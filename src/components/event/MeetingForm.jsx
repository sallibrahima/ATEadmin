import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectOption } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

const MeetingForm = ({ isOpen, onClose, meeting, participants, onSubmit }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    participant1Id: '',
    participant2Id: '',
    date: '',
    time: '',
    location: '',
    notes: '',
  });
  const [participant1Type, setParticipant1Type] = useState('');
  const [participant2Type, setParticipant2Type] = useState('');

  useEffect(() => {
    if (meeting) {
      setFormData({
        title: meeting.title || '',
        participant1Id: meeting.participant1Id || '',
        participant2Id: meeting.participant2Id || '',
        date: meeting.date || '',
        time: meeting.time || '',
        location: meeting.location || '',
        notes: meeting.notes || '',
      });
      const p1 = participants.find(p => p.id === meeting.participant1Id);
      const p2 = participants.find(p => p.id === meeting.participant2Id);
      setParticipant1Type(p1?.type || '');
      setParticipant2Type(p2?.type || '');
    } else {
      setFormData({
        title: '', participant1Id: '', participant2Id: '',
        date: '', time: '', location: '', notes: '',
      });
      setParticipant1Type('');
      setParticipant2Type('');
    }
  }, [meeting, participants, isOpen]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleParticipantChange = (name, value) => {
    const selectedParticipant = participants.find(p => p.id === value);
    if (name === "participant1Id") {
        setParticipant1Type(selectedParticipant?.type || '');
    } else if (name === "participant2Id") {
        setParticipant2Type(selectedParticipant?.type || '');
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.participant1Id && formData.participant2Id && formData.participant1Id === formData.participant2Id) {
        toast({ title: "Erreur", description: "Un participant ne peut pas avoir un rendez-vous avec lui-même.", variant: "destructive" });
        return;
    }
    if (participant1Type === participant2Type && participant1Type !== '' && participant2Type !== '') {
        toast({ title: "Erreur", description: "Les deux participants ne peuvent pas avoir le même rôle (Exposant/Investisseur).", variant: "destructive" });
        return;
    }
    onSubmit(formData);
  };
  
  const availableParticipantsForP2 = participants.filter(p => {
    if (!formData.participant1Id) return true;
    if (p.id === formData.participant1Id) return false;
    if (participant1Type && p.type === participant1Type) return false; 
    return true;
  });
  
  const availableParticipantsForP1 = participants.filter(p => {
    if (!formData.participant2Id) return true;
    if (p.id === formData.participant2Id) return false;
    if (participant2Type && p.type === participant2Type) return false; 
    return true;
  });


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle className="text-foreground">{meeting ? 'Modifier le rendez-vous' : 'Planifier un nouveau rendez-vous'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-1">
                <Label htmlFor="title">Objet du rendez-vous</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="participant1Id">Exposant/Investisseur 1</Label>
                  <Select id="participant1Id" name="participant1Id" value={formData.participant1Id} onValueChange={(val) => handleParticipantChange("participant1Id", val)} onChange={(e) => handleParticipantChange("participant1Id", e.target.value)} required>
                    <SelectOption value="">Sélectionner...</SelectOption>
                    {availableParticipantsForP1.map(p => <SelectOption key={p.id} value={p.id}>{p.name} ({p.type === 'exhibitor' ? 'Exposant' : 'Investisseur'})</SelectOption>)}
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="participant2Id">Exposant/Investisseur 2</Label>
                  <Select id="participant2Id" name="participant2Id" value={formData.participant2Id} onValueChange={(val) => handleParticipantChange("participant2Id", val)} onChange={(e) => handleParticipantChange("participant2Id", e.target.value)} required>
                    <SelectOption value="">Sélectionner...</SelectOption>
                    {availableParticipantsForP2.map(p => <SelectOption key={p.id} value={p.id}>{p.name} ({p.type === 'exhibitor' ? 'Exposant' : 'Investisseur'})</SelectOption>)}
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="time">Heure</Label>
                  <Input id="time" name="time" type="time" value={formData.time} onChange={handleChange} required />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="location">Lieu</Label>
                <Input id="location" name="location" value={formData.location} onChange={handleChange} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} />
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
                <Button type="submit">{meeting ? 'Mettre à jour' : 'Planifier'}</Button>
              </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
  );
};

export default MeetingForm;