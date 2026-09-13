# Bundle Builder

A responsive, data-driven React application for configuring a custom security system through a multi-step bundle-building experience.

The application pairs a four-step product builder with a live review panel that stays synchronized with the user's selections, quantities, variants, pricing, savings, and configuration state.

```text
Cameras → Plan → Sensors → Extra Protection
```

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Frontend Only](#frontend-only)
  - [Running with the Backend](#running-with-the-backend)
  - [Production Build](#production-build)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
  - [Data-Driven Product Catalog](#data-driven-product-catalog)
  - [State Management](#state-management)
  - [Derived State](#derived-state)
  - [Persistence](#persistence)
  - [API Integration](#api-integration)
- [Responsive Design](#responsive-design)
- [UI & Design Decisions](#ui--design-decisions)
- [Engineering Decisions](#engineering-decisions)
- [Future Improvements](#future-improvements)
- [Development Philosophy](#development-philosophy)

---

## Overview

The interface is organized into two primary areas:

| Area | Purpose |
| --- | --- |
| **Bundle Builder** | A four-step accordion for selecting products, variants, and quantities. |
| **Review Panel** | A live summary of the configuration: selected products, quantities, pricing, savings, and required items. |

The application is fully functional using local JSON data. An optional Express API is included to demonstrate how the frontend can consume a remote catalog without making the backend a runtime dependency.

---

## Features

**Configuration**

- Multi-step bundle configuration
- Product and variant selection
- Independent quantities for individual variants
- Live review panel synchronized with the builder
- Automatic price and savings calculation

**Architecture & data**

- Data-driven product rendering
- Persistent bundle configuration via `localStorage`
- Automatic fallback from API to local JSON data
- Optional Express backend API

**Presentation**

- Responsive layouts across mobile, tablet, and desktop
- Responsive review panel built on CSS container queries
- Production-ready frontend build configuration

---

## Tech Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | React, Vite, Tailwind CSS, JavaScript, CSS Container Queries, `@fontsource/quicksand`, `localStorage` |
| **Backend** | Node.js, Express |
| **Tooling** | npm, Git |

---

## Getting Started

### Prerequisites

Node.js and npm must be installed.

### Frontend Only

The frontend runs independently using the bundled JSON catalog. No backend is required.

```bash
cd frontend
npm install
npm run dev
```

Open the URL provided by Vite, typically:

```text
http://localhost:5173
```

### Running with the Backend

The optional Express API runs on port `4000`.

**Terminal 1 — Backend**

```bash
cd backend
npm install
npm start
```

The API becomes available at `http://localhost:4000`.

**Terminal 2 — Frontend**

```bash
cd frontend
npm install
npm run dev
```

When the backend is reachable, the frontend loads the catalog from `GET /api/bundle`. If the API is unavailable, it falls back to the local JSON catalog automatically, which makes the backend an optional enhancement rather than a hard runtime dependency.

### Production Build

```bash
cd frontend
npm run build
npm run preview
```

Production output is generated in `frontend/dist/`.

---

## Project Structure

```text
bundle-builder/
├── frontend/
│   ├── src/
│   │   ├── api/              # API access and fallback logic
│   │   ├── components/       # Reusable UI components
│   │   ├── data/             # Local bundle catalog
│   │   ├── hooks/            # Application state and derived data
│   │   └── utils/            # Persistence and shared utilities
│   └── ...
│
└── backend/
    └── src/
        ├── bundle-data.json  # Catalog served by the API
        └── server.js         # Express API
```

The `frontend` directory is the primary deliverable. The `backend` is an optional extension for exercising the API integration.

---

## Architecture

### Data-Driven Product Catalog

Product information lives in `frontend/src/data/bundle-data.json`, with a corresponding copy served by the backend at `backend/src/bundle-data.json`.

| Key | Contents |
| --- | --- |
| `steps` | The four bundle-building stages. |
| `products` | Products available within each stage. |
| `variants` | Product variants such as colors. |
| `reviewOnlyItems` | Required items displayed only in the review panel. |
| `meta` | Shipping, guarantee, financing, and category labels. |

The UI does not depend on hardcoded product names or IDs. Adding a product to the catalog is enough for the existing components to render its card, variants, quantity controls, review entry, pricing, and selection counts — no component changes required.

### State Management

Bundle state is centralized in `frontend/src/hooks/useBundleState.js`, which acts as the single source of truth for the configuration.

**Quantities** are stored as a map keyed by variant ID:

```text
variantId → quantity
```

This lets variants of the same product hold independent quantities:

```text
Red   → 2
Blue  → 1
Black → 0
```

Switching the active variant therefore never overwrites another variant's quantity.

**Active variants** are tracked separately:

```text
productId → activeVariantId
```

The quantity control on a product card always operates against the currently active variant.

**Accordion state** is tracked through a single `openStep` value.

### Derived State

The review panel keeps no second copy of the bundle state. The following are derived from the underlying quantities:

- Selected item counts
- Review-panel line items
- Total price
- Total savings
- Per-step selection counts

This keeps the builder and review panel synchronized and avoids duplicated state that could drift out of sync.

### Persistence

**Save My System for Later** writes the current configuration to `localStorage`. The saved snapshot contains:

```json
{
  "quantities": {},
  "activeVariant": {},
  "openStep": null
}
```

On startup the saved configuration is restored when available; otherwise the application initializes from the catalog defaults. This preserves selected products and quantities along with active variants and the currently open accordion step.

Persistence logic is isolated in `frontend/src/utils/persistence.js`.

### API Integration

The optional Express backend exposes the catalog through:

```text
GET /api/bundle
GET /api/bundle/steps/:stepId
```

The frontend API layer is responsible for:

1. Attempting to retrieve the catalog from the backend.
2. Validating the response.
3. Falling back to the local JSON catalog if the request fails.

Fallback covers backend unavailability, connection refusal, request timeouts, non-success HTTP responses, and unexpected response structures. API integration can therefore be enabled without altering application behavior or requiring the server to be running.

---

## Responsive Design

The interface is a single responsive system built around three primary layouts:

| Breakpoint | Layout |
| --- | --- |
| **Mobile** | Builder and review panel stack vertically to accommodate limited horizontal space. |
| **Medium** | A balanced two-column layout with comfortable spacing and readable product cards. |
| **Desktop** | A wider builder area alongside an expanded review panel. |

The product grid adapts to available space rather than relying on fixed card positioning, so the same component structure works across viewport sizes.

### Container Queries

The review panel uses CSS container queries to adapt its internal layout to the panel's own available width. Because the panel appears in different layouts depending on the viewport, responding to its container rather than coupling entirely to viewport breakpoints keeps its internal behavior correct in every position.

---

## UI & Design Decisions

**Typography.** The design uses Quicksand, a rounded geometric sans-serif that closely matches the provided visual reference. It is self-hosted through `@fontsource/quicksand`, avoiding a runtime dependency on an external font CDN.

**Product images.** Product photography was outside the project scope, so products use deterministic placeholder tiles. The implementation is isolated within the `ProductImage` component, making it straightforward to swap in real assets later.

**Plan rendering.** The Cam Unlimited plan is modeled differently from standard products because it represents a single-choice subscription rather than a quantity-based product. It uses a dedicated `PlanLine` component instead of the standard review row and quantity controls.

---

## Engineering Decisions

**Single source of truth.** Bundle configuration is maintained centrally and the UI derives secondary values from it, reducing synchronization problems between the builder and review panel.

**Data-driven rendering.** Product-specific information stays in the catalog rather than being embedded in React components, making the UI easier to extend as the catalog changes.

**Backend as an optional dependency.** The local JSON catalog remains the fallback source so the application functions without a server. The Express API demonstrates remote data integration without coupling the frontend to it.

**Responsive components.** Components respond to available layout space rather than relying exclusively on hardcoded viewport-specific positioning, which makes them more reusable across screen sizes.

---

## Future Improvements

### Testing

- Unit tests for pricing and savings calculations
- Tests for bundle state transitions
- Tests for variant-specific quantities
- End-to-end coverage of the builder → variant → review synchronization flow

A Playwright suite would be particularly valuable for protecting the most interaction-heavy parts of the application.

### Type Safety

Migrating the frontend to TypeScript would provide stronger bundle model definitions, safer state transitions, better API response validation, and improved maintainability as the catalog grows.

### State Management

A dedicated state-management solution such as Zustand would give clearer separation between bundle configuration, active variants, persistence, and derived pricing state. The current hook-based approach is intentionally lightweight for the project's size.

### Backend

Replacing the static JSON catalog with a persistent database would support runtime catalog management. A larger implementation could introduce a layered structure:

```text
Controller → Service → Repository → Database
```

This would open the door to product catalog management, dynamic pricing rules, bundle and order creation, payment integration, event tracking, and customer configuration persistence.

### Product Assets

Replace the deterministic placeholder images with optimized product photography and an appropriate asset delivery strategy.

---

## Development Philosophy

The implementation prioritizes clear separation of concerns, reusable components, data-driven rendering, minimal duplicated state, responsive behavior, graceful degradation, and maintainability over unnecessary abstraction.

The architecture is intentionally lightweight while leaving clear paths for stronger typing, automated testing, persistent storage, and a more comprehensive backend as requirements grow.
