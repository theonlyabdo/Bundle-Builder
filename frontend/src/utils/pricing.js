/**
 * Formats a number as USD currency, e.g. 27.98 -> "$27.98"
 */
export function formatPrice(value) {
  if (value === null || value === undefined) return "";
  return `$${value.toFixed(2)}`;
}

/**
 * Rounds to 2 decimal places to avoid floating point artifacts (e.g. 0.1 + 0.2)
 */
export function round2(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
