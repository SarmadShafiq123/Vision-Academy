/**
 * IconBadge — shared premium icon container used across all sections.
 *
 * Visual spec:
 *  - 48×48px square, rounded-xl
 *  - bg-blue-100 with border border-blue-200 and shadow-sm
 *  - Icon: brand blue (#1a3a8f), size 22, strokeWidth 1.75
 *  - Optional `className` for margin/hover overrides from the call site
 *
 * Hover treatment (on cards):
 *  - Wrap with a group class on the parent card, then add group-hover:bg-blue-200
 *    via the hoverClassName prop, or just use the default which includes a
 *    CSS transition so the bg shifts subtly when the badge is hovered directly.
 */
export default function IconBadge({ icon: Icon, className = '' }) {
  return (
    <div
      className={`w-12 h-12 rounded-xl bg-blue-100 border border-blue-200 shadow-sm
        flex items-center justify-center flex-shrink-0
        transition-colors duration-200 group-hover:bg-blue-200 ${className}`}
    >
      <Icon size={22} strokeWidth={1.75} color="#1a3a8f" />
    </div>
  );
}
