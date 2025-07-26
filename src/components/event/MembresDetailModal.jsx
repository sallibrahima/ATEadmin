import React from 'react';
import QRCode from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { CalendarDays, Mail, Phone, MapPin } from 'lucide-react';

const MembresDetailModal = ({ member, isOpen, onClose, organisationName }) => {
  if (!member) return null;

  const qrValue = JSON.stringify({
    memberId: member.id,
    name: member.name,
    email: member.email,
    organisation: organisationName,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl text-foreground">Détails du Membre</DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-3 gap-0">
          <div className="md:col-span-2 p-6 space-y-4 border-b md:border-b-0 md:border-r text-foreground">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={`https://avatar.vercel.sh/${member.email}.png?size=80`} alt={member.name} />
                <AvatarFallback>{member.name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start">
                <Phone className="h-4 w-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                <div>
                  <span className="font-medium">Téléphone:</span> {member.phone || 'Non renseigné'}
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                <div>
                  <span className="font-medium">Adresse:</span> {member.address || 'Non renseignée'}
                </div>
              </div>
  
            </div>

            <div className="pt-4">
              <h4 className="font-semibold mb-2">Informations supplémentaires</h4>
              <p className="text-sm text-muted-foreground">
                {member.name} est membre de l’organisation {organisationName || 'Non précisée'}.
              </p>
            </div>
          </div>

          <div className="md:col-span-1 bg-muted/30 p-6 flex flex-col items-center justify-center space-y-4">
            <h4 className="text-lg font-semibold text-center text-foreground">Pass Événement</h4>
            <div className="bg-white p-3 rounded-lg shadow-md">
              <QRCode value={qrValue} size={160} level="H" bgColor="#FFFFFF" fgColor="#000000" />
            </div>
            <p className="text-xs text-muted-foreground text-center">Scannez ce code pour vérifier ce membre.</p>
            <Button onClick={() => alert('Impression de la carte... (simulation)')} className="w-full">
              Imprimer le Pass
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MembresDetailModal;
