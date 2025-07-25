import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart as BarChartLucide, Calendar, DollarSign, Users, Activity, TrendingUp, PieChart as PieChartLucide, Users2 } from 'lucide-react';
import { Select, SelectOption } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

const Reports = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const initialEvents = [
    { id: '1', title: 'Afrinov Tech Summit 2025', capacity: 500 },
    { id: '2', title: 'Workshop IA & Big Data', capacity: 100 },
    { id: '3', title: 'Hackathon Blockchain pour Impact Social', capacity: 200 },
    { id: '4', title: 'Networking Tech Entrepreneurs', capacity: 150 },
  ];

  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    let currentEvents = initialEvents;
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents);
      if (parsedEvents.length > 0) {
        currentEvents = parsedEvents.map(e => ({ id: e.id, title: e.title, capacity: e.capacity }));
      }
    }
    setEvents(currentEvents);
    if (currentEvents.length > 0) {
      setSelectedEventId(currentEvents[0].id);
    }
    setIsLoading(false);
  }, []);
  
  useEffect(() => {
    if (selectedEventId) {
      setIsLoading(true);
      setTimeout(() => {
        const eventDetails = events.find(e => e.id === selectedEventId);
        const capacity = eventDetails?.capacity || 500;
        const participants = Math.floor(Math.random() * capacity);
        const revenue = Math.floor(Math.random() * 5000000) + 1000000; // FCFA
        const engagementRate = Math.floor(Math.random() * 70) + 30;
        
        const dailyAttendance = Array.from({length: 5}, (_, i) => ({
          name: `Jour ${i+1}`,
          participants: Math.floor(Math.random() * (participants / 3)) + Math.floor(participants / 5)
        }));

        const ticketTypesData = [
          { name: 'Standard', value: Math.floor(Math.random() * 60) + 20 },
          { name: 'VIP', value: Math.floor(Math.random() * 30) + 10 },
          { name: 'Étudiant', value: Math.floor(Math.random() * 20) + 5 },
        ];
        
        setReportData({
          eventName: eventDetails?.title || 'N/A',
          participants,
          capacity,
          revenue,
          engagementRate,
          dailyAttendance,
          ticketTypes: ticketTypesData,
          topSessions: [
            { name: 'Keynote d\'ouverture', attendees: Math.floor(Math.random() * (participants*0.8)) + Math.floor(participants*0.2) },
            { name: 'Panel sur l\'IA', attendees: Math.floor(Math.random() * (participants*0.6)) + Math.floor(participants*0.1) },
            { name: 'Atelier Fintech', attendees: Math.floor(Math.random() * (participants*0.4)) + Math.floor(participants*0.1) },
          ],
        });
        setIsLoading(false);
      }, 500);
    } else {
      setReportData(null);
    }
  }, [selectedEventId, events]);

  const handleEventChange = (value) => {
    setSelectedEventId(value);
  };

  const statCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };
  
  const COLORS = ['#6366F1', '#EC4899', '#10B981', '#F59E0B'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Rapports Généraux</h2>
          <p className="text-muted-foreground">
            Consultez les statistiques et analyses de vos événements.
          </p>
        </div>
        <div className="w-full sm:w-[300px]">
          <Label htmlFor="event-select" className="sr-only">Sélectionner un événement</Label>
          <Select 
            id="event-select"
            value={selectedEventId} 
            onValueChange={handleEventChange}
            onChange={(e) => handleEventChange(e.target.value)}
          >
            {events.length === 0 && !isLoading && <SelectOption value="" disabled>Aucun événement disponible</SelectOption>}
            {events.map(event => (
              <SelectOption key={event.id} value={event.id}>{event.title}</SelectOption>
            ))}
          </Select>
        </div>
      </div>

      {isLoading && selectedEventId && (
         <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
      )}

      {!isLoading && reportData && (
        <motion.div 
          variants={statCardVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <h3 className="text-2xl font-semibold">Rapport pour : {reportData.eventName}</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Participants', value: reportData.participants, subtext: `sur ${reportData.capacity} places`, icon: Users2 },
              { title: 'Revenus générés', value: `${reportData.revenue.toLocaleString('fr-FR')} FCFA`, subtext: 'Ventes de tickets', icon: DollarSign },
              { title: 'Taux d\'engagement', value: `${reportData.engagementRate}%`, subtext: 'Participation active', icon: Activity },
              { title: 'Tickets vendus', value: reportData.ticketTypes.reduce((sum, t) => sum + t.value, 0), subtext: 'Tous types confondus', icon: TrendingUp },
            ].map((item, idx) => (
              <motion.div variants={itemVariants} key={idx}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{item.value}</div>
                    <p className="text-xs text-muted-foreground">{item.subtext}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Participation Journalière</CardTitle>
                  <CardDescription>Nombre de participants par jour de l'événement.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reportData.dailyAttendance}>
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`}/>
                      <Tooltip wrapperClassName="!bg-background !border-border !shadow-lg" cursor={{fill: 'hsl(var(--muted))'}}/>
                      <Legend iconType="circle" />
                      <Bar dataKey="participants" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Participants"/>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Répartition des Types de Tickets</CardTitle>
                  <CardDescription>Pourcentage des ventes par type de ticket.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie data={reportData.ticketTypes} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" labelLine={false}
                        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                          const RADIAN = Math.PI / 180;
                          const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                          const x = cx + radius * Math.cos(-midAngle * RADIAN);
                          const y = cy + radius * Math.sin(-midAngle * RADIAN);
                          return (
                            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
                              {`${(percent * 100).toFixed(0)}%`}
                            </text>
                          );
                        }}
                      >
                        {reportData.ticketTypes.map((entry, index) => (
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
          </div>
           <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Sessions les plus populaires</CardTitle>
                   <CardDescription>Nombre de participants par session.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {reportData.topSessions.sort((a,b) => b.attendees - a.attendees).map(session => (
                       <li key={session.name} className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50">
                         <span className="text-sm">{session.name}</span>
                         <Badge variant="secondary">{session.attendees} participants</Badge>
                       </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
        </motion.div>
      )}
      
      {!isLoading && !selectedEventId && events.length > 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center bg-white rounded-lg border shadow-sm p-6">
          <div className="rounded-full bg-primary/10 p-3 mb-4">
            <BarChartLucide className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium">Sélectionnez un événement</h3>
          <p className="text-muted-foreground mt-1 max-w-md">
            Choisissez un événement dans la liste déroulante ci-dessus pour afficher son rapport.
          </p>
        </div>
      )}

       {!isLoading && events.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center bg-white rounded-lg border shadow-sm p-6">
          <div className="rounded-full bg-primary/10 p-3 mb-4">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium">Aucun événement à afficher</h3>
          <p className="text-muted-foreground mt-1 max-w-md">
            Créez des événements pour pouvoir générer des rapports.
          </p>
        </div>
      )}
    </div>
  );
};

export default Reports;