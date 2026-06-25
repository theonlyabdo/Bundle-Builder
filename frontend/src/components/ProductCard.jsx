import { ProductImage } from "./ProductImage";
import { QuantityStepper } from "./QuantityStepper";
import { VariantSelector } from "./VariantSelector";
import { DiscountBadge } from "./DiscountBadge";
import { PriceTag } from "./PriceTag";

export function ProductCard({
  product,
  quantities,
  activeVariantId,
  onSelectVariant,
  onChangeQuantity,
}) {
  const activeVariant =
    product.variants.find((v) => v.id === activeVariantId) ??
    product.variants[0];
  const activeQty = quantities[activeVariant.id] ?? 0;
  const isSelected = product.variants.some((v) => (quantities[v.id] ?? 0) > 0);

  return (
    <div
      className={`relative flex flex-col rounded-card border bg-white p-4 shadow-card transition ${
        isSelected
          ? "border-brand-600 ring-1 ring-brand-600"
          : "border-surface-border"
      }`}
    >
      <DiscountBadge>{product.badge}</DiscountBadge>

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex w-full shrink-0 items-center justify-center lg:w-[88px]">
          <ProductImage name={product.name} size={80} />
        </div>

        <div className="flex flex-1 flex-col gap-2 pt-1">
          <div>
            <h3 className="text-sm font-semibold text-ink-900">
              {product.name}
            </h3>
            <p className="mt-0.5 text-xs leading-snug text-ink-500">
              {product.description}{" "}
              {product.learnMoreUrl && (
                <a
                  href={product.learnMoreUrl}
                  className="font-medium text-brand-600 underline-offset-2 hover:underline"
                  onClick={(e) => e.preventDefault()}
                >
                  Learn More
                </a>
              )}
            </p>
          </div>

          <VariantSelector
            variants={product.variants}
            activeVariantId={activeVariant.id}
            onSelect={(variantId) => onSelectVariant(product.id, variantId)}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <QuantityStepper
          quantity={activeQty}
          label={product.name}
          onChange={(qty) => onChangeQuantity(activeVariant.id, qty)}
        />
        <PriceTag
          price={activeVariant.price}
          compareAtPrice={product.compareAtPrice}
          billingSuffix={product.billingSuffix}
        />
      </div>
    </div>
  );
}
