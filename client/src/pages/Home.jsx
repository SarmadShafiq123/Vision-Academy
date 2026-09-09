import { motion, useReducedMotion } from 'motion/react';
import { GraduationCap, BookOpen, Scale, Target } from 'lucide-react';
import StatsSection from '../components/StatsSection';
import Button from '../components/Button';
import SectionHeading from '../components/SectionHeading';
import IconBadge from '../components/IconBadge';
import heroImage from '../assets/hero-home.png';
import academyImage from '../assets/intro-academy.png';

const whyChooseData = [
  {
    icon: GraduationCap,
    title: 'Experienced Faculty',
    description: 'Learn from industry experts and qualified teachers with years of experience.',
  },
  {
    icon: BookOpen,
    title: 'Modern Curriculum',
    description: 'Updated course content aligned with current industry standards and trends.',
  },
  {
    icon: Scale,
    title: 'Skill + Academic Balance',
    description: 'Perfect blend of academic excellence and practical skill development.',
  },
  {
    icon: Target,
    title: 'Result-Oriented Approach',
    description: 'Focused on delivering measurable outcomes and student success.',
  },
];

/** Stagger container variants */
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

export default function Home() {
  const prefersReduced = useReducedMotion();

  // When reduced-motion is on, skip all motion props
  const motionProps = (variants) =>
    prefersReduced
      ? {}
      : { variants, initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '-60px' } };

  const heroMotion = prefersReduced
    ? {}
    : { initial: 'hidden', animate: 'show' };

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#1a3a8f] to-[#29b6f6] text-white py-16 md:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Text — staggered children */}
            <motion.div
              variants={staggerContainer}
              {...heroMotion}
            >
              <motion.h1
                variants={fadeUp}
                className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 leading-tight"
              >
                Empowering Minds,<br />Shaping Futures
              </motion.h1>
              <motion.p variants={fadeUp} className="text-lg md:text-xl mb-8 text-blue-100">
                Join Vision Academy for quality education that combines academic excellence
                with practical skills for tomorrow's success.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
                <motion.div
                  whileHover={prefersReduced ? {} : { scale: 1.05 }}
                  whileTap={prefersReduced ? {} : { scale: 0.97 }}
                >
                  <Button variant="secondary" to="/courses">
                    Explore Courses
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={prefersReduced ? {} : { scale: 1.05 }}
                  whileTap={prefersReduced ? {} : { scale: 0.97 }}
                >
                  <Button variant="outline" to="/contact">
                    Contact Us
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Hero image — right column */}
            <motion.div
              className="relative h-80 rounded-xl overflow-hidden shadow-2xl"
              variants={fadeUp}
              {...heroMotion}
              transition={{ duration: 0.5, delay: prefersReduced ? 0 : 0.2 }}
            >
              <img
                src={heroImage}
                alt="Students studying"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Brief Intro ──────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <motion.div
              {...motionProps(fadeUp)}
            >
              <img
                src={academyImage}
                alt="Vision Academy"
                className="h-96 w-full object-cover rounded-xl shadow-lg"
              />
            </motion.div>

            <motion.div
              variants={staggerContainer}
              {...(prefersReduced ? {} : { initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '-60px' } })}
            >
              <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-semibold text-[#1a1a2e] mb-6">
                Welcome to Vision Academy
              </motion.h2>
              <motion.p variants={fadeUp} className="text-gray-700 text-lg leading-relaxed mb-4">
                At Vision Academy, we believe in nurturing talent and building futures.
                With over a decade of excellence in education, we offer comprehensive programs
                ranging from matriculation to intermediate levels, alongside cutting-edge
                skill development courses.
              </motion.p>
              <motion.p variants={fadeUp} className="text-gray-700 text-lg leading-relaxed">
                Our mission is to provide students with not just academic knowledge, but
                practical skills that prepare them for the real world. From truck dispatch
                training to web development and AI automation, we're committed to making
                education relevant and impactful.
              </motion.p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-[#f5f7fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Why Choose Vision Academy?"
            subtitle="Discover what makes us the preferred choice for quality education"
          />
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            {...(prefersReduced ? {} : { initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '-60px' } })}
          >
            {whyChooseData.map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                whileHover={prefersReduced ? {} : { scale: 1.03, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
                whileTap={prefersReduced ? {} : { scale: 0.98 }}
                className="bg-white p-8 rounded-xl shadow-md cursor-default transition-shadow group"
              >
                <IconBadge icon={item.icon} className="mb-4" />
                <h3 className="text-xl font-semibold text-[#1a1a2e] mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <StatsSection />

      {/* ── CTA Banner ───────────────────────────────────────── */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-[#29b6f6] to-[#1a3a8f]">
        <motion.div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          {...motionProps(fadeUp)}
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join thousands of successful students. Get in touch with us today!
          </p>
          <motion.div
            whileHover={prefersReduced ? {} : { scale: 1.05 }}
            whileTap={prefersReduced ? {} : { scale: 0.97 }}
            className="inline-block"
          >
            <Button
              variant="secondary"
              href="https://wa.me/923126174004"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-2xl mr-3">💬</span>
              Chat with us on WhatsApp
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
