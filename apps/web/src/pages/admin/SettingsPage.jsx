import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { toast } from 'sonner';
import AdminLayout from '@/components/AdminLayout.jsx';
import { useSettings } from '@/hooks/useSettings.js';
import AboutUsSettingsPanel from '@/pages/admin/AboutUsSettingsPanel.jsx';

const SettingsPage = () => {
  const { settings, loading, updateSettings } = useSettings();
  const [formData, setFormData] = useState({
    storeName: '',
    email: '',
    whatsApp: '',
    address: '',
    hours: '',
    shippingCost: 0,
    nequiNumber: '',
    falabellaNumber: '',
    paymentInstructions: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        storeName: settings.storeName || '',
        email: settings.email || '',
        whatsApp: settings.whatsApp || '',
        address: settings.address || '',
        hours: settings.hours || '',
        shippingCost: 0,
        nequiNumber: settings.nequiNumber || '',
        falabellaNumber: settings.falabellaNumber || '',
        paymentInstructions: settings.paymentInstructions || ''
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveGeneral = async () => {
    try {
      setSaving(true);
      await updateSettings(formData);
      toast.success('Configuración guardada correctamente');
    } catch (err) {
      toast.error('Error al guardar configuración');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLayout><div className="p-8">Cargando...</div></AdminLayout>;

  return (
    <AdminLayout>
      <Helmet>
        <title>Admin - Configuración - Modo Fácil</title>
      </Helmet>

      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
          <Button onClick={handleSaveGeneral} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>

        <Tabs defaultValue="general">
          <TabsList className="mb-6 bg-muted p-1">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="payments">Pagos & Envíos</TabsTrigger>
            <TabsTrigger value="about">Página Quiénes Somos</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <div className="bg-card border border-border p-6 rounded-xl space-y-6">
              <h2 className="text-xl font-semibold border-b border-border pb-4">Información de la tienda</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Nombre de la tienda</Label>
                  <Input id="storeName" name="storeName" value={formData.storeName} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico de contacto</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsApp">WhatsApp (con código de país ej: 57300...)</Label>
                  <Input id="whatsApp" name="whatsApp" value={formData.whatsApp} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hours">Horario de atención</Label>
                  <Input id="hours" name="hours" value={formData.hours} onChange={handleChange} />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address">Dirección física</Label>
                  <Input id="address" name="address" value={formData.address} onChange={handleChange} />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <div className="bg-card border border-border p-6 rounded-xl space-y-6">
              <h2 className="text-xl font-semibold border-b border-border pb-4">Configuración de Pagos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nequiNumber">Número Nequi</Label>
                  <Input id="nequiNumber" name="nequiNumber" value={formData.nequiNumber} onChange={handleChange} placeholder="Ej: 3001234567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="falabellaNumber">Cuenta Banco Falabella (u otro)</Label>
                  <Input id="falabellaNumber" name="falabellaNumber" value={formData.falabellaNumber} onChange={handleChange} placeholder="Ej: Ahorros 1234..." />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="paymentInstructions">Instrucciones de Pago (para clientes)</Label>
                  <Textarea
                    id="paymentInstructions"
                    name="paymentInstructions"
                    value={formData.paymentInstructions}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Realiza la transferencia a los números indicados y envía el comprobante por WhatsApp..."
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="about">
            <AboutUsSettingsPanel settings={settings} updateSettings={updateSettings} />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
