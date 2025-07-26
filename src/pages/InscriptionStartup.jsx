import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const InscriptionStartup = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    pays: 'gn',       // code pays par défaut
    telephone: '',
    email: '',
    profession: '',
    description: '',
    logoFile: null,
  });

  const { toast } = useToast();

  const logoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/450ab5d6-6205-4dde-ae91-ca6c3511d636/dd327866bb331639858978fd3fbe5173.png";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value, country) => {
    setFormData(prev => ({
      ...prev,
      telephone: value,
      pays: country.countryCode,
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, logoFile: file }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Exemple simple d'affichage en console des données + fichier logo
    console.log("Données soumises :", formData);
    if(formData.logoFile) {
      console.log("Logo file:", formData.logoFile);
    }

    toast({
      title: "Inscription réussie",
      description: "Merci pour votre inscription !",
    });
    // Ajouter intégration backend (upload logo + données)
  };

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
          <h1 className="text-3xl font-bold text-center text-foreground mb-2">Inscription Startup</h1>
          <p className="text-muted-foreground text-center mb-8">Remplissez le formulaire pour vous inscrire.</p>

          <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
            <div className="space-y-2">
              <Label htmlFor="nom" className="text-foreground">Nom de votre Startup</Label>
              <Input
                id="nom"
                name="nom"
                type="text"
                value={formData.nom}
                onChange={handleChange}
                required
                className="bg-background border-border focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prenom" className="text-foreground">Secteur d'activité</Label>
              <Input
                id="prenom"
                name="prenom"
                type="text"
                value={formData.prenom}
                onChange={handleChange}
                required
                className="bg-background border-border focus:border-primary"
              />
            </div>

            {/* Champ téléphone avec indicatif pays */}
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
              <Label htmlFor="email" className="text-foreground">Adresse Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-background border-border focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profession" className="text-foreground">Site web / URL page</Label>
              <Input
                id="profession"
                name="profession"
                type="text"
                value={formData.profession}
                onChange={handleChange}
                required
                className="bg-background border-border focus:border-primary"
              />
            </div>

            {/* Nouveau champ description courte */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground">Description courte</Label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-border bg-background p-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

              {/* Upload logo startup */}
              <div className="space-y-2">
                <Label htmlFor="logoFile" className="text-foreground">Logo de la startup</Label>
                <input
                  id="logoFile"
                  name="logoFile"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="w-full rounded-md border border-border bg-background p-2 text-foreground cursor-pointer hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                />
                {formData.logoFile && (
                  <img
                    src={URL.createObjectURL(formData.logoFile)}
                    alt="Aperçu du logo"
                    className="mt-2 max-h-32 object-contain rounded"
                  />
                )}
              </div>

                  <br></br>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base">
              S'inscrire
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Vous avez déjà un compte ? <a href="/login" className="font-medium text-primary hover:underline">Se connecter</a>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-white/70">
          &copy; {new Date().getFullYear()} Afrinov Tech Expo. Tous droits réservés.
        </p>
      </motion.div>
    </div>
  );
};

export default InscriptionStartup;
