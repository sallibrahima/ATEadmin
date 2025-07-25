import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Save, Bell, Palette, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectOption } from '@/components/ui/select';

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    appName: 'Afrinov Tech Expo',
    notifications: {
      email: true,
      push: false,
    },
    theme: 'system',
    dateFormat: 'DD/MM/YYYY',
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const storedSettings = localStorage.getItem('appSettings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('notifications.')) {
      const key = name.split('.')[1];
      setSettings(prev => ({
        ...prev,
        notifications: { ...prev.notifications, [key]: type === 'checkbox' ? checked : value }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };
  
  const handleSwitchChange = (checked, name) => {
     if (name.startsWith('notifications.')) {
      const key = name.split('.')[1];
      setSettings(prev => ({
        ...prev,
        notifications: { ...prev.notifications, [key]: checked }
      }));
    }
  };


  const handleSaveSettings = (tabName) => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    toast({
      title: "Paramètres sauvegardés",
      description: `Les paramètres de ${tabName} ont été enregistrés avec succès.`,
    });
  };
  
  const handleChangePassword = () => {
    if(newPassword === '' || confirmPassword === '') {
      toast({ title: "Erreur", description: "Veuillez remplir les deux champs de mot de passe.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas.", variant: "destructive" });
      return;
    }
    // Ici, vous intégreriez la logique de changement de mot de passe avec votre backend
    console.log("Nouveau mot de passe (simulé):", newPassword);
    toast({ title: "Mot de passe modifié", description: "Votre mot de passe a été modifié avec succès." });
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h2 className="text-3xl font-bold tracking-tight">Paramètres</h2>
        <p className="text-muted-foreground">
          Configurez les préférences de votre application.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-3">
          <TabsTrigger value="general"><SettingsIcon className="mr-2 h-4 w-4 inline-block sm:hidden md:inline-block" />Général</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4 inline-block sm:hidden md:inline-block" />Notifications</TabsTrigger>
          {/* <TabsTrigger value="appearance"><Palette className="mr-2 h-4 w-4 inline-block sm:hidden md:inline-block" />Apparence</TabsTrigger> */}
          <TabsTrigger value="security"><Lock className="mr-2 h-4 w-4 inline-block sm:hidden md:inline-block" />Sécurité</TabsTrigger>
        </TabsList>

        <motion.div initial={{ opacity: 0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration: 0.3 }}>
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres généraux</CardTitle>
                <CardDescription>Gérez les paramètres de base de votre application.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="appName">Nom de l'application</Label>
                  <Input id="appName" name="appName" value={settings.appName} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Format de date</Label>
                  <Select id="dateFormat" name="dateFormat" value={settings.dateFormat} onChange={(e) => handleInputChange({ target: { name: 'dateFormat', value: e.target.value }})}>
                    <SelectOption value="DD/MM/YYYY">DD/MM/YYYY</SelectOption>
                    <SelectOption value="MM/DD/YYYY">MM/DD/YYYY</SelectOption>
                    <SelectOption value="YYYY-MM-DD">YYYY-MM-DD</SelectOption>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleSaveSettings('généraux')}><Save className="mr-2 h-4 w-4" />Sauvegarder</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Gérez vos préférences de notification.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between space-x-2 p-2 rounded-md border">
                  <Label htmlFor="emailNotifications" className="flex flex-col space-y-1">
                    <span>Notifications par email</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                      Recevoir des mises à jour importantes par email.
                    </span>
                  </Label>
                  <Switch 
                    id="emailNotifications" 
                    name="notifications.email"
                    checked={settings.notifications.email} 
                    onCheckedChange={(checked) => handleSwitchChange(checked, "notifications.email")}
                  />
                </div>
                <div className="flex items-center justify-between space-x-2 p-2 rounded-md border">
                  <Label htmlFor="pushNotifications" className="flex flex-col space-y-1">
                    <span>Notifications push</span>
                     <span className="font-normal leading-snug text-muted-foreground">
                      Recevoir des notifications push pour les alertes. (Indisponible)
                    </span>
                  </Label>
                  <Switch 
                    id="pushNotifications" 
                    name="notifications.push"
                    checked={settings.notifications.push} 
                    onCheckedChange={(checked) => handleSwitchChange(checked, "notifications.push")}
                    disabled 
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleSaveSettings('notifications')}><Save className="mr-2 h-4 w-4" />Sauvegarder</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Sécurité</CardTitle>
                <CardDescription>Gérez les paramètres de sécurité de votre compte.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="********" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="********" />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleChangePassword}><Save className="mr-2 h-4 w-4" />Changer le mot de passe</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
};

export default Settings;