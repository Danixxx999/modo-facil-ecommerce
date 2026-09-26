import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { calculateTieredPrice } from "@/hooks/useProductPricing.js";

export const PAYMENT_METHODS = {
  PREPAID: "Pago anticipado",
  COD: "Pago contra entrega",
};

export const SHIPPING_COST = 0;

const CartContext = createContext(null);

const safeParseCart = () => {
  try {
    const saved = localStorage.getItem("cart");
    const parsed = saved ? JSON.parse(saved) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error leyendo el carrito:", error);
    return [];
  }
};

const normalizeQuantity = (quantity) => {
  const numericQuantity = Number(quantity || 1);

  if (Number.isNaN(numericQuantity) || numericQuantity < 1) {
    return 1;
  }

  return Math.floor(numericQuantity);
};

const getItemUnitPrice = (item) => {
  if (!item) return 0;

  if (item.type === "combo") {
    return Number(item.finalPrice || item.price || 0);
  }

  return Number(calculateTieredPrice(item, item.quantity || 1) || 0);
};

const getItemLineTotal = (item) => {
  const quantity = normalizeQuantity(item?.quantity);
  const unitPrice = getItemUnitPrice(item);

  return unitPrice * quantity;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(safeParseCart);

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error guardando el carrito:", error);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    if (!product?.id) return;

    const safeQuantity = normalizeQuantity(quantity);

    setCartItems((previousItems) => {
      const existing = previousItems.find(
        (item) => item.id === product.id && item.type === "product"
      );

      if (existing) {
        return previousItems.map((item) =>
          item.id === product.id && item.type === "product"
            ? {
                ...item,
                quantity: normalizeQuantity(item.quantity + safeQuantity),
              }
            : item
        );
      }

      return [
        ...previousItems,
        {
          ...product,
          quantity: safeQuantity,
          type: "product",
        },
      ];
    });
  };

  const addComboToCart = (combo, quantity = 1) => {
    if (!combo?.id) return;

    const safeQuantity = normalizeQuantity(quantity);

    setCartItems((previousItems) => {
      const existing = previousItems.find(
        (item) => item.id === combo.id && item.type === "combo"
      );

      if (existing) {
        return previousItems.map((item) =>
          item.id === combo.id && item.type === "combo"
            ? {
                ...item,
                quantity: normalizeQuantity(item.quantity + safeQuantity),
              }
            : item
        );
      }

      return [
        ...previousItems,
        {
          ...combo,
          quantity: safeQuantity,
          type: "combo",
        },
      ];
    });
  };

  const removeFromCart = (id, type) => {
    setCartItems((previousItems) =>
      previousItems.filter((item) => !(item.id === id && item.type === type))
    );
  };

  const updateQuantity = (id, type, quantity) => {
    const safeQuantity = Number(quantity);

    if (!safeQuantity || safeQuantity <= 0) {
      removeFromCart(id, type);
      return;
    }

    setCartItems((previousItems) =>
      previousItems.map((item) =>
        item.id === id && item.type === type
          ? {
              ...item,
              quantity: normalizeQuantity(safeQuantity),
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      return sum + getItemLineTotal(item);
    }, 0);
  };

  const calculateShipping = () => 0;

  const calculateTotal = () => calculateSubtotal();

  const getCartItemPrice = (item) => {
    return getItemUnitPrice(item);
  };

  const getCartItemTotal = (item) => {
    return getItemLineTotal(item);
  };

  const cartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      return sum + normalizeQuantity(item.quantity);
    }, 0);
  }, [cartItems]);

  const cartHasItems = cartItems.length > 0;

  const value = {
    cartItems,
    addToCart,
    addComboToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    calculateSubtotal,
    calculateShipping,
    calculateTotal,
    getCartItemPrice,
    getCartItemTotal,
    cartCount,
    cartHasItems,
    PAYMENT_METHODS,
    SHIPPING_COST,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
};
