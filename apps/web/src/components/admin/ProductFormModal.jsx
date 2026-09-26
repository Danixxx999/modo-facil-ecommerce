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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { toast } from "sonner";
import pb from "@/lib/pocketbaseClient.js";
import {
  UploadCloud,
  PackageCheck,
  BadgePercent,
  Sparkles,
  ImageIcon,
  DollarSign,
  Info,
  X,
} from "lucide-react";

const emptyForm = {
  name: "",
  slug: "",
  price: "",
  oldPrice: "",
  category: "",
  benefit: "",
  description: "",
  longDescription: "",
  benefits: "",
  howToUse: "",
  specs: "",
  whatIncluded: "",
  warranty: "",
  estimatedDelivery: "",
  stock: "",
  tags: "",
  tier1Qty: "",
  tier1Price: "",
  tier2Qty: "",
  tier2Price: "",
  tier3Qty: "",
  tier3Price: "",
  tier4Qty: "",
  tier4Price: "",
  active: true,
};

const formatCurrency = (value) => {
  const numericValue = Number(value || 0);

  return numericValue.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
};

const toNumber = (value) => {
  const number = Number(value || 0);
  return Number.isNaN(number) ? 0 : number;
};

const generateSlug = (name) => {
  return String(name || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

const normalizeTags = (value) => {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return value || "";
};

const parseTags = (value) => {
  return String(value || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const ProductFormModal = ({
  isOpen,
  onClose,
  product,
  categories = [],
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        slug: product.slug || "",
        price: product.price || "",
        oldPrice: product.oldPrice || "",
        category: product.category || "",
        benefit: product.benefit || "",
        description: product.description || "",
        longDescription: product.longDescription || "",
        benefits: product.benefits || "",
        howToUse: product.howToUse || "",
        specs: product.specs || "",
        whatIncluded: product.whatIncluded || "",
        warranty: product.warranty || "",
        estimatedDelivery: product.estimatedDelivery || "",
        stock: product.stock || "",
        tags: normalizeTags(product.tags),
        tier1Qty: product.tier1Qty || "",
        tier1Price: product.tier1Price || "",
        tier2Qty: product.tier2Qty || "",
        tier2Price: product.tier2Price || "",
        tier3Qty: product.tier3Qty || "",
        tier3Price: product.tier3Price || "",
        tier4Qty: product.tier4Qty || "",
        tier4Price: product.tier4Price || "",
        active: product.active ?? true,
      });
    } else {
      setFormData(emptyForm);
    }

    setImageFiles([]);
  }, [product, isOpen]);

  const handleChange = (field, value) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const handleNameChange = (value) => {
    handleChange("name", value);

    if (!product) {
      handleChange("slug", generateSlug(value));
    }
  };

  const pricePreview = useMemo(() => {
    const basePrice = toNumber(formData.price);

    const tiers = [
      {
        label: "1 unidad",
        qty: 1,
        total: basePrice,
      },
      {
        label: `${formData.tier1Qty || 2} unidades`,
        qty: toNumber(formData.tier1Qty),
        total: toNumber(formData.tier1Price),
      },
      {
        label: `${formData.tier2Qty || 3} unidades`,
        qty: toNumber(formData.tier2Qty),
        total: toNumber(formData.tier2Price),
      },
      {
        label: `${formData.tier3Qty || 4} unidades`,
        qty: toNumber(formData.tier3Qty),
        total: toNumber(formData.tier3Price),
      },
      {
        label: `${formData.tier4Qty || 5}+ unidades`,
        qty: toNumber(formData.tier4Qty),
        total: toNumber(formData.tier4Price),
      },
    ];

    return tiers.filter((tier) => tier.total > 0 && tier.qty > 0);
  }, [formData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "tags") {
          const tags = parseTags(value);
          data.append("tags", JSON.stringify(tags));
          return;
        }

        if (value !== "" && value !== null && value !== undefined) {
          data.append(key, value);
        }
      });

      imageFiles.forEach((file) => {
        data.append(product ? "images+" : "images", file);
      });

      if (product) {
        await pb.collection("products").update(product.id, data, {
          $autoCancel: false,
        });
        toast.success("Producto actualizado");
      } else {
        await pb.collection("products").create(data, {
          $autoCancel: false,
        });
        toast.success("Producto creado");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error al guardar el producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto rounded-[1.8rem]">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl font-black tracking-[-0.055em]">
            {product ? "Editar producto" : "Nuevo producto"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          {/* Bloque principal */}
          <section className="rounded-[1.5rem] border border-border bg-card p-5">
            <div className="mb-5 flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <PackageCheck className="h-5 w-5" />
              </span>

              <div>
                <h3 className="font-display text-2xl font-black tracking-[-0.05em]">
                  Información principal
                </h3>
                <p className="text-sm font-semibold text-muted-foreground">
                  Esta es la información que verá el cliente en la tienda.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="font-black">Nombre *</Label>
                <Input
                  required
                  value={formData.name}
                  onChange={(event) => handleNameChange(event.target.value)}
                  placeholder="Ej: Tabla Pilates Multifuncional"
                  className="mf-input h-12"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-black">Slug *</Label>
                <Input
                  required
                  value={formData.slug}
                  onChange={(event) => handleChange("slug", event.target.value)}
                  placeholder="tabla-pilates-multifuncional"
                  className="mf-input h-12"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-black">Categoría</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleChange("category", value)}
                >
                  <SelectTrigger className="mf-input h-12">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>

                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-black">Stock *</Label>
                <Input
                  type="number"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={(event) => handleChange("stock", event.target.value)}
                  placeholder="Ej: 20"
                  className="mf-input h-12"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="font-black">
                  Beneficio corto / frase vendedora
                </Label>
                <Input
                  value={formData.benefit}
                  onChange={(event) =>
                    handleChange("benefit", event.target.value)
                  }
                  placeholder="Ej: Entrena en casa sin ocupar espacio y mejora tu rutina diaria."
                  className="mf-input h-12"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="font-black">Etiquetas</Label>
                <Input
                  value={formData.tags}
                  onChange={(event) => handleChange("tags", event.target.value)}
                  placeholder="Ej: Nuevo, Más vendido, Paga al recibir"
                  className="mf-input h-12"
                />
                <p className="text-xs font-semibold text-muted-foreground">
                  Sepáralas por coma. Ejemplo: Nuevo, Oferta, Más vendido
                </p>
              </div>
            </div>
          </section>

          {/* Precios */}
          <section className="rounded-[1.5rem] border border-border bg-card p-5">
            <div className="mb-5 flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                <DollarSign className="h-5 w-5" />
              </span>

              <div>
                <h3 className="font-display text-2xl font-black tracking-[-0.05em]">
                  Precios y paquetes
                </h3>
                <p className="text-sm font-semibold text-muted-foreground">
                  Importante: los precios por cantidad son el{" "}
                  <strong>valor total del paquete</strong>.
                </p>
              </div>
            </div>

            <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="font-black">Precio 1 unidad *</Label>
                <Input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(event) => handleChange("price", event.target.value)}
                  placeholder="Ej: 69900"
                  className="mf-input h-12"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-black">Precio anterior</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.oldPrice}
                  onChange={(event) =>
                    handleChange("oldPrice", event.target.value)
                  }
                  placeholder="Ej: 89900"
                  className="mf-input h-12"
                />
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-primary/15 bg-primary-soft/45 p-4">
              <div className="mb-4 flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-black text-primary-deep">
                    Cómo llenar paquetes
                  </p>
                  <p className="mt-1 text-sm font-semibold leading-6 text-muted-foreground">
                    Si quieres vender 2 unidades por $99.900, coloca cantidad{" "}
                    <strong>2</strong> y precio paquete{" "}
                    <strong>99900</strong>. El sistema calcula solo el valor por
                    unidad.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label className="font-black">Cantidad paquete 1</Label>
                  <Input
                    type="number"
                    min="2"
                    value={formData.tier1Qty}
                    onChange={(event) =>
                      handleChange("tier1Qty", event.target.value)
                    }
                    placeholder="2"
                    className="mf-input h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-black">Precio total paquete 1</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.tier1Price}
                    onChange={(event) =>
                      handleChange("tier1Price", event.target.value)
                    }
                    placeholder="99900"
                    className="mf-input h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-black">Cantidad paquete 2</Label>
                  <Input
                    type="number"
                    min="2"
                    value={formData.tier2Qty}
                    onChange={(event) =>
                      handleChange("tier2Qty", event.target.value)
                    }
                    placeholder="3"
                    className="mf-input h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-black">Precio total paquete 2</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.tier2Price}
                    onChange={(event) =>
                      handleChange("tier2Price", event.target.value)
                    }
                    placeholder="139900"
                    className="mf-input h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-black">Cantidad paquete 3</Label>
                  <Input
                    type="number"
                    min="2"
                    value={formData.tier3Qty}
                    onChange={(event) =>
                      handleChange("tier3Qty", event.target.value)
                    }
                    placeholder="4"
                    className="mf-input h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-black">Precio total paquete 3</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.tier3Price}
                    onChange={(event) =>
                      handleChange("tier3Price", event.target.value)
                    }
                    placeholder="179900"
                    className="mf-input h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-black">Cantidad paquete 4+</Label>
                  <Input
                    type="number"
                    min="2"
                    value={formData.tier4Qty}
                    onChange={(event) =>
                      handleChange("tier4Qty", event.target.value)
                    }
                    placeholder="5"
                    className="mf-input h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-black">Precio total paquete 4+</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.tier4Price}
                    onChange={(event) =>
                      handleChange("tier4Price", event.target.value)
                    }
                    placeholder="209900"
                    className="mf-input h-12"
                  />
                </div>
              </div>
            </div>

            {pricePreview.length > 0 && (
              <div className="mt-4 rounded-[1.4rem] border border-border bg-muted/35 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <BadgePercent className="h-5 w-5 text-primary" />
                  <h4 className="font-black">Vista previa de precios</h4>
                </div>

                <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                  {pricePreview.map((tier) => {
                    const unit = tier.qty > 0 ? tier.total / tier.qty : 0;
                    const baseTotal = toNumber(formData.price) * tier.qty;
                    const savings = Math.max(baseTotal - tier.total, 0);

                    return (
                      <div
                        key={`${tier.label}-${tier.total}`}
                        className="rounded-2xl border border-border bg-card p-3"
                      >
                        <p className="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">
                          {tier.label}
                        </p>

                        <p className="mt-1 font-display text-2xl font-black tracking-[-0.05em] text-primary">
                          {formatCurrency(tier.total)}
                        </p>

                        {tier.qty > 1 && (
                          <p className="mt-1 text-xs font-semibold text-muted-foreground">
                            Aprox. {formatCurrency(unit)} por unidad
                          </p>
                        )}

                        {savings > 0 && (
                          <p className="mt-2 inline-flex rounded-full bg-accent/15 px-2 py-1 text-[10px] font-black text-accent-foreground">
                            Ahorro {formatCurrency(savings)}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* Contenido */}
          <section className="rounded-[1.5rem] border border-border bg-card p-5">
            <div className="mb-5 flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <Sparkles className="h-5 w-5" />
              </span>

              <div>
                <h3 className="font-display text-2xl font-black tracking-[-0.05em]">
                  Contenido del producto
                </h3>
                <p className="text-sm font-semibold text-muted-foreground">
                  Estos textos alimentan la página del producto.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label className="font-black">Descripción breve</Label>
                <Textarea
                  value={formData.description}
                  onChange={(event) =>
                    handleChange("description", event.target.value)
                  }
                  rows={3}
                  placeholder="Texto corto para explicar qué es el producto."
                  className="mf-input"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-black">Descripción larga</Label>
                <Textarea
                  value={formData.longDescription}
                  onChange={(event) =>
                    handleChange("longDescription", event.target.value)
                  }
                  rows={5}
                  placeholder="Explica el producto con más detalle."
                  className="mf-input"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="font-black">Beneficios</Label>
                  <Textarea
                    value={formData.benefits}
                    onChange={(event) =>
                      handleChange("benefits", event.target.value)
                    }
                    rows={5}
                    placeholder={"• Beneficio 1\n• Beneficio 2\n• Beneficio 3"}
                    className="mf-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-black">Cómo usar</Label>
                  <Textarea
                    value={formData.howToUse}
                    onChange={(event) =>
                      handleChange("howToUse", event.target.value)
                    }
                    rows={5}
                    placeholder="Instrucciones sencillas para el cliente."
                    className="mf-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-black">Especificaciones</Label>
                  <Textarea
                    value={formData.specs}
                    onChange={(event) =>
                      handleChange("specs", event.target.value)
                    }
                    rows={5}
                    placeholder="Material, medidas, potencia, color, etc."
                    className="mf-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-black">Qué incluye</Label>
                  <Textarea
                    value={formData.whatIncluded}
                    onChange={(event) =>
                      handleChange("whatIncluded", event.target.value)
                    }
                    rows={5}
                    placeholder={"• Producto principal\n• Accesorios\n• Manual"}
                    className="mf-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="font-black">Garantía</Label>
                  <Input
                    value={formData.warranty}
                    onChange={(event) =>
                      handleChange("warranty", event.target.value)
                    }
                    placeholder="Ej: Compra segura / Garantía por defecto de fábrica"
                    className="mf-input h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-black">Tiempo de entrega</Label>
                  <Input
                    value={formData.estimatedDelivery}
                    onChange={(event) =>
                      handleChange("estimatedDelivery", event.target.value)
                    }
                    placeholder="Ej: 2 a 5 días hábiles según ciudad"
                    className="mf-input h-12"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Imágenes */}
          <section className="rounded-[1.5rem] border border-border bg-card p-5">
            <div className="mb-5 flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-muted text-foreground">
                <ImageIcon className="h-5 w-5" />
              </span>

              <div>
                <h3 className="font-display text-2xl font-black tracking-[-0.05em]">
                  Imágenes
                </h3>
                <p className="text-sm font-semibold text-muted-foreground">
                  Sube imágenes limpias y atractivas. La primera será la imagen
                  principal.
                </p>
              </div>
            </div>

            <div className="relative flex min-h-[150px] flex-col items-center justify-center rounded-[1.4rem] border-2 border-dashed border-border bg-muted/20 p-6 text-center transition-colors hover:bg-muted/35">
              <UploadCloud className="mb-2 h-9 w-9 text-muted-foreground" />
              <p className="text-sm font-black text-foreground">
                Haz clic o arrastra imágenes aquí
              </p>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                Puedes subir varias imágenes del producto.
              </p>

              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={(event) =>
                  setImageFiles(Array.from(event.target.files || []))
                }
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />

              {imageFiles.length > 0 && (
                <p className="mt-4 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-black text-primary">
                  {imageFiles.length} archivo
                  {imageFiles.length > 1 ? "s" : ""} seleccionado
                  {imageFiles.length > 1 ? "s" : ""}
                </p>
              )}
            </div>

            {imageFiles.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                {imageFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="relative overflow-hidden rounded-2xl border border-border bg-muted"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="aspect-square w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setImageFiles((previous) =>
                          previous.filter((_, fileIndex) => fileIndex !== index)
                        )
                      }
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-destructive shadow-premium-xs"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Estado */}
          <section className="rounded-[1.5rem] border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Label htmlFor="active" className="text-base font-black">
                  Producto activo
                </Label>
                <p className="mt-1 text-sm font-semibold text-muted-foreground">
                  Si está activo, aparecerá visible en la tienda.
                </p>
              </div>

              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(value) => handleChange("active", value)}
              />
            </div>
          </section>

          <div className="sticky bottom-0 z-10 -mx-6 border-t border-border bg-background/92 px-6 py-4 backdrop-blur-xl">
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                type="button"
                onClick={onClose}
                className="rounded-full"
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={loading}
                className="mf-btn mf-btn-primary rounded-full px-6"
              >
                {loading
                  ? "Guardando..."
                  : product
                    ? "Guardar cambios"
                    : "Crear producto"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormModal;
