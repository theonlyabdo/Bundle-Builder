import { ChevronDown, Plus, Minus, Truck, Camera, Shield, Radar, PackagePlus } from "lucide-react";

export function ChevronIcon({ open, className = "" }) {
  return (
    <ChevronDown
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""} ${className}`}
      size={16}
      strokeWidth={2}
      aria-hidden="true"
    />
  );
}

export function PlusIcon({ className = "" }) {
  return <Plus className={className} size={12} strokeWidth={2.25} aria-hidden="true" />;
}

export function MinusIcon({ className = "" }) {
  return <Minus className={className} size={12} strokeWidth={2.25} aria-hidden="true" />;
}

export function TruckIcon({ className = "" }) {
  return <Truck className={className} size={20} strokeWidth={1.75} aria-hidden="true" />;
}

// Maps each step's `icon` key (from bundle-data.json) to a lucide-react icon.
const STEP_ICON_COMPONENTS = {
  camera: Camera,
  shield: Shield,
  sensor: Radar,
  extra: PackagePlus,
};

export function StepIcon({ name, className = "" }) {
  const Icon = STEP_ICON_COMPONENTS[name] ?? Camera;
  return <Icon className={className} size={20} strokeWidth={1.75} aria-hidden="true" />;
}
