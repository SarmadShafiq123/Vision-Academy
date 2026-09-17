import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, useSpring } from 'motion/react';
import { GraduationCap, BookOpen, Scale, Target } from 'lucide-react';
import StatsSection from '../components/StatsSection';
import Button from '../components/Button';
import SectionHeading from '../components/SectionHeading';
import IconBadge from '../components/IconBadge';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import MagneticButton from '../components/MagneticButton';
import { useLenisScroll } from '../hooks/useLenisScroll';
import heroImage   from '../assets/hero-home.png';
import academyImage from '../assets/intro-academy.png';

const WHY_CHOOSE_DATA = [
  { icon: GraduationCap, title: 'Experienced Faculty',      description: 'Learn from industry experts and qualified teachers with years of experience.' },
  { icon: BookOpen,      title: 'Modern Curriculum',        description: 'Updated course content aligned with current industry standards and trends.' },
  { icon: Scale,         title: 'Skill + Academic Balance', description: 'Perfect blend of academic excellence and practical skill development.' },
  { icon: Target,        title: 'Result-Oriented Approach', description: 'Focused on delivering measurable outcomes and student success.' },
];

const STAGGER_DELAY_S      = 0.1;
const FADE_UP_DURATION_S   = 0.45;
const FADE_UP_Y_OFFSET     = 30;
const HERO_IMG_PARALLAX    = [-30, 30];
const INTRO_IMG_PARALLAX   = [20, -20];
const VELOCITY_SKEW_DEG    = [-2.5, 0, 2.5];
const VELOCITY_SKEW_INPUT  = [-40, 0, 40];
const SKEW_STIFFNESS       = 80;
const SKEW_DAMPING         = 20;
const SKEW_MASS            = 0.5;
const CARD_HOVER_Y         = -4;
const CARD_HOVER_SCALE     = 1.02;
const CARD_HOVER_SHADOW    = '0 20px 40px rgba(26,58,143,0.12)';
const HERO_IMG_DELAY_S     = 0.2;
const HERO_IMG_DURATION_S  = 0.5;
const VIEWPORT_MARGIN      = '-60px';

const staggerContainer = {
  hidden: {},
  show:   { transition: { staggerChildren: STAGGER_DELAY_S } },
};

const fadeUp = {
  hidden: { opacity: 0, y: FADE_UP_Y_OFFSET },
  show:   { opacity: 1, y: 0, transition: { duration: FADE_UP_DURATION_S, ease: 'easeOut' } },
};

const cardHover = { y: CARD_HOVER_Y, scale: CARD_HOVER_SCALE, boxShadow: CARD_HOVER_SHADOW };

