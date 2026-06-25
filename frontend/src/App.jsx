import { useState } from "react";
import bundleData from "./data/bundle-data.json";
import BuilderStep from "./components/BuilderStep";

export default function App() {
  const { steps } = bundleData;

  const [openStep, setOpenStep] = useState(steps[0].id);

  const [quantities, setQuantities] = useState({});
  const [activeVariant, setActiveVariant] = useState({});

  const toggleStep = (stepId) => {
    setOpenStep((current) => (current === stepId ? null : stepId));
  };

  const selectVariant = (productId, variantId) => {
    setActiveVariant((prev) => ({
      ...prev,
      [productId]: variantId,
    }));
  };

  const setQuantity = (variantId, qty) => {
    setQuantities((prev) => ({
      ...prev,
      [variantId]: qty,
    }));
  };

  const goToNextStep = (stepId) => {
    const currentIndex = steps.findIndex((step) => step.id === stepId);

    const nextStep = steps[currentIndex + 1];

    if (nextStep) {
      setOpenStep(nextStep.id);
    }
  };

  const selectedCountByStep = steps.reduce((acc, step) => {
    acc[step.id] = step.products.reduce((count, product) => {
      return (
        count +
        product.variants.reduce(
          (sum, variant) =>
            sum + (quantities[variant.id] || variant.defaultQty || 0),
          0,
        )
      );
    }, 0);

    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#f7f7fb] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1280px]">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-ink-900">
            Build your security system
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

          <div className="lg:sticky lg:top-8 lg:self-start">review</div>
        </div>
      </div>
    </div>
  );
}
