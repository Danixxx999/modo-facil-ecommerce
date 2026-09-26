import { useCallback, useEffect, useState } from "react";
import pb from "@/lib/pocketbaseClient.js";
export const useCombos = (options = {}) => {
  const opts = typeof options === "boolean" ? { showOnHomeOnly: options } : options;
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      const filters = [];
      if (opts.onlyActive !== false) filters.push("active=true");
      if (opts.showOnHomeOnly) filters.push("showOnHome=true");
      const rows = await pb.collection("combos").getFullList({ filter: filters.join(" && "), sort: "-created", expand: "products", $autoCancel: false });
      setCombos(rows);
      setError(null);
    } catch (err) { setError(err?.message || "No fue posible cargar los combos"); setCombos([]); }
    finally { setLoading(false); }
  }, [opts.onlyActive, opts.showOnHomeOnly]);
  useEffect(() => { refetch(); }, [refetch]);
  return {
    combos, loading, error, refetch,
    createCombo: (data) => pb.collection("combos").create(data, { $autoCancel: false }),
    updateCombo: (id, data) => pb.collection("combos").update(id, data, { $autoCancel: false }),
    deleteCombo: (id) => pb.collection("combos").delete(id, { $autoCancel: false }),
  };
};
export const useCombo = (value) => {
  const [combo, setCombo] = useState(null);
  const [loading, setLoading] = useState(Boolean(value));
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!value) { setLoading(false); return; }
    const safe = String(value).replaceAll('"', '\\"');
    pb.collection("combos").getFullList({ filter: `(id="${safe}" || slug="${safe}")`, expand: "products", $autoCancel: false })
      .then((rows) => setCombo(rows[0] || null))
      .catch((err) => setError(err?.message || "Combo no encontrado"))
      .finally(() => setLoading(false));
  }, [value]);
  return { combo, loading, error };
};
