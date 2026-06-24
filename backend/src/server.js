import express from "express";
import cors from "cors";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, "bundle-data.json");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Simple in-memory cache of the JSON file. Re-read on every request would
// be fine at this scale too, but this avoids hitting disk every call.
let cachedData = null;

async function loadData() {
  if (cachedData) return cachedData;
  const raw = await readFile(DATA_PATH, "utf-8");
  cachedData = JSON.parse(raw);
  return cachedData;
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Full bundle (steps, review-only items, meta) — what the frontend consumes.
app.get("/api/bundle", async (_req, res) => {
  try {
    const data = await loadData();
    res.json(data);
  } catch (err) {
    console.error("Failed to load bundle data:", err);
    res.status(500).json({ error: "Failed to load bundle data" });
  }
});

// Convenience sub-routes, in case a consumer only wants one slice.
app.get("/api/bundle/steps", async (_req, res) => {
  const data = await loadData();
  res.json(data.steps);
});

app.get("/api/bundle/steps/:stepId", async (req, res) => {
  const data = await loadData();
  const step = data.steps.find((s) => s.id === req.params.stepId);
  if (!step) return res.status(404).json({ error: "Step not found" });
  res.json(step);
});

app.get("/api/bundle/review-only-items", async (_req, res) => {
  const data = await loadData();
  res.json(data.reviewOnlyItems);
});

app.get("/api/bundle/meta", async (_req, res) => {
  const data = await loadData();
  res.json(data.meta);
});

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Bundle API listening on http://localhost:${PORT}`);
});
