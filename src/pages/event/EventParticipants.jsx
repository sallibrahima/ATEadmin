import React, { useState, useEffect } from 'react';
import EventLayout from '@/components/EventLayout';
import { motion } from 'framer-motion';
import { Users as UsersIcon, Plus, Edit, Trash2, Search, Eye, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectOption } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useParams } from 'react-router-dom';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription as AlertDesc,
  AlertDialogFooter as AlertDFooter,
  AlertDialogHeader as AlertDHeader,
  AlertDialogTitle as AlertDTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ParticipantForm, { participantTypes } from '@/components/event/ParticipantForm';
import ParticipantDetailModal from '@/components/event/ParticipantDetailModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const EventParticipants = () => {
  const { eventId } = useParams();
  const { toast } = useToast();
  const [participants, setParticipants] = useState([]);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [currentParticipant, setCurrentParticipant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [eventName, setEventName] = useState('');

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
    const currentEventDetails = storedEvents.find(e => e.id === eventId);
    if (currentEventDetails) {
      setEventName(currentEventDetails.title);
    }

    const storedEventParticipants = JSON.parse(localStorage.getItem('eventParticipants') || '{}');
    const eventParticipantsData = storedEventParticipants[eventId] || [];
    setParticipants(eventParticipantsData);
    setIsLoading(false);
  }, [eventId]);

  useEffect(() => {
    if (!isLoading) {
      const storedEventParticipants = JSON.parse(localStorage.getItem('eventParticipants') || '{}');
      storedEventParticipants[eventId] = participants;
      localStorage.setItem('eventParticipants', JSON.stringify(storedEventParticipants));
    }
  }, [participants, eventId, isLoading]);

  const handleAddParticipant = () => {
    setCurrentParticipant(null);
    setIsFormDialogOpen(true);
  };

  const handleEditParticipant = (participant) => {
    setCurrentParticipant(participant);
    setIsFormDialogOpen(true);
  };
  
  const handleViewParticipant = (participant) => {
    setSelectedParticipant(participant);
    setIsDetailModalOpen(true);
  };

  const handleDeleteParticipant = (id) => {
    setParticipants(participants.filter(p => p.id !== id));
    toast({ title: "Participant supprimé", description: "Le participant a été retiré de la liste." });
  };

  const handleSubmitParticipant = (formData) => {
    if (currentParticipant) {
      setParticipants(participants.map(p => p.id === currentParticipant.id ? { ...formData, id: p.id, registrationDate: p.registrationDate } : p));
      toast({ title: "Participant mis à jour", description: "Les informations du participant ont été modifiées." });
    } else {
      setParticipants([...participants, { ...formData, id: Date.now().toString(), registrationDate: new Date().toISOString() }]);
      toast({ title: "Participant ajouté", description: "Le nouveau participant a été ajouté." });
    }
    setIsFormDialogOpen(false);
  };

  const filteredParticipants = participants.filter(p => {
    const nameMatch = p.name ? p.name.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const emailMatch = p.email ? p.email.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const orgMatch = p.organization ? p.organization.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const matchesSearch = nameMatch || emailMatch || orgMatch;
    const matchesType = typeFilter === '' || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <EventLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Participants</h2>
            <p className="text-muted-foreground">
              Gérez les participants à votre événement.
            </p>
          </div>
          <Button onClick={handleAddParticipant} className="sm:w-auto w-full">
            <Plus className="mr-2 h-4 w-4" /> Ajouter
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, email, organisation..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-auto sm:min-w-[200px]">
            <Select value={typeFilter} onValueChange={setTypeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <SelectOption value="">Tous les types</SelectOption>
              {Object.entries(participantTypes).map(([key, { label }]) => (
                <SelectOption key={key} value={key}>{label}</SelectOption>
              ))}
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
        ) : filteredParticipants.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-card shadow-sm rounded-lg border overflow-x-auto"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px] text-card-foreground">Nom</TableHead>
                  <TableHead className="hidden md:table-cell min-w-[200px] text-card-foreground">Email</TableHead>
                  <TableHead className="min-w-[120px] text-card-foreground">Type</TableHead>
                  <TableHead className="hidden sm:table-cell min-w-[150px] text-card-foreground">Organisation</TableHead>
                  <TableHead className="text-right min-w-[100px] text-card-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParticipants.map(p => (
                  <TableRow key={p.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium py-3 text-card-foreground" onClick={() => handleViewParticipant(p)}>{p.name}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground" onClick={() => handleViewParticipant(p)}>{p.email}</TableCell>
                    <TableCell onClick={() => handleViewParticipant(p)}>
                      <Badge variant={ p.type === "exhibitor" || p.type === "investor" ? "default" : "secondary" } className="flex items-center w-fit text-xs whitespace-nowrap">
                        {React.createElement(participantTypes[p.type]?.icon || UsersIcon, { className: "h-3 w-3 mr-1.5 flex-shrink-0"})}
                        {participantTypes[p.type]?.label || p.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground" onClick={() => handleViewParticipant(p)}>{p.organization || 'N/A'}</TableCell>
                    <TableCell className="text-right py-2">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewParticipant(p)}>
                            <Eye className="mr-2 h-4 w-4 text-muted-foreground" /> Voir détails
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditParticipant(p)}>
                            <Edit className="mr-2 h-4 w-4 text-muted-foreground" /> Modifier
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                               <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                 <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                               </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDHeader>
                                <AlertDTitle className="text-foreground">Supprimer {p.name}?</AlertDTitle>
                                <AlertDesc className="text-muted-foreground">Cette action est irréversible.</AlertDesc>
                              </AlertDHeader>
                              <AlertDFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteParticipant(p.id)} className="bg-destructive hover:bg-destructive/90">Supprimer</AlertDialogAction>
                              </AlertDFooter>
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
              <UsersIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-card-foreground">Aucun participant trouvé</h3>
            <p className="text-muted-foreground mt-1">
              {searchTerm || typeFilter ? "Aucun participant ne correspond à vos filtres." : "Commencez par ajouter des participants."}
            </p>
            <Button onClick={handleAddParticipant} className="mt-4">
              <Plus className="mr-2 h-4 w-4" /> Ajouter un participant
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">{currentParticipant ? 'Modifier le participant' : 'Ajouter un nouveau participant'}</DialogTitle>
          </DialogHeader>
          <ParticipantForm participant={currentParticipant} onSubmit={handleSubmitParticipant} onCancel={() => setIsFormDialogOpen(false)} />
        </DialogContent>
      </Dialog>
      
      <ParticipantDetailModal 
        participant={selectedParticipant} 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)}
        eventName={eventName}
      />

    </EventLayout>
  );
};

export default EventParticipants;