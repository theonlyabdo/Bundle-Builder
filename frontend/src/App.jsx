import { useState } from "react";
import bundleData from "./data/bundle-data.json";

export default function App() {
  const { steps } = bundleData;

  const [openStep, setOpenStep] = useState(steps[0].id);

  return (
    <div className="min-h-screen bg-[#f7f7fb] px-4 py-8 sm:px-6 lg:px-5">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-ink-900">
            Build your security system
          </h1>

          <p className="mt-1 text-sm text-ink-500">
            Pick the cameras, plan, sensors, and extras that fit your home.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_380px]">
          {/* Accordion */}
          <div className="flex flex-col gap-3">
            {steps.map((step) => {
              const isOpen = openStep === step.id;

              return (
                <div
                  key={step.id}
                  className="rounded-card bg-white shadow-card overflow-hidden"
                >
                  {/* Header */}
                  <button
                    onClick={() => setOpenStep(isOpen ? null : step.id)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                  >
                    <div>
                      <p className="text-xs text-ink-400">
                        Step {step.stepNumber}
                      </p>

                      <h2 className="text-lg font-bold text-ink-900">
                        {step.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="rounded-chip bg-brand-100 px-3 py-1 text-xs text-brand-70">
                        {step.icon}
                      </span>

                      <span
                        className={`
                          text-xl transition-transform
                          ${isOpen ? "rotate-180" : ""}
                        `}
                      ></span>
                    </div>
                  </button>

                  {/* Content */}
                  {isOpen && (
                    <div className="border-t border-surface-border p-5">
                      <div className="grid gap-3 sm:grid-cols-2">
                        {step.products.map((product) => (
                          <div
                            key={product.id}
                            className="rounded-card border border-surface-border p-4"
                          >
                            <h3 className="font-semibold text-ink-900">
                              {product.name}
                            </h3>

                            <p className="mt-1 text-sm text-ink-500">
                              {product.description}
                            </p>

                            <div className="mt-3 flex justify-between">
                              <span className="font-bold text-brand-600">
                                ${product.variants[0].price}
                              </span>

                              {product.badge && (
                                <span className="rounded-pill bg-green-100 px-2 py-1 text-xs text-success">
                                  {product.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Review panel */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-card bg-white p-5 shadow-panel">
              <h2 className="font-bold text-ink-900">Review your system</h2>

              <p className="mt-2 text-sm text-ink-500">
                Selected products will appear here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
