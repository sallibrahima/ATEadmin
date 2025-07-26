import React, { useState, useEffect } from 'react';
// import EventLayout from '@/components/EventLayout'; ← supprimé
import { motion } from 'framer-motion';
import {
  HeartHandshake, Plus, Edit, Trash2, Search, Eye, MoreVertical, Filter as FilterIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useParams } from 'react-router-dom';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription as AlertDesc,
  AlertDialogFooter as AlertDFooter,
  AlertDialogHeader as AlertDHeader,
  AlertDialogTitle as AlertDTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MeetingForm from '@/components/event/MeetingForm';
import MeetingDetailModal from '@/components/event/MeetingDetailModal';

const RendezVousOrganisateur = () => {
  const { eventId } = useParams();
  const { toast } = useToast();
  const [meetings, setMeetings] = useState([]);
  const [allParticipants, setAllParticipants] = useState([]);
  const [eligibleParticipants, setEligibleParticipants] = useState([]);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [currentMeeting, setCurrentMeeting] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Chargement des données
  useEffect(() => {
    const storedMeetings = JSON.parse(localStorage.getItem('organizerMeetings') || '{}');
    const meetingsData = storedMeetings[eventId] || [];
    setMeetings(meetingsData);

    const storedParticipants = JSON.parse(localStorage.getItem('eventParticipants') || '{}');
    const participants = storedParticipants[eventId] || [];
    setAllParticipants(participants);
    setEligibleParticipants(participants.filter(p => ['exhibitor', 'investor'].includes(p.type)));

    setIsLoading(false);
  }, [eventId]);

  // Sauvegarde des données
  useEffect(() => {
    if (!isLoading) {
      const stored = JSON.parse(localStorage.getItem('organizerMeetings') || '{}');
      stored[eventId] = meetings;
      localStorage.setItem('organizerMeetings', JSON.stringify(stored));
    }
  }, [meetings, eventId, isLoading]);

  const handleAddMeeting = () => {
    setCurrentMeeting(null);
    setIsFormDialogOpen(true);
  };

  const handleEditMeeting = (meeting) => {
    setCurrentMeeting(meeting);
    setIsFormDialogOpen(true);
  };

  const handleViewMeeting = (meeting) => {
    setSelectedMeeting(meeting);
    setIsDetailModalOpen(true);
  };

  const handleDeleteMeeting = (id) => {
    setMeetings(meetings.filter(m => m.id !== id));
    toast({ title: "Rendez-vous annulé", description: "Le rendez-vous a été supprimé." });
  };

  const handleSubmitMeeting = (formData) => {
    const p1 = eligibleParticipants.find(p => p.id === formData.participant1Id);
    const p2 = eligibleParticipants.find(p => p.id === formData.participant2Id);

    const meetingData = {
      ...formData,
      participant1Name: p1?.name || 'N/A',
      participant1Type: p1?.type || 'N/A',
      participant2Name: p2?.name || 'N/A',
      participant2Type: p2?.type || 'N/A'
    };

    if (currentMeeting) {
      setMeetings(meetings.map(m => m.id === currentMeeting.id ? { ...meetingData, id: m.id } : m));
      toast({ title: "Rendez-vous mis à jour" });
    } else {
      setMeetings([...meetings, { ...meetingData, id: Date.now().toString() }]);
      toast({ title: "Rendez-vous planifié" });
    }
    setIsFormDialogOpen(false);
  };

  const filteredMeetings = meetings.filter(m => {
    const matches = (text) => text?.toLowerCase().includes(searchTerm.toLowerCase());
    return (
      (matches(m.title) || matches(m.participant1Name) || matches(m.participant2Name) || matches(m.location)) &&
      (!dateFilter || m.date === dateFilter)
    );
  }).sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Rendez-vous</h2>
          <p className="text-muted-foreground">Gérez les rendez-vous entre exposants et investisseurs.</p>
        </div>
        <Button onClick={handleAddMeeting} disabled={eligibleParticipants.length < 2}>
          <Plus className="mr-2 h-4 w-4" /> Planifier
        </Button>
      </div>

      {eligibleParticipants.length < 2 && !isLoading && (
        <p className="text-sm text-destructive text-center bg-destructive/10 p-3 rounded-md">
          Vous avez besoin d'au moins un exposant et un investisseur pour planifier un rendez-vous.
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-full sm:w-auto" />
        {(searchTerm || dateFilter) && (
          <Button variant="ghost" onClick={() => { setSearchTerm(''); setDateFilter(''); }}>
            <FilterIcon className="mr-2 h-4 w-4" /> Effacer filtres
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      ) : filteredMeetings.length > 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="bg-card shadow-sm rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Objet</TableHead>
                <TableHead>Exposant</TableHead>
                <TableHead>Investisseur</TableHead>
                <TableHead className="hidden md:table-cell">Date & Heure</TableHead>
                <TableHead className="hidden lg:table-cell">Lieu</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMeetings.map(m => {
                const exposant = m.participant1Type === 'exhibitor' ? m.participant1Name : m.participant2Name;
                const investisseur = m.participant1Type === 'investor' ? m.participant1Name : m.participant2Name;
                return (
                  <TableRow key={m.id}>
                    <TableCell onClick={() => handleViewMeeting(m)}>{m.title}</TableCell>
                    <TableCell onClick={() => handleViewMeeting(m)}>{exposant}</TableCell>
                    <TableCell onClick={() => handleViewMeeting(m)}>{investisseur}</TableCell>
                    <TableCell className="hidden md:table-cell" onClick={() => handleViewMeeting(m)}>
                      {new Date(m.date).toLocaleDateString('fr-FR')} à {m.time}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell" onClick={() => handleViewMeeting(m)}>{m.location || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewMeeting(m)}><Eye className="mr-2 h-4 w-4" /> Voir</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditMeeting(m)} disabled={eligibleParticipants.length < 2}><Edit className="mr-2 h-4 w-4" /> Modifier</DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDHeader>
                                <AlertDTitle>Confirmer la suppression</AlertDTitle>
                                <AlertDesc>Cette action est irréversible.</AlertDesc>
                              </AlertDHeader>
                              <AlertDFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteMeeting(m.id)} className="bg-destructive">Supprimer</AlertDialogAction>
                              </AlertDFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center bg-card rounded-lg border shadow-sm p-6">
          <HeartHandshake className="h-6 w-6 text-primary mb-4" />
          <h3 className="text-lg font-medium">Aucun rendez-vous</h3>
          <p className="text-muted-foreground">Commencez par en planifier un.</p>
          <Button onClick={handleAddMeeting} className="mt-4" disabled={eligibleParticipants.length < 2}>
            <Plus className="mr-2 h-4 w-4" /> Planifier un rendez-vous
          </Button>
        </div>
      )}

      <MeetingForm
        isOpen={isFormDialogOpen}
        onClose={() => setIsFormDialogOpen(false)}
        meeting={currentMeeting}
        participants={eligibleParticipants}
        onSubmit={handleSubmitMeeting}
      />

      <MeetingDetailModal
        meeting={selectedMeeting}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        participantsList={allParticipants}
      />
    </div>
  );
};

export default RendezVousOrganisateur;
