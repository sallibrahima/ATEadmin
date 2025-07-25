import React, { useState, useEffect } from 'react';
import EventLayout from '@/components/EventLayout';
import { motion } from 'framer-motion';
import { ScanLine, BadgeCheck as TicketCheck, Ticket as TicketX, Search, ListFilter, UserCircle, Clock } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { Select, SelectOption } from '@/components/ui/select';

const EventScannedTickets = () => {
  const { eventId } = useParams();
  const { toast } = useToast();
  const [scannedTickets, setScannedTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // 'valid', 'invalid', ''

  // Simuler des données de tickets pour l'événement
  const mockEventTickets = [
    { id: 'ticket001', participantName: 'Alice Dupont', type: 'VIP', scanTime: new Date(Date.now() - 3600000).toISOString(), status: 'valid' },
    { id: 'ticket002', participantName: 'Bob Martin', type: 'Standard', scanTime: new Date(Date.now() - 7200000).toISOString(), status: 'valid' },
    { id: 'ticket003', participantName: 'Charlie Durand', type: 'Étudiant', scanTime: new Date(Date.now() - 10800000).toISOString(), status: 'invalid' },
    { id: 'ticket004', participantName: 'Diana Moreau', type: 'VIP', scanTime: new Date(Date.now() - 14400000).toISOString(), status: 'valid' },
  ];

  useEffect(() => {
    const storedScanned = JSON.parse(localStorage.getItem('eventScannedTickets') || '{}');
    let eventScans = storedScanned[eventId];

    if (!eventScans || eventScans.length === 0) {
      // Si pas de données, utiliser les mocks et les stocker
      eventScans = mockEventTickets.map(t => ({...t, eventId}));
      storedScanned[eventId] = eventScans;
      localStorage.setItem('eventScannedTickets', JSON.stringify(storedScanned));
    }
    
    setScannedTickets(eventScans);
    setIsLoading(false);
  }, [eventId]);

  // Pas de CRUD pour cette page, c'est principalement de la consultation
  // Une fonction de scan réelle nécessiterait une caméra et une logique de validation de code QR/barcode

  const filteredScans = scannedTickets.filter(scan => {
    const matchesSearch = scan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          scan.participantName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || scan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <EventLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Tickets scannés</h2>
            <p className="text-muted-foreground">
              Suivez les entrées et les tickets scannés pour cet événement.
            </p>
          </div>
          {/* Un bouton de scan pourrait être ici, mais la fonctionnalité de scan n'est pas implémentable en frontend seul */}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par ID de ticket ou nom..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-[180px]">
            <Select value={statusFilter} onValueChange={setStatusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <SelectOption value="">Tous les statuts</SelectOption>
              <SelectOption value="valid">Valide</SelectOption>
              <SelectOption value="invalid">Invalide</SelectOption>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
        ) : filteredScans.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-sm rounded-lg border"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Ticket</TableHead>
                  <TableHead>Participant</TableHead>
                  <TableHead>Type Ticket</TableHead>
                  <TableHead>Heure Scan</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredScans.map(scan => (
                  <TableRow key={scan.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-xs">{scan.id}</TableCell>
                    <TableCell className="font-medium flex items-center">
                      <UserCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                      {scan.participantName}
                    </TableCell>
                    <TableCell>{scan.type}</TableCell>
                    <TableCell className="flex items-center">
                       <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                       {new Date(scan.scanTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={scan.status === 'valid' ? 'default' : 'destructive'} className="items-center">
                        {scan.status === 'valid' ? <TicketCheck className="h-3 w-3 mr-1" /> : <TicketX className="h-3 w-3 mr-1" />}
                        {scan.status === 'valid' ? 'Valide' : 'Invalide'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center bg-white rounded-lg border shadow-sm p-6">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <ScanLine className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium">Aucun ticket scanné</h3>
            <p className="text-muted-foreground mt-1">
              {searchTerm || statusFilter ? "Aucun scan ne correspond à vos filtres." : "Aucun ticket n'a encore été scanné pour cet événement."}
            </p>
          </div>
        )}
      </div>
    </EventLayout>
  );
};

export default EventScannedTickets;