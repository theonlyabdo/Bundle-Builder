import { useState } from "react";
import { ReviewLine } from "./ReviewLine";
import { PlanLine } from "./PlanLine";
import { GuaranteeSeal } from "./GuaranteeSeal";
import { TruckIcon } from "./icons";
import { PriceTag } from "./PriceTag";
import { formatPrice } from "../utils/pricing";
import PaymentDialogue from "./PaymentDialogue";

export default function ReviewPanel({
  reviewGroups,
  totals,
  meta,
  onChangeQuantity,
  onSave,
  justSaved,
}) {
  const [checkoutMessage, setCheckoutMessage] = useState(false);
  const hasItems = reviewGroups.some((g) => g.lines.length > 0);

  const [paymentOpen, setPaymentOpen] = useState(false);

  const handleCheckout = () => {
    setPaymentOpen(true);
  };

  return (
    <div className="@container flex flex-col rounded-card bg-surface-panel p-5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
        Review
      </p>
      <h2 className="mt-1 text-xl font-bold text-ink-900">
        Your security system
      </h2>
      <p className="mt-1 text-sm leading-snug text-ink-500">
        Review your personalized protection system designed to keep what matters
        most safe.
      </p>

      <div className="mt-4">
        {hasItems ? (
          reviewGroups.map((group) => (
            <div
              key={group.category}
              className="border-t border-surface-border/80 py-2 first:border-t-0 first:pt-0"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">
                {group.category}
              </p>
              <div>
                {group.lines.map((line) =>
                  group.category === meta.categoryLabels.plan ? (
                    <PlanLine key={line.variantId} line={line} />
                  ) : (
                    <ReviewLine
                      key={line.variantId}
                      line={line}
                      onChangeQuantity={onChangeQuantity}
                    />
                  ),
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="py-6 text-center text-sm text-ink-500">
            Nothing selected yet — choose products on the left to build your
            system.
          </p>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-surface-border py-2.5">
        <span className="flex items-center gap-2 text-sm text-ink-900">
          <TruckIcon className="text-ink-700" />
          {meta.shipping.label}
        </span>
        <PriceTag
          size="sm"
          variant="review"
          price={meta.shipping.price}
          compareAtPrice={meta.shipping.compareAtPrice}
          priceLabel={meta.shipping.priceLabel}
        />
      </div>

      <div className="border-t border-surface-border pt-4">
        <div className="flex items-start gap-4">
          <GuaranteeSeal text={meta.guarantee.badgeText} size={64} />

          <div className="hidden flex-1 @[420px]:block">
            <p className="text-sm font-semibold text-ink-900">
              {meta.guarantee.title}
            </p>
            <p className="mt-0.5 text-xs leading-snug text-ink-500">
              {meta.guarantee.description}
            </p>
          </div>

          <div className="flex flex-1 flex-col items-end gap-1.5">
            <span className="rounded-pill bg-brand-700 px-2.5 py-1 text-[11px] font-semibold text-white">
              {meta.financing.text}
            </span>
            <div className="flex items-end gap-1.5">
              {totals.savings > 0 && (
                <span className="text-base text-ink-400 line-through">
                  {formatPrice(totals.compareSubtotal)}
                </span>
              )}
              <span className="text-2xl font-bold text-brand-700">
                {formatPrice(totals.subtotal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {totals.savings > 0 && (
        <p className="mt-3 text-center text-sm font-medium text-success">
          Congrats! You're saving {formatPrice(totals.savings)} on your security
          bundle!
        </p>
      )}

      <button
        type="button"
        onClick={handleCheckout}
        disabled={!hasItems}
        className="mt-4 cursor-pointer w-full rounded-xl bg-brand-700 py-3.5 text-sm font-bold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Checkout
      </button>

      {checkoutMessage && (
        <p
          className="mt-2 text-center text-xs font-medium text-success"
          role="status"
        >
          This is a prototype — checkout isn't wired up yet!
        </p>
      )}

      <button
        type="button"
        onClick={onSave}
        className="mt-3 text-center text-xs font-semibold text-ink-700 underline underline-offset-2 hover:text-brand-600"
      >
        Save my system for later
      </button>
      <PaymentDialogue
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
      />

      {justSaved && (
        <p
          className="mt-1 text-center text-xs font-medium text-success"
          role="status"
        >
          Saved! Come back anytime to pick up where you left off.
        </p>
      )}
    </div>
  );
}
