import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import {
  Save,
  Settings as SettingsIcon,
  Store,
  MessageCircle,
  Mail,
  Clock,
  MapPin,
  Truck,
  CreditCard,
  Banknote,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Send,
  Instagram,
  Facebook,
  Globe,
  BadgeCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.jsx";
import AdminLayout from "@/components/AdminLayout.jsx";
import { useSettings } from "@/hooks/useSettings.js";

const DEFAULT_PAYMENT_INSTRUCTIONS =
  "Para pago anticipado puedes realizar la transferencia a Nequi o cuenta bancaria. Después envíanos el comprobante por WhatsApp para confirmar tu pedido.";

const normalizePhone = (value) => {
  return String(value || "").replace(/[^\d]/g, "");
};

const AdminSettingsPage = () => {
  const { settings, loading, updateSettings, refetch } = useSettings();

  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        storeName: settings.storeName || "Modo Fácil",
        slogan:
          settings.slogan ||
          "Productos útiles para hacer tu vida más fácil.",
        email: settings.email || "",
        whatsApp: settings.whatsApp || settings.whatsapp || "",
        address: settings.address || "",
        city: settings.city || "",
        department: settings.department || "",
        hours: settings.hours || "Lunes a sábado de 8:00 a.m. a 6:00 p.m.",

        shippingCost: 0,
        freeShippingText:
          settings.freeShippingText || "Envío gratis en todos los pedidos",
        codShippingText:
          settings.codShippingText ||
          "Pago contra entrega disponible · envío gratis",
        deliveryTime:
          settings.deliveryTime || "Entrega estimada de 2 a 5 días hábiles",

        nequiNumber: settings.nequiNumber || "",
        daviplataNumber: settings.daviplataNumber || "",
        falabellaNumber: settings.falabellaNumber || "",
        bankAccount: settings.bankAccount || "",
        paymentInstructions:
          settings.paymentInstructions || DEFAULT_PAYMENT_INSTRUCTIONS,

        instagram: settings.instagram || "",
        facebook: settings.facebook || "",
        tiktok: settings.tiktok || "",
        website: settings.website || "",

        guaranteeText:
          settings.guaranteeText ||
          "Compra segura, productos verificados y atención personalizada por WhatsApp.",
        homeAnnouncement:
          settings.homeAnnouncement ||
          "Envío gratis a toda Colombia · Pago anticipado o contra entrega",
      });
    }
  }, [settings]);

  const previewWhatsapp = useMemo(() => {
    const phone = normalizePhone(formData.whatsApp);
    if (!phone) return "";

    return `https://wa.me/57${phone.replace(/^57/, "")}`;
  }, [formData.whatsApp]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.storeName?.trim()) {
      toast.error("El nombre de la tienda es obligatorio");
      return;
    }

    if (!formData.whatsApp?.trim()) {
      toast.error("El WhatsApp de contacto es importante para vender");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...formData,
        whatsApp: normalizePhone(formData.whatsApp),
        shippingCost: 0,
      };

      await updateSettings(payload);
      toast.success("Configuración actualizada");
    } catch (error) {
      console.error("Error guardando configuración:", error);
      toast.error(error?.message || "Error al guardar configuración");
    } finally {
      setSaving(false);
    }
  };

  const handleTestWhatsApp = () => {
    if (!previewWhatsapp) {
      toast.error("Agrega un número de WhatsApp válido");
      return;
    }

    const message = `Hola 👋 Quiero más información de ${formData.storeName || "Modo Fácil"}`;
    window.open(`${previewWhatsapp}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const SectionTitle = ({ icon: Icon, title, description }) => (
    <div className="mb-5 flex items-start gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
        <Icon className="h-5 w-5" />
      </span>

      <div>
        <h2 className="font-display text-2xl font-black tracking-[-0.05em]">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm font-semibold text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  );

  const Field = ({ label, children, hint }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {hint && (
        <p className="text-xs font-semibold text-muted-foreground">{hint}</p>
      )}
    </div>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-card p-10 text-center">
          <RefreshCw className="mx-auto mb-3 h-8 w-8 animate-spin text-primary" />
          <p className="font-semibold text-muted-foreground">
            Cargando configuración...
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Configuración | Admin Modo Fácil</title>
      </Helmet>

      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-black text-primary">
            <SettingsIcon className="h-4 w-4" />
            Panel del dueño
          </div>

          <h1 className="font-display text-4xl font-black tracking-[-0.06em] text-foreground">
            Configuración
          </h1>

          <p className="mt-2 text-sm font-semibold text-muted-foreground">
            Ajusta la información de la tienda, WhatsApp, pagos, envíos y textos
            principales.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {refetch && (
            <Button
              variant="outline"
              onClick={refetch}
              className="rounded-full"
              disabled={saving}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Actualizar
            </Button>
          )}

          <Button
            onClick={handleSave}
            disabled={saving}
            className="mf-btn mf-btn-primary rounded-full"
          >
            <Save className="h-4 w-4" />
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="admin-card p-5 xl:col-span-2">
          <div className="mb-3 flex items-center gap-2 text-sm font-black text-primary">
            <Sparkles className="h-4 w-4" />
            Vista previa de promesa comercial
          </div>

          <h2 className="font-display text-3xl font-black tracking-[-0.055em]">
            {formData.storeName || "Modo Fácil"}
          </h2>

          <p className="mt-2 text-sm font-semibold text-muted-foreground">
            {formData.slogan || "Productos útiles para hacer tu vida más fácil."}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="mf-badge bg-secondary-soft text-secondary-deep">
              <Truck className="h-4 w-4" />
              {formData.freeShippingText || "Envío gratis en todos los pedidos"}
            </span>

            <span className="mf-badge bg-primary-soft text-primary">
              <Banknote className="h-4 w-4" />
              Contra entrega · envío gratis
            </span>

            <span className="mf-badge bg-muted text-foreground">
              <ShieldCheck className="h-4 w-4" />
              Compra segura
            </span>
          </div>
        </div>

        <div className="admin-card p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-black text-primary">
            <MessageCircle className="h-4 w-4" />
            WhatsApp principal
          </div>

          <p className="text-xl font-black">
            {formData.whatsApp || "Sin configurar"}
          </p>

          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            Este número se usa para pedidos, soporte y mensajes de checkout.
          </p>

          <Button
            variant="outline"
            onClick={handleTestWhatsApp}
            className="mt-4 w-full rounded-full"
          >
            <Send className="mr-2 h-4 w-4" />
            Probar WhatsApp
          </Button>
        </div>
      </div>

      <Tabs defaultValue="store" className="admin-card p-4 sm:p-6">
        <TabsList className="mb-6 grid h-auto grid-cols-2 gap-2 rounded-2xl bg-muted/50 p-1 md:grid-cols-4">
          <TabsTrigger value="store" className="rounded-xl">
            Tienda
          </TabsTrigger>
          <TabsTrigger value="payments" className="rounded-xl">
            Pagos y envíos
          </TabsTrigger>
          <TabsTrigger value="social" className="rounded-xl">
            Redes
          </TabsTrigger>
          <TabsTrigger value="texts" className="rounded-xl">
            Textos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="mt-0">
          <SectionTitle
            icon={Store}
            title="Información general"
            description="Datos principales que se usan en la tienda y mensajes."
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Nombre de la tienda">
              <Input
                name="storeName"
                value={formData.storeName || ""}
                onChange={handleChange}
                className="h-11 rounded-xl"
                placeholder="Modo Fácil"
              />
            </Field>

            <Field label="WhatsApp de contacto" hint="Ejemplo: 573001112233">
              <div className="relative">
                <MessageCircle className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  name="whatsApp"
                  value={formData.whatsApp || ""}
                  onChange={handleChange}
                  className="h-11 rounded-xl pl-9"
                  placeholder="573000000000"
                />
              </div>
            </Field>

            <Field label="Email de soporte">
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="h-11 rounded-xl pl-9"
                  placeholder="soporte@modofacil.com"
                />
              </div>
            </Field>

            <Field label="Horario de atención">
              <div className="relative">
                <Clock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  name="hours"
                  value={formData.hours || ""}
                  onChange={handleChange}
                  className="h-11 rounded-xl pl-9"
                  placeholder="Lunes a sábado de 8:00 a.m. a 6:00 p.m."
                />
              </div>
            </Field>

            <Field label="Ciudad">
              <Input
                name="city"
                value={formData.city || ""}
                onChange={handleChange}
                className="h-11 rounded-xl"
                placeholder="Ibagué"
              />
            </Field>

            <Field label="Departamento">
              <Input
                name="department"
                value={formData.department || ""}
                onChange={handleChange}
                className="h-11 rounded-xl"
                placeholder="Tolima"
              />
            </Field>

            <div className="md:col-span-2">
              <Field label="Dirección">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="address"
                    value={formData.address || ""}
                    onChange={handleChange}
                    className="h-11 rounded-xl pl-9"
                    placeholder="Dirección comercial o ciudad base"
                  />
                </div>
              </Field>
            </div>

            <div className="md:col-span-2">
              <Field label="Slogan">
                <Textarea
                  name="slogan"
                  value={formData.slogan || ""}
                  onChange={handleChange}
                  rows={3}
                  className="rounded-xl"
                  placeholder="Productos útiles para hacer tu vida más fácil."
                />
              </Field>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="mt-0">
          <SectionTitle
            icon={CreditCard}
            title="Pagos y envíos"
            description="Configura cuentas, tiempos y mensajes para pago anticipado o contra entrega."
          />

          <div className="mb-5 rounded-2xl border border-secondary/20 bg-secondary-soft p-4 text-secondary-deep">
            <div className="mb-1 flex items-center gap-2 font-black">
              <BadgeCheck className="h-5 w-5" />
              Regla comercial recomendada
            </div>
            <p className="text-sm font-semibold leading-6">
              El envío es gratis con pago anticipado y también con pago contra entrega.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Tiempo de entrega">
              <Input
                name="deliveryTime"
                value={formData.deliveryTime || ""}
                onChange={handleChange}
                className="h-11 rounded-xl"
                placeholder="Entrega estimada de 2 a 5 días hábiles"
              />
            </Field>

            <Field label="Número Nequi">
              <Input
                name="nequiNumber"
                value={formData.nequiNumber || ""}
                onChange={handleChange}
                className="h-11 rounded-xl"
                placeholder="3000000000"
              />
            </Field>

            <Field label="Número Daviplata">
              <Input
                name="daviplataNumber"
                value={formData.daviplataNumber || ""}
                onChange={handleChange}
                className="h-11 rounded-xl"
                placeholder="3000000000"
              />
            </Field>

            <Field label="Cuenta Banco Falabella">
              <Input
                name="falabellaNumber"
                value={formData.falabellaNumber || ""}
                onChange={handleChange}
                className="h-11 rounded-xl"
                placeholder="Número de cuenta"
              />
            </Field>

            <Field label="Otra cuenta bancaria">
              <Input
                name="bankAccount"
                value={formData.bankAccount || ""}
                onChange={handleChange}
                className="h-11 rounded-xl"
                placeholder="Banco, tipo de cuenta y número"
              />
            </Field>

            <div className="md:col-span-2">
              <Field label="Instrucciones de pago anticipado">
                <Textarea
                  name="paymentInstructions"
                  value={formData.paymentInstructions || ""}
                  onChange={handleChange}
                  rows={5}
                  className="rounded-xl"
                  placeholder={DEFAULT_PAYMENT_INSTRUCTIONS}
                />
              </Field>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="social" className="mt-0">
          <SectionTitle
            icon={Globe}
            title="Redes y enlaces"
            description="Guarda los enlaces para mostrar o reutilizar en la tienda."
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Instagram">
              <div className="relative">
                <Instagram className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  name="instagram"
                  value={formData.instagram || ""}
                  onChange={handleChange}
                  className="h-11 rounded-xl pl-9"
                  placeholder="https://instagram.com/modofacil"
                />
              </div>
            </Field>

            <Field label="Facebook">
              <div className="relative">
                <Facebook className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  name="facebook"
                  value={formData.facebook || ""}
                  onChange={handleChange}
                  className="h-11 rounded-xl pl-9"
                  placeholder="https://facebook.com/modofacil"
                />
              </div>
            </Field>

            <Field label="TikTok">
              <Input
                name="tiktok"
                value={formData.tiktok || ""}
                onChange={handleChange}
                className="h-11 rounded-xl"
                placeholder="https://tiktok.com/@modofacil"
              />
            </Field>

            <Field label="Sitio web / dominio">
              <Input
                name="website"
                value={formData.website || ""}
                onChange={handleChange}
                className="h-11 rounded-xl"
                placeholder="https://modofacil.co"
              />
            </Field>
          </div>
        </TabsContent>

        <TabsContent value="texts" className="mt-0">
          <SectionTitle
            icon={Sparkles}
            title="Textos comerciales"
            description="Mensajes que ayudan a vender y generar confianza."
          />

          <div className="grid grid-cols-1 gap-5">
            <Field label="Anuncio superior / franja principal">
              <Textarea
                name="homeAnnouncement"
                value={formData.homeAnnouncement || ""}
                onChange={handleChange}
                rows={3}
                className="rounded-xl"
                placeholder="Envío gratis a toda Colombia · Pago anticipado o contra entrega"
              />
            </Field>

            <Field label="Texto pago anticipado">
              <Input
                name="freeShippingText"
                value={formData.freeShippingText || ""}
                onChange={handleChange}
                className="h-11 rounded-xl"
                placeholder="Envío gratis en todos los pedidos"
              />
            </Field>

            <Field label="Texto contra entrega">
              <Input
                name="codShippingText"
                value={formData.codShippingText || ""}
                onChange={handleChange}
                className="h-11 rounded-xl"
                placeholder="Pago contra entrega disponible · envío gratis"
              />
            </Field>

            <Field label="Garantía / confianza">
              <Textarea
                name="guaranteeText"
                value={formData.guaranteeText || ""}
                onChange={handleChange}
                rows={4}
                className="rounded-xl"
                placeholder="Compra segura, productos verificados y atención personalizada por WhatsApp."
              />
            </Field>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="mf-btn mf-btn-primary rounded-full px-8"
        >
          <Save className="h-4 w-4" />
          {saving ? "Guardando..." : "Guardar configuración"}
        </Button>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
