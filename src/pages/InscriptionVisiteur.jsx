import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const InscriptionVisiteur = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    profession: '',
    pays: 'gn',
    telephone: '',
    adresse: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value, country) => {
    setFormData({
      ...formData,
      telephone: value,
      pays: country.countryCode, // Ex: "gn" pour Guinée
    });
  };

  // Génère un ticketId simple unique
  const generateTicketId = () => {
    return 'AFR-' + Date.now();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const ticketId = generateTicketId();

    // Stocker dans localStorage en format attendu par ticketpage
    localStorage.setItem('visitorRegistration', JSON.stringify({
      ticketId,
      firstName: formData.prenom,
      lastName: formData.nom,
      email: formData.email,
      profession: formData.profession,
      phone: formData.telephone,
      address: formData.adresse,
    }));

    toast({
      title: "Inscription réussie",
      description: "Merci pour votre inscription !",
    });

    navigate('/ticket');
  };

  const logoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/450ab5d6-6205-4dde-ae91-ca6c3511d636/dd327866bb331639858978fd3fbe5173.png";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-purple-700 to-indigo-800 flex flex-col justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card shadow-2xl rounded-xl p-8 md:p-10">
          <div className="flex justify-center mb-8">
            <img src={logoUrl} alt="Afrinov Tech Expo Logo" className="h-12 object-contain" />
          </div>

          <h1 className="text-3xl font-bold text-center text-foreground mb-2">Inscription Visiteur</h1>
          <p className="text-muted-foreground text-center mb-8">
            Remplissez le formulaire pour obtenir votre Pass.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prenom" className="text-foreground">Prénom</Label>
              <Input
                id="prenom"
                name="prenom"
                type="text"
                value={formData.prenom}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nom" className="text-foreground">Nom</Label>
              <Input
                id="nom"
                name="nom"
                type="text"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Adresse Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profession" className="text-foreground">Profession</Label>
              <Input
                id="profession"
                name="profession"
                type="text"
                value={formData.profession}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telephone" className="text-foreground">Téléphone</Label>
              <PhoneInput
                country={'gn'}
                value={formData.telephone}
                onChange={handlePhoneChange}
                inputProps={{
                  name: 'telephone',
                  required: true,
                }}
                countryCodeEditable={false}
                containerClass="w-full"
                inputClass="!w-full !bg-background !text-foreground"
                buttonClass="!bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adresse" className="text-foreground">Ville / Adresse</Label>
              <Input
                id="adresse"
                name="adresse"
                type="text"
                value={formData.adresse}
                onChange={handleChange}
                required
              />
            </div>

            <br />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base">
              S'inscrire
            </Button>
          </form>

          <br />
        </div>

        <p className="mt-6 text-center text-xs text-white/70">
          &copy; {new Date().getFullYear()} Afrinov Tech Expo. Tous droits réservés.
        </p>
      </motion.div>
    </div>
  );
};

export default InscriptionVisiteur;
