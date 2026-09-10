import { motion, useReducedMotion } from 'motion/react';
import { Award, ShieldCheck, Lightbulb } from 'lucide-react';
import StatsSection from '../components/StatsSection';
import SectionHeading from '../components/SectionHeading';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import IconBadge from '../components/IconBadge';
import missionImage from '../assets/about-mission.png';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const values = [
  { icon: Award,       title: 'Excellence',  text: 'We maintain the highest standards in education and continuously strive for improvement.' },
  { icon: ShieldCheck, title: 'Integrity',   text: 'Honesty, transparency, and ethical practices guide everything we do.' },
  { icon: Lightbulb,   title: 'Innovation',  text: 'We embrace new teaching methods and technologies to enhance learning.' },
];

export default function About() {
  const prefersReduced = useReducedMotion();

  const inView = (extra = {}) =>
    prefersReduced
      ? {}
      : { initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '-60px' }, ...extra };

  return (
    <div>
      {/* ── Page Header ──────────────────────────────────────── */}
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-gradient-to-r from-[#1a3a8f] to-[#29b6f6] text-white rounded-xl px-8 py-10 text-center relative overflow-hidden"
            variants={staggerContainer}
            {...(prefersReduced ? {} : { initial: 'hidden', animate: 'show' })}
          >
            {/* Subtle geometric overlay */}
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
                backgroundSize: '18px 18px',
              }}
            />
            <div className="relative z-10">
              <motion.h1 variants={fadeUp} className="text-3xl md:text-4xl font-semibold mb-3">
                About Vision Academy
              </motion.h1>
              <motion.p variants={fadeUp} className="text-base md:text-lg text-blue-100">
                Building futures through quality education since 2000
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Mission & Vision ─────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <motion.div variants={staggerContainer} {...inView()}>
              <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold leading-tight text-[#1a1a2e] mb-6">
                Our Mission &amp; Vision
              </motion.h2>
              <motion.div variants={fadeUp} className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-[#1a3a8f] mb-3">Mission</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    To provide accessible, high-quality education that empowers students with both
                    academic knowledge and practical skills needed to thrive in an ever-evolving world.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#1a3a8f] mb-3">Vision</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    To be the leading educational institution recognized for excellence in both
                    traditional academics and modern skill development, producing graduates who are
                    confident, competent, and ready to make meaningful contributions to society.
                  </p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div variants={fadeUp} {...inView()}>
              <ImageWithSkeleton
                src={missionImage}
                alt="Students celebrating academic success"
                wrapperClassName="w-full"
                className="h-96 w-full object-cover rounded-2xl shadow-[0_8px_30px_rgba(26,58,143,0.10)]"
              />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Our Story ────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-[#f5f7fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto"
            variants={staggerContainer}
            {...inView()}
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold leading-tight text-[#1a1a2e] mb-6 text-center">
              Our Story
            </motion.h2>
            <motion.div variants={fadeUp} className="space-y-4">
              <p className="text-gray-600 text-lg leading-relaxed">
                Vision Academy was founded with a clear purpose: to bridge the gap between
                traditional education and real-world skills. Our founders recognized that
                students needed more than just textbook knowledge to succeed in today's
                competitive landscape.
              </p>
            
              <p className="text-gray-600 text-lg leading-relaxed">
                Today, we're proud to offer everything from matriculation and intermediate
                programs to specialised courses in truck dispatch, web development, and AI
                automation. Our success is measured not just in exam results, but in the
                successful careers and confident futures of our graduates.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <StatsSection
        title="Our Achievements in Numbers"
        description="A decade of excellence and impact"
      />

      {/* ── Core Values ──────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Our Core Values" />
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            {...inView()}
          >
            {values.map((v) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                whileHover={prefersReduced ? {} : { y: -4, scale: 1.02, boxShadow: '0 20px 40px rgba(26,58,143,0.10)' }}
                whileTap={prefersReduced ? {} : { scale: 0.98 }}
                className="bg-[#f5f7fa] p-8 rounded-2xl cursor-default shadow-[0_4px_20px_rgba(26,58,143,0.06)]"
              >
                <IconBadge icon={v.icon} className="mb-4" />
                <h3 className="text-xl font-semibold text-[#1a1a2e] mb-3">{v.title}</h3>
                <p className="text-gray-600">{v.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
