import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import EventLayout from '@/components/EventLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { Users, Ticket, CalendarDays, BarChart2, CheckCircle, Clock } from 'lucide-react';

const EventDashboard = () => {
  const { eventId } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [ticketsData, setTicketsData] = useState({ sold: 0, remaining: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchEventData = () => {
      const allEvents = JSON.parse(localStorage.getItem('events') || '[]');
      const currentEvent = allEvents.find(e => e.id === eventId);
      setEventDetails(currentEvent);

      const allParticipants = JSON.parse(localStorage.getItem('eventParticipants') || '{}');
      const eventParticipants = allParticipants[eventId] || [];
      setParticipantsCount(eventParticipants.length);

      const allTickets = JSON.parse(localStorage.getItem('eventTickets') || '{}');
      const eventTickets = allTickets[eventId] || [];
      
      let totalCapacity = 0;
      let soldCount = 0; // This needs actual sales data, for now we simulate based on participants vs capacity
      
      if (eventTickets.length > 0) {
        totalCapacity = eventTickets.reduce((sum, ticket) => sum + (parseInt(ticket.quantity, 10) || 0), 0);
        // Simulate sold tickets for demo. In a real app, this would come from sales records.
        // Let's assume sold tickets are a fraction of total capacity or participants count, whichever is smaller.
        soldCount = Math.min(eventParticipants.length, totalCapacity); 
        // Or, if tickets have 'quantitySold' property:
        // soldCount = eventTickets.reduce((sum, ticket) => sum + (parseInt(ticket.quantitySold, 10) || 0), 0);
      } else if (currentEvent?.capacity) {
        totalCapacity = parseInt(currentEvent.capacity, 10);
        soldCount = Math.min(eventParticipants.length, totalCapacity);
      }


      setTicketsData({
        sold: soldCount,
        total: totalCapacity,
        remaining: Math.max(0, totalCapacity - soldCount),
      });
      
      setIsLoading(false);
    };

    fetchEventData();
  }, [eventId]);

  const getDaysRemaining = () => {
    if (!eventDetails?.date) return 'N/A';
    const today = new Date();
    const eventDate = new Date(eventDetails.date);
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'Passé';
    if (diffDays === 0) return 'Aujourd\'hui';
    return `${diffDays} jours`;
  };

  const statCards = [
    { title: 'Inscriptions', value: participantsCount, icon: Users, subtext: `sur ${ticketsData.total || eventDetails?.capacity || 'N/A'} places` },
    { title: 'Tickets Vendus', value: ticketsData.sold, icon: Ticket, subtext: `${ticketsData.remaining} restants` },
    { title: 'Jours Restants', value: getDaysRemaining(), icon: Clock, subtext: `Événement le ${eventDetails ? new Date(eventDetails.date).toLocaleDateString('fr-FR') : 'N/A'}` },
    { title: 'Sessions Planifiées', value: JSON.parse(localStorage.getItem('eventPrograms') || '{}')[eventId]?.length || 0, icon: CalendarDays, subtext: 'Voir programme' },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 }
    })
  };

  if (isLoading) {
    return (
      <EventLayout>
        <div className="flex justify-center items-center h-[calc(100vh-150px)]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
      </EventLayout>
    );
  }
  
  if (!eventDetails) {
    return (
      <EventLayout>
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold">Événement non trouvé</h2>
          <p className="text-muted-foreground">Impossible de charger les détails de cet événement.</p>
        </div>
      </EventLayout>
    );
  }

  const registrationProgress = ticketsData.total > 0 ? (participantsCount / ticketsData.total) * 100 : 0;
  const ticketSalesProgress = ticketsData.total > 0 ? (ticketsData.sold / ticketsData.total) * 100 : 0;

  return (
    <EventLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tableau de bord: {eventDetails.title}</h2>
          <p className="text-muted-foreground">
            Vue d'ensemble des statistiques et informations importantes.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card, i) => (
            <motion.custom
              key={card.title}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={i}
              className="w-full"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <card.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground">{card.subtext}</p>
                </CardContent>
              </Card>
            </motion.custom>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <motion.custom variants={cardVariants} initial="hidden" animate="visible" custom={4}>
            <Card>
              <CardHeader>
                <CardTitle>Progression des Inscriptions</CardTitle>
                <CardDescription>{participantsCount} participants sur {ticketsData.total || eventDetails?.capacity || 'N/A'} places disponibles.</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={registrationProgress} aria-label={`${registrationProgress.toFixed(0)}% d'inscriptions`} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{registrationProgress.toFixed(0)}%</span>
                  <span>Objectif: {ticketsData.total || eventDetails?.capacity || 'N/A'}</span>
                </div>
              </CardContent>
            </Card>
          </motion.custom>

          <motion.custom variants={cardVariants} initial="hidden" animate="visible" custom={5}>
            <Card>
              <CardHeader>
                <CardTitle>Ventes de Tickets</CardTitle>
                <CardDescription>{ticketsData.sold} tickets vendus sur {ticketsData.total || 'N/A'} disponibles.</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={ticketSalesProgress} aria-label={`${ticketSalesProgress.toFixed(0)}% de tickets vendus`} className="h-3" />
                 <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{ticketSalesProgress.toFixed(0)}%</span>
                  <span>{ticketsData.remaining} restants</span>
                </div>
              </CardContent>
            </Card>
          </motion.custom>
        </div>
        
      </div>
    </EventLayout>
  );
};

export default EventDashboard;