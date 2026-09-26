import { useCallback, useEffect, useState } from "react";
import pb from "@/lib/pocketbaseClient.js";

const escapeFilterValue = (value) => {
  return String(value || "").replaceAll('"', '\\"');
};

export const useCategories = (options = {}) => {
  const { onlyActive = true } = options;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);

      const records = await pb.collection("categories").getFullList({
        filter: onlyActive ? "active=true" : "",
        sort: "order,name",
        $autoCancel: false,
      });

      setCategories(Array.isArray(records) ? records : []);
      setError(null);
    } catch (err) {
      console.error("Error cargando categorías:", err);
      setCategories([]);
      setError(err?.message || "Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  }, [onlyActive]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = async (categoryData) => {
    try {
      const record = await pb.collection("categories").create(categoryData, {
        $autoCancel: false,
      });

      setCategories((previous) => [...previous, record]);
      return record;
    } catch (err) {
      console.error("Error creando categoría:", err);
      throw new Error(err?.message || "Error al crear categoría");
    }
  };

  const updateCategory = async (categoryId, categoryData) => {
    try {
      const record = await pb.collection("categories").update(
        categoryId,
        categoryData,
        { $autoCancel: false }
      );

      setCategories((previous) =>
        previous.map((category) =>
          category.id === categoryId ? record : category
        )
      );

      return record;
    } catch (err) {
      console.error("Error actualizando categoría:", err);
      throw new Error(err?.message || "Error al actualizar categoría");
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      await pb.collection("categories").delete(categoryId, {
        $autoCancel: false,
      });

      setCategories((previous) =>
        previous.filter((category) => category.id !== categoryId)
      );

      return true;
    } catch (err) {
      console.error("Error eliminando categoría:", err);
      throw new Error(err?.message || "Error al eliminar categoría");
    }
  };

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};

export const useCategory = (slugOrId) => {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(Boolean(slugOrId));
  const [error, setError] = useState(null);

  const fetchCategory = useCallback(async () => {
    if (!slugOrId) {
      setCategory(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const safeValue = escapeFilterValue(slugOrId);

      const records = await pb.collection("categories").getFullList({
        filter: `(slug="${safeValue}" || id="${safeValue}")`,
        $autoCancel: false,
      });

      if (records.length > 0) {
        setCategory(records[0]);
        setError(null);
      } else {
        setCategory(null);
        setError("Categoría no encontrada");
      }
    } catch (err) {
      console.error("Error cargando categoría:", err);
      setCategory(null);
      setError(err?.message || "Error al cargar categoría");
    } finally {
      setLoading(false);
    }
  }, [slugOrId]);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  return {
    category,
    loading,
    error,
    refetch: fetchCategory,
  };
};
