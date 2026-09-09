import { motion, useReducedMotion } from 'motion/react';
import {
  BookOpen,
  Truck,
  MessageCircle,
  Monitor,
  Bot,
  GraduationCap,
  Target,
  Award,
} from 'lucide-react';
import Button from '../components/Button';
import SectionHeading from '../components/SectionHeading';
import IconBadge from '../components/IconBadge';

const academicPrograms = [
  { title: 'Class 9',             description: 'Foundation year with comprehensive curriculum for all subjects.' },
  { title: 'Class 10',            description: 'Matriculation preparation with focus on board exam success.' },
  { title: 'Class 11',            description: 'Intermediate first year across Science, Arts, and Commerce streams.' },
  { title: 'Class 12',            description: 'Final year intermediate with university admission guidance.' },
  { title: 'Supplementary Exams', description: 'Focused preparation for repeat/supplementary board exams to help students clear pending subjects.' },
  { title: 'Federal Board',       description: 'Complete curriculum coverage aligned with Federal Board syllabus and exam pattern.' },
  { title: 'O Levels',            description: 'Cambridge O Level preparation across core subjects with structured concept building.' },
  { title: 'A Levels',            description: 'Cambridge A Level preparation with in-depth subject coverage for university readiness.' },
];

const skillCourses = [
  {
    title: 'Truck Dispatch',
    description: 'Master the logistics industry with professional truck dispatch training. Learn load booking, route planning, and carrier management.',
    icon: Truck,
  },
  {
    title: 'English Spoken Course',
    description: 'Build confidence in English communication. Develop fluency, pronunciation, and conversational skills for professional success.',
    icon: MessageCircle,
  },
  {
    title: 'Web Applications',
    description: 'Learn modern web development from scratch. Build responsive websites and applications using latest frameworks and technologies.',
    icon: Monitor,
  },
  {
    title: 'AI & Automation',
    description: 'Explore artificial intelligence and automation tools. Learn to leverage AI for business efficiency and innovation.',
    icon: Bot,
  },
];

const whyItems = [
  { icon: GraduationCap, title: 'Expert Instructors', text: 'Learn from experienced professionals with industry expertise.' },
  { icon: Target,        title: 'Practical Focus',    text: 'Hands-on training with real-world applications and projects.' },
  { icon: Award,         title: 'Certification',      text: 'Receive recognised certificates upon course completion.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function Courses() {
  const prefersReduced = useReducedMotion();

  const inView = () =>
    prefersReduced
      ? {}
      : { initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '-60px' } };

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
                Our Courses
              </motion.h1>
              <motion.p variants={fadeUp} className="text-base md:text-lg text-blue-100">
                Choose from academic programs or skill development courses
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Academic Programs ────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Academic Programs (9th – 12th)"
            subtitle="Comprehensive education for matriculation and intermediate levels"
          />
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 items-stretch"
            variants={staggerContainer}
            {...inView()}
          >
            {academicPrograms.map((program) => (
              <motion.div
                key={program.title}
                variants={fadeUp}
                whileHover={prefersReduced ? {} : { scale: 1.03, boxShadow: '0 20px 40px rgba(0,0,0,0.10)' }}
                whileTap={prefersReduced ? {} : { scale: 0.98 }}
                className="bg-[#f5f7fa] p-6 rounded-xl shadow-md border-t-4 border-[#1a3a8f] flex flex-col h-full group"
              >
                <IconBadge icon={BookOpen} className="mb-4" />
                <h3 className="text-lg font-semibold text-[#1a1a2e] mb-3">{program.title}</h3>
                <p className="text-gray-600 mb-6 flex-1 text-sm">{program.description}</p>
                <Button
                  variant="primary"
                  fullWidth
                  to={`/contact?program=${encodeURIComponent(program.title)}`}
                  className="mt-auto"
                >
                  Learn More
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Divider ──────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#29b6f6] to-[#1a3a8f] h-2" />

      {/* ── Skill Development ────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-[#f5f7fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Skill Development Courses"
            subtitle="Modern skills for the digital age and professional success"
          />
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch"
            variants={staggerContainer}
            {...inView()}
          >
            {skillCourses.map((course) => (
              <motion.div
                key={course.title}
                variants={fadeUp}
                whileHover={prefersReduced ? {} : { scale: 1.03, boxShadow: '0 20px 40px rgba(0,0,0,0.10)' }}
                whileTap={prefersReduced ? {} : { scale: 0.98 }}
                className="bg-white p-8 rounded-xl shadow-md border-t-4 border-[#29b6f6] flex flex-col h-full group"
              >
                <IconBadge icon={course.icon} className="mb-4" />
                <h3 className="text-2xl font-semibold text-[#1a1a2e] mb-3">{course.title}</h3>
                <p className="text-gray-600 mb-6 flex-1">{course.description}</p>
                <Button
                  variant="accent"
                  fullWidth
                  href={`https://wa.me/923126174004?text=${encodeURIComponent(`Hi, I'm interested in enrolling in the ${course.title} course`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto"
                >
                  Enroll Now
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Why Our Courses ──────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Why Choose Our Courses?" />
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            {...inView()}
          >
            {whyItems.map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                className="text-center p-6"
              >
                {/* Centered badge for the text-center layout */}
                <div className="flex justify-center mb-4">
                  <IconBadge icon={item.icon} />
                </div>
                <h3 className="text-xl font-semibold text-[#1a1a2e] mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-[#1a3a8f] to-[#29b6f6] text-white">
        <motion.div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          variants={fadeUp}
          {...inView()}
        >
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Ready to Enroll?</h2>
          <p className="text-blue-100 text-lg mb-8">
            Contact us today to learn more about our courses and enrollment process
          </p>
          <motion.div
            whileHover={prefersReduced ? {} : { scale: 1.05 }}
            whileTap={prefersReduced ? {} : { scale: 0.97 }}
            className="inline-block"
          >
            <Button variant="secondary" href="https://wa.me/923126174004" target="_blank" rel="noopener noreferrer">
              <span className="text-2xl mr-3">💬</span>
              Chat with us on WhatsApp
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
