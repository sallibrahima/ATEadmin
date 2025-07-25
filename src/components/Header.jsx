import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = ({ toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Tableau de bord';
    if (path.startsWith('/events/')) {
        const parts = path.split('/');
        const eventSubPage = parts[3];
        if (!eventSubPage || parts.length === 3) return 'Tableau de bord Événement';
        if (eventSubPage === 'program') return 'Programme';
        if (eventSubPage === 'tickets') return 'Tickets';
        if (eventSubPage === 'participants') return 'Participants';
        if (eventSubPage === 'meetings') return 'Rendez-vous';
        if (eventSubPage === 'scanned-tickets') return 'Tickets Scannés';
        if (eventSubPage === 'report') return 'Rapport d\'événement';
        return 'Gestion d\'événement';
    }
    if (path === '/events') return 'Événements';
    if (path === '/users') return 'Utilisateurs';
    if (path === '/reports') return 'Rapports';
    if (path === '/settings') return 'Paramètres';
    return 'Afrinov Tech Expo';
  };
  
  const notifications = [
    { id: 1, text: "Nouvel événement 'TechConf 2025' ajouté.", time: "Il y a 5 minutes" },
    { id: 2, text: "Rapport mensuel disponible.", time: "Il y a 1 heure" },
    { id: 3, text: "Maintenance prévue ce soir à 23h.", time: "Il y a 3 heures" },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      
      <motion.h1 
        className="text-lg sm:text-xl font-semibold"
        key={location.pathname}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {getPageTitle()}
      </motion.h1>
      
      <div className="ml-auto flex items-center gap-2 md:gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher..."
            className="rounded-md border border-input bg-background pl-8 pr-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-40 lg:w-64"
          />
        </div>
        
        <DropdownMenu onOpenChange={setShowNotifications} open={showNotifications}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive animate-pulse"></span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              notifications.map(notif => (
                <DropdownMenuItem key={notif.id} className="flex flex-col items-start">
                  <p className="text-sm">{notif.text}</p>
                  <p className="text-xs text-muted-foreground">{notif.time}</p>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>Aucune nouvelle notification</DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center">
              Voir toutes les notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://avatar.vercel.sh/${user?.email || 'default'}.png`} alt={user?.name || 'User'} />
                <AvatarFallback>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name || 'Utilisateur'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || 'email@example.com'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <SettingsIcon className="mr-2 h-4 w-4" />
              <span>Paramètres</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;