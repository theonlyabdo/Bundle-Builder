import { MinusIcon, PlusIcon } from "./icons";

export function QuantityStepper({
  quantity,
  onChange,
  size = "md",
  label,
  muted = false,
}) {
  const isCompact = size === "sm";
  const btnSize = isCompact ? "w-5 h-5" : "w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7";
  const textSize = isCompact ? "text-sm" : "text-sm lg:text-base";
  const gap = isCompact ? "gap-1.5" : "gap-1 lg:gap-1.5";

  const decrement = () => onChange(Math.max(0, quantity - 1));
  const increment = () => onChange(quantity + 1);

  const btnBase = `${btnSize} flex items-center justify-center rounded-md border transition disabled:cursor-not-allowed disabled:opacity-40`;
  const btnTone = muted
    ? "border-dashed border-surface-border bg-surface-panelAlt text-ink-400 hover:border-brand-300 hover:text-brand-500"
    : "border-surface-border bg-surface-panelAlt text-ink-700 hover:border-brand-400 hover:text-brand-600";

  return (
    <div
      className={`inline-flex items-center ${gap} select-none`}
      role="group"
      aria-label={label ? `Quantity for ${label}` : "Quantity"}
    >
      <button
        type="button"
        onClick={decrement}
        disabled={quantity <= 0}
        className={`${btnBase} ${btnTone}`}
        aria-label={`Decrease quantity${label ? ` of ${label}` : ""}`}
      >
        <MinusIcon />
      </button>
      <span
        className={`${textSize} w-4 text-center font-semibold tabular-nums text-ink-900`}
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={increment}
        className={`${btnBase} ${btnTone}`}
        aria-label={`Increase quantity${label ? ` of ${label}` : ""}`}
      >
        <PlusIcon />
      </button>
    </div>
  );
}
