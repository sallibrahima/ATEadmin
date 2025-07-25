import React, { useState, useEffect } from 'react';
import EventLayout from '@/components/EventLayout';
import { motion } from 'framer-motion';
import { Ticket as TicketIcon, Plus, Edit, Trash2, DollarSign, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useParams } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter as AlertDFooter,
  AlertDialogHeader as AlertDHeader,
  AlertDialogTitle as AlertDTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from '@/components/ui/textarea';

const TicketForm = ({ ticket, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: ticket?.name || '',
    price: ticket?.price || '',
    quantity: ticket?.quantity || '',
    description: ticket?.description || '',
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
        <Label htmlFor="name">Nom du ticket</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="price">Prix (USD)</Label>
          <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="quantity">Quantité disponible</Label>
          <Input id="quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} required />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="description">Description (avantages, etc.)</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit">{ticket ? 'Mettre à jour' : 'Ajouter le ticket'}</Button>
      </DialogFooter>
    </form>
  );
};

const EventTickets = () => {
  const { eventId } = useParams();
  const { toast } = useToast();
  const [tickets, setTickets] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedEventTickets = JSON.parse(localStorage.getItem('eventTickets') || '{}');
    const eventTicketsData = storedEventTickets[eventId] || [];
    setTickets(eventTicketsData);
    setIsLoading(false);
  }, [eventId]);

  useEffect(() => {
    if (!isLoading) {
      const storedEventTickets = JSON.parse(localStorage.getItem('eventTickets') || '{}');
      storedEventTickets[eventId] = tickets;
      localStorage.setItem('eventTickets', JSON.stringify(storedEventTickets));
    }
  }, [tickets, eventId, isLoading]);

  const handleAddTicket = () => {
    setCurrentTicket(null);
    setIsDialogOpen(true);
  };

  const handleEditTicket = (ticket) => {
    setCurrentTicket(ticket);
    setIsDialogOpen(true);
  };

  const handleDeleteTicket = (id) => {
    setTickets(tickets.filter(t => t.id !== id));
    toast({ title: "Ticket supprimé", description: "Le type de ticket a été supprimé." });
  };

  const handleSubmitTicket = (formData) => {
    if (currentTicket) {
      setTickets(tickets.map(t => t.id === currentTicket.id ? { ...formData, id: t.id } : t));
      toast({ title: "Ticket mis à jour", description: "Les informations du ticket ont été modifiées." });
    } else {
      setTickets([...tickets, { ...formData, id: Date.now().toString() }]);
      toast({ title: "Ticket ajouté", description: "Le nouveau type de ticket a été ajouté." });
    }
    setIsDialogOpen(false);
  };

  return (
    <EventLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Gestion des tickets</h2>
            <p className="text-muted-foreground">
              Gérez les différents types de tickets et leurs ventes.
            </p>
          </div>
          <Button onClick={handleAddTicket} className="sm:w-auto w-full">
            <Plus className="mr-2 h-4 w-4" /> Ajouter un type de ticket
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
        ) : tickets.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tickets.map(ticket => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-xl transition-shadow flex flex-col justify-between text-card-foreground"
              >
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-2">{ticket.name}</h3>
                  <div className="flex items-center text-muted-foreground text-sm mb-1">
                    <DollarSign className="h-4 w-4 mr-1" /> Prix: {Number(ticket.price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </div>
                  <div className="flex items-center text-muted-foreground text-sm mb-3">
                    <Users className="h-4 w-4 mr-1" /> Quantité: {ticket.quantity}
                  </div>
                  {ticket.description && <p className="text-sm text-muted-foreground mb-4">{ticket.description}</p>}
                </div>
                <div className="flex gap-2 mt-auto pt-4 border-t">
                  <Button variant="outline" size="sm" onClick={() => handleEditTicket(ticket)} className="flex-1">
                    <Edit className="h-3 w-3 mr-1" /> Modifier
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="flex-1">
                        <Trash2 className="h-3 w-3 mr-1" /> Supprimer
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDHeader>
                        <AlertDTitle>Supprimer le ticket "{ticket.name}"?</AlertDTitle>
                        <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
                      </AlertDHeader>
                      <AlertDFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteTicket(ticket.id)} className="bg-destructive hover:bg-destructive/90">Supprimer</AlertDialogAction>
                      </AlertDFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center bg-card rounded-lg border shadow-sm p-6">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <TicketIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-card-foreground">Aucun type de ticket configuré</h3>
            <p className="text-muted-foreground mt-1">Commencez par ajouter des types de tickets pour votre événement.</p>
            <Button onClick={handleAddTicket} className="mt-4">
              <Plus className="mr-2 h-4 w-4" /> Ajouter un ticket
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-foreground">{currentTicket ? 'Modifier le type de ticket' : 'Ajouter un nouveau type de ticket'}</DialogTitle>
          </DialogHeader>
          <TicketForm ticket={currentTicket} onSubmit={handleSubmitTicket} onCancel={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </EventLayout>
  );
};

export default EventTickets;