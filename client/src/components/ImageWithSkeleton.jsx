/**
 * ImageWithSkeleton
 * Shows an animate-pulse skeleton until the image's onLoad fires,
 * then cross-fades the real image in.
 *
 * Props:
 *  src              – image URL (if falsy or load fails → placeholder shown)
 *  alt              – alt text
 *  className        – applied to the <img> element itself
 *  wrapperClassName – applied to the outer wrapper <div> (use for sizing/layout)
 *  placeholderLabel – text shown inside the fallback placeholder box
 *
 * Fallback behaviour:
 *  - No src / load error → styled placeholder box with label
 *  - Valid src → skeleton pulse until onLoad, then cross-fade to image
 */
import { useState } from 'react';

export default function ImageWithSkeleton({
  src,
  alt,
  className        = '',
  wrapperClassName = '',
  style,
  placeholderLabel,
}) {
  const [loaded,  setLoaded]  = useState(false);
  const [errored, setErrored] = useState(false);

  const showPlaceholder = !src || errored;

  if (showPlaceholder) {
    return (
      <div
        className={`bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center rounded-2xl ${wrapperClassName} ${className}`}
        style={style}
        aria-label={alt}
        role="img"
      >
        <span className="text-gray-500 text-sm text-center px-4 select-none">
          {placeholderLabel || alt || 'Image'}
        </span>
      </div>
    );
  }

  return (
    // wrapperClassName lets call-sites control positioning / sizing (e.g. "absolute inset-0")
    <div className={`relative ${wrapperClassName}`} style={style}>
      {/* Skeleton — covers wrapper until image loads */}
      {!loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-gray-200 rounded-2xl"
        />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        className={`${className} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}
