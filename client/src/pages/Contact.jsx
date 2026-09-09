import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Phone, MessageCircle, Mail, MapPin, Clock } from 'lucide-react';
import emailjs from '@emailjs/browser';
import Button from '../components/Button';

// ─────────────────────────────────────────────────────────────
// EmailJS credentials are loaded from .env — fill in the values
// in the .env file at the project root (client/.env).
//   VITE_EMAILJS_SERVICE_ID   → your service ID from EmailJS dashboard
//   VITE_EMAILJS_TEMPLATE_ID  → your template ID from EmailJS dashboard
//   VITE_EMAILJS_PUBLIC_KEY   → your public key from EmailJS → Account → API Keys
// ─────────────────────────────────────────────────────────────
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
    content: <a href="tel:+923126174004" className="text-[#29b6f6] hover:underline text-lg">+92 312 6174004</a>,
    sub: 'Call us for immediate assistance',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    content: <a href="https://wa.me/923126174004" target="_blank" rel="noopener noreferrer" className="text-[#29b6f6] hover:underline text-lg">Chat on WhatsApp</a>,
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
          className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-[#25d366] hover:bg-[#1ebe5d] text-white text-sm font-medium rounded-lg transition-colors"
        >
          <MessageCircle size={14} strokeWidth={1.75} /> Chat on WhatsApp
        </a>
      </>
    ),
    sub: 'Contact us to book your slot',
  },
];

export default function Contact() {
  const prefersReduced = useReducedMotion();
  const [formData, setFormData]   = useState({ name: '', email: '', message: '' });
  const [submitState, setSubmitState] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'

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
      // Template variables must match the variable names in your EmailJS template.
      // Expected template variables: {{from_name}}, {{from_email}}, {{message}}
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:  formData.name,
          from_email: formData.email,
          message:    formData.message,
        },
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
                Contact Us
              </motion.h1>
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

            {/* Contact Form */}
            <motion.div variants={staggerContainer} {...inView()}>
              <motion.h2 variants={fadeUp} className="text-3xl font-semibold text-[#1a1a2e] mb-6">
                Send Us a Message
              </motion.h2>
              <motion.form variants={fadeUp} onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={submitState === 'sending'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29b6f6] focus:border-transparent transition-shadow disabled:opacity-60"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={submitState === 'sending'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29b6f6] focus:border-transparent transition-shadow disabled:opacity-60"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    disabled={submitState === 'sending'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29b6f6] focus:border-transparent resize-none transition-shadow disabled:opacity-60"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                {/* Inline success / error feedback */}
                {submitState === 'success' && (
                  <p
                    role="status"
                    className="text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm"
                  >
                    ✅ Message sent! We'll get back to you soon.
                  </p>
                )}
                {submitState === 'error' && (
                  <p
                    role="alert"
                    className="text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm"
                  >
                    ❌ Something went wrong. Please try again or contact us directly via WhatsApp.
                  </p>
                )}

                <motion.div
                  whileHover={prefersReduced ? {} : { scale: 1.02 }}
                  whileTap={prefersReduced ? {} : { scale: 0.98 }}
                >
                  <Button
                    variant="primary"
                    type="submit"
                    fullWidth
                    disabled={submitState === 'sending'}
                  >
                    {submitState === 'sending' ? 'Sending…' : 'Send Message'}
                  </Button>
                </motion.div>
              </motion.form>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={staggerContainer} {...inView()}>
              <motion.h2 variants={fadeUp} className="text-3xl font-semibold text-[#1a1a2e] mb-6">
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
          <motion.h2
            className="text-3xl font-semibold text-[#1a1a2e] mb-8 text-center"
            variants={fadeUp}
            {...inView()}
          >
            Find Us on the Map
          </motion.h2>
          <motion.div
            className="rounded-xl overflow-hidden shadow-lg"
            variants={fadeUp}
            {...inView()}
          >
            <iframe
              title="Vision Academy Location"
              src="https://www.google.com/maps?q=32.1551,74.1788&z=17&output=embed"
              width="100%"
              height="350"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
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
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Visit Us Today</h2>
          <p className="text-blue-100 text-lg mb-8">
            We'd love to meet you in person and show you around our campus
          </p>
          <motion.div
            whileHover={prefersReduced ? {} : { scale: 1.05 }}
            whileTap={prefersReduced ? {} : { scale: 0.97 }}
            className="inline-block"
          >
            <Button variant="secondary" href="https://wa.me/923126174004" target="_blank" rel="noopener noreferrer">
              <span className="text-2xl mr-3">💬</span>
              Schedule a Visit
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
