import React, { useState, useEffect } from 'react';
import EventLayout from '@/components/EventLayout';
import { motion } from 'framer-motion';
import { HeartHandshake, Plus, Edit, Trash2, Search, Eye, MoreVertical, Filter as FilterIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MeetingForm from '@/components/event/MeetingForm';
import MeetingDetailModal from '@/components/event/MeetingDetailModal';
import { participantTypes } from '@/components/event/ParticipantForm';


const EventMeetings = () => {
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

  useEffect(() => {
    const storedEventMeetings = JSON.parse(localStorage.getItem('eventMeetings') || '{}');
    const eventMeetingsData = storedEventMeetings[eventId] || [];
    setMeetings(eventMeetingsData);

    const storedEventParticipants = JSON.parse(localStorage.getItem('eventParticipants') || '{}');
    const eventParticipantsData = storedEventParticipants[eventId] || [];
    setAllParticipants(eventParticipantsData);
    setEligibleParticipants(eventParticipantsData.filter(p => ['exhibitor', 'investor'].includes(p.type)));
    
    setIsLoading(false);
  }, [eventId]);

  useEffect(() => {
    if (!isLoading) {
      const storedEventMeetings = JSON.parse(localStorage.getItem('eventMeetings') || '{}');
      storedEventMeetings[eventId] = meetings;
      localStorage.setItem('eventMeetings', JSON.stringify(storedEventMeetings));
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
    const titleMatch = m.title.toLowerCase().includes(searchTerm.toLowerCase());
    const p1Match = m.participant1Name.toLowerCase().includes(searchTerm.toLowerCase());
    const p2Match = m.participant2Name.toLowerCase().includes(searchTerm.toLowerCase());
    const locationMatch = m.location ? m.location.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const matchesSearch = titleMatch || p1Match || p2Match || locationMatch;
    const matchesDate = dateFilter === '' || m.date === dateFilter;
    return matchesSearch && matchesDate;
  }).sort((a,b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));

  const getParticipantDisplay = (name, type) => {
    const role = type === 'exhibitor' ? 'Exposant' : (type === 'investor' ? 'Investisseur' : '');
    return (
        <>
            {name}
            {role && <span className="text-xs text-muted-foreground ml-1">({role})</span>}
        </>
    );
  };


  return (
    <EventLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Rendez-vous</h2>
            <p className="text-muted-foreground">
              Gérez les rendez-vous entre exposants et investisseurs.
            </p>
          </div>
          <Button onClick={handleAddMeeting} className="sm:w-auto w-full" disabled={eligibleParticipants.length < 2}>
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
            <Input
              placeholder="Rechercher par titre, participant, lieu..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-auto sm:min-w-[200px]">
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full"
            />
          </div>
           {(searchTerm || dateFilter) && (
            <Button variant="ghost" onClick={() => { setSearchTerm(''); setDateFilter('');}} className="w-full sm:w-auto">
              <FilterIcon className="mr-2 h-4 w-4" /> Effacer filtres
            </Button>
          )}
        </div>


        {isLoading ? (
          <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
        ) : filteredMeetings.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-card shadow-sm rounded-lg border overflow-x-auto"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[180px] text-card-foreground">Objet</TableHead>
                  <TableHead className="min-w-[180px] text-card-foreground">Exposant</TableHead>
                  <TableHead className="min-w-[180px] text-card-foreground">Investisseur</TableHead>
                  <TableHead className="hidden md:table-cell min-w-[150px] text-card-foreground">Date & Heure</TableHead>
                  <TableHead className="hidden lg:table-cell min-w-[120px] text-card-foreground">Lieu</TableHead>
                  <TableHead className="text-right min-w-[100px] text-card-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMeetings.map(meeting => {
                  const exposant = meeting.participant1Type === 'exhibitor' ? meeting.participant1Name : (meeting.participant2Type === 'exhibitor' ? meeting.participant2Name : 'N/A');
                  const investisseur = meeting.participant1Type === 'investor' ? meeting.participant1Name : (meeting.participant2Type === 'investor' ? meeting.participant2Name : 'N/A');
                  return (
                    <TableRow key={meeting.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium py-3 text-card-foreground" onClick={() => handleViewMeeting(meeting)}>{meeting.title}</TableCell>
                      <TableCell className="text-muted-foreground" onClick={() => handleViewMeeting(meeting)}>
                        {exposant}
                      </TableCell>
                      <TableCell className="text-muted-foreground" onClick={() => handleViewMeeting(meeting)}>
                        {investisseur}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground" onClick={() => handleViewMeeting(meeting)}>
                        {new Date(meeting.date).toLocaleDateString('fr-FR')} à {meeting.time}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground" onClick={() => handleViewMeeting(meeting)}>{meeting.location || 'N/A'}</TableCell>
                      <TableCell className="text-right py-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewMeeting(meeting)}>
                              <Eye className="mr-2 h-4 w-4 text-muted-foreground" /> Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditMeeting(meeting)} disabled={eligibleParticipants.length < 2}>
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
                                  <AlertDTitle className="text-foreground">Annuler "{meeting.title}"?</AlertDTitle>
                                  <AlertDesc className="text-muted-foreground">Cette action est irréversible.</AlertDesc>
                                </AlertDHeader>
                                <AlertDFooter>
                                  <AlertDialogCancel>Non</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteMeeting(meeting.id)} className="bg-destructive hover:bg-destructive/90">Oui, annuler</AlertDialogAction>
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
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <HeartHandshake className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-card-foreground">Aucun rendez-vous trouvé</h3>
            <p className="text-muted-foreground mt-1">
              {searchTerm || dateFilter ? "Aucun RDV ne correspond à vos filtres." : "Commencez par planifier des rendez-vous."}
            </p>
            {eligibleParticipants.length >= 2 && 
                <Button onClick={handleAddMeeting} className="mt-4">
                <Plus className="mr-2 h-4 w-4" /> Planifier un rendez-vous
                </Button>
            }
          </div>
        )}
      </div>

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
    </EventLayout>
  );
};

export default EventMeetings;