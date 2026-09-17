import { motion, useReducedMotion, useAnimation } from 'motion/react';
import { useCallback } from 'react';
import { useCountUp } from '../hooks/useCountUp';

const STATS = [
  { number: '25+',  label: 'Years of Experience' },
  { number: '500+', label: 'Students Taught' },
  { number: '12+',  label: 'Courses Offered' },
  { number: '95%',  label: 'Success Rate' },
];

const COUNT_UP_DURATION_MS = 1800;
const PULSE_SCALE_PEAK     = 1.1;
const PULSE_DURATION_S     = 0.3;
const STAT_ENTER_DURATION  = 0.4;
const STAT_ENTER_OFFSET    = 20;

function StatItem({ number, label }) {
  const prefersReduced = useReducedMotion();
  const pulseControls  = useAnimation();

  const handlePulse = useCallback(() => {
    if (prefersReduced) return;
    pulseControls.start({
      scale:      [1, PULSE_SCALE_PEAK, 1],
      transition: { duration: PULSE_DURATION_S, ease: 'easeOut' },
    });
  }, [prefersReduced, pulseControls]);

  const [ref, displayValue] = useCountUp(number, COUNT_UP_DURATION_MS, handlePulse);

  return (
    <motion.div
      className="text-center"
      initial={prefersReduced ? false : { opacity: 0, y: STAT_ENTER_OFFSET }}
      whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: STAT_ENTER_DURATION }}
    >
      <div ref={ref}>
        <motion.div
          animate={pulseControls}
          className="text-4xl md:text-5xl font-extrabold text-[#29b6f6] mb-2 leading-tight"
        >
          {displayValue}
        </motion.div>
      </div>
      <div className="text-base text-blue-100 font-medium">{label}</div>
    </motion.div>
  );
}

export default function StatsSection({ title, description }) {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className="py-16 md:py-24 text-white relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1a3a8f 0%, #16307a 100%)' }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize:   '128px',
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || description) && (
          <motion.div
            className="text-center mb-12"
            initial={prefersReduced ? false : { opacity: 0, y: STAT_ENTER_OFFSET }}
            whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: STAT_ENTER_DURATION }}
          >
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">{title}</h2>
            )}
            {description && (
              <p className="text-blue-200 text-lg leading-relaxed">{description}</p>
            )}
          </motion.div>
        )}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <StatItem key={stat.label} number={stat.number} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
