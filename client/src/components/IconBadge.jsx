export default function IconBadge({ icon: Icon, className = '' }) {
  return (
    <div
      className={`w-12 h-12 rounded-xl
        bg-blue-100 dark:bg-blue-950/40
        border border-blue-200 dark:border-blue-800/50
        shadow-sm
        flex items-center justify-center flex-shrink-0
        transition-colors duration-200
        group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50
        ${className}`}
    >
      <Icon size={22} strokeWidth={1.75} className="text-[#1a3a8f] dark:text-blue-300" />
    </div>
  );
}
