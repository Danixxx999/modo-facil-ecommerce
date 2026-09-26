import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import {
  Plus,
  Shield,
  Edit,
  Trash2,
  Users,
  RefreshCw,
  Mail,
  CalendarDays,
  Crown,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button.jsx";
import AdminLayout from "@/components/AdminLayout.jsx";
import AdminUserFormModal from "@/components/admin/AdminUserFormModal.jsx";
import { useAuth } from "@/contexts/AuthContext.jsx";
import pb from "@/lib/pocketbaseClient.js";

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

const getRoleBadge = (role) => {
  const normalizedRole = role || "admin";

  const roleConfig = {
    owner: "bg-primary-soft text-primary",
    superadmin: "bg-primary-soft text-primary",
    admin: "bg-secondary-soft text-secondary-deep",
    editor: "bg-muted text-muted-foreground",
  };

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-black",
        roleConfig[normalizedRole] || roleConfig.admin,
      ].join(" ")}
    >
      {["owner", "superadmin"].includes(normalizedRole) ? (
        <Crown className="h-3.5 w-3.5" />
      ) : (
        <Shield className="h-3.5 w-3.5" />
      )}
      {normalizedRole}
    </span>
  );
};

const AdminUsersPage = () => {
  const { currentAdmin } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const records = await pb.collection("admins").getFullList({
        sort: "-created",
        $autoCancel: false,
      });

      setUsers(Array.isArray(records) ? records : []);
    } catch (error) {
      console.error("Error cargando administradores:", error);
      toast.error("Error al cargar usuarios");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const stats = useMemo(() => {
    const owners = users.filter((user) =>
      ["owner", "superadmin"].includes(user.role)
    ).length;

    return {
      total: users.length,
      owners,
      admins: users.filter((user) => user.role === "admin").length,
      withEmail: users.filter((user) => user.email).length,
    };
  }, [users]);

  const openCreateModal = () => {
    setSelectedUser(null);
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleDelete = async (user) => {
    if (currentAdmin?.id === user.id) {
      toast.error("No puedes eliminar tu propio usuario mientras estás conectado");
      return;
    }

    const confirmation = window.confirm(
      `¿Seguro que deseas eliminar al administrador "${user.name || user.email}"?`
    );

    if (!confirmation) return;

    try {
      await pb.collection("admins").delete(user.id, {
        $autoCancel: false,
      });

      toast.success("Administrador eliminado");
      fetchUsers();
    } catch (error) {
      console.error("Error eliminando administrador:", error);
      toast.error("Error al eliminar usuario");
    }
  };

  const StatCard = ({ title, value, icon: Icon, tone = "primary" }) => {
    const toneClass = {
      primary: "bg-primary-soft text-primary",
      secondary: "bg-secondary-soft text-secondary-deep",
      neutral: "bg-muted text-foreground",
      danger: "bg-destructive/10 text-destructive",
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
        <title>Usuarios Admin | Modo Fácil</title>
      </Helmet>

      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-black text-primary">
            <Shield className="h-4 w-4" />
            Seguridad del panel
          </div>

          <h1 className="font-display text-4xl font-black tracking-[-0.06em] text-foreground">
            Usuarios administradores
          </h1>

          <p className="mt-2 text-sm font-semibold text-muted-foreground">
            Controla quién puede entrar al panel, editar productos, pedidos y
            configuración.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={fetchUsers}
            className="rounded-full"
            disabled={loading}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Actualizar
          </Button>

          <Button
            onClick={openCreateModal}
            className="mf-btn mf-btn-primary rounded-full"
          >
            <Plus className="h-4 w-4" />
            Nuevo usuario
          </Button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total usuarios" value={stats.total} icon={Users} />
        <StatCard
          title="Dueños / superadmin"
          value={stats.owners}
          icon={Crown}
          tone="primary"
        />
        <StatCard
          title="Administradores"
          value={stats.admins}
          icon={UserCheck}
          tone="secondary"
        />
        <StatCard
          title="Con email"
          value={stats.withEmail}
          icon={Mail}
          tone="neutral"
        />
      </div>

      <div className="mb-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-900 dark:border-yellow-900 dark:bg-yellow-950/20 dark:text-yellow-300">
        <div className="mb-1 flex items-center gap-2 font-black">
          <AlertTriangle className="h-5 w-5" />
          Recomendación de seguridad
        </div>
        <p className="text-sm font-semibold leading-6">
          Mantén pocos administradores, usa contraseñas fuertes y elimina accesos
          que ya no necesites.
        </p>
      </div>

      {/* Desktop table */}
      <div className="admin-table-container hidden overflow-hidden md:block">
        <table className="admin-table w-full text-sm">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Creado</th>
              <th className="text-center">Actual</th>
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
                  Cargando usuarios...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="py-12 text-center font-semibold text-muted-foreground"
                >
                  No hay usuarios administradores.
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const isCurrent = currentAdmin?.id === user.id;

                return (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                          <Shield className="h-5 w-5" />
                        </span>

                        <div>
                          <p className="font-black text-foreground">
                            {user.name || "Sin nombre"}
                          </p>
                          <p className="text-xs font-semibold text-muted-foreground">
                            ID: {user.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="font-semibold text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Mail className="h-4 w-4 text-primary" />
                        {user.email || "-"}
                      </span>
                    </td>

                    <td>{getRoleBadge(user.role)}</td>

                    <td className="font-semibold text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4" />
                        {formatDate(user.created)}
                      </span>
                    </td>

                    <td className="text-center">
                      {isCurrent ? (
                        <span className="rounded-full bg-secondary-soft px-2.5 py-1 text-xs font-black text-secondary-deep">
                          Tú
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-muted-foreground">
                          -
                        </span>
                      )}
                    </td>

                    <td className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(user)}
                          className="h-8 w-8 text-muted-foreground hover:text-blue-500"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(user)}
                          disabled={isCurrent}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive disabled:opacity-30"
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
      </div>

      {/* Mobile cards */}
      <div className="space-y-4 md:hidden">
        {loading ? (
          <div className="admin-card p-8 text-center font-semibold text-muted-foreground">
            Cargando usuarios...
          </div>
        ) : users.length === 0 ? (
          <div className="admin-card p-8 text-center font-semibold text-muted-foreground">
            No hay usuarios administradores.
          </div>
        ) : (
          users.map((user) => {
            const isCurrent = currentAdmin?.id === user.id;

            return (
              <article key={user.id} className="admin-card p-4">
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                    <Shield className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-black text-foreground">
                        {user.name || "Sin nombre"}
                      </p>

                      {isCurrent && (
                        <span className="rounded-full bg-secondary-soft px-2 py-0.5 text-[11px] font-black text-secondary-deep">
                          Tú
                        </span>
                      )}
                    </div>

                    <p className="mt-1 truncate text-xs font-semibold text-muted-foreground">
                      {user.email || "-"}
                    </p>

                    <div className="mt-2">{getRoleBadge(user.role)}</div>
                  </div>
                </div>

                <div className="mb-4 rounded-2xl bg-muted/35 p-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-muted-foreground">
                      Creado
                    </span>
                    <span className="font-black">{formatDate(user.created)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(user)}
                  >
                    <Edit className="mr-1 h-4 w-4" />
                    Editar
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(user)}
                    disabled={isCurrent}
                    className="text-destructive hover:text-destructive disabled:opacity-30"
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Borrar
                  </Button>
                </div>
              </article>
            );
          })
        )}
      </div>

      <AdminUserFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        user={selectedUser}
        onSuccess={fetchUsers}
      />
    </AdminLayout>
  );
};

export default AdminUsersPage;
