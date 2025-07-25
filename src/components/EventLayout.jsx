import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import EventSidebar from '@/components/EventSidebar';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const EventLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); 
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <EventSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={cn(
          "flex flex-col flex-1 overflow-hidden transition-all duration-300 ease-in-out",
          // sidebarOpen && window.innerWidth < 768 ? "ml-0" : "ml-0 md:ml-[72px]",
          // sidebarOpen && window.innerWidth >= 768 ? "md:ml-[240px]" : ""
        )}
      >
        <Header toggleSidebar={toggleSidebar} isEventLayout={true} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default EventLayout;