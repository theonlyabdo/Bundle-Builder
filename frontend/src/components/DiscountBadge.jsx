export function DiscountBadge({ children, className = "" }) {
  if (!children) return null;
  return (
    <span
      className={`absolute left-3 top-3 rounded-md bg-brand-700 px-2 py-1 text-[11px] font-semibold leading-none text-white shadow-sm ${className}`}
    >
      {children}
    </span>
  );
}
