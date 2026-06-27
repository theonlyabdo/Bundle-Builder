import { formatPrice } from "../utils/pricing";

export function PriceTag({
  price,
  compareAtPrice,
  priceLabel,
  billingSuffix,
  align = "right",
  size = "md",
  variant = "card",
}) {
  const showCompare = compareAtPrice != null && compareAtPrice > price;
  const priceText = priceLabel ?? formatPrice(price);

  const isCardSize = size !== "sm";
  const priceSize = isCardSize
    ? variant === "card"
      ? "text-sm lg:text-base"
      : "text-base"
    : "text-sm";
  const compareSize = isCardSize
    ? variant === "card"
      ? "text-xs lg:text-sm"
      : "text-sm"
    : "text-xs";

  const compareColor = variant === "review" ? "text-ink-400" : "text-sale";
  const priceColor = variant === "review" ? "text-brand-600" : "text-ink-900";

  return (
    <div
      className={`flex flex-col ${align === "right" ? "items-end" : "items-start"} leading-tight`}
    >
      {showCompare && (
        <span className={`${compareSize} ${compareColor} line-through`}>
          {formatPrice(compareAtPrice)}
        </span>
      )}
      <span className={`${priceSize} font-semibold ${priceColor}`}>
        {priceText}
        {billingSuffix && (
          <span className="text-xs font-normal text-ink-500">
            {billingSuffix}
          </span>
        )}
      </span>
    </div>
  );
}
