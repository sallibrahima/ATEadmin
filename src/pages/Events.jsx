import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter as FilterIcon, X, Calendar, Edit, Trash2, Eye, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectOption } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import EventForm from '@/components/EventForm';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

const Events = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const initialEvents = [
    {
      id: '1',
      title: 'Afrinov Tech Summit 2025',
      date: '2025-05-12',
      endDate: '2025-05-14',
      location: 'Dakar, Sénégal',
      description: 'Le plus grand événement tech d\'Afrique de l\'Ouest.',
      category: 'conference',
      capacity: 500,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: '2',
      title: 'Workshop IA & Big Data',
      date: '2024-06-18',
      endDate: '2024-06-18',
      location: 'Abidjan, Côte d\'Ivoire',
      description: 'Atelier pratique sur l\'IA et le Big Data.',
      category: 'workshop',
      capacity: 100,
      image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: '3',
      title: 'Hackathon Blockchain',
      date: '2025-07-25',
      endDate: '2025-07-27',
      location: 'Lagos, Nigeria',
      description: 'Hackathon de 48 heures sur la blockchain.',
      category: 'hackathon',
      capacity: 200,
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
    },
     {
      id: '4',
      title: 'Conférence Cybersécurité',
      date: '2024-03-10',
      endDate: '2024-03-11',
      location: 'Nairobi, Kenya',
      description: 'Les enjeux de la cybersécurité en Afrique.',
      category: 'conference',
      capacity: 300,
      statusUpdate: 'Annulé', 
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2074&q=80'
    }
  ];

  //Ajouter pour recuperer le slug (titre de l'évenement pour facilité lien formulaire d'inscription)

  const slugify = (str) => 
  str
    .toLowerCase()
    .normalize("NFD")                 // Remove accents
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-')     // Replace non-alphanum with hyphens
    .replace(/^-+|-+$/g, '');        // Remove leading/trailing hyphens


  //Fin code ajouter

  const getEventStatus = (event) => {
    if (event.statusUpdate) return event.statusUpdate;
    const today = new Date();
    const startDate = new Date(event.date);
    const endDate = event.endDate ? new Date(event.endDate) : startDate;
    today.setHours(0,0,0,0);
    startDate.setHours(0,0,0,0);
    endDate.setHours(0,0,0,0);

    if (today >= startDate && today <= endDate) return 'En cours';
    if (today < startDate) return 'À venir';
    if (today > endDate) return 'Terminé';
    return 'Planifié'; 
  };

  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    let loadedEvents;
    if (storedEvents) {
      loadedEvents = JSON.parse(storedEvents);
    } else {
      loadedEvents = initialEvents;
      localStorage.setItem('events', JSON.stringify(initialEvents));
    }
    setEvents(loadedEvents.map(e => ({...e, status: getEventStatus(e)})));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('events', JSON.stringify(events.map(e => {
        const {status, ...eventToStore} = e; 
        return eventToStore;
      })));
    }
  }, [events, isLoading]);

  const handleAddEvent = () => {
    setCurrentEvent(null);
    setIsFormDialogOpen(true);
  };

  const handleEditEvent = (event) => {
    setCurrentEvent(event);
    setIsFormDialogOpen(true);
  };

  const handleDeleteEvent = (id) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
    toast({
      title: "Événement supprimé",
      description: "L'événement a été supprimé avec succès.",
    });
  };

  const handleSubmitEvent = (formData) => {
    let updatedEvents;
    if (currentEvent) {
      updatedEvents = events.map(event =>
        event.id === currentEvent.id ? { ...currentEvent, ...formData, status: getEventStatus({...currentEvent, ...formData}) } : event
      );
      toast({ title: "Événement mis à jour" });
    } else {
      const newEvent = {
        ...formData,
        id: Date.now().toString(),
      };
      newEvent.status = getEventStatus(newEvent);
      updatedEvents = [...events, newEvent];
      toast({ title: "Événement créé" });
    }
    setEvents(updatedEvents);
    setIsFormDialogOpen(false);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setStatusFilter('');
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === '' || event.category === categoryFilter;
    const matchesStatus = statusFilter === '' || event.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'À venir': return 'warning';
      case 'En cours': return 'success';
      case 'Terminé': return 'outline';
      case 'Annulé': return 'destructive';
      default: return 'default';
    }
  };
  
  const categoryMap = {
    conference: "Conférence",
    workshop: "Atelier",
    hackathon: "Hackathon",
    networking: "Networking",
    exhibition: "Exposition",
    seminar: "Séminaire",
    webinar: "Webinaire"
  };

  const statusOptions = ['À venir', 'En cours', 'Terminé', 'Annulé'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Événements</h2>
          <p className="text-muted-foreground">
            Gérez tous vos événements technologiques.
          </p>
        </div>
        <Button onClick={handleAddEvent} className="w-full md:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Ajouter un événement
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative sm:col-span-2 lg:col-span-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par titre ou lieu..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <SelectOption value="">Toutes les catégories</SelectOption>
          {Object.entries(categoryMap).map(([key, value]) => (
            <SelectOption key={key} value={key}>{value}</SelectOption>
          ))}
        </Select>
        
        <Select value={statusFilter} onValueChange={setStatusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <SelectOption value="">Tous les statuts</SelectOption>
          {statusOptions.map(status => (
            <SelectOption key={status} value={status}>{status}</SelectOption>
          ))}
        </Select>
        
        {(searchTerm || categoryFilter || statusFilter) && (
          <Button variant="ghost" onClick={handleClearFilters} className="sm:col-span-2 lg:col-span-4">
            <X className="mr-2 h-4 w-4" /> Effacer les filtres
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredEvents.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-card shadow-sm rounded-lg border overflow-x-auto"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px] text-card-foreground">Titre</TableHead>
                <TableHead className="min-w-[120px] text-card-foreground">Date</TableHead>
                <TableHead className="hidden md:table-cell min-w-[150px] text-card-foreground">Lieu</TableHead>
                <TableHead className="hidden lg:table-cell min-w-[120px] text-card-foreground">Catégorie</TableHead>
                <TableHead className="hidden lg:table-cell min-w-[80px] text-card-foreground">Capacité</TableHead>
                <TableHead className="min-w-[100px] text-card-foreground">Statut</TableHead>
                <TableHead className="text-right min-w-[100px] text-card-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map(event => (
                <TableRow 
                  key={event.id} 
                  className="hover:bg-muted/50"
                >
                  <TableCell className="font-medium py-3 text-card-foreground" onClick={() => navigate(`/events/${event.id}`)}>{event.title}</TableCell>
                  <TableCell onClick={() => navigate(`/events/${event.id}`)} className="text-muted-foreground">{new Date(event.date).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground" onClick={() => navigate(`/events/${event.id}`)}>{event.location}</TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground" onClick={() => navigate(`/events/${event.id}`)}>{categoryMap[event.category] || event.category}</TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground" onClick={() => navigate(`/events/${event.id}`)}>{event.capacity}</TableCell>
                  <TableCell onClick={() => navigate(`/events/${event.id}`)}>
                    <Badge variant={getStatusBadgeVariant(event.status)} className="whitespace-nowrap">{event.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right py-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/events/${event.id}`)}>
                          <Eye className="mr-2 h-4 w-4 text-muted-foreground" /> Voir
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditEvent(event)}>
                          <Edit className="mr-2 h-4 w-4 text-muted-foreground" /> Modifier
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                             <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                               <Trash2 className="mr-2 h-4 w-4" /> 
                               <span>Supprimer</span>
                             </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer "{event.title}"?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteEvent(event.id)} className="bg-destructive hover:bg-destructive/90">Supprimer</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center bg-card rounded-lg border shadow-sm p-6">
          <div className="rounded-full bg-primary/10 p-3 mb-4">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-card-foreground">Aucun événement trouvé</h3>
          <p className="text-muted-foreground mt-1">
            {searchTerm || categoryFilter || statusFilter
              ? "Aucun événement ne correspond à vos critères." 
              : "Commencez par ajouter votre premier événement."}
          </p>
          {(searchTerm || categoryFilter || statusFilter) && (
            <Button variant="outline" onClick={handleClearFilters} className="mt-4">
              Effacer les filtres
            </Button>
          )}
           {!searchTerm && !categoryFilter && !statusFilter && (
             <Button onClick={handleAddEvent} className="mt-4">
                <Plus className="mr-2 h-4 w-4" /> Ajouter un événement
            </Button>
           )}
        </div>
      )}

      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {currentEvent ? "Modifier l'événement" : "Ajouter un nouvel événement"}
            </DialogTitle>
          </DialogHeader>
          <EventForm
            event={currentEvent}
            onSubmit={handleSubmitEvent}
            onCancel={() => setIsFormDialogOpen(false)}
            categoryMap={categoryMap}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Events;