import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const EventCard = ({ event, onEdit, onDelete }) => {
  const categoryColors = {
    conference: 'bg-secondary text-secondary-foreground',
    workshop: 'bg-green-500/20 text-green-700 dark:text-green-400',
    hackathon: 'bg-purple-500/20 text-purple-700 dark:text-purple-400',
    networking: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    exhibition: 'bg-orange-500/20 text-orange-700 dark:text-orange-400'
  };

  const categoryLabels = {
    conference: 'Conférence',
    workshop: 'Atelier',
    hackathon: 'Hackathon',
    networking: 'Networking',
    exhibition: 'Exposition'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="h-full flex flex-col overflow-hidden bg-card text-card-foreground shadow-lg hover:shadow-xl transition-shadow">
        <div className="relative h-48 overflow-hidden">
          {event.image ? (
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/30 via-primary/50 to-secondary/50 flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-lg opacity-80">Afrinov Tech</span>
            </div>
          )}
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-medium ${categoryColors[event.category] || 'bg-muted text-muted-foreground'}`}>
            {categoryLabels[event.category] || event.category}
          </div>
        </div>
        
        <CardHeader className="pb-2">
          <CardTitle className="line-clamp-2 text-card-foreground">{event.title}</CardTitle>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4 text-primary" />
              <span>{new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <MapPin className="mr-2 h-4 w-4 text-primary" />
              <span>{event.location}</span>
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <Users className="mr-2 h-4 w-4 text-primary" />
              <span>{event.capacity} participants</span>
            </div>
          </div>
          
          <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
            {event.description}
          </p>
        </CardContent>
        
        <CardFooter className="border-t pt-4">
          <div className="flex justify-between w-full">
            <Button variant="outline" size="sm" onClick={() => onEdit(event)}>
              Modifier
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(event.id)}>
              Supprimer
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default EventCard;