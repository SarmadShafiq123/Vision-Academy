import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import logo from '../assets/vision-logo-transparent.png';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function NotFound() {
  const prefersReduced = useReducedMotion();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-[#f5f7fa] dark:bg-[#0d1425]">
      <motion.div
        className="text-center max-w-md"
        variants={stagger}
        initial={prefersReduced ? false : 'hidden'}
        animate="show"
      >
        {/* Logo — always white-backed so dark-blue logo stays readable */}
        <motion.div variants={fadeUp} className="flex justify-center mb-8">
          <img src={logo} alt="Vision Academy" className="h-14" />
        </motion.div>

        {/* 404 */}
        <motion.p
          variants={fadeUp}
          className="text-8xl font-semibold text-[#1a3a8f] dark:text-[#3d5fc4] leading-none mb-4"
        >
          404
        </motion.p>

        {/* Heading */}
        <motion.h1
          variants={fadeUp}
          className="text-2xl md:text-3xl font-semibold text-[#1a1a2e] dark:text-[#e8eaf0] mb-4"
        >
          Page Not Found
        </motion.h1>

        {/* Message */}
        <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </motion.p>

        {/* CTA */}
        <motion.div variants={fadeUp}>
          <Link
            to="/"
            className="inline-flex items-center justify-center font-semibold rounded-xl
              bg-[#1a3a8f] dark:bg-[#3d5fc4] text-white px-8 py-3
              hover:bg-[#2a4a9f] dark:hover:bg-[#4a6fd4] transition-colors
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
          >
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
