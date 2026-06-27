import express from "express";
import cors from "cors";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import process from "node:process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, "bundle-data.json");

const app = express();
const PORT = process.env.PORT || 4000;

/* -----------------------------
   Basic Observability Logger
------------------------------*/
function log(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  console.log(JSON.stringify({ level, message, timestamp, ...meta }));
}

/* -----------------------------
   Global error safety nets
------------------------------*/
process.on("uncaughtException", (err) => {
  log("fatal", "Uncaught Exception", { error: err.message, stack: err.stack });
});

process.on("unhandledRejection", (reason) => {
  log("fatal", "Unhandled Rejection", { reason });
});

/* -----------------------------
   Middleware: request logging
------------------------------*/
app.use((req, _res, next) => {
  log("info", "Incoming request", {
    method: req.method,
    path: req.url,
  });
  next();
});

app.use(cors());
app.use(express.json());

/* -----------------------------
   Data layer (cached)
------------------------------*/
let cachedData = null;

async function loadData() {
  if (cachedData) return cachedData;

  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    cachedData = JSON.parse(raw);

    log("info", "Bundle data loaded", {
      steps: cachedData.steps?.length,
      reviewOnlyItems: cachedData.reviewOnlyItems?.length,
    });

    return cachedData;
  } catch (err) {
    log("error", "Failed to load bundle data", {
      path: DATA_PATH,
      error: err.message,
    });
    throw err;
  }
}

/* -----------------------------
   Routes
------------------------------*/
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/bundle", async (_req, res) => {
  try {
    const data = await loadData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to load bundle data" });
  }
});

app.get("/api/bundle/steps", async (_req, res) => {
  const data = await loadData();
  res.json(data.steps);
});

app.get("/api/bundle/steps/:stepId", async (req, res) => {
  const data = await loadData();
  const step = data.steps.find((s) => s.id === req.params.stepId);

  if (!step) {
    log("warn", "Step not found", { stepId: req.params.stepId });
    return res.status(404).json({ error: "Step not found" });
  }

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

/* -----------------------------
   404 handler
------------------------------*/
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

/* -----------------------------
   Start server
------------------------------*/
app.listen(PORT, () => {
  log("info", "Bundle API started", {
    url: `http://localhost:${PORT}`,
  });
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    log("fatal", "Port already in use — is another instance already running?", {
      port: PORT,
      error: err.message,
    });
  } else {
    log("fatal", "Server failed to start", {
      error: err.message,
      code: err.code,
    });
  }
  process.exit(1);
});

server.on("close", () => {
  log("warn", "Server closed", {});
});
