import { useBundleState } from "./hooks/useBundleState";
import BuilderStep from "./components/BuilderStep";
import ReviewPanel from "./components/ReviewPanel";

export default function App() {
  const {
    isLoading,
    steps,
    meta,
    quantities,
    activeVariant,
    openStep,
    justSaved,
    selectedCountByStep,
    reviewGroups,
    totals,
    setQuantity,
    selectVariant,
    toggleStep,
    goToNextStep,
    handleSave,
  } = useBundleState();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f7fb]">
        <p className="text-sm font-medium text-ink-500">
          Loading your security system…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7fb] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1280px]">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-ink-900 hidden lg:block">
            Build your security system
          </h1>
          <h1 className="text-2xl font-bold text-ink-900 lg:hidden">
            Let's Get Started!
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Pick the cameras, plan, sensors, and extras that fit your home.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="flex flex-col">
            {steps.map((step, idx) => (
              <div key={step.id} className={openStep === step.id ? "mb-4" : ""}>
                <BuilderStep
                  step={step}
                  isOpen={openStep === step.id}
                  isLast={idx === steps.length - 1}
                  selectedCount={selectedCountByStep[step.id] ?? 0}
                  quantities={quantities}
                  activeVariant={activeVariant}
                  onToggle={toggleStep}
                  onSelectVariant={selectVariant}
                  onChangeQuantity={setQuantity}
                  onNext={() => goToNextStep(step.id)}
                />
              </div>
            ))}
          </div>

          <div className="lg:sticky lg:top-8 lg:self-start">
            <ReviewPanel
              reviewGroups={reviewGroups}
              totals={totals}
              meta={meta}
              onChangeQuantity={setQuantity}
              onSave={handleSave}
              justSaved={justSaved}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
