import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

const Sponsors = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h2 className="text-3xl font-bold tracking-tight">Sponsors</h2>
        <p className="text-muted-foreground">
          Cette section est en cours de développement. Revenez bientôt pour gérer vos sponsors.
        </p>
      </div>

      <motion.div 
        className="flex flex-col items-center justify-center h-64 text-center bg-white rounded-lg border shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="rounded-full bg-primary/10 p-3 mb-4">
          <Briefcase className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium">Gestion des sponsors</h3>
        <p className="text-muted-foreground mt-1 max-w-md">
          Cette fonctionnalité sera bientôt disponible. Vous pourrez ajouter, modifier et gérer les sponsors de vos événements.
        </p>
      </motion.div>
    </div>
  );
};

export default Sponsors;