import React, { useState, useEffect } from 'react';
import EventLayout from '@/components/EventLayout';
import { motion } from 'framer-motion';
import { BarChart as BarChartLucide, Users, Ticket, ScanLine, DollarSign, TrendingUp, PieChart as PieChartLucideIcon, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useParams } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

const EventReport = () => {
  const { eventId } = useParams();
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Simuler la récupération des données de rapport pour l'événement spécifique
    setTimeout(() => {
      const eventDetails = JSON.parse(localStorage.getItem('events') || '[]').find(e => e.id === eventId);
      const eventParticipants = JSON.parse(localStorage.getItem('eventParticipants') || '{}')[eventId] || [];
      const eventTickets = JSON.parse(localStorage.getItem('eventTickets') || '{}')[eventId] || [];
      const eventScannedTickets = JSON.parse(localStorage.getItem('eventScannedTickets') || '{}')[eventId] || [];
      
      const totalParticipants = eventParticipants.length;
      // Simuler quantitySold si non existant pour la démo
      const eventTicketsWithSales = eventTickets.map(t => ({
        ...t,
        quantitySold: t.quantitySold || Math.floor(Math.random() * (parseInt(t.quantity,10) || 0))
      }));

      const totalTicketsSold = eventTicketsWithSales.reduce((sum, ticket) => sum + (parseInt(ticket.quantitySold, 10) || 0), 0);
      const totalRevenue = eventTicketsWithSales.reduce((sum, ticket) => sum + ( (parseInt(ticket.price, 10) || 0) * (parseInt(ticket.quantitySold, 10) || 0) ), 0);
      const ticketsScannedValid = eventScannedTickets.filter(t => t.status === 'valid').length;

      const participantTypesData = eventParticipants.reduce((acc, p) => {
        acc[p.type] = (acc[p.type] || 0) + 1;
        return acc;
      }, {});
      const participantTypesChart = Object.entries(participantTypesData).map(([name, value]) => ({ name, value }));

      const ticketSalesByType = eventTicketsWithSales.map(ticket => ({
        name: ticket.name,
        sold: parseInt(ticket.quantitySold, 10) || 0
      }));


      setReportData({
        eventName: eventDetails?.title || 'Événement Inconnu',
        totalParticipants,
        totalTicketsSold,
        totalRevenue,
        ticketsScannedValid,
        attendanceRate: totalTicketsSold > 0 ? ((ticketsScannedValid / totalTicketsSold) * 100).toFixed(1) : 0, // Basé sur tickets vendus
        participantTypesChart,
        ticketSalesByType,
      });
      setIsLoading(false);
    }, 700);
  }, [eventId]);

  const statCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const COLORS = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#3B82F6'];

  if (isLoading) {
    return (
      <EventLayout>
        <div className="flex justify-center items-center h-[calc(100vh-150px)]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
      </EventLayout>
    );
  }

  if (!reportData) {
     return (
      <EventLayout>
        <div className="flex flex-col items-center justify-center h-64 text-center bg-white rounded-lg border shadow-sm p-6">
            <BarChartLucide className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold">Données de rapport non disponibles</h3>
            <p className="text-muted-foreground mt-1">Impossible de charger les données pour cet événement.</p>
        </div>
      </EventLayout>
    );
  }


  return (
    <EventLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Rapport pour : {reportData.eventName}</h2>
          <p className="text-muted-foreground">
            Statistiques détaillées de votre événement.
          </p>
        </div>

        <motion.div 
          variants={statCardVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        >
          {[
            { title: 'Participants Inscrits', value: reportData.totalParticipants, icon: Users },
            { title: 'Tickets Vendus', value: reportData.totalTicketsSold, icon: Ticket },
            { title: 'Revenus Totaux', value: `${reportData.totalRevenue.toLocaleString('fr-FR')} FCFA`, icon: DollarSign },
            { title: 'Tickets Scannés (Valides)', value: reportData.ticketsScannedValid, icon: ScanLine },
            { title: 'Taux de Présence', value: `${reportData.attendanceRate}%`, icon: TrendingUp },
          ].map((item, idx) => (
            <motion.div variants={itemVariants} key={idx}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{item.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Répartition des Types de Participants</CardTitle>
                  <CardDescription>Distribution des participants par catégorie.</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie data={reportData.participantTypesChart} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {reportData.participantTypesChart.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip wrapperClassName="!bg-background !border-border !shadow-lg" />
                      <Legend iconType="circle" />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
             <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Ventes de Tickets par Type</CardTitle>
                  <CardDescription>Nombre de tickets vendus pour chaque catégorie.</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reportData.ticketSalesByType} layout="vertical" margin={{ left: 20, right: 20, bottom:5, top:5 }}>
                      <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                      <YAxis type="category" dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={100} interval={0} />
                      <Tooltip wrapperClassName="!bg-background !border-border !shadow-lg" cursor={{fill: 'hsl(var(--muted))'}}/>
                      <Legend iconType="circle" />
                      <Bar dataKey="sold" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Tickets Vendus"/>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
        </div>
      </div>
    </EventLayout>
  );
};

export default EventReport;