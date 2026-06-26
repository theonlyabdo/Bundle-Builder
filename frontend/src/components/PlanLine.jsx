import { Shield } from "lucide-react";
import { PriceTag } from "./PriceTag";

export function PlanLine({ line }) {
  const words = line.name.split(" ");
  const prefix = words.slice(0, -1).join(" ") || words[0];
  const suffix = words.length > 1 ? words[words.length - 1] : "";

  return (
    <div className="flex items-center gap-3 py-2">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
        <Shield size={16} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <span className="flex-1 truncate text-sm font-bold text-ink-900">
        {prefix} {suffix && <span className="text-brand-600">{suffix}</span>}
      </span>
      <PriceTag
        size="sm"
        variant="review"
        price={line.price}
        compareAtPrice={line.compareAtPrice}
        billingSuffix={line.billingSuffix}
      />
    </div>
  );
}
