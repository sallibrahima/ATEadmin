import React from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, CalendarDays, Ticket, Users, HeartHandshake as Handshake, ScanLine, BarChart, ChevronLeft, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const EventSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { eventId } = useParams();
  const navigate = useNavigate();
  
  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Tableau de bord', path: `/events/${eventId}` },
    { icon: CalendarDays, label: 'Programme', path: `/events/${eventId}/program` },
    { icon: Ticket, label: 'Tickets', path: `/events/${eventId}/tickets` },
    { icon: Ticket, label: 'Speakers', path: `/speakers/${eventId}/speakers` },
    { icon: Users, label: 'Participants', path: `/events/${eventId}/participants` },
    { icon: Ticket, label: 'Invites', path: `/invites/${eventId}/invites` },
    { icon: Handshake, label: 'Business Meets', path: `/events/${eventId}/meetings` },
    { icon: ScanLine, label: 'Tickets scannés', path: `/events/${eventId}/scanned-tickets` },
    { icon: BarChart, label: 'Rapport', path: `/events/${eventId}/report` },
  ];

  const sidebarVariants = {
    open: { width: '240px', transition: { duration: 0.3 } },
    closed: { width: '72px', transition: { duration: 0.3 } }
  };

  return (
    <AnimatePresence initial={false}>
      <motion.aside
        className="bg-card border-r shadow-sm z-10 h-full flex flex-col"
        initial={isOpen ? 'open' : 'closed'}
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
      >
        <div className="flex items-center justify-between p-4 border-b h-16">
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-sm"
                  onClick={() => navigate('/events')}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour
                </Button>
              </motion.div>
            )}
             {!isOpen && (
                 <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => navigate('/events')}
                  aria-label="Retour à la liste des événements"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
            )}
          </AnimatePresence>
          
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden md:flex">
            <ChevronLeft className={cn("h-5 w-5 transition-transform", !isOpen && "rotate-180")} />
          </Button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {sidebarItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "sidebar-item text-muted-foreground",
                    location.pathname === item.path && "active text-primary-foreground"
                  )}
                >
                  <item.icon className="sidebar-item-icon" />
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
            ))}
          </ul>
        </nav>
      </motion.aside>
    </AnimatePresence>
  );
};

export default EventSidebar;