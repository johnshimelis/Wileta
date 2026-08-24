import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import PageTransition from './components/PageTransition';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import PublicProfile from './pages/PublicProfile';
import KYCVerification from './pages/KYCVerification';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Overlay from './pages/Overlay';
import PrivacyPolicy from './pages/PrivacyPolicy';
import DataDeletion from './pages/DataDeletion';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (!user.isOnboarded && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

// Public Route (redirect to dashboard if logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (user) {
    return <Navigate to={user.isOnboarded ? "/dashboard" : "/onboarding"} replace />;
  }
  return children;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={
          <PublicRoute>
            <PageTransition><Login /></PageTransition>
          </PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute>
            <PageTransition><Signup /></PageTransition>
          </PublicRoute>
        } />
        <Route path="/reset-password/:token" element={
          <PublicRoute>
            <PageTransition><ResetPassword /></PageTransition>
          </PublicRoute>
        } />
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <PageTransition><Onboarding /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <PageTransition><Dashboard /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/kyc" element={
          <ProtectedRoute>
            <PageTransition><KYCVerification /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <PageTransition><Profile /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <PageTransition><Settings /></PageTransition>
          </ProtectedRoute>
        } />
        {/* Public Tipping Page */}
        <Route path="/:username" element={<PageTransition><PublicProfile /></PageTransition>} />
        <Route path="/@:username" element={<PageTransition><PublicProfile /></PageTransition>} />
        {/* OBS Stream Overlay */}
        <Route path="/overlay/:creatorId" element={<PageTransition><Overlay /></PageTransition>} />
        
        {/* Public Legal / Compliance Pages */}
        <Route path="/privacy-policy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
        <Route path="/data-deletion" element={<PageTransition><DataDeletion /></PageTransition>} />
        
        {/* Homepage */}
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <AnimatedRoutes />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
