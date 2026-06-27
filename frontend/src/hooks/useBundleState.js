import { useCallback, useEffect, useMemo, useState } from "react";
import { loadBundleData } from "../api/bundleApi";
import {
  loadSavedSystem,
  saveSystem,
  clearSavedSystem,
} from "../utils/persistence";
import { round2 } from "../utils/pricing";

// Flatten every variant across every product into a lookup table, tagged
// with the product + step it belongs to. This is what makes the app data
// driven: nothing below hardcodes a product id.
function buildVariantIndex(steps, reviewOnlyItems, meta) {
  const index = {};
  steps.forEach((step) => {
    step.products.forEach((product) => {
      product.variants.forEach((variant) => {
        index[variant.id] = {
          ...variant,
          productId: product.id,
          productName: product.name,
          stepId: step.id,
          compareAtPrice: product.compareAtPrice,
          category: meta.categoryLabels[step.id] || step.id,
          isReviewOnly: false,
        };
      });
    });
  });
  reviewOnlyItems.forEach((item) => {
    index[item.id] = {
      id: item.id,
      label: null,
      price: item.price,
      priceLabel: item.priceLabel,
      compareAtPrice: item.compareAtPrice,
      productId: item.id,
      productName: item.name,
      stepId: null,
      category: meta.categoryLabels[item.category] || item.category,
      isReviewOnly: true,
    };
  });
  return index;
}

function buildDefaultQuantities(steps, reviewOnlyItems) {
  const qty = {};
  steps
    .flatMap((s) => s.products)
    .flatMap((p) => p.variants)
    .forEach((variant) => {
      qty[variant.id] = 0;
    });
  reviewOnlyItems.forEach((item) => {
    qty[item.id] = 0;
  });
  return qty;
}

function buildDefaultActiveVariants(steps) {
  const active = {};
  steps.forEach((step) => {
    step.products.forEach((product) => {
      // Prefer the variant with the highest default quantity as the
      // initially active one, falling back to the first variant.
      const sorted = [...product.variants].sort(
        (a, b) => (b.defaultQty || 0) - (a.defaultQty || 0),
      );
      active[product.id] = sorted[0]?.id ?? product.variants[0]?.id;
    });
  });
  return active;
}

/**
 * Loads bundle data (API-first, local-JSON-fallback) and owns all builder
 * state derived from it: quantities, active variants, open accordion step,
 * and every derived value the UI needs (selected counts, review groups,
 * totals). This is the single source of truth for the whole app.
 */
export function useBundleState() {
  const [bundle, setBundle] = useState(null);
  const [dataSource, setDataSource] = useState(null);

  useEffect(() => {
    let cancelled = false;
    loadBundleData().then(({ data, source }) => {
      if (!cancelled) {
        setBundle(data);
        setDataSource(source);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const saved = useMemo(() => loadSavedSystem(), []);

  const EMPTY_STEPS = useMemo(() => [], []);
  const EMPTY_ITEMS = useMemo(() => [], []);

  const steps = bundle?.steps ?? EMPTY_STEPS;
  const reviewOnlyItems = bundle?.reviewOnlyItems ?? EMPTY_ITEMS;
  const meta = bundle?.meta ?? null;

  const variantIndex = useMemo(
    () => (bundle ? buildVariantIndex(steps, reviewOnlyItems, meta) : {}),
    [bundle, steps, reviewOnlyItems, meta],
  );

  const [quantities, setQuantities] = useState(null);
  const [activeVariant, setActiveVariant] = useState(null);
  const [openStep, setOpenStep] = useState(null);
  const [justSaved, setJustSaved] = useState(false);

  // Initialize state once the bundle data has loaded (can't do this at
  // useState-init time since the data arrives asynchronously).
  useEffect(() => {
    if (!bundle || quantities !== null) return;
    setQuantities(
      saved?.quantities ?? buildDefaultQuantities(steps, reviewOnlyItems),
    );
    setActiveVariant(saved?.activeVariant ?? buildDefaultActiveVariants(steps));
    setOpenStep(saved?.openStep ?? steps[0]?.id ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bundle]);

  const setQuantity = useCallback(
    (variantId, nextQty) => {
      const safeQty = Math.max(0, nextQty);

      setQuantities((prev) => {
        const next = { ...prev, [variantId]: safeQty };

        // Enforce single-plan selection: setting any plan variant > 0
        // zeroes out every other variant in the "plan" step.
        if (safeQty > 0) {
          const planStep = steps.find((s) => s.id === "plan");
          const isPlanVariant = planStep?.products.some((p) =>
            p.variants.some((v) => v.id === variantId),
          );
          if (isPlanVariant) {
            planStep.products
              .flatMap((p) => p.variants)
              .forEach((v) => {
                if (v.id !== variantId) next[v.id] = 0;
              });
          }
        }

        return next;
      });
    },
    [steps],
  );

  const incrementVariant = useCallback((variantId, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [variantId]: Math.max(0, (prev[variantId] ?? 0) + delta),
    }));
  }, []);

  const selectVariant = useCallback((productId, variantId) => {
    setActiveVariant((prev) => ({ ...prev, [productId]: variantId }));
  }, []);

  const toggleStep = useCallback((stepId) => {
    setOpenStep((prev) => (prev === stepId ? null : stepId));
  }, []);

  const goToNextStep = useCallback(
    (currentStepId) => {
      const idx = steps.findIndex((s) => s.id === currentStepId);
      const next = steps[idx + 1];
      setOpenStep(next ? next.id : null);
    },
    [steps],
  );

  // --- Derived data -------------------------------------------------------

  // Count of distinct products (not variants) with at least one variant > 0
  const selectedCountByStep = useMemo(() => {
    const counts = {};
    if (!quantities) return counts;
    steps.forEach((step) => {
      counts[step.id] = step.products.filter((product) =>
        product.variants.some((v) => (quantities[v.id] ?? 0) > 0),
      ).length;
    });
    return counts;
  }, [steps, quantities]);

  // Review panel lines, grouped by category, in step + product order
  const reviewGroups = useMemo(() => {
    const groups = {};
    const order = [];
    if (!quantities || !meta) return [];

    function pushLine(category, line) {
      if (!groups[category]) {
        groups[category] = [];
        order.push(category);
      }
      groups[category].push(line);
    }

    steps.forEach((step) => {
      step.products.forEach((product) => {
        product.variants.forEach((variant) => {
          const qty = quantities[variant.id] ?? 0;
          if (qty <= 0) return;
          const name = variant.label
            ? `${product.name} (${variant.label})`
            : product.name;
          pushLine(meta.categoryLabels[step.id] || step.id, {
            variantId: variant.id,
            name,
            image: product.image,
            qty,
            price: variant.price,
            compareAtPrice: product.compareAtPrice,
            editable: true,
            billingSuffix: product.billingSuffix ?? null,
          });
        });
      });
    });

    reviewOnlyItems.forEach((item) => {
      const qty = quantities[item.id] ?? 0;
      if (qty <= 0) return;
      pushLine(meta.categoryLabels[item.category] || item.category, {
        variantId: item.id,
        name: item.name,
        image: item.image,
        qty,
        price: item.price,
        priceLabel: item.priceLabel,
        compareAtPrice: item.compareAtPrice,
        editable: true,
        billingSuffix: null,
      });
    });

    return order.map((category) => ({ category, lines: groups[category] }));
  }, [steps, reviewOnlyItems, meta, quantities]);

  const totals = useMemo(() => {
    let subtotal = 0;
    let compareSubtotal = 0;
    if (!quantities) return { subtotal: 0, compareSubtotal: 0, savings: 0 };

    Object.entries(quantities).forEach(([variantId, qty]) => {
      if (qty <= 0) return;
      const v = variantIndex[variantId];
      if (!v) return;
      subtotal += v.price * qty;
      const compareUnit = v.compareAtPrice ?? v.price;
      compareSubtotal += compareUnit * qty;
    });

    subtotal = round2(subtotal);
    compareSubtotal = round2(compareSubtotal);
    const savings = round2(Math.max(0, compareSubtotal - subtotal));

    return { subtotal, compareSubtotal, savings };
  }, [quantities, variantIndex]);

  const handleSave = useCallback(() => {
    saveSystem({ quantities, activeVariant, openStep });
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);
  }, [quantities, activeVariant, openStep]);

  const handleReset = useCallback(() => {
    clearSavedSystem();
    setQuantities(buildDefaultQuantities(steps, reviewOnlyItems));
    setActiveVariant(buildDefaultActiveVariants(steps));
    setOpenStep(steps[0]?.id ?? null);
  }, [steps, reviewOnlyItems]);

  return {
    isLoading: !bundle || quantities === null,
    dataSource,
    steps,
    meta,
    quantities: quantities ?? {},
    activeVariant: activeVariant ?? {},
    openStep,
    justSaved,
    selectedCountByStep,
    reviewGroups,
    totals,
    setQuantity,
    incrementVariant,
    selectVariant,
    toggleStep,
    goToNextStep,
    handleSave,
    handleReset,
    hasSavedSystem: Boolean(saved),
  };
}
