import React from 'react';
import QRCode from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Users as UsersIcon, Briefcase, Landmark, Tv, HeartHandshake as PartnerIcon, CalendarDays } from 'lucide-react';
import { participantTypes } from '@/components/event/ParticipantForm';


const ParticipantDetailModal = ({ participant, isOpen, onClose, eventName }) => {
  if (!participant) return null;

  const ParticipantIcon = participantTypes[participant.type]?.icon || UsersIcon;
  const qrValue = JSON.stringify({
    participantId: participant.id,
    name: participant.name,
    email: participant.email,
    eventName: eventName,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl text-foreground">Détails du Participant</DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-3 gap-0">
          <div className="md:col-span-2 p-6 space-y-4 border-b md:border-b-0 md:border-r text-foreground">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={`https://avatar.vercel.sh/${participant.email}.png?size=80`} alt={participant.name} />
                <AvatarFallback>{participant.name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{participant.name}</h3>
                <p className="text-sm text-muted-foreground">{participant.email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start">
                <ParticipantIcon className="h-4 w-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                <div>
                  <span className="font-medium">Type:</span> {participantTypes[participant.type]?.label || participant.type}
                </div>
              </div>
              {participant.organization && (
                <div className="flex items-start">
                  <Briefcase className="h-4 w-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                  <div>
                    <span className="font-medium">Organisation:</span> {participant.organization}
                  </div>
                </div>
              )}
              <div className="flex items-start">
                <CalendarDays className="h-4 w-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                <div>
                  <span className="font-medium">Inscrit le:</span> {new Date(participant.registrationDate).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>
             <div className="pt-4">
                <h4 className="font-semibold mb-2">Informations supplémentaires</h4>
                <p className="text-sm text-muted-foreground">
                    {participant.name} est inscrit(e) en tant que {participantTypes[participant.type]?.label.toLowerCase()}
                    {participant.organization ? ` de ${participant.organization}` : ''} pour l'événement {eventName}.
                </p>
            </div>
          </div>
          <div className="md:col-span-1 bg-muted/30 p-6 flex flex-col items-center justify-center space-y-4">
            <h4 className="text-lg font-semibold text-center text-foreground">Pass Événement</h4>
            <div className="bg-white p-3 rounded-lg shadow-md">
              <QRCode value={qrValue} size={160} level="H" bgColor="#FFFFFF" fgColor="#000000" />
            </div>
            <p className="text-xs text-muted-foreground text-center">Scannez ce code à l'entrée.</p>
            <Button onClick={() => alert('Impression du pass... (simulation)')} className="w-full">Imprimer le Pass</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipantDetailModal;