import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectOption } from '@/components/ui/select';

const UserForm = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '', 
    role: user?.role || 'editor',
    status: user?.status || 'active',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRoleChange = (value) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleStatusChange = (value) => {
    setFormData(prev => ({ ...prev, status: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = { ...formData };
    if (!user && !formData.password) { 
      alert("Le mot de passe est requis pour un nouvel utilisateur.");
      return;
    }
    if (user && !formData.password) {
      delete dataToSubmit.password;
    }
    onSubmit(dataToSubmit);
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit} 
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Nom complet</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Nom de l'utilisateur" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email de l'utilisateur" required disabled={!!user} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder={user ? "Laisser vide pour ne pas changer" : "Mot de passe"} required={!user} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="role">Rôle</Label>
          <Select id="role" name="role" value={formData.role} onValueChange={handleRoleChange} onChange={(e) => handleRoleChange(e.target.value)} required>
            <SelectOption value="admin">Administrateur</SelectOption>
            <SelectOption value="editor">Éditeur</SelectOption>
            <SelectOption value="viewer">Lecteur</SelectOption>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select id="status" name="status" value={formData.status} onValueChange={handleStatusChange} onChange={(e) => handleStatusChange(e.target.value)} required>
            <SelectOption value="active">Actif</SelectOption>
            <SelectOption value="inactive">Inactif</SelectOption>
            <SelectOption value="pending">En attente</SelectOption>
          </Select>
        </div>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit">{user ? 'Mettre à jour' : 'Créer l\'utilisateur'}</Button>
      </div>
    </motion.form>
  );
};

export default UserForm;