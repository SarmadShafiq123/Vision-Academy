import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { Phone, MessageCircle, Mail } from 'lucide-react';
import logo from '../assets/vision.png';

const quickLinks = [
  { name: 'Home',    path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Courses', path: '/courses' },
  { name: 'Contact', path: '/contact' },
];

export default function Footer() {
  const prefersReduced = useReducedMotion();

  return (
    <footer className="bg-[#1a1a2e] text-white mt-auto">
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
            <div className="bg-white rounded-xl inline-block px-3 py-2 mb-4">
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
              <a
                href="https://www.facebook.com/profile.php?id=61594178853129"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vision Academy on Facebook"
                className="w-8 h-8 bg-gray-700 rounded-xl flex items-center justify-center text-xs hover:bg-[#29b6f6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                FB
              </a>
              <a
                href="https://www.instagram.com/visionacademyyy/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vision Academy on Instagram"
                className="w-8 h-8 bg-gray-700 rounded-xl flex items-center justify-center text-xs hover:bg-[#29b6f6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                IG
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
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
