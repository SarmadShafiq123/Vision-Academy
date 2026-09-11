/**
 * ImageWithSkeleton
 * Shows an animate-pulse skeleton until the image's onLoad fires,
 * then cross-fades the real image in.
 *
 * Dark mode: skeleton and placeholder use darker gray tones so they
 * don't look washed-out or mismatched against dark backgrounds.
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
        className={`bg-gradient-to-br from-gray-200 to-gray-300 dark:from-[#1e2d4a] dark:to-[#16213e] flex items-center justify-center rounded-2xl ${wrapperClassName} ${className}`}
        style={style}
        aria-label={alt}
        role="img"
      >
        <span className="text-gray-500 dark:text-gray-400 text-sm text-center px-4 select-none">
          {placeholderLabel || alt || 'Image'}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative ${wrapperClassName}`} style={style}>
      {/* Skeleton — covers wrapper until image loads */}
      {!loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-[#1e2d4a] rounded-2xl"
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
