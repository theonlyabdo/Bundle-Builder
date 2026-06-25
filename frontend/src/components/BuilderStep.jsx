import { ChevronIcon, StepIcon } from "./icons";
import { ProductCard } from "./ProductCard";

export default function BuilderStep({
  step,
  isOpen,
  selectedCount,
  quantities,
  activeVariant,
  onToggle,
  onSelectVariant,
  onChangeQuantity,
  onNext,
  isLast,
}) {
  const panelId = `step-panel-${step.id}`;
  const headerId = `step-header-${step.id}`;

  if (isOpen) {
    return (
      <section className="rounded-card bg-surface-panel p-5">
        <h2 className="m-0 mb-4">
          <span className="block text-[11px] font-semibold uppercase tracking-wide text-ink-400">
            Step {step.stepNumber} of 4
          </span>
          <button
            type="button"
            id={headerId}
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={() => onToggle(step.id)}
            className="mt-1 flex w-full items-center justify-between gap-3 text-left"
          >
            <span className="flex items-center gap-2 text-lg font-bold text-ink-900">
              <StepIcon name={step.icon} className="text-ink-700" />
              {step.title}
            </span>
            <span className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-600">
              <span className="whitespace-nowrap">
                {selectedCount} selected
              </span>
              <ChevronIcon open={isOpen} className="text-brand-600" />
            </span>
          </button>
        </h2>

        <div id={panelId} role="region" aria-labelledby={headerId}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2">
            {step.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                quantities={quantities}
                activeVariantId={activeVariant[product.id]}
                onSelectVariant={onSelectVariant}
                onChangeQuantity={onChangeQuantity}
              />
            ))}
          </div>

          {!isLast && (
            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={onNext}
                className="rounded-pill border border-brand-600 bg-white px-5 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
              >
                {step.nextLabel}
              </button>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-surface-border">
      <h2 className="m-0">
        <span className="block px-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-ink-400">
          Step {step.stepNumber} of 4
        </span>
        <button
          type="button"
          id={headerId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => onToggle(step.id)}
          className="flex w-full items-center justify-between gap-3 px-1 py-3 text-left cursor-pointer hover:bg-surface-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
        >
          <span className="flex items-center gap-2 text-lg font-bold text-ink-900">
            <StepIcon name={step.icon} className="text-ink-700" />
            {step.title}
          </span>
          <ChevronIcon open={isOpen} className="shrink-0 text-ink-400" />
        </button>
      </h2>
    </section>
  );
}
