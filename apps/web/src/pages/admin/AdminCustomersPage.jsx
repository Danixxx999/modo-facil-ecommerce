import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import {
  Search,
  Trash2,
  Users,
  Phone,
  MessageCircle,
  MapPin,
  CalendarDays,
  RefreshCw,
  UserCheck,
  Building2,
  Clipboard,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import AdminLayout from "@/components/AdminLayout.jsx";
import pb from "@/lib/pocketbaseClient.js";

const escapeFilterValue = (value) => {
  return String(value || "").replaceAll('"', '\\"');
};

const formatDate = (value) => {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "-";
  }
};

const normalizePhone = (value) => {
  if (!value) return "";
  return String(value).replace(/[^\d]/g, "");
};

const getClientWhatsApp = (client) => {
  return client.whatsApp || client.whatsapp || client.phone || "";
};

const AdminCustomersPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [search, setSearch] = useState("");

  const fetchClients = async () => {
    setLoading(true);

    try {
      const filters = [];

      if (search) {
        const safeSearch = escapeFilterValue(search);

        filters.push(
          `(name~"${safeSearch}" || phone~"${safeSearch}" || city~"${safeSearch}" || department~"${safeSearch}")`
        );
      }

      const response = await pb.collection("clients").getList(page, 15, {
        filter: filters.join(" && "),
        sort: "-created",
        $autoCancel: false,
      });

      setClients(Array.isArray(response.items) ? response.items : []);
      setTotalPages(response.totalPages || 1);
      setTotalItems(response.totalItems || 0);
    } catch (error) {
      console.error("Error cargando clientes:", error);
      toast.error("Error al cargar clientes");
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchClients, 300);
    return () => clearTimeout(timer);
  }, [page, search]);

  const stats = useMemo(() => {
    const withPhone = clients.filter((client) => client.phone).length;
    const withWhatsApp = clients.filter((client) => getClientWhatsApp(client)).length;
    const withCity = clients.filter((client) => client.city).length;

    return {
      totalPage: clients.length,
      totalItems,
      withPhone,
      withWhatsApp,
      withCity,
    };
  }, [clients, totalItems]);

  const handleDelete = async (client) => {
    const confirmation = window.confirm(
      `¿Seguro que deseas eliminar el cliente "${client.name || "sin nombre"}"?`
    );

    if (!confirmation) return;

    try {
      await pb.collection("clients").delete(client.id, {
        $autoCancel: false,
      });

      toast.success("Cliente eliminado");
      fetchClients();
    } catch (error) {
      console.error("Error eliminando cliente:", error);
      toast.error("Error al eliminar cliente");
    }
  };

  const handleOpenWhatsApp = (client) => {
    const phone = normalizePhone(getClientWhatsApp(client));

    if (!phone) {
      toast.error("Este cliente no tiene WhatsApp o teléfono");
      return;
    }

    const message = `Hola ${client.name || ""} 👋\n\nTe saluda Modo Fácil. Queríamos ayudarte con tu compra o resolver cualquier duda.`;

    window.open(
      `https://wa.me/57${phone.replace(/^57/, "")}?text=${encodeURIComponent(
        message
      )}`,
      "_blank"
    );
  };

  const handleCopyClient = async (client) => {
    const text = [
      `Cliente: ${client.name || "-"}`,
      `Teléfono: ${client.phone || "-"}`,
      `WhatsApp: ${getClientWhatsApp(client) || "-"}`,
      `Ciudad: ${client.city || "-"}`,
      `Departamento: ${client.department || "-"}`,
      `Fecha registro: ${formatDate(client.created)}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      toast.success("Datos del cliente copiados");
    } catch {
      toast.error("No se pudo copiar");
    }
  };

  const StatCard = ({ title, value, icon: Icon, tone = "primary" }) => {
    const toneClass = {
      primary: "bg-primary-soft text-primary",
      secondary: "bg-secondary-soft text-secondary-deep",
      neutral: "bg-muted text-foreground",
    }[tone];

    return (
      <div className="admin-card p-4">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-11 w-11 items-center justify-center rounded-2xl ${toneClass}`}
          >
            <Icon className="h-5 w-5" />
          </span>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
              {title}
            </p>
            <p className="text-2xl font-black">{value}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Clientes | Admin Modo Fácil</title>
      </Helmet>

      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-black text-primary">
            <Users className="h-4 w-4" />
            Directorio comercial
          </div>

          <h1 className="font-display text-4xl font-black tracking-[-0.06em] text-foreground">
            Clientes
          </h1>

          <p className="mt-2 text-sm font-semibold text-muted-foreground">
            Administra compradores, teléfonos, WhatsApp y ubicación para
            seguimiento.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={fetchClients}
          className="w-fit rounded-full"
          disabled={loading}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Actualizar
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total clientes"
          value={stats.totalItems}
          icon={Users}
          tone="primary"
        />

        <StatCard
          title="En esta página"
          value={stats.totalPage}
          icon={UserCheck}
          tone="neutral"
        />

        <StatCard
          title="Con WhatsApp"
          value={stats.withWhatsApp}
          icon={MessageCircle}
          tone="secondary"
        />

        <StatCard
          title="Con ciudad"
          value={stats.withCity}
          icon={MapPin}
          tone="primary"
        />
      </div>

      <div className="admin-card mb-6 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, teléfono, ciudad o departamento..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            className="h-11 rounded-xl pl-9"
          />
        </div>
      </div>

      {/* Desktop */}
      <div className="admin-table-container hidden overflow-hidden md:block">
        <table className="admin-table w-full text-sm">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Teléfono</th>
              <th>WhatsApp</th>
              <th>Ubicación</th>
              <th>Registro</th>
              <th className="text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="6"
                  className="py-12 text-center font-semibold text-muted-foreground"
                >
                  Cargando clientes...
                </td>
              </tr>
            ) : clients.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="py-12 text-center font-semibold text-muted-foreground"
                >
                  No se encontraron clientes.
                </td>
              </tr>
            ) : (
              clients.map((client) => {
                const whatsapp = getClientWhatsApp(client);

                return (
                  <tr key={client.id}>
                    <td>
                      <p className="font-black text-foreground">
                        {client.name || "Cliente sin nombre"}
                      </p>

                      {client.email && (
                        <p className="mt-1 text-xs font-semibold text-muted-foreground">
                          {client.email}
                        </p>
                      )}
                    </td>

                    <td className="font-semibold text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="h-4 w-4 text-primary" />
                        {client.phone || "-"}
                      </span>
                    </td>

                    <td className="font-semibold text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <MessageCircle className="h-4 w-4 text-secondary" />
                        {whatsapp || "-"}
                      </span>
                    </td>

                    <td className="font-semibold text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-primary" />
                        {client.city
                          ? `${client.city}${client.department ? `, ${client.department}` : ""}`
                          : "-"}
                      </span>
                    </td>

                    <td className="font-semibold text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4" />
                        {formatDate(client.created)}
                      </span>
                    </td>

                    <td className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenWhatsApp(client)}
                          className="h-8 w-8 text-muted-foreground hover:text-secondary"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopyClient(client)}
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                        >
                          <Clipboard className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(client)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border bg-muted/20 p-4">
            <span className="text-sm font-semibold text-muted-foreground">
              Página {page} de {totalPages} · {totalItems} clientes
            </span>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                disabled={page === 1}
              >
                Anterior
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage((previous) => Math.min(totalPages, previous + 1))
                }
                disabled={page === totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile */}
      <div className="space-y-4 md:hidden">
        {loading ? (
          <div className="admin-card p-8 text-center font-semibold text-muted-foreground">
            Cargando clientes...
          </div>
        ) : clients.length === 0 ? (
          <div className="admin-card p-8 text-center font-semibold text-muted-foreground">
            No se encontraron clientes.
          </div>
        ) : (
          clients.map((client) => {
            const whatsapp = getClientWhatsApp(client);

            return (
              <article key={client.id} className="admin-card p-4">
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                    <Users className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-black text-foreground">
                      {client.name || "Cliente sin nombre"}
                    </p>

                    <p className="mt-1 text-xs font-semibold text-muted-foreground">
                      Registrado: {formatDate(client.created)}
                    </p>
                  </div>
                </div>

                <div className="mb-4 grid gap-2 rounded-2xl bg-muted/35 p-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-muted-foreground">
                      Teléfono
                    </span>
                    <span className="font-black">{client.phone || "-"}</span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-muted-foreground">
                      WhatsApp
                    </span>
                    <span className="font-black">{whatsapp || "-"}</span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-muted-foreground">
                      Ciudad
                    </span>
                    <span className="font-black">
                      {client.city || "-"}
                    </span>
                  </div>

                  {client.department && (
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-muted-foreground">
                        Departamento
                      </span>
                      <span className="font-black">{client.department}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenWhatsApp(client)}
                  >
                    <MessageCircle className="mr-1 h-4 w-4" />
                    WA
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyClient(client)}
                  >
                    <Clipboard className="mr-1 h-4 w-4" />
                    Copiar
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(client)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Borrar
                  </Button>
                </div>
              </article>
            );
          })
        )}

        {totalPages > 1 && (
          <div className="admin-card flex items-center justify-between p-4">
            <span className="text-sm font-semibold text-muted-foreground">
              Página {page} de {totalPages}
            </span>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                disabled={page === 1}
              >
                Ant.
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage((previous) => Math.min(totalPages, previous + 1))
                }
                disabled={page === totalPages}
              >
                Sig.
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCustomersPage;
