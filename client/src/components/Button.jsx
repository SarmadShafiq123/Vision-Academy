import { Link } from 'react-router-dom';

export default function Button({
  children,
  variant = 'primary',
  to,
  href,
  type = 'button',
  className = '',
  fullWidth = false,
  disabled = false,
  ...props
}) {
  const base = [
    'inline-flex items-center justify-center font-semibold',
    'transition-all duration-200 rounded-xl',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2',
  ].join(' ');

  const variants = {
    primary: [
      'bg-[#1a3a8f] dark:bg-[#3d5fc4] text-white px-8 py-3',
      'hover:bg-[#16307a] dark:hover:bg-[#4a6fd4] hover:shadow-lg hover:shadow-blue-800/30',
    ].join(' '),
    secondary: [
      'bg-white dark:bg-[#16213e] text-[#1a3a8f] dark:text-blue-300 px-8 py-3',
      'hover:bg-gray-50 dark:hover:bg-[#1e2d4a] hover:shadow-lg hover:shadow-black/10',
    ].join(' '),
    outline: [
      'border-2 border-white text-white px-8 py-3',
      'hover:bg-white hover:text-[#1a3a8f] hover:shadow-lg hover:shadow-white/20',
    ].join(' '),
    accent: [
      'bg-[#29b6f6] text-white px-8 py-3',
      'hover:bg-[#1a9fd6] hover:shadow-lg hover:shadow-sky-400/30',
    ].join(' '),
  };

  const widthClass    = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-60 pointer-events-none' : '';
  const cls = `${base} ${variants[variant]} ${widthClass} ${disabledClass} ${className}`.trim();

  if (to) {
    return <Link to={to} className={cls} {...props}>{children}</Link>;
  }
  if (href) {
    return <a href={href} className={cls} {...props}>{children}</a>;
  }
  return (
    <button type={type} disabled={disabled} className={cls} {...props}>
      {children}
    </button>
  );
}
