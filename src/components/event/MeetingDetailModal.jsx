import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Users as UsersIcon } from 'lucide-react';
import { participantTypes } from '@/components/event/ParticipantForm';

const MeetingDetailModal = ({ meeting, isOpen, onClose, participantsList }) => {
  if (!meeting) return null;

  const getParticipantDetails = (id) => participantsList.find(p => p.id === id);
  const p1 = getParticipantDetails(meeting.participant1Id);
  const p2 = getParticipantDetails(meeting.participant2Id);
  
  const getParticipantRoleForMeeting = (participant) => {
     if (!participant) return 'Participant';
     if (participant.type === 'exhibitor') return 'Exposant';
     if (participant.type === 'investor') return 'Investisseur';
     return participantTypes[participant.type]?.label || 'Participant';
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg text-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl">{meeting.title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Détails du rendez-vous planifié.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4 text-sm">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
            <strong>Date & Heure:</strong> <span className="ml-1">{new Date(meeting.date).toLocaleDateString('fr-FR')} à {meeting.time}</span>
          </div>
          {meeting.location && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
              <strong>Lieu:</strong> <span className="ml-1">{meeting.location}</span>
            </div>
          )}
          <div className="pt-2">
            <h4 className="font-semibold mb-2 text-md">Participants</h4>
            <div className="grid grid-cols-1 gap-3">
                <div className="bg-muted/50 p-3 rounded-md">
                    <p className="font-medium text-primary">{getParticipantRoleForMeeting(p1)}</p>
                    <p>{p1?.name || meeting.participant1Name}</p>
                    {p1?.organization && <p className="text-xs text-muted-foreground">{p1.organization}</p>}
                </div>
                 <div className="bg-muted/50 p-3 rounded-md">
                    <p className="font-medium text-primary">{getParticipantRoleForMeeting(p2)}</p>
                    <p>{p2?.name || meeting.participant2Name}</p>
                    {p2?.organization && <p className="text-xs text-muted-foreground">{p2.organization}</p>}
                </div>
            </div>
          </div>
          {meeting.notes && (
            <div className="pt-2">
              <h4 className="font-semibold mb-1">Notes:</h4>
              <p className="bg-muted/50 p-2 rounded text-xs">{meeting.notes}</p>
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>Fermer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingDetailModal;