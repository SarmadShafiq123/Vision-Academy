import { Link } from 'react-router-dom';

export default function Button({
  children,
  variant = 'primary',
  to,
  href,
  type = 'button',
  className = '',
  fullWidth = false,
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-colors rounded-xl';
  
  const variants = {
    primary: 'bg-[#1a3a8f] text-white px-8 py-3 hover:bg-[#2a4a9f]',
    secondary: 'bg-white text-[#1a3a8f] px-8 py-3 hover:bg-gray-100',
    outline: 'border-2 border-white text-white px-8 py-3 hover:bg-white hover:text-[#1a3a8f]',
    accent: 'bg-[#29b6f6] text-white px-8 py-3 hover:bg-[#1a9fd6]',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const combinedClasses = `${baseClasses} ${variants[variant]} ${widthClass} ${className}`.trim();

  // Internal Link
  if (to) {
    return (
      <Link to={to} className={combinedClasses} {...props}>
        {children}
      </Link>
    );
  }

  // External Link
  if (href) {
    return (
      <a href={href} className={combinedClasses} {...props}>
        {children}
      </a>
    );
  }

  // Button element
  return (
    <button type={type} className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
