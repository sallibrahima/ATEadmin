import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectOption } from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';

const EventForm = ({ event, onSubmit, onCancel, categoryMap }) => {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    date: event?.date || '',
    endDate: event?.endDate || '',
    location: event?.location || '',
    description: event?.description || '',
    category: event?.category || 'conference',
    capacity: event?.capacity || '',
    image: event?.image || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="title">Titre de l'événement</Label>
        <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="date">Date de début</Label>
          <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="endDate">Date de fin (optionnel)</Label>
          <Input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleChange} min={formData.date} />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="location">Lieu</Label>
        <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="category">Catégorie</Label>
          <Select id="category" name="category" value={formData.category} onValueChange={handleCategoryChange} onChange={(e) => handleCategoryChange(e.target.value)} required>
            {Object.entries(categoryMap).map(([key, value]) => (
              <SelectOption key={key} value={key}>{value}</SelectOption>
            ))}
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="capacity">Capacité (max participants)</Label>
          <Input id="capacity" name="capacity" type="number" value={formData.capacity} onChange={handleChange} required />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="image">URL de l'image de couverture</Label>
        <Input id="image" name="image" type="url" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" />
      </div>
      <DialogFooter className="pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit">{event ? 'Mettre à jour' : 'Créer l\'événement'}</Button>
      </DialogFooter>
    </form>
  );
};

export default EventForm;