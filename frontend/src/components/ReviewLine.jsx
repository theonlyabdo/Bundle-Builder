import { ProductImage } from "./ProductImage";
import { QuantityStepper } from "./QuantityStepper";
import { PriceTag } from "./PriceTag";

export function ReviewLine({ line, onChangeQuantity }) {
  return (
    <div className="flex items-center gap-2.5 py-2">
      <ProductImage
        name={line.name}
        src={line.image}
        size={32}
        rounded="rounded-md"
      />
      <span className="flex-1 text-sm leading-snug text-ink-900">
        {line.name}
      </span>
      <QuantityStepper
        size="sm"
        quantity={line.qty}
        label={line.name}
        onChange={(qty) => onChangeQuantity(line.variantId, qty)}
      />
      <div className="w-[72px] shrink-0">
        <PriceTag
          size="sm"
          variant="review"
          price={line.price * line.qty}
          compareAtPrice={
            line.compareAtPrice != null ? line.compareAtPrice * line.qty : null
          }
          priceLabel={line.priceLabel}
          billingSuffix={line.billingSuffix}
        />
      </div>
    </div>
  );
}
