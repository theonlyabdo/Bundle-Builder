import { useEffect, useState } from "react";

export default function PaymentDialogue({ open, onClose }) {
  const [stage, setStage] = useState("idle");
  // idle | processing | success

  useEffect(() => {
    if (!open) {
      setStage("idle");
      return;
    }

    setStage("processing");

    const timer1 = setTimeout(() => {
      setStage("success");
    }, 2000);

    const timer2 = setTimeout(() => {
      onClose?.();
      setStage("idle");
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[360px] rounded-2xl bg-white p-6 shadow-xl">
        {stage === "processing" && (
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-700" />
            <h2 className="mt-4 text-lg font-bold text-ink-900">
              Processing payment
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              Please wait while we secure your order...
            </p>
          </div>
        )}

        {stage === "success" && (
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success text-white text-xl">
              ✓
            </div>
            <h2 className="mt-4 text-lg font-bold text-ink-900">
              Payment successful
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              Your security bundle is being prepared.
            </p>

            <button
              onClick={onClose}
              className="mt-5 rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
