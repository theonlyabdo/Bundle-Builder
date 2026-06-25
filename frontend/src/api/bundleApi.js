import fallbackData from "../data/bundle-data.json";

/**
 * If we run the Express API (see /backend), the app fetches live
 * data from it instead of the bundled JSON. It will fall back to the
 * local JSON automatically if the API isn't reachable, times out, or
 * returns something unexpected. so the app always works standalone.
 */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
const FETCH_TIMEOUT_MS = 1200;

function isValidBundleShape(data) {
  return (
    data &&
    Array.isArray(data.steps) &&
    Array.isArray(data.reviewOnlyItems) &&
    typeof data.meta === "object"
  );
}

/**
 * Resolves with the bundle data, preferring the live API and silently
 * falling back to the bundled JSON file on any failure (network error,
 * timeout, malformed response, API not running, etc).
 */
export async function loadBundleData() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const response = await fetch(`${API_BASE_URL}/api/bundle`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`API responded with ${response.status}`);

    const data = await response.json();
    if (!isValidBundleShape(data))
      throw new Error("Unexpected API response shape");

    return { data, source: "api" };
  } catch (err) {
    console.info("Bundle API unavailable, using local data:", err.message);
    return { data: fallbackData, source: "local" };
  }
}
