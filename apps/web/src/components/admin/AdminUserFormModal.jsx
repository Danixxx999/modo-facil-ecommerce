import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';

const AdminUserFormModal = ({ isOpen, onClose, user, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Auxiliar', password: '', passwordConfirm: '' });

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '', email: user.email || '', role: user.role || 'Auxiliar', password: '', passwordConfirm: '' });
    } else {
      setFormData({ name: '', email: '', role: 'Auxiliar', password: '', passwordConfirm: '' });
    }
  }, [user, isOpen]);

  const handleChange = (field, val) => setFormData(p => ({ ...p, [field]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user && formData.password !== formData.passwordConfirm) {
      return toast.error('Las contraseñas no coinciden');
    }
    setLoading(true);
    try {
      const data = { ...formData };
      if (user && !data.password) { delete data.password; delete data.passwordConfirm; }

      if (user) {
        await pb.collection('admins').update(user.id, data, { $autoCancel: false });
        toast.success('Usuario actualizado');
      } else {
        await pb.collection('admins').create(data, { $autoCancel: false });
        toast.success('Usuario creado');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Error al guardar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>{user ? 'Editar Usuario' : 'Nuevo Usuario'}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2"><Label>Nombre</Label><Input required value={formData.name} onChange={e=>handleChange('name', e.target.value)} /></div>
          <div className="space-y-2"><Label>Email</Label><Input type="email" required value={formData.email} onChange={e=>handleChange('email', e.target.value)} /></div>
          <div className="space-y-2">
            <Label>Rol</Label>
            <Select value={formData.role} onValueChange={v=>handleChange('role', v)}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="Dueño">Dueño</SelectItem>
                <SelectItem value="Auxiliar">Auxiliar</SelectItem>
                <SelectItem value="Solo lectura">Solo lectura</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(!user || formData.password !== undefined) && (
            <>
              <div className="space-y-2"><Label>Contraseña {user && '(Opcional)'}</Label><Input type="password" required={!user} value={formData.password} onChange={e=>handleChange('password', e.target.value)} /></div>
              <div className="space-y-2"><Label>Confirmar Contraseña</Label><Input type="password" required={!user} value={formData.passwordConfirm} onChange={e=>handleChange('passwordConfirm', e.target.value)} /></div>
            </>
          )}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminUserFormModal;