export default function Home() {
  const prefersReduced  = useReducedMotion();
  const heroSectionRef  = useRef(null);
  const introSectionRef = useRef(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroSectionRef,
    offset: ['start start', 'end start'],
  });
  const { scrollYProgress: introProgress } = useScroll({
    target: introSectionRef,
    offset: ['start end', 'end start'],
  });

  const heroImgY  = useTransform(heroProgress,  [0, 1], prefersReduced ? [0, 0] : HERO_IMG_PARALLAX);
  const introImgY = useTransform(introProgress, [0, 1], prefersReduced ? [0, 0] : INTRO_IMG_PARALLAX);

  const { velocity } = useLenisScroll();
  const rawSkew = useTransform(
    velocity,
    VELOCITY_SKEW_INPUT,
    prefersReduced ? [0, 0, 0] : VELOCITY_SKEW_DEG,
  );
  const skewY = useSpring(rawSkew, { stiffness: SKEW_STIFFNESS, damping: SKEW_DAMPING, mass: SKEW_MASS });

  const motionProps = (variants) =>
    prefersReduced
      ? {}
      : { variants, initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: VIEWPORT_MARGIN } };

  const heroMotion = prefersReduced ? {} : { initial: 'hidden', animate: 'show' };

  return (
    <div>
      <section
        ref={heroSectionRef}
        className="relative text-white py-12 md:py-16 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a3a8f 0%, #1e44a8 50%, #29b6f6 100%)' }}
      >
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '128px' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={staggerContainer} style={{ skewY }} {...heroMotion}>
              <motion.h1 variants={fadeUp}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight tracking-tight">
                Empowering Minds,<br />Shaping Futures
              </motion.h1>
              <motion.p variants={fadeUp} className="text-base md:text-lg mb-6 text-blue-100 font-normal leading-relaxed max-w-lg">
                Join Vision Academy for quality education that combines academic excellence
                with practical skills for tomorrow's success.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
                <MagneticButton>
                  <Button variant="secondary" to="/courses">Explore Courses</Button>
                </MagneticButton>
                <MagneticButton>
                  <Button variant="outline" to="/contact">Contact Us</Button>
                </MagneticButton>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative h-64 md:h-72 rounded-2xl overflow-hidden shadow-2xl"
              variants={fadeUp} {...heroMotion}
              transition={{ duration: HERO_IMG_DURATION_S, delay: prefersReduced ? 0 : HERO_IMG_DELAY_S }}
            >
              <motion.div
                className="absolute inset-0"
                style={{ y: heroImgY, height: 'calc(100% + 60px)', top: '-30px' }}
              >
                <ImageWithSkeleton
                  src={heroImage}
                  alt="Students studying"
                  wrapperClassName="absolute inset-0"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section ref={introSectionRef} className="py-16 md:py-24 bg-white dark:bg-[#0d1425]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div {...motionProps(fadeUp)} className="overflow-hidden rounded-2xl">
              <motion.div style={{ y: introImgY }}>
                <ImageWithSkeleton
                  src={academyImage}
                  alt="Vision Academy"
                  wrapperClassName="w-full"
                  className="h-96 w-full object-cover rounded-2xl shadow-[0_8px_30px_rgba(26,58,143,0.10)]"
                />
              </motion.div>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              {...(prefersReduced ? {} : { initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: VIEWPORT_MARGIN } })}
            >
              <motion.h2 variants={fadeUp}
                className="text-3xl md:text-4xl font-bold leading-tight text-[#1a1a2e] dark:text-[#e8eaf0] mb-6">
                Welcome to Vision Academy
              </motion.h2>
              <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-4">
                At Vision Academy, we believe in nurturing talent and building futures.
                With over a decade of excellence in education, we offer comprehensive programs
                ranging from matriculation to intermediate levels, alongside cutting-edge
                skill development courses.
              </motion.p>
              <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                Our mission is to provide students with not just academic knowledge, but
                practical skills that prepare them for the real world. From truck dispatch
                training to web development and AI automation, we're committed to making
                education relevant and impactful.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[#f5f7fa] dark:bg-[#0a0f1e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Why Choose Vision Academy?"
            subtitle="Discover what makes us the preferred choice for quality education"
          />
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            {...(prefersReduced ? {} : { initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: VIEWPORT_MARGIN } })}
          >
            {WHY_CHOOSE_DATA.map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                whileHover={prefersReduced ? {} : cardHover}
                whileTap={prefersReduced   ? {} : { scale: 0.98 }}
                className="bg-white dark:bg-[#16213e] p-8 rounded-2xl shadow-[0_4px_20px_rgba(26,58,143,0.07)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] cursor-default transition-shadow group"
              >
                <IconBadge icon={item.icon} className="mb-4" />
                <h3 className="text-xl font-bold text-[#1a1a2e] dark:text-[#e8eaf0] mb-3 leading-tight">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <StatsSection />

      <section className="py-12 md:py-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e44a8 0%, #1a3a8f 50%, #29b6f6 100%)' }}>
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '128px' }} />
        <motion.div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white" {...motionProps(fadeUp)}>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">Ready to Start Learning?</h2>
          <p className="text-blue-100 text-lg mb-8 leading-relaxed">Join thousands of successful students. Get in touch with us today!</p>
          <MagneticButton className="inline-block">
            <Button variant="secondary" href="https://wa.me/923126174004" target="_blank" rel="noopener noreferrer">
              <span className="text-2xl mr-3">💬</span>
              Chat with us on WhatsApp
            </Button>
          </MagneticButton>
        </motion.div>
      </section>
    </div>
  );
}
