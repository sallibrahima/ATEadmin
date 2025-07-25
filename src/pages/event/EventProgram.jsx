import React, { useState, useEffect } from 'react';
import EventLayout from '@/components/EventLayout';
import { motion } from 'framer-motion';
import { CalendarDays, Plus, Edit, Trash2, Clock, MapPin, Users as UsersIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

const SessionForm = ({ session, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: session?.title || '',
    time: session?.time || '',
    duration: session?.duration || '60',
    location: session?.location || '',
    speaker: session?.speaker || '',
    description: session?.description || '',
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
        <Label htmlFor="title">Titre de la session</Label>
        <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="time">Heure (HH:MM)</Label>
          <Input id="time" name="time" type="time" value={formData.time} onChange={handleChange} required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="duration">Durée (minutes)</Label>
          <Input id="duration" name="duration" type="number" value={formData.duration} onChange={handleChange} required />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="location">Lieu</Label>
        <Input id="location" name="location" value={formData.location} onChange={handleChange} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="speaker">Intervenant(s)</Label>
        <Input id="speaker" name="speaker" value={formData.speaker} onChange={handleChange} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit">{session ? 'Mettre à jour' : 'Ajouter la session'}</Button>
      </DialogFooter>
    </form>
  );
};


const EventProgram = () => {
  const { eventId } = useParams();
  const { toast } = useToast();
  const [sessions, setSessions] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedPrograms = JSON.parse(localStorage.getItem('eventPrograms') || '{}');
    const eventProgram = storedPrograms[eventId] || [];
    setSessions(eventProgram);
    setIsLoading(false);
  }, [eventId]);

  useEffect(() => {
    if (!isLoading) {
      const storedPrograms = JSON.parse(localStorage.getItem('eventPrograms') || '{}');
      storedPrograms[eventId] = sessions;
      localStorage.setItem('eventPrograms', JSON.stringify(storedPrograms));
    }
  }, [sessions, eventId, isLoading]);

  const handleAddSession = () => {
    setCurrentSession(null);
    setIsDialogOpen(true);
  };

  const handleEditSession = (session) => {
    setCurrentSession(session);
    setIsDialogOpen(true);
  };

  const handleDeleteSession = (id) => {
    setSessions(sessions.filter(s => s.id !== id));
    toast({ title: "Session supprimée", description: "La session a été retirée du programme." });
  };

  const handleSubmitSession = (formData) => {
    if (currentSession) {
      setSessions(sessions.map(s => s.id === currentSession.id ? { ...formData, id: s.id } : s));
      toast({ title: "Session mise à jour", description: "La session a été modifiée." });
    } else {
      setSessions([...sessions, { ...formData, id: Date.now().toString() }]);
      toast({ title: "Session ajoutée", description: "La nouvelle session a été ajoutée au programme." });
    }
    setIsDialogOpen(false);
  };
  
  const groupSessionsByTime = (sessionList) => {
    return sessionList.sort((a,b) => a.time.localeCompare(b.time))
    .reduce((acc, session) => {
      const timeKey = session.time;
      if (!acc[timeKey]) {
        acc[timeKey] = [];
      }
      acc[timeKey].push(session);
      return acc;
    }, {});
  };

  const groupedSessions = groupSessionsByTime(sessions);


  return (
    <EventLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Programme de l'événement</h2>
            <p className="text-muted-foreground">
              Gérez le programme et les sessions de votre événement.
            </p>
          </div>
          <Button onClick={handleAddSession} className="sm:w-auto w-full">
            <Plus className="mr-2 h-4 w-4" /> Ajouter une session
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
        ) : Object.keys(groupedSessions).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedSessions).map(([time, timeSessions]) => (
              <div key={time}>
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-primary" /> {time}
                </h3>
                <div className="space-y-4">
                {timeSessions.map(session => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-semibold text-primary">{session.title}</h4>
                        <p className="text-sm text-muted-foreground">Durée: {session.duration} min</p>
                        {session.location && <p className="text-sm text-muted-foreground flex items-center"><MapPin className="mr-1 h-3 w-3" /> {session.location}</p>}
                        {session.speaker && <p className="text-sm text-muted-foreground flex items-center"><UsersIcon className="mr-1 h-3 w-3" /> {session.speaker}</p>}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditSession(session)}><Edit className="h-4 w-4" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDHeader>
                              <AlertDTitle>Supprimer la session "{session.title}"?</AlertDTitle>
                              <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
                            </AlertDHeader>
                            <AlertDFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteSession(session.id)}>Supprimer</AlertDialogAction>
                            </AlertDFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    {session.description && <p className="mt-2 text-sm">{session.description}</p>}
                  </motion.div>
                ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center bg-white rounded-lg border shadow-sm p-6">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <CalendarDays className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium">Aucune session programmée</h3>
            <p className="text-muted-foreground mt-1">Commencez par ajouter des sessions à votre événement.</p>
            <Button onClick={handleAddSession} className="mt-4">
              <Plus className="mr-2 h-4 w-4" /> Ajouter une session
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentSession ? 'Modifier la session' : 'Ajouter une nouvelle session'}</DialogTitle>
          </DialogHeader>
          <SessionForm session={currentSession} onSubmit={handleSubmitSession} onCancel={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </EventLayout>
  );
};

export default EventProgram;