const toNumber = (value, fallback = 0) => {
  const number = Number(value);

  if (Number.isNaN(number) || number < 0) {
    return fallback;
  }

  return number;
};

const normalizeQty = (qty) => {
  const quantity = Number(qty || 1);

  if (Number.isNaN(quantity) || quantity < 1) {
    return 1;
  }

  return Math.floor(quantity);
};

const buildRawTiers = (product) => {
  if (!product) return [];

  const basePrice = toNumber(product.price);

  const tiers = [
    {
      qty: 1,
      totalPrice: basePrice,
      unitPrice: basePrice,
      label: "1 unidad",
      isBase: true,
    },
  ];

  const possibleTiers = [
    {
      qty: product.tier1Qty,
      price: product.tier1Price,
    },
    {
      qty: product.tier2Qty,
      price: product.tier2Price,
    },
    {
      qty: product.tier3Qty,
      price: product.tier3Price,
    },
    {
      qty: product.tier4Qty,
      price: product.tier4Price,
      plus: true,
    },
  ];

  possibleTiers.forEach((tier) => {
    const tierQty = normalizeQty(tier.qty);
    const tierTotalPrice = toNumber(tier.price);

    if (!tierQty || tierQty <= 1 || !tierTotalPrice) return;

    tiers.push({
      qty: tierQty,
      totalPrice: tierTotalPrice,
      unitPrice: tierTotalPrice / tierQty,
      label: tier.plus ? `${tierQty}+ unidades` : `${tierQty} unidades`,
      isBase: false,
    });
  });

  return tiers
    .filter((tier, index, array) => {
      return array.findIndex((item) => item.qty === tier.qty) === index;
    })
    .sort((a, b) => a.qty - b.qty);
};

export const getActiveTier = (product, qty = 1) => {
  const quantity = normalizeQty(qty);
  const tiers = buildRawTiers(product);

  if (tiers.length === 0) {
    return {
      qty: 1,
      totalPrice: 0,
      unitPrice: 0,
      label: "1 unidad",
      isBase: true,
    };
  }

  let activeTier = tiers[0];

  tiers.forEach((tier) => {
    if (quantity >= tier.qty) {
      activeTier = tier;
    }
  });

  return activeTier;
};

/**
 * IMPORTANTE:
 * Esta función devuelve el PRECIO POR UNIDAD.
 *
 * Ejemplo:
 * 2 unidades cuestan $99.900 en total.
 * Esta función devuelve $49.950.
 *
 * Así, cuando el carrito haga:
 * precioUnidad * cantidad
 *
 * El total será:
 * $49.950 * 2 = $99.900
 */
export const calculateTieredPrice = (product, qty = 1) => {
  const activeTier = getActiveTier(product, qty);

  return Math.round(activeTier.unitPrice);
};

/**
 * Esta función devuelve el TOTAL REAL según la cantidad.
 *
 * Ejemplo:
 * 1 unidad = $69.900
 * 2 unidades = $99.900
 * 3 unidades = $139.900
 *
 * Si qty = 2, devuelve $99.900.
 * Si qty = 3, devuelve $139.900.
 */
export const calculateTieredTotal = (product, qty = 1) => {
  const quantity = normalizeQty(qty);
  const activeTier = getActiveTier(product, quantity);

  if (quantity === activeTier.qty) {
    return Math.round(activeTier.totalPrice);
  }

  return Math.round(activeTier.unitPrice * quantity);
};

export const getTiersArray = (product) => {
  if (!product) return [];

  const basePrice = toNumber(product.price);
  const tiers = buildRawTiers(product);

  return tiers.map((tier) => {
    const regularTotal = basePrice * tier.qty;
    const savings = Math.max(regularTotal - tier.totalPrice, 0);
    const savingsPercent =
      regularTotal > 0 ? Math.round((savings / regularTotal) * 100) : 0;

    return {
      qty: tier.qty,

      /**
       * price se mantiene como PRECIO POR UNIDAD
       * para no romper ProductCard, CartPage, CheckoutPage, etc.
       */
      price: Math.round(tier.unitPrice),

      /**
       * unitPrice = precio por unidad real.
       */
      unitPrice: Math.round(tier.unitPrice),

      /**
       * totalPrice = precio total del paquete.
       * Este es el que visualmente queremos mostrar cuando diga:
       * 2 unidades = $99.900
       */
      totalPrice: Math.round(tier.totalPrice),

      label: tier.label,
      savings,
      savingsPercent,
      isBase: tier.isBase,
    };
  });
};

export const formatTierLabel = (tier) => {
  if (!tier) return "";

  if (tier.qty === 1) {
    return "1 unidad";
  }

  return `${tier.qty} unidades`;
};

export const hasTieredPricing = (product) => {
  return getTiersArray(product).length > 1;
};
