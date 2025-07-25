import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarDays,
  Users2,
  CalendarCheck,
  CreditCard,
  FileText,
  ChevronLeft,
  LogOut,
  Settings,
  BarChart,
  Building
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const getSidebarItems = (role) => {

    // Rôle "organisateur"
    if (role === 'organisateur') {
      return [
        { icon: LayoutDashboard, label: 'Tableau de bord', path: '/' },
        { icon: Building, label: 'Mon organisation', path: '/events' },
        { icon: Users2, label: 'Membres', path: '/MembresOrganisation' },
        { icon: CalendarCheck, label: 'Rendez-vous', path: '/RendezVousOrganisateur' },
        { icon: CreditCard, label: 'Facture et Paiement', path: '/billing' },
        { icon: FileText, label: 'Documents utiles', path: '/documents' },
      ];
    }

    // Rôle "admin" par défaut
    return [
      { icon: LayoutDashboard, label: 'Tableau de bord', path: '/' },
      { icon: CalendarDays, label: 'Événements', path: '/events' },
      { icon: Users2, label: 'Utilisateurs', path: '/users' },
      { icon: BarChart, label: 'Rapports', path: '/reports' },
      { icon: Settings, label: 'Paramètres', path: '/settings' },
    ];
  };

  const sidebarItems = getSidebarItems(user?.role);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarVariants = {
    open: { width: '240px', transition: { duration: 0.3 } },
    closed: { width: '72px', transition: { duration: 0.3 } }
  };

  const logoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/450ab5d6-6205-4dde-ae91-ca6c3511d636/dd327866bb331639858978fd3fbe5173.png";

  return (
    <AnimatePresence initial={false}>
      <motion.aside
        className="bg-card border-r shadow-sm z-40 h-full flex flex-col"
        initial={isOpen ? 'open' : 'closed'}
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
      >
        <div className="flex items-center justify-between p-4 border-b h-16">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="logo-large"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <img src={logoUrl} alt="Afrinov Tech Expo Logo" className="h-8 object-contain" />
              </motion.div>
            ) : (
              <motion.div
                key="logo-small"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center w-full"
              >
                <img src={logoUrl} alt="Afrinov Tech Expo Logo Small" className="h-7 object-contain" />
              </motion.div>
            )}
          </AnimatePresence>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden md:flex">
            <ChevronLeft className={cn("h-5 w-5 transition-transform", !isOpen && "rotate-180")} />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "sidebar-item text-muted-foreground flex items-center gap-3 px-3 py-2 rounded-md",
                      location.pathname === item.path && "active bg-primary text-primary-foreground"
                    )}
                  >
                    <Icon className="sidebar-item-icon h-5 w-5" />
                    <AnimatePresence mode="wait">
                      {isOpen && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto border-t p-2">
          <button
            onClick={handleLogout}
            className={cn(
              "sidebar-item w-full flex items-center gap-3 text-muted-foreground px-3 py-2 rounded-md hover:bg-destructive hover:text-destructive-foreground",
              !isOpen && "justify-center"
            )}
          >
            <LogOut className="sidebar-item-icon h-5 w-5" />
            <AnimatePresence mode="wait">
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="whitespace-nowrap"
                >
                  Déconnexion
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};

export default Sidebar;
