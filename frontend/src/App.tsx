import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DirectAdvisorModal } from './components/DirectAdvisorModal';
import { StatusTrackerModal } from './components/StatusTrackerModal';

// Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { ServiceDetail } from './pages/ServiceDetail';
import { CaseStudies } from './pages/CaseStudies';
import { ConciergeContact } from './pages/ConciergeContact';
import { FAQ } from './pages/FAQ';
import { Legal } from './pages/Legal';
import { NotFound } from './pages/NotFound';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';

// Protected Route Guard
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-platinum-400">
        Authenticating session security tokens...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

// Layout Controller
const AppContent: React.FC = () => {
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-obsidian-900 text-platinum-100">
      {/* Global Navbar */}
      <Navbar
        onRequestCallback={() => setIsCallbackOpen(true)}
        onTrackInquiry={() => setIsTrackerOpen(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home onRequestCallback={() => setIsCallbackOpen(true)} />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route
            path="/services/:slug"
            element={<ServiceDetail onRequestCallback={() => setIsCallbackOpen(true)} />}
          />
          <Route path="/credentials" element={<CaseStudies />} />
          <Route path="/contact" element={<ConciergeContact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/legal" element={<Legal />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />

          {/* Fallback 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Global Footer (Visible on public pages and login) */}
      {!isAdminRoute && <Footer onTrackInquiry={() => setIsTrackerOpen(true)} />}

      {/* Global Modals */}
      <DirectAdvisorModal
        isOpen={isCallbackOpen}
        onClose={() => setIsCallbackOpen(false)}
      />

      <StatusTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
