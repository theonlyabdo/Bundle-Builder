import { useState } from "react";

// Deterministic pastel color from a string, so each product gets a stable
// but distinct placeholder tile instead of random colors on every render.
function colorFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 92%)`;
}

function initials(name) {
  return name
    .split(" ")
    .filter((w) => /^[A-Za-z0-9]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export function ProductImage({
  name,
  src,
  size = 64,
  className = "",
  rounded = "rounded-lg",
  fallbackColor,
  showInitials = true,
}) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !src || failed;

  if (showPlaceholder) {
    const bg = fallbackColor ?? colorFromString(name);
    return (
      <div
        className={`flex items-center justify-center shrink-0 ${rounded} ${className}`}
        style={{ backgroundColor: bg, width: size, height: size }}
        aria-hidden="true"
      >
        {showInitials && (
          <span
            className="font-semibold text-ink-700/50"
            style={{ fontSize: Math.max(11, size * 0.28) }}
          >
            {initials(name)}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`shrink-0 object-contain ${rounded} ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
