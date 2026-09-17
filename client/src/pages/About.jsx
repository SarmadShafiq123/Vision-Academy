import { motion, useReducedMotion } from 'motion/react';
import { Award, ShieldCheck, Lightbulb } from 'lucide-react';
import StatsSection from '../components/StatsSection';
import SectionHeading from '../components/SectionHeading';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import IconBadge from '../components/IconBadge';
import missionImage from '../assets/about-mission.png';

const CORE_VALUES = [
  { icon: Award,       title: 'Excellence', text: 'We maintain the highest standards in education and continuously strive for improvement.' },
  { icon: ShieldCheck, title: 'Integrity',  text: 'Honesty, transparency, and ethical practices guide everything we do.' },
  { icon: Lightbulb,   title: 'Innovation', text: 'We embrace new teaching methods and technologies to enhance learning.' },
];

const FADE_UP_DURATION_S  = 0.45;
const FADE_UP_Y_OFFSET    = 30;
const STAGGER_DELAY_S     = 0.12;
const VIEWPORT_MARGIN     = '-60px';
const CARD_HOVER_Y        = -4;
const CARD_HOVER_SCALE    = 1.02;
const CARD_HOVER_SHADOW   = '0 20px 40px rgba(26,58,143,0.10)';

const fadeUp = {
  hidden: { opacity: 0, y: FADE_UP_Y_OFFSET },
  show:   { opacity: 1, y: 0, transition: { duration: FADE_UP_DURATION_S, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  show:   { transition: { staggerChildren: STAGGER_DELAY_S } },
};

export default function About() {
  const prefersReduced = useReducedMotion();

  const inView = (extra = {}) =>
    prefersReduced
      ? {}
      : { initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: VIEWPORT_MARGIN }, ...extra };

  return (
    <div>
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-gradient-to-r from-[#1a3a8f] to-[#29b6f6] text-white rounded-2xl px-5 py-8 sm:px-8 sm:py-10 text-center relative overflow-hidden"
            variants={staggerContainer}
            {...(prefersReduced ? {} : { initial: 'hidden', animate: 'show' })}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
                backgroundSize:  '18px 18px',
              }}
            />
            <div className="relative z-10">
              <motion.h1 variants={fadeUp} className="text-3xl md:text-4xl font-semibold mb-3">
                About Vision Academy
              </motion.h1>
              <motion.p variants={fadeUp} className="text-base md:text-lg text-blue-100 leading-relaxed">
                Building futures through quality education since 2000
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white dark:bg-[#0d1425]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={staggerContainer} {...inView()}>
              <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold leading-tight text-[#1a1a2e] dark:text-[#e8eaf0] mb-6">
                Our Mission &amp; Vision
              </motion.h2>
              <motion.div variants={fadeUp} className="space-y-6">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#1a3a8f] dark:text-blue-400 mb-3">Mission</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                    To provide accessible, high-quality education that empowers students with both
                    academic knowledge and practical skills needed to thrive in an ever-evolving world.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#1a3a8f] dark:text-blue-400 mb-3">Vision</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
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

      <section className="py-16 md:py-24 bg-[#f5f7fa] dark:bg-[#0a0f1e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="max-w-4xl mx-auto" variants={staggerContainer} {...inView()}>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold leading-tight text-[#1a1a2e] dark:text-[#e8eaf0] mb-6 text-center">
              Our Story
            </motion.h2>
            <motion.div variants={fadeUp} className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                Vision Academy was founded with a clear purpose: to bridge the gap between
                traditional education and real-world skills. Our founders recognized that
                students needed more than just textbook knowledge to succeed in today's
                competitive landscape.
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                Today, we're proud to offer everything from matriculation and intermediate
                programs to specialised courses in truck dispatch, web development, and AI
                automation. Our success is measured not just in exam results, but in the
                successful careers and confident futures of our graduates.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <StatsSection
        title="Our Achievements in Numbers"
        description="A decade of excellence and impact"
      />

      <section className="py-16 md:py-24 bg-white dark:bg-[#0d1425]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Our Core Values" />
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            {...inView()}
          >
            {CORE_VALUES.map((v) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                whileHover={prefersReduced ? {} : { y: CARD_HOVER_Y, scale: CARD_HOVER_SCALE, boxShadow: CARD_HOVER_SHADOW }}
                whileTap={prefersReduced   ? {} : { scale: 0.98 }}
                className="bg-[#f5f7fa] dark:bg-[#16213e] p-8 rounded-2xl cursor-default shadow-[0_4px_20px_rgba(26,58,143,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] group"
              >
                <IconBadge icon={v.icon} className="mb-4" />
                <h3 className="text-xl font-semibold text-[#1a1a2e] dark:text-[#e8eaf0] mb-3">{v.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{v.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
