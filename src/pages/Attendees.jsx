import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

const Attendees = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h2 className="text-3xl font-bold tracking-tight">Participants</h2>
        <p className="text-muted-foreground">
          Cette section est en cours de développement. Revenez bientôt pour gérer vos participants.
        </p>
      </div>

      <motion.div 
        className="flex flex-col items-center justify-center h-64 text-center bg-white rounded-lg border shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="rounded-full bg-primary/10 p-3 mb-4">
          <Users className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium">Gestion des participants</h3>
        <p className="text-muted-foreground mt-1 max-w-md">
          Cette fonctionnalité sera bientôt disponible. Vous pourrez gérer les inscriptions, les présences et les informations des participants.
        </p>
      </motion.div>
    </div>
  );
};

export default Attendees;