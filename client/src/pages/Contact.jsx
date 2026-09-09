import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Phone, MessageCircle, Mail, MapPin, Clock } from 'lucide-react';
import emailjs from '@emailjs/browser';
import Button from '../components/Button';

// ─────────────────────────────────────────────────────────────────────────────
// EmailJS credentials — fill in client/.env
//   VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY
// ─────────────────────────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const contactItems = [
  {
    icon: Phone,
    title: 'Phone',
    content: <a href="tel:+923126174004" className="text-[#29b6f6] hover:underline text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded">+92 312 6174004</a>,
    sub: 'Call us for immediate assistance',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    content: <a href="https://wa.me/923126174004" target="_blank" rel="noopener noreferrer" className="text-[#29b6f6] hover:underline text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded">Chat on WhatsApp</a>,
    sub: 'Quick responses via WhatsApp',
  },
  {
    icon: Mail,
    title: 'Email',
    content: <p className="text-gray-700 text-lg">info@visionacademy.com</p>,
    sub: 'Send us your detailed queries',
  },
  {
    icon: MapPin,
    title: 'Address',
    content: <p className="text-gray-700 text-lg">554H+5CH, Gulshanabad Chah Chohan Wala</p>,
    sub: 'Gujranwala, Pakistan',
  },
  {
    icon: Clock,
    title: 'Appointment Only',
    content: (
      <>
        <p className="text-gray-700">
          We currently operate by appointment. Reach out via WhatsApp or phone to schedule a visit.
        </p>
        <a
          href="https://wa.me/923126174004"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-[#25d366] hover:bg-[#1ebe5d] text-white text-sm font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2"
        >
          <MessageCircle size={14} strokeWidth={1.75} /> Chat on WhatsApp
        </a>
      </>
    ),
    sub: 'Contact us to book your slot',
  },
];

// ─── Floating label field ─────────────────────────────────────────────────────

/**
 * FloatingLabelInput
 * The label sits inside the field by default. On focus OR when the field
 * has a value it animates up to float above the input border.
 */
function FloatingLabelInput({ id, name, label, type = 'text', value, onChange, disabled, required }) {
  const [focused, setFocused] = useState(false);
  const prefersReduced        = useReducedMotion();
  const floated               = focused || value.length > 0;

  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        required={required}
        placeholder="" /* empty so :placeholder-shown works as fallback */
        className={[
          'peer w-full px-4 pt-6 pb-2 border rounded-xl bg-white',
          'disabled:opacity-60 transition-shadow',
          'focus:outline-none',
          focused
            ? 'border-[#1a3a8f] ring-2 ring-blue-200'
            : 'border-gray-300',
        ].join(' ')}
      />
      {/* Floating label */}
      <motion.label
        htmlFor={id}
        animate={
          floated
            ? { y: -10, scale: 0.78, color: focused ? '#1a3a8f' : '#6b7280' }
            : { y: 0, scale: 1, color: '#6b7280' }
        }
        transition={prefersReduced ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' }}
        style={{ originX: 0 }}
        className="absolute left-4 top-4 text-gray-500 pointer-events-none font-medium select-none"
      >
        {label}
      </motion.label>
    </div>
  );
}

/**
 * FloatingLabelTextarea — same pattern for the message field
 */
function FloatingLabelTextarea({ id, name, label, value, onChange, disabled, required, rows }) {
  const [focused, setFocused] = useState(false);
  const prefersReduced        = useReducedMotion();
  const floated               = focused || value.length > 0;

  return (
    <div className="relative">
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        required={required}
        rows={rows}
        placeholder=""
        className={[
          'peer w-full px-4 pt-6 pb-2 border rounded-xl bg-white resize-none',
          'disabled:opacity-60 transition-shadow',
          'focus:outline-none',
          focused
            ? 'border-[#1a3a8f] ring-2 ring-blue-200'
            : 'border-gray-300',
        ].join(' ')}
      />
      <motion.label
        htmlFor={id}
        animate={
          floated
            ? { y: -10, scale: 0.78, color: focused ? '#1a3a8f' : '#6b7280' }
            : { y: 0, scale: 1, color: '#6b7280' }
        }
        transition={prefersReduced ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' }}
        style={{ originX: 0 }}
        className="absolute left-4 top-4 text-gray-500 pointer-events-none font-medium select-none"
      >
        {label}
      </motion.label>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Contact() {
  const prefersReduced = useReducedMotion();
  const [formData, setFormData]     = useState({ name: '', email: '', message: '' });
  const [submitState, setSubmitState] = useState('idle');

  const inView = () =>
    prefersReduced
      ? {}
      : { initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '-60px' } };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitState('sending');
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { from_name: formData.name, from_email: formData.email, message: formData.message },
        EMAILJS_PUBLIC_KEY,
      );
      setSubmitState('success');
      setFormData({ name: '', email: '', message: '' });
    } catch {
      setSubmitState('error');
    }
  };

  return (
    <div>
      {/* ── Page Header ──────────────────────────────────────── */}
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-gradient-to-br from-[#1a3a8f] via-[#16307a] to-[#29b6f6] text-white rounded-2xl px-8 py-10 text-center relative overflow-hidden"
            variants={staggerContainer}
            {...(prefersReduced ? {} : { initial: 'hidden', animate: 'show' })}
          >
            <div aria-hidden="true" className="absolute inset-0 opacity-[0.07]"
              style={{ backgroundImage: 'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)', backgroundSize: '18px 18px' }} />
            <div className="relative z-10">
              <motion.h1 variants={fadeUp} className="text-3xl md:text-4xl font-bold leading-tight mb-3">Contact Us</motion.h1>
              <motion.p variants={fadeUp} className="text-base md:text-lg text-blue-100">
                Get in touch with us for admissions, inquiries, or support
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Form + Info ──────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* ── Contact Form ── */}
            <motion.div variants={staggerContainer} {...inView()}>
              <motion.h2 variants={fadeUp} className="text-3xl font-bold leading-tight text-[#1a1a2e] mb-6">
                Send Us a Message
              </motion.h2>
              <motion.form variants={fadeUp} onSubmit={handleSubmit} className="space-y-6" noValidate>

                <FloatingLabelInput
                  id="name" name="name" label="Your Name"
                  value={formData.name} onChange={handleChange}
                  disabled={submitState === 'sending'} required
                />
                <FloatingLabelInput
                  id="email" name="email" label="Email Address" type="email"
                  value={formData.email} onChange={handleChange}
                  disabled={submitState === 'sending'} required
                />
                <FloatingLabelTextarea
                  id="message" name="message" label="Your Message"
                  value={formData.message} onChange={handleChange}
                  disabled={submitState === 'sending'} required rows={6}
                />

                {/* Inline feedback */}
                <AnimatePresence mode="wait">
                  {submitState === 'success' && (
                    <motion.p
                      key="success"
                      role="status"
                      initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm"
                    >
                      ✅ Message sent! We'll get back to you soon.
                    </motion.p>
                  )}
                  {submitState === 'error' && (
                    <motion.p
                      key="error"
                      role="alert"
                      initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm"
                    >
                      ❌ Something went wrong. Please try again or contact us via WhatsApp.
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.div
                  whileHover={prefersReduced ? {} : { scale: 1.02 }}
                  whileTap={prefersReduced ? {} : { scale: 0.98 }}
                >
                  <Button variant="primary" type="submit" fullWidth disabled={submitState === 'sending'}
                    className="focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2">
                    {submitState === 'sending' ? 'Sending…' : 'Send Message'}
                  </Button>
                </motion.div>
              </motion.form>
            </motion.div>

            {/* ── Contact Info ── */}
            <motion.div variants={staggerContainer} {...inView()}>
              <motion.h2 variants={fadeUp} className="text-3xl font-bold leading-tight text-[#1a1a2e] mb-6">
                Contact Information
              </motion.h2>
              <div className="space-y-4">
                {contactItems.map((item) => (
                  <motion.div
                    key={item.title}
                    variants={fadeUp}
                    className="flex items-start space-x-4 bg-[#f5f7fa] p-6 rounded-xl"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-100 border border-blue-200 shadow-sm flex items-center justify-center flex-shrink-0">
                      <item.icon size={20} strokeWidth={1.75} color="#1a3a8f" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#1a1a2e] mb-1">{item.title}</h3>
                      {item.content}
                      <p className="text-gray-600 mt-1 text-sm">{item.sub}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Map ──────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-[#f5f7fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 className="text-3xl font-bold leading-tight text-[#1a1a2e] mb-8 text-center" variants={fadeUp} {...inView()}>
            Find Us on the Map
          </motion.h2>
          <motion.div className="rounded-xl overflow-hidden shadow-lg" variants={fadeUp} {...inView()}>
            <iframe
              title="Vision Academy Location"
              src="https://www.google.com/maps?q=32.1551,74.1788&z=17&output=embed"
              width="100%" height="350"
              style={{ border: 0, display: 'block' }}
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-12 md:py-16 relative overflow-hidden text-white"
        style={{ background: 'linear-gradient(135deg, #1a3a8f 0%, #16307a 50%, #29b6f6 100%)' }}>
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '128px' }} />
        <motion.div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" variants={fadeUp} {...inView()}>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">Visit Us Today</h2>
          <p className="text-blue-100 text-lg mb-8">We'd love to meet you in person and show you around our campus</p>
          <motion.div whileHover={prefersReduced ? {} : { scale: 1.05 }} whileTap={prefersReduced ? {} : { scale: 0.97 }} className="inline-block">
            <Button variant="secondary" href="https://wa.me/923126174004" target="_blank" rel="noopener noreferrer"
              className="focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2">
              <span className="text-2xl mr-3">💬</span>
              Schedule a Visit
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
