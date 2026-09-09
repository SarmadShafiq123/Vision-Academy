import { motion, useReducedMotion } from 'motion/react';
import { useCountUp } from '../hooks/useCountUp';

const stats = [
  { number: '25+',   label: 'Years of Experience' },
  { number: '500+',  label: 'Students Taught' },
  { number: '12+',   label: 'Courses Offered' },
  { number: '95%',   label: 'Success Rate' },
];

function StatItem({ number, label }) {
  const prefersReduced = useReducedMotion();
  const [ref, displayValue] = useCountUp(number);

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={prefersReduced ? false : { opacity: 0, y: 20 }}
      whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-4xl md:text-5xl font-semibold text-[#29b6f6] mb-2">
        {displayValue}
      </div>
      <div className="text-lg text-blue-100">{label}</div>
    </motion.div>
  );
}

export default function StatsSection({ title, description }) {
  const prefersReduced = useReducedMotion();

  return (
    <section className="py-16 md:py-24 bg-[#1a3a8f] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || description) && (
          <motion.div
            className="text-center mb-12"
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            {title && (
              <h2 className="text-3xl md:text-4xl font-semibold mb-4">{title}</h2>
            )}
            {description && (
              <p className="text-blue-100 text-lg">{description}</p>
            )}
          </motion.div>
        )}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          initial={prefersReduced ? false : { opacity: 0 }}
          whileInView={prefersReduced ? {} : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
        >
          {stats.map((stat) => (
            <StatItem key={stat.label} number={stat.number} label={stat.label} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
