import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Button } from "@/components/ui/button.jsx";
import { toast } from "sonner";
import pb from "@/lib/pocketbaseClient.js";
import {
  UploadCloud,
  FolderOpen,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";

const createSlug = (value) => {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

const getCategoryImage = (category) => {
  if (!category?.image) return null;

  try {
    return pb.files.getURL(category, category.image, {
      thumb: "300x300",
    });
  } catch {
    return null;
  }
};

const CategoryFormModal = ({ isOpen, onClose, category, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    order: 0,
    active: true,
  });

  const previewImage = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return getCategoryImage(category);
  }, [imageFile, category]);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        order: category.order ?? 0,
        active: category.active ?? true,
      });
    } else {
      setFormData({
        name: "",
        slug: "",
        description: "",
        order: 0,
        active: true,
      });
    }

    setImageFile(null);
  }, [category, isOpen]);

  const handleChange = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleNameChange = (value) => {
    setFormData((previous) => ({
      ...previous,
      name: value,
      slug: category ? previous.slug : createSlug(value),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.error("El nombre de la categoría es obligatorio");
      return;
    }

    if (!formData.slug.trim()) {
      toast.error("El slug de la categoría es obligatorio");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      data.append("name", formData.name.trim());
      data.append("slug", createSlug(formData.slug));
      data.append("description", formData.description || "");
      data.append("order", Number(formData.order || 0));
      data.append("active", formData.active);

      if (imageFile) {
        data.append("image", imageFile);
      }

      if (category) {
        await pb.collection("categories").update(category.id, data, {
          $autoCancel: false,
        });

        toast.success("Categoría actualizada");
      } else {
        await pb.collection("categories").create(data, {
          $autoCancel: false,
        });

        toast.success("Categoría creada");
      }

      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error("Error guardando categoría:", error);
      toast.error(error?.message || "Error al guardar categoría");
    } finally {
      setLoading(false);
    }
  };

  const title = category ? "Editar categoría" : "Nueva categoría";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto rounded-[1.8rem]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 pt-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <FolderOpen className="h-5 w-5" />
            </span>

            <span>
              <span className="block font-display text-3xl font-black tracking-[-0.055em]">
                {title}
              </span>
              <span className="block text-sm font-semibold text-muted-foreground">
                Organiza la tienda por secciones claras y fáciles de navegar.
              </span>
            </span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          <div className="rounded-[1.5rem] border border-border bg-muted/25 p-4">
            <div className="mb-4 flex items-center gap-2 text-sm font-black text-primary">
              <Sparkles className="h-4 w-4" />
              Información principal
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Nombre *</Label>
                <Input
                  required
                  value={formData.name}
                  onChange={(event) => handleNameChange(event.target.value)}
                  placeholder="Ej: Hogar organizado"
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>Slug *</Label>
                <Input
                  required
                  value={formData.slug}
                  onChange={(event) =>
                    handleChange("slug", createSlug(event.target.value))
                  }
                  placeholder="hogar-organizado"
                  className="h-11 rounded-xl"
                />
                <p className="text-xs font-semibold text-muted-foreground">
                  URL final: /category/{formData.slug || "nombre-categoria"}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Descripción</Label>
                <Textarea
                  value={formData.description}
                  onChange={(event) =>
                    handleChange("description", event.target.value)
                  }
                  placeholder="Describe qué tipo de productos encontrará el cliente en esta categoría..."
                  rows={3}
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-border bg-card p-4">
              <Label>Orden</Label>
              <Input
                type="number"
                value={formData.order}
                onChange={(event) => handleChange("order", event.target.value)}
                className="mt-2 h-11 rounded-xl"
              />
              <p className="mt-2 text-xs font-semibold text-muted-foreground">
                Menor número aparece primero.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-border bg-card p-4">
              <Label>Estado</Label>

              <button
                type="button"
                onClick={() => handleChange("active", !formData.active)}
                className={[
                  "mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl border text-sm font-black transition-colors",
                  formData.active
                    ? "border-secondary/20 bg-secondary-soft text-secondary-deep"
                    : "border-border bg-muted text-muted-foreground",
                ].join(" ")}
              >
                {formData.active ? (
                  <>
                    <Eye className="h-4 w-4" />
                    Activa
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4" />
                    Inactiva
                  </>
                )}
              </button>

              <p className="mt-2 text-xs font-semibold text-muted-foreground">
                Si está inactiva, no debería mostrarse en tienda.
              </p>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-border bg-card p-4">
            <Label>Imagen de categoría</Label>

            <div className="mt-3 grid gap-4 sm:grid-cols-[150px_1fr]">
              <div className="flex h-[150px] items-center justify-center overflow-hidden rounded-2xl bg-muted">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Vista previa"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <ImageIcon className="mx-auto mb-2 h-8 w-8" />
                    <p className="text-xs font-bold">Sin imagen</p>
                  </div>
                )}
              </div>

              <div className="relative flex min-h-[150px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 p-4 text-center transition-colors hover:bg-muted/35">
                <UploadCloud className="mb-2 h-7 w-7 text-primary" />

                <p className="text-sm font-black text-foreground">
                  Clic para subir imagen
                </p>

                <p className="mt-1 text-xs font-semibold text-muted-foreground">
                  Ideal: imagen cuadrada o vertical, clara y bonita.
                </p>

                {imageFile && (
                  <p className="mt-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-black text-primary">
                    {imageFile.name}
                  </p>
                )}

                <Input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setImageFile(event.target.files?.[0] || null)
                  }
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="rounded-full"
              disabled={loading}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="mf-btn mf-btn-primary rounded-full"
            >
              {loading ? "Guardando..." : "Guardar categoría"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryFormModal;
