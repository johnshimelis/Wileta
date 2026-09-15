import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import PageTransition from './components/PageTransition';
import './index.css';

// Ultra-fast Code Splitting with React.lazy
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const PublicProfile = lazy(() => import('./pages/PublicProfile'));
const KYCVerification = lazy(() => import('./pages/KYCVerification'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const Overlay = lazy(() => import('./pages/Overlay'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const DataDeletion = lazy(() => import('./pages/DataDeletion'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Support = lazy(() => import('./pages/Support'));
const Chat = lazy(() => import('./pages/Chat'));
const MaintenanceScreen = lazy(() => import('./components/MaintenanceScreen'));

const PageLoader = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-color, #09090b)',
    gap: '1rem'
  }}>
    <div style={{
      width: '36px',
      height: '36px',
      border: '3px solid rgba(5, 150, 105, 0.2)',
      borderTopColor: '#059669',
      borderRadius: '50%',
      animation: 'spin 0.6s linear infinite'
    }} />
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;

  if (!user) return <Navigate to="/login" replace />;

  if (!user.isOnboarded && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  if (user.isOnboarded && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public Route (redirect to dashboard if logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (user) {
    return <Navigate to={user.isOnboarded ? "/dashboard" : "/onboarding"} replace />;
  }
  return children;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<PageLoader />}>
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
          {/* Public Creator & Tipping Pages */}
          <Route path="/creator/:username" element={<PageTransition><PublicProfile /></PageTransition>} />
          <Route path="/c/:username" element={<PageTransition><PublicProfile /></PageTransition>} />
          <Route path="/tip/:username" element={<PageTransition><PublicProfile /></PageTransition>} />
          <Route path="/:username" element={<PageTransition><PublicProfile /></PageTransition>} />
          <Route path="/@:username" element={<PageTransition><PublicProfile /></PageTransition>} />
          
          {/* OBS Stream Overlay */}
          <Route path="/overlay/:creatorId" element={<PageTransition><Overlay /></PageTransition>} />
          
          {/* Direct In-App Chat / Conversation */}
          <Route path="/chat" element={
            <ProtectedRoute>
              <PageTransition><Chat /></PageTransition>
            </ProtectedRoute>
          } />
          <Route path="/conversation" element={
            <ProtectedRoute>
              <PageTransition><Chat /></PageTransition>
            </ProtectedRoute>
          } />
          <Route path="/messages" element={
            <ProtectedRoute>
              <PageTransition><Chat /></PageTransition>
            </ProtectedRoute>
          } />

          {/* Support & Contact Pages */}
          <Route path="/support" element={<PageTransition><Support /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Support /></PageTransition>} />

          {/* Maintenance Direct Routes & Aliases */}
          <Route path="/maintenance" element={<MaintenanceRouteWrapper />} />
          <Route path="/maintance" element={<MaintenanceRouteWrapper />} />

          {/* Public Legal / Compliance Pages */}
          <Route path="/privacy-policy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
          <Route path="/data-deletion" element={<PageTransition><DataDeletion /></PageTransition>} />
          
          {/* Homepage */}
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};

function MaintenanceRouteWrapper() {
  const { maintenanceInfo, checkSystemStatus } = useAuth();
  return (
    <Suspense fallback={<PageLoader />}>
      <MaintenanceScreen
        message={maintenanceInfo?.message}
        supportEmail={maintenanceInfo?.supportEmail || 'biranalabs@gmail.com'}
        supportPhone={maintenanceInfo?.supportPhone || '+251 967 432 143'}
        onRefresh={checkSystemStatus}
      />
    </Suspense>
  );
}

function AppContent() {
  const { maintenanceInfo, checkSystemStatus } = useAuth();

  if (maintenanceInfo?.isMaintenance) {
    return (
      <Suspense fallback={<PageLoader />}>
        <MaintenanceScreen
          message={maintenanceInfo.message}
          supportEmail={maintenanceInfo.supportEmail || 'biranalabs@gmail.com'}
          supportPhone={maintenanceInfo.supportPhone || '+251 967 432 143'}
          onRefresh={checkSystemStatus}
        />
      </Suspense>
    );
  }

  return (
    <NotificationProvider>
      <AnimatedRoutes />
    </NotificationProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
