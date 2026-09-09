import { motion, useReducedMotion } from 'motion/react';

export default function SectionHeading({ title, subtitle, centered = true, className = '' }) {
  const prefersReduced = useReducedMotion();
  const alignClass  = centered ? 'text-center' : '';
  const marginClass = centered ? 'mb-16' : 'mb-8';

  return (
    <motion.div
      className={`${alignClass} ${marginClass} ${className}`.trim()}
      initial={prefersReduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4 }}
    >
      {title && (
        <h2 className="text-3xl md:text-4xl font-bold leading-tight text-[#1a1a2e] mb-4">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-gray-500 text-lg">{subtitle}</p>
      )}
    </motion.div>
  );
}
