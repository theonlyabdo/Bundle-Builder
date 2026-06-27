import { ProductImage } from "./ProductImage";

export function VariantSelector({ variants, activeVariantId, onSelect }) {
  if (!variants || variants.length <= 1) return null;

  return (
    <div
      className="flex flex-wrap items-center gap-1.5"
      role="radiogroup"
      aria-label="Color"
    >
      {variants.map((variant) => {
        const isActive = variant.id === activeVariantId;
        return (
          <button
            key={variant.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onSelect(variant.id)}
            className={`flex items-center gap-1.5 rounded-md border bg-white px-2 py-1 text-xs text-ink-700 transition ${
              isActive
                ? "border-emerald-300 ring-1 ring-emerald-200"
                : "border-surface-border hover:border-ink-300"
            }`}
          >
            <ProductImage
              name={variant.label ?? "Variant"}
              src={variant.image}
              size={16}
              rounded="rounded-sm"
              fallbackColor={variant.swatch ?? "#d4d4d8"}
              showInitials={false}
            />
            {variant.label}
          </button>
        );
      })}
    </div>
  );
}
