import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';

const MembresForm = ({ member, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: member?.name || '',
    email: member?.email || '',
    phone: member?.phone || '',
    address: member?.address || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="name">Nom et prénom</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
      </div>

      <div className="space-y-1">
        <Label htmlFor="phone">Téléphone</Label>
        <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
      </div>

      <div className="space-y-1">
        <Label htmlFor="address">Adresse</Label>
        <Input id="address" name="address" value={formData.address} onChange={handleChange} />
      </div>

      <DialogFooter className="pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {member ? 'Mettre à jour' : 'Ajouter le membre'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default MembresForm;
