import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { Phone, MessageCircle, Mail } from 'lucide-react';
import logo from '../assets/vision-logo-transparent.png';

const quickLinks = [
  { name: 'Home',     path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Courses',  path: '/courses' },
  { name: 'Contact',  path: '/contact' },
];

function FacebookIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer() {
  const prefersReduced = useReducedMotion();

  return (
    <footer className="bg-[#1a1a2e] dark:bg-[#080e1f] text-white mt-auto border-t border-transparent dark:border-[#2a3352]">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Logo + Description */}
          <div>
            <div className="mb-4">
              <img src={logo} alt="Vision Academy" className="h-20" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering minds and shaping futures through quality education
              and skill development.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-[#29b6f6] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center space-x-2">
                <Phone size={15} strokeWidth={1.5} color="#29b6f6" />
                <a href="tel:+923126174004" className="hover:text-[#29b6f6] transition-colors">
                  +92 312 6174004
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <MessageCircle size={15} strokeWidth={1.5} color="#29b6f6" />
                <a
                  href="https://wa.me/923126174004"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#29b6f6] transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={15} strokeWidth={1.5} color="#29b6f6" />
                <span>info@visionacademy.com</span>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="flex space-x-3 mt-4">
              <motion.a
                href="https://www.facebook.com/profile.php?id=61594178853129"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vision Academy on Facebook"
                whileHover={prefersReduced ? {} : { scale: 1.1 }}
                whileTap={prefersReduced ? {} : { scale: 0.95 }}
                className={[
                  'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                  'bg-blue-100 dark:bg-blue-950/40',
                  'border border-blue-200 dark:border-blue-800/50',
                  'text-[#1a3a8f] dark:text-blue-300',
                  'hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
                ].join(' ')}
              >
                <FacebookIcon size={18} />
              </motion.a>
              <motion.a
                href="https://www.instagram.com/visionacademyyy/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vision Academy on Instagram"
                whileHover={prefersReduced ? {} : { scale: 1.1 }}
                whileTap={prefersReduced ? {} : { scale: 0.95 }}
                className={[
                  'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                  'bg-blue-100 dark:bg-blue-950/40',
                  'border border-blue-200 dark:border-blue-800/50',
                  'text-[#1a3a8f] dark:text-blue-300',
                  'hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
                ].join(' ')}
              >
                <InstagramIcon size={18} />
              </motion.a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 dark:border-[#2a3352] mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2026 Vision Academy. All rights reserved.</p>
          <p className="text-xs text-gray-500 mt-2">
            Made with ❤️ by Sarmad Shafiq —{' '}
            <a
              href="mailto:mrsarmadshafiq@gmail.com"
              className="hover:text-[#29b6f6] transition-colors"
            >
              mrsarmadshafiq@gmail.com
            </a>
          </p>
        </div>
      </motion.div>
    </footer>
  );
}
