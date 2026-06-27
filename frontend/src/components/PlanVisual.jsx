import { Cloud } from "lucide-react";

export function PlanVisual({ size = 80, className = "" }) {
  return (
    <div
      className={`flex items-center justify-center shrink-0 rounded-lg bg-brand-100 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <Cloud className="text-brand-600" size={size * 0.45} strokeWidth={1.6} />
    </div>
  );
}
