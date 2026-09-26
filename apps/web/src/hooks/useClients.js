import { useCallback, useEffect, useState } from "react";
import pb from "@/lib/pocketbaseClient.js";

const escapeFilterValue = (value) => {
  return String(value || "").replaceAll('"', '\\"');
};

export const useClients = (options = {}) => {
  const { search = "" } = options;

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);

      const filters = [];

      if (search) {
        const safeSearch = escapeFilterValue(search);

        filters.push(
          `(name~"${safeSearch}" || email~"${safeSearch}" || phone~"${safeSearch}" || city~"${safeSearch}")`
        );
      }

      const records = await pb.collection("clients").getFullList({
        filter: filters.join(" && "),
        sort: "-created",
        $autoCancel: false,
      });

      setClients(Array.isArray(records) ? records : []);
      setError(null);
    } catch (err) {
      console.error("Error cargando clientes:", err);
      setClients([]);
      setError(err?.message || "Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const createClient = async (clientData) => {
    try {
      const record = await pb.collection("clients").create(clientData, {
        $autoCancel: false,
      });

      setClients((previous) => [record, ...previous]);
      return record;
    } catch (err) {
      console.error("Error creando cliente:", err);
      throw new Error(err?.message || "Error al crear cliente");
    }
  };

  const updateClient = async (clientId, clientData) => {
    try {
      const record = await pb.collection("clients").update(
        clientId,
        clientData,
        {
          $autoCancel: false,
        }
      );

      setClients((previous) =>
        previous.map((client) => (client.id === clientId ? record : client))
      );

      return record;
    } catch (err) {
      console.error("Error actualizando cliente:", err);
      throw new Error(err?.message || "Error al actualizar cliente");
    }
  };

  const deleteClient = async (clientId) => {
    try {
      await pb.collection("clients").delete(clientId, {
        $autoCancel: false,
      });

      setClients((previous) =>
        previous.filter((client) => client.id !== clientId)
      );

      return true;
    } catch (err) {
      console.error("Error eliminando cliente:", err);
      throw new Error(err?.message || "Error al eliminar cliente");
    }
  };

  return {
    clients,
    loading,
    error,
    refetch: fetchClients,
    createClient,
    updateClient,
    deleteClient,
  };
};

export const useClient = (clientId) => {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(Boolean(clientId));
  const [error, setError] = useState(null);

  const fetchClient = useCallback(async () => {
    if (!clientId) {
      setClient(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const record = await pb.collection("clients").getOne(clientId, {
        $autoCancel: false,
      });

      setClient(record);
      setError(null);
    } catch (err) {
      console.error("Error cargando cliente:", err);
      setClient(null);
      setError(err?.message || "Error al cargar cliente");
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  return {
    client,
    loading,
    error,
    refetch: fetchClient,
  };
};

export const findClientByPhone = async (phone) => {
  try {
    const safePhone = escapeFilterValue(phone);

    const records = await pb.collection("clients").getFullList({
      filter: `(phone="${safePhone}" || whatsapp="${safePhone}")`,
      sort: "-created",
      $autoCancel: false,
    });

    return records?.[0] || null;
  } catch (err) {
    console.error("Error buscando cliente por teléfono:", err);
    return null;
  }
};
