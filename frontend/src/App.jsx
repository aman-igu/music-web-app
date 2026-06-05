import React, { createContext, useContext, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ArtistDashboard from './pages/ArtistDashboard';
import AudioPlayer from './components/AudioPlayer';
import Chatbot from './components/Chatbot';
import { Music } from 'lucide-react';
import './App.css';

// Toast Context
const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 300);
    }, 3500);
  }, []);

  const toast = useCallback({
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
  }, [addToast]);

  // Fix: make toast callable methods
  const toastAPI = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
  };

  return (
    <ToastContext.Provider value={toastAPI}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type} ${t.exiting ? 'toast-exit' : ''}`}>
            {t.type === 'success' && '✓'}
            {t.type === 'error' && '✕'}
            {t.type === 'info' && 'ℹ'}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

function AppContent() {
  const { user, loadingProfile } = useApp();

  if (loadingProfile) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">
          <Music size={32} color="white" />
        </div>
        <span style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          MELODIX
        </span>
        <div className="loading-bar" />
      </div>
    );
  }

  return (
    <Router>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Ambient background orbs */}
        <div className="ambient-orb ambient-orb-1" aria-hidden="true" />
        <div className="ambient-orb ambient-orb-2" aria-hidden="true" />
        
        <Navbar />
        <main style={{ 
          flex: 1, 
          padding: '100px 24px 140px', 
          maxWidth: '1200px', 
          width: '100%', 
          margin: '0 auto',
          position: 'relative',
          zIndex: 1 
        }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
            <Route 
              path="/artist/dashboard" 
              element={user && user.role === 'artist' ? <ArtistDashboard /> : <Navigate to="/login" />} 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <AudioPlayer />
        <Chatbot />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
