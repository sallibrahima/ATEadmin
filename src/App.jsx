import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Events from '@/pages/Events';
import Users from '@/pages/Users';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import EventDashboard from '@/pages/event/EventDashboard';
import EventProgram from '@/pages/event/EventProgram';
import EventTickets from '@/pages/event/EventTickets';
import EventParticipants from '@/pages/event/EventParticipants';
import EventMeetings from '@/pages/event/EventMeetings';
import EventScannedTickets from '@/pages/event/EventScannedTickets';
import EventReport from '@/pages/event/EventReport';
import { AuthProvider } from '@/contexts/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/events" element={
            <ProtectedRoute>
              <Layout>
                <Events />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/users" element={
            <ProtectedRoute>
              <Layout>
                <Users />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/reports" element={
            <ProtectedRoute>
              <Layout>
                <Reports />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/events/:eventId" element={
            <ProtectedRoute>
               <EventDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/events/:eventId/program" element={
            <ProtectedRoute>
              <EventProgram />
            </ProtectedRoute>
          } />
          
          <Route path="/events/:eventId/tickets" element={
            <ProtectedRoute>
               <EventTickets />
            </ProtectedRoute>
          } />
          
          <Route path="/events/:eventId/participants" element={
            <ProtectedRoute>
              <EventParticipants />
            </ProtectedRoute>
          } />
          
          <Route path="/events/:eventId/meetings" element={
            <ProtectedRoute>
              <EventMeetings />
            </ProtectedRoute>
          } />
          
          <Route path="/events/:eventId/scanned-tickets" element={
            <ProtectedRoute>
              <EventScannedTickets />
            </ProtectedRoute>
          } />
          
          <Route path="/events/:eventId/report" element={
            <ProtectedRoute>
              <EventReport />
            </ProtectedRoute>
          } />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;