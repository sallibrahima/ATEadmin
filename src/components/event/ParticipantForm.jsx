import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectOption } from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import { Users as UsersIcon, Briefcase, Landmark, Tv, HeartHandshake as PartnerIcon } from 'lucide-react';

export const participantTypes = {
  visitor: { label: 'Visiteur', icon: UsersIcon },
  exhibitor: { label: 'Exposant', icon: Briefcase },
  investor: { label: 'Investisseur', icon: Landmark },
  media: { label: 'Média', icon: Tv },
  partner: { label: 'Partenaire', icon: PartnerIcon },
};

const ParticipantForm = ({ participant, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: participant?.name || '',
    email: participant?.email || '',
    type: participant?.type || 'visitor',
    organization: participant?.organization || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTypeChange = (value) => {
    setFormData(prev => ({ ...prev, type: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="name">Nom complet</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="type">Type de participant</Label>
        <Select id="type" name="type" value={formData.type} onValueChange={handleTypeChange} onChange={(e) => handleTypeChange(e.target.value)} required>
          {Object.entries(participantTypes).map(([key, { label }]) => (
            <SelectOption key={key} value={key}>{label}</SelectOption>
          ))}
        </Select>
      </div>
      <div className="space-y-1">
        <Label htmlFor="organization">Organisation (si applicable)</Label>
        <Input id="organization" name="organization" value={formData.organization} onChange={handleChange} />
      </div>
      <DialogFooter className="pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit">{participant ? 'Mettre à jour' : 'Ajouter le participant'}</Button>
      </DialogFooter>
    </form>
  );
};

export default ParticipantForm;