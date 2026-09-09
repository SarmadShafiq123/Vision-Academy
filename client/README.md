# Vision Academy Website - Phase 1

A modern, responsive 4-page website for Vision Academy built with React (Vite) and Tailwind CSS.

## 🎯 Phase 1 Overview

This is **Phase 1: Structure Only** - A clean, static, fully responsive website with no animations or 3D effects. Ready for Phase 2 enhancements (animations with Framer Motion).

## 🚀 Tech Stack

- **React 19** - Latest stable version
- **Vite 8** - Fast build tool and dev server
- **Tailwind CSS v4** - Latest version with @tailwindcss/vite plugin
- **React Router DOM 7** - Client-side routing
- **Poppins Font** - From Google Fonts

## 📁 Project Structure

```
vision-academy/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx       # Sticky navigation with mobile menu
│   │   └── Footer.jsx        # Site footer with links and contact
│   ├── pages/
│   │   ├── Home.jsx          # Landing page with hero, features, stats
│   │   ├── About.jsx         # About us, mission, vision, story
│   │   ├── Courses.jsx       # Academic + Skill Development courses
│   │   └── Contact.jsx       # Contact form and information
│   ├── assets/
│   │   └── logo.svg          # Academy logo
│   ├── App.jsx               # Main app with routing
│   ├── main.jsx              # Entry point
│   └── index.css             # Tailwind imports + custom styles
├── index.html
├── package.json
└── vite.config.js
```

## 🎨 Design System

### Colors
- **Primary Deep Blue:** `#1a3a8f`
- **Accent Sky Blue:** `#29b6f6`
- **White:** `#ffffff`
- **Neutral Gray:** `#f5f7fa`
- **Text Dark:** `#1a1a2e`

### Typography
- **Font Family:** Poppins (Google Fonts)
- **Headings:** Semi-bold (600)
- **Body:** Regular (400)

### Design Elements
- Rounded corners (`rounded-xl`)
- Soft shadows
- Clean whitespace
- Professional edtech aesthetic

## 📄 Pages

### 1. Home (`/`)
- Hero section with CTA buttons
- Brief intro with academy overview
- "Why Choose Us" - 4 feature cards
- Stats section (years, students, courses, success rate)
- WhatsApp CTA banner

### 2. About (`/about`)
- Page header
- Mission & Vision section
- Founder story / "Why We Started"
- Stats section
- Core values

### 3. Courses (`/courses`)
- Page header
- **Academic Programs (9th-12th):** 4 cards for classes 9-12
- **Skill Development:** 4 cards (Truck Dispatch, English Spoken, Web Apps, AI & Automation)
- Course benefits section
- Enrollment CTA

### 4. Contact (`/contact`)
- Page header
- Contact form (Name, Email, Message)
- Contact information cards (Phone, WhatsApp, Email, Address, Hours)
- Map placeholder
- Visit CTA

## 🔧 Installation & Setup

```bash
# Navigate to project directory
cd vision-academy

# Install dependencies (already done)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Development Server

The development server is currently running at:
- **Local:** http://localhost:5174/
- Hot Module Replacement (HMR) enabled

## 📱 Responsive Design

Fully responsive with mobile-first approach:
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

Features mobile hamburger menu and optimized layouts for all screen sizes.

## 🖼️ Image Placeholders

All images are currently **styled div placeholders** with:
- Gray gradient backgrounds
- Descriptive text labels
- Comments indicating replacement locations: `/* REPLACE: Gemini-generated image of [description] */`

These placeholders maintain proper layout structure for seamless image replacement in future phases.

## 📞 Contact Information

- **Phone:** +92 312 6174004 (tel: link)
- **WhatsApp:** https://wa.me/923126174004
- **Email:** info@visionacademy.com (placeholder)

## 🎯 Features Implemented

✅ Clean, modern UI design  
✅ Fully responsive layout  
✅ Mobile hamburger navigation  
✅ Sticky navbar  
✅ React Router DOM navigation  
✅ Contact form with state management  
✅ WhatsApp integration  
✅ Clickable phone links  
✅ Footer with social placeholders  
✅ SEO-friendly page titles  
✅ Zero console errors  
✅ Production-ready build  

## 🚫 Phase 1 Exclusions (By Design)

- ❌ No animations (Phase 2)
- ❌ No Framer Motion (Phase 2)
- ❌ No Three.js/3D (Phase 2+)
- ❌ No backend integration
- ❌ No database
- ❌ No form submissions (UI only)

## 📋 Next Steps (Phase 2)

When ready for Phase 2:
1. Install Framer Motion: `npm install framer-motion`
2. Add scroll animations to sections
3. Animate stats counters
4. Add page transition effects
5. Implement smooth reveals
6. Enhance micro-interactions

## 🏗️ Component Structure

All components are clean and modular:
- **Navbar:** Mobile-responsive with hamburger menu
- **Footer:** Three-column layout with links and contact
- **Pages:** Self-contained with all content sections
- **Styling:** Tailwind utility classes throughout

## ✅ Build Status

- Build: ✅ Successful (no errors)
- Dev Server: ✅ Running
- Hot Reload: ✅ Working
- Production Build: ✅ Optimized

## 📝 Notes

- Logo is currently a simple SVG placeholder (blue rectangle with white text)
- Replace with actual Vision Academy logo when available
- All image placeholders are ready for real image insertion
- Form submission handlers are placeholders (console.log)
- Ready for backend integration when needed

---

**Built with ❤️ for Vision Academy**  
*Empowering Minds, Shaping Futures*
