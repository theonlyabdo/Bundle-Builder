export function GuaranteeSeal({
  text = "100% Satisfaction Guarantee",
  size = 72,
}) {
  return (
    <div
      className="relative flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {/* Outer ring glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-400 via-brand-600 to-brand-800 shadow-lg" />

      {/* Inner metallic ring */}
      <div className="absolute inset-[6px] rounded-full bg-gradient-to-br from-white/20 via-white/10 to-transparent backdrop-blur-sm" />

      {/* Decorative starburst (medal feel) */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 opacity-20"
        style={{ width: size, height: size }}
      >
        <polygon
          points="50,2 61,12 75,8 79,22 93,25 89,39 99,50 89,61 93,75 79,79 75,93 61,89 50,99 39,89 25,93 21,79 7,75 11,61 1,50 11,39 7,25 21,22 25,8 39,12"
          fill="white"
        />
      </svg>

      {/* Shine highlight */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/40 via-white/10 to-transparent opacity-60" />

      {/* Center text */}
      <div className="relative flex flex-col items-center justify-center px-2 text-center">
        <span className="text-[9px] font-bold leading-tight text-white drop-shadow">
          {text}
        </span>
      </div>
    </div>
  );
}
