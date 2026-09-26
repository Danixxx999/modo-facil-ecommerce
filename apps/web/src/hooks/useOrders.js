import { useCallback, useEffect, useState } from "react";
import pb from "@/lib/pocketbaseClient.js";

const escapeFilterValue = (value) => {
  return String(value || "").replaceAll('"', '\\"');
};

export const useOrders = (statusFilter = null) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      const filters = [];

      if (statusFilter) {
        filters.push(`status="${escapeFilterValue(statusFilter)}"`);
      }

      const records = await pb.collection("orders").getFullList({
        filter: filters.join(" && "),
        sort: "-created",
        expand: "products,combos",
        $autoCancel: false,
      });

      setOrders(Array.isArray(records) ? records : []);
      setError(null);
    } catch (err) {
      console.error("Error cargando pedidos:", err);
      setOrders([]);
      setError(err?.message || "Error al cargar pedidos");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const createOrder = async (orderData) => {
    try {
      const record = await pb.collection("orders").create(orderData, {
        $autoCancel: false,
      });

      setOrders((previous) => [record, ...previous]);

      return record;
    } catch (err) {
      console.error("Error creando pedido:", err);
      throw new Error(err?.message || "Error al crear pedido");
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const record = await pb.collection("orders").update(
        orderId,
        { status },
        { $autoCancel: false }
      );

      setOrders((previous) =>
        previous.map((order) => (order.id === orderId ? record : order))
      );

      return record;
    } catch (err) {
      console.error("Error actualizando pedido:", err);
      throw new Error(err?.message || "Error al actualizar pedido");
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await pb.collection("orders").delete(orderId, {
        $autoCancel: false,
      });

      setOrders((previous) => previous.filter((order) => order.id !== orderId));

      return true;
    } catch (err) {
      console.error("Error eliminando pedido:", err);
      throw new Error(err?.message || "Error al eliminar pedido");
    }
  };

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
    createOrder,
    updateOrderStatus,
    deleteOrder,
  };
};

export const useOrder = (orderNumber) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(Boolean(orderNumber));
  const [error, setError] = useState(null);

  const fetchOrder = useCallback(async () => {
    if (!orderNumber) {
      setOrder(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const safeOrderNumber = escapeFilterValue(orderNumber);

      const records = await pb.collection("orders").getFullList({
        filter: `orderNumber="${safeOrderNumber}"`,
        expand: "products,combos",
        $autoCancel: false,
      });

      if (records.length > 0) {
        setOrder(records[0]);
        setError(null);
      } else {
        setOrder(null);
        setError("Pedido no encontrado");
      }
    } catch (err) {
      console.error("Error cargando pedido:", err);
      setOrder(null);
      setError(err?.message || "Error al cargar pedido");
    } finally {
      setLoading(false);
    }
  }, [orderNumber]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return {
    order,
    loading,
    error,
    refetch: fetchOrder,
  };
};
