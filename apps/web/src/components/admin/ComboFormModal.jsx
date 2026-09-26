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
import { Switch } from "@/components/ui/switch.jsx";
import { toast } from "sonner";
import pb from "@/lib/pocketbaseClient.js";
import {
  UploadCloud,
  Check,
  Layers,
  Image as ImageIcon,
  BadgePercent,
  Eye,
  EyeOff,
  Home,
  Sparkles,
  Package,
  Search,
} from "lucide-react";

const createSlug = (value) => {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

const formatCurrency = (value) => {
  const numericValue = Number(value || 0);

  return numericValue.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
};

const getComboImage = (combo) => {
  if (!combo?.image) return null;

  try {
    return pb.files.getURL(combo, combo.image, {
      thumb: "300x300",
    });
  } catch {
    return null;
  }
};

const getProductImage = (product) => {
  const image = product?.images?.[0] || product?.image;

  if (!image) return null;

  try {
    return pb.files.getURL(product, image, {
      thumb: "100x100",
    });
  } catch {
    return null;
  }
};

const ComboFormModal = ({
  isOpen,
  onClose,
  combo,
  productsList = [],
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [productSearch, setProductSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    finalPrice: "",
    oldPrice: "",
    description: "",
    showOnHome: true,
    active: true,
  });

  const [selectedProducts, setSelectedProducts] = useState([]);

  const previewImage = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return getComboImage(combo);
  }, [imageFile, combo]);

  useEffect(() => {
    if (combo) {
      setFormData({
        name: combo.name || "",
        slug: combo.slug || "",
        finalPrice: combo.finalPrice || combo.price || "",
        oldPrice: combo.oldPrice || combo.regularPrice || "",
        description: combo.description || "",
        showOnHome: combo.showOnHome ?? true,
        active: combo.active ?? true,
      });

      setSelectedProducts(Array.isArray(combo.products) ? combo.products : []);
    } else {
      setFormData({
        name: "",
        slug: "",
        finalPrice: "",
        oldPrice: "",
        description: "",
        showOnHome: true,
        active: true,
      });

      setSelectedProducts([]);
    }

    setImageFile(null);
    setProductSearch("");
  }, [combo, isOpen]);

  const filteredProducts = useMemo(() => {
    const search = productSearch.toLowerCase().trim();

    if (!search) return productsList;

    return productsList.filter((product) =>
      `${product.name || ""} ${product.slug || ""}`
        .toLowerCase()
        .includes(search)
    );
  }, [productsList, productSearch]);

  const selectedProductsData = useMemo(() => {
    return productsList.filter((product) => selectedProducts.includes(product.id));
  }, [productsList, selectedProducts]);

  const savings = useMemo(() => {
    const oldPrice = Number(formData.oldPrice || 0);
    const finalPrice = Number(formData.finalPrice || 0);

    if (!oldPrice || !finalPrice || oldPrice <= finalPrice) return 0;

    return oldPrice - finalPrice;
  }, [formData.oldPrice, formData.finalPrice]);

  const savingsPercent = useMemo(() => {
    const oldPrice = Number(formData.oldPrice || 0);

    if (!oldPrice || !savings) return 0;

    return Math.round((savings / oldPrice) * 100);
  }, [formData.oldPrice, savings]);

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
      slug: combo ? previous.slug : createSlug(value),
    }));
  };

  const toggleProduct = (id) => {
    setSelectedProducts((previous) =>
      previous.includes(id)
        ? previous.filter((productId) => productId !== id)
        : [...previous, id]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.error("El nombre del combo es obligatorio");
      return;
    }

    if (!formData.slug.trim()) {
      toast.error("El slug del combo es obligatorio");
      return;
    }

    if (!Number(formData.finalPrice || 0)) {
      toast.error("El precio final es obligatorio");
      return;
    }

    if (selectedProducts.length === 0) {
      toast.error("Selecciona al menos un producto para el combo");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      data.append("name", formData.name.trim());
      data.append("slug", createSlug(formData.slug));
      data.append("finalPrice", Number(formData.finalPrice || 0));
      data.append("oldPrice", Number(formData.oldPrice || 0));
      data.append("description", formData.description || "");
      data.append("showOnHome", formData.showOnHome);
      data.append("active", formData.active);

      selectedProducts.forEach((id) => {
        data.append("products", id);
      });

      if (imageFile) {
        data.append("image", imageFile);
      }

      if (combo) {
        await pb.collection("combos").update(combo.id, data, {
          $autoCancel: false,
        });

        toast.success("Combo actualizado");
      } else {
        await pb.collection("combos").create(data, {
          $autoCancel: false,
        });

        toast.success("Combo creado");
      }

      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error("Error guardando combo:", error);
      toast.error(error?.message || "Error al guardar combo");
    } finally {
      setLoading(false);
    }
  };

  const title = combo ? "Editar combo" : "Nuevo combo";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto rounded-[1.8rem]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 pt-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <Layers className="h-5 w-5" />
            </span>

            <span>
              <span className="block font-display text-3xl font-black tracking-[-0.055em]">
                {title}
              </span>
              <span className="block text-sm font-semibold text-muted-foreground">
                Arma ofertas con ahorro real para subir el ticket promedio.
              </span>
            </span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
            <div className="space-y-5">
              <section className="rounded-[1.5rem] border border-border bg-muted/25 p-4">
                <div className="mb-4 flex items-center gap-2 text-sm font-black text-primary">
                  <Sparkles className="h-4 w-4" />
                  Información principal
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Nombre *</Label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(event) => handleNameChange(event.target.value)}
                      placeholder="Ej: Combo Cine en Casa"
                      className="h-11 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label>Slug *</Label>
                    <Input
                      required
                      value={formData.slug}
                      onChange={(event) =>
                        handleChange("slug", createSlug(event.target.value))
                      }
                      placeholder="combo-cine-en-casa"
                      className="h-11 rounded-xl"
                    />
                    <p className="text-xs font-semibold text-muted-foreground">
                      Slug interno: {formData.slug || "nombre-del-combo"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Precio final *</Label>
                    <Input
                      type="number"
                      required
                      value={formData.finalPrice}
                      onChange={(event) =>
                        handleChange("finalPrice", event.target.value)
                      }
                      placeholder="99900"
                      className="h-11 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Precio anterior</Label>
                    <Input
                      type="number"
                      value={formData.oldPrice}
                      onChange={(event) =>
                        handleChange("oldPrice", event.target.value)
                      }
                      placeholder="129900"
                      className="h-11 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label>Descripción</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(event) =>
                        handleChange("description", event.target.value)
                      }
                      placeholder="Describe el beneficio del combo y por qué conviene comprarlo junto..."
                      rows={3}
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-[1.5rem] border border-border bg-card p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-black text-primary">
                      <Package className="h-4 w-4" />
                      Productos del combo
                    </div>
                    <p className="mt-1 text-xs font-semibold text-muted-foreground">
                      Seleccionados: {selectedProducts.length}
                    </p>
                  </div>
                </div>

                <div className="relative mb-3">
                  <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={productSearch}
                    onChange={(event) => setProductSearch(event.target.value)}
                    placeholder="Buscar producto..."
                    className="h-11 rounded-xl pl-9"
                  />
                </div>

                <div className="grid max-h-72 gap-2 overflow-y-auto rounded-2xl border border-border bg-muted/15 p-3 sm:grid-cols-2">
                  {filteredProducts.length === 0 ? (
                    <div className="col-span-full p-6 text-center text-sm font-semibold text-muted-foreground">
                      No hay productos disponibles.
                    </div>
                  ) : (
                    filteredProducts.map((product) => {
                      const selected = selectedProducts.includes(product.id);
                      const imageUrl = getProductImage(product);

                      return (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => toggleProduct(product.id)}
                          className={[
                            "flex items-center gap-3 rounded-2xl border p-2 text-left transition-colors",
                            selected
                              ? "border-primary bg-primary-soft text-primary"
                              : "border-transparent hover:bg-muted",
                          ].join(" ")}
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-background">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Package className="h-4 w-4 text-muted-foreground" />
                            )}
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-black">
                              {product.name}
                            </span>
                            <span className="block text-xs font-semibold text-muted-foreground">
                              {formatCurrency(product.price)}
                            </span>
                          </span>

                          <span
                            className={[
                              "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
                              selected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-muted-foreground/35",
                            ].join(" ")}
                          >
                            {selected && <Check className="h-3.5 w-3.5" />}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </section>
            </div>

            <div className="space-y-5">
              <section className="rounded-[1.5rem] border border-border bg-card p-4">
                <Label>Imagen del combo</Label>

                <div className="mt-3 flex h-[190px] items-center justify-center overflow-hidden rounded-2xl bg-muted">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Vista previa"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <ImageIcon className="mx-auto mb-2 h-9 w-9" />
                      <p className="text-xs font-bold">Sin imagen</p>
                    </div>
                  )}
                </div>

                <div className="relative mt-3 flex min-h-[120px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 p-4 text-center hover:bg-muted/35">
                  <UploadCloud className="mb-2 h-7 w-7 text-primary" />

                  <p className="text-sm font-black text-foreground">
                    Clic para subir imagen
                  </p>

                  <p className="mt-1 text-xs font-semibold text-muted-foreground">
                    Ideal: imagen clara mostrando el combo completo.
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
              </section>

              <section className="rounded-[1.5rem] border border-border bg-card p-4">
                <div className="mb-4 flex items-center gap-2 text-sm font-black text-primary">
                  <BadgePercent className="h-4 w-4" />
                  Resumen comercial
                </div>

                <div className="space-y-3 rounded-2xl bg-muted/35 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-muted-foreground">
                      Precio final
                    </span>
                    <span className="font-black text-primary">
                      {formatCurrency(formData.finalPrice)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-muted-foreground">
                      Precio anterior
                    </span>
                    <span className="font-black">
                      {formatCurrency(formData.oldPrice)}
                    </span>
                  </div>

                  <div className="border-t border-border pt-3">
                    {savings > 0 ? (
                      <div className="rounded-2xl bg-secondary-soft p-3 text-secondary-deep">
                        <p className="text-xs font-black uppercase tracking-[0.12em]">
                          Ahorro visible
                        </p>
                        <p className="mt-1 text-xl font-black">
                          {formatCurrency(savings)} · {savingsPercent}%
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-muted-foreground">
                        Agrega precio anterior mayor al final para mostrar ahorro.
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <section className="rounded-[1.5rem] border border-border bg-card p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <Label className="font-black">Activo</Label>
                      <p className="text-xs font-semibold text-muted-foreground">
                        Si está activo, puede mostrarse en tienda.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleChange("active", !formData.active)}
                      className={[
                        "flex h-10 min-w-[115px] items-center justify-center gap-2 rounded-full text-sm font-black",
                        formData.active
                          ? "bg-secondary-soft text-secondary-deep"
                          : "bg-muted text-muted-foreground",
                      ].join(" ")}
                    >
                      {formData.active ? (
                        <>
                          <Eye className="h-4 w-4" />
                          Activo
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-4 w-4" />
                          Inactivo
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
                    <div>
                      <Label className="font-black">Mostrar en inicio</Label>
                      <p className="text-xs font-semibold text-muted-foreground">
                        Para destacar este combo en el home.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleChange("showOnHome", !formData.showOnHome)
                      }
                      className={[
                        "flex h-10 min-w-[115px] items-center justify-center gap-2 rounded-full text-sm font-black",
                        formData.showOnHome
                          ? "bg-primary-soft text-primary"
                          : "bg-muted text-muted-foreground",
                      ].join(" ")}
                    >
                      <Home className="h-4 w-4" />
                      {formData.showOnHome ? "Sí" : "No"}
                    </button>
                  </div>
                </div>
              </section>

              {selectedProductsData.length > 0 && (
                <section className="rounded-[1.5rem] border border-border bg-card p-4">
                  <p className="mb-3 text-sm font-black text-foreground">
                    Incluidos
                  </p>

                  <div className="space-y-2">
                    {selectedProductsData.slice(0, 5).map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between rounded-xl bg-muted/35 px-3 py-2 text-sm"
                      >
                        <span className="truncate font-semibold">
                          {product.name}
                        </span>
                        <span className="ml-3 shrink-0 font-black text-primary">
                          {formatCurrency(product.price)}
                        </span>
                      </div>
                    ))}

                    {selectedProductsData.length > 5 && (
                      <p className="text-xs font-semibold text-muted-foreground">
                        +{selectedProductsData.length - 5} productos más
                      </p>
                    )}
                  </div>
                </section>
              )}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-full"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="mf-btn mf-btn-primary rounded-full"
            >
              {loading ? "Guardando..." : "Guardar combo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ComboFormModal;
