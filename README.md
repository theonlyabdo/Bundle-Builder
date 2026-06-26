# Bundle-Builder

A React-based interactive bundle builder featuring a multi-step flow, dynamic selections, and a live review panel designed with scalable frontend practices. A two-column, data-driven bundle builder: a 4-step accordion on the left for assembling a security system

```bash
(cameras -> plan -> sensors -> extra protection)
```

and a live review panel on the right that stays in sync as you go.

```
bundle-builder/
├── frontend/   React + Vite + Tailwind app (the actual deliverable)
└── backend/    Tiny Express API serving the product JSON (bonus)
```

## Quick start

The frontend works completely on its own, reading from a local JSON file.
The backend is optional, if it's running, the frontend will use it instead;
if not, it falls back to the local file automatically.

### 1. Frontend only (fastest path)

```bash
cd frontend
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). That's it.

### 2. Frontend + backend (to exercise the bonus API)

In one terminal:

```bash
cd backend
npm install
npm start
```

This starts the API on `http://localhost:4000`.

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Reload the app: open the Network tab and you'll see it now requests
`http://localhost:4000/api/bundle` instead of using the bundled JSON. If you
stop the backend and reload again, it falls back to the local file with no
errors and no visible difference, by design.

### Production build (frontend)

```bash
cd frontend
npm run build
npm run preview   # serves the dist/ build locally to sanity-check it
```

## How it's organized

### Data

Everything renders from `frontend/src/data/bundle-data.json` (also mirrored
in `backend/src/bundle-data.json` for the API to serve). The shape:

- **`steps`**: the 4 accordion steps, each with a list of **products**,
  each product with a list of **variants**. A product with one variant and
  no `label` (e.g. the doorbell) renders with no color selector, matching
  the design. A product with multiple variants (e.g. White/Grey/Black)
  renders the chip row.
- **`reviewOnlyItems`**: things that show up pre-populated in the review
  panel but have no card in the builder (the required sensor hub). They
  still carry a `defaultQty` and get a real, working quantity stepper in the
  review panel, per the brief.
- **`meta`**: shipping, guarantee copy, financing line, and the category
  labels used as review-panel subheadings.

Nothing in the component layer hardcodes a product name or id. Add a new
product to the JSON (with at least one variant) and it shows up correctly
laid out, priced, and wired into the review panel and totals.

### State

`frontend/src/hooks/useBundleState.js` is the single source of truth:

- `quantities`: a flat map of **variant id -> quantity**. This is what
  makes "Red ×2, Blue ×0 of the same product" work: red and blue are
  different variant ids with independent counts.
- `activeVariant`: a map of **product id -> currently selected variant id**.
  The quantity stepper on a card is always bound to
  `quantities[activeVariant[productId]]`, so switching the color chip swaps
  which count the stepper is reading/writing without touching any other
  variant's count.
- `openStep`: which accordion step is expanded.

Everything else (the "N selected" counts, the grouped review-panel lines,
the running total and savings) is derived from `quantities` with
`useMemo`, not stored separately, so there's no way for the review panel to
drift out of sync with the cards.

### Persistence

"Save my system for later" writes `{ quantities, activeVariant, openStep }`
to `localStorage` (see `frontend/src/utils/persistence.js`). On load, the
app checks for a saved snapshot first and seeds state from it; if nothing's
saved, it falls back to the defaults baked into the JSON. A full page
reload after saving restores the exact configuration, including which
accordion step was open and which color was active on each card.

### The bonus API

`backend/src/server.js` is a small Express app that reads the same JSON off
disk and exposes it at `GET /api/bundle` (plus a few convenience sub-routes
like `/api/bundle/steps/:stepId`). The frontend's `src/api/bundleApi.js`
tries that endpoint first with a short timeout and transparently falls back
to the bundled JSON on any failure, connection refused, timeout, non-200,
or an unexpected shape. This was a deliberate choice: the brief says a
local JSON file is "completely fine," so the API had to be additive, never
a hard dependency.

## Implementation notes / decisions

- **Three responsive layouts from Figma.** The reference included three separate
  Figma screens representing the same design across different breakpoints:
  mobile, medium responsive, and wide desktop. I treated them as responsive
  states of one system rather than separate pages. The layout adapts by
  changing the builder/review relationship: stacked content on mobile,
  balanced two-column layout on medium screens, and an expanded desktop view
  with a persistent review panel.

- **Review panel responsiveness.** The review panel behavior is driven by its
  available space rather than only viewport size. I used a CSS container query
  (`@container`) so internal sections such as the guarantee description adapt
  based on the panel width itself. This keeps the component reusable and
  matches the Figma behavior across different layouts.

- **Font.** The reference uses a rounded geometric sans (note the single-story
  "a"). I matched it with Quicksand (used AI to help), self-hosted via
  `@fontsource/quicksand` instead of relying on an external Google Fonts
  request, keeping the app independent from runtime CDN availability.

- **Product images are placeholders.** Real product photography was out of
  scope according to the requirements. Each product uses a deterministic
  generated placeholder tile with initials and stable colors. The
  `ProductImage` component is isolated, so replacing it with real image assets
  only requires updating that component.

- **Dedicated plan rendering.** The Cam Unlimited plan is treated as a
  single-choice subscription rather than a quantity-based product. Because of
  that, it uses a dedicated `PlanLine` component with its own icon, highlighted
  text styling, and pricing layout instead of the regular product review row
  with a quantity stepper.

- **Responsive product grid.** Product cards use a responsive grid that adapts
  naturally between screen sizes: a single-column layout on smaller screens and
  multiple columns when enough horizontal space is available. The layout is
  driven by available width instead of hardcoded card positioning, allowing
  the same component structure to support all three Figma views.

## What I'd do with more time

- Swap `ProductImage` placeholders for real product photography.
- Add proper unit tests around the pricing/derivation logic in
  `useBundleState` (totals, savings, and the per-step selected count are
  pure functions of `quantities` and would be easy to test in isolation).
- Wire the Express API up to a real datastore instead of reading a JSON
  file off disk, if this needed to support editing the catalog at runtime.
- Add a tiny e2e test (Playwright) covering the variant-switch +
  review-panel-sync flow described in the brief, since that's the trickiest
  interaction to get right and the easiest to regress.
- Introduce a dedicated state manager (e.g. Zustand) to simplify and isolate
  cross-component state like quantities, active variants, and derived totals,
  instead of keeping everything inside a single hook.
- Migrate the codebase to TypeScript to enforce stronger type safety across
  the bundle model, reduce runtime assumptions, and make derived state logic
  more reliable and maintainable.
- Build a proper backend layer backed by a real database (e.g. MongoDB), introducing a structured domain model and service layer to handle core business logic such as product catalog management, pricing rules, order creation, simulated payment processing, and event tracking. Even if payments remain mocked, the system would follow a production-like architecture with clear separation between controllers, services, and data models.
