import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Map as MapIcon, Users, BarChart3, Menu, X, PhoneCall, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import io from 'socket.io-client';

// Simple Component Imports (to be expanded)
import LandingPage from './pages/LandingPage';
import EmergencyReport from './pages/EmergencyReport';
import CoordinatorDashboard from './pages/CoordinatorDashboard';
import VolunteerPortal from './pages/VolunteerPortal';

const socket = io('http://localhost:5000');

function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    socket.on('emergency-broadcast', (alert) => {
      setAlerts(prev => [alert, ...prev]);
    });

    return () => socket.off('emergency-broadcast');
  }, []);

  const navItems = [
    { id: 'landing', label: 'Home', icon: Shield },
    { id: 'report', label: 'I Need Help', icon: AlertTriangle, color: 'text-red-500' },
    { id: 'dashboard', label: 'Rescue Dashboard', icon: MapIcon },
    { id: 'volunteer', label: 'Volunteer', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-red-200">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white border-b border-red-200 shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="bg-gradient-to-br from-red-600 to-red-700 p-2 rounded-lg shadow-lg shadow-red-600/30 group-hover:scale-110 transition-transform">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-display font-black tracking-tighter uppercase italic bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              RescueMap
            </span>
          </motion.button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-black text-xs uppercase tracking-widest transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-red-100 text-red-600 border border-red-300 shadow-md' 
                    : 'text-gray-600 hover:text-red-600 hover:bg-red-50 border border-transparent'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="hidden sm:flex items-center gap-2 px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-md"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Emergency Line
            </motion.button>
            
            <motion.button 
              whileHover={{ rotate: 90 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-md pt-20 px-4 md:hidden border-t border-red-200"
          >
            <div className="flex flex-col gap-2 max-w-md mx-auto">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 5 }}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center gap-4 p-4 rounded-xl text-lg font-bold transition-all ${
                    activeTab === item.id 
                      ? 'bg-red-100 text-red-600 border border-red-300 shadow-md' 
                      : 'text-gray-600 hover:text-red-600 hover:bg-red-50 border border-transparent'
                  }`}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="uppercase tracking-wider">{item.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-20 pb-12 px-4">
        <AnimatePresence mode="wait">
          {activeTab === 'landing' && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <LandingPage onStart={() => setActiveTab('report')} onDash={() => setActiveTab('dashboard')} />
            </motion.div>
          )}
          {activeTab === 'report' && (
            <motion.div key="report" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <EmergencyReport onComplete={() => setActiveTab('landing')} />
            </motion.div>
          )}
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <CoordinatorDashboard />
            </motion.div>
          )}
          {activeTab === 'volunteer' && (
            <motion.div key="volunteer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <VolunteerPortal />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Alerts Toasts */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {alerts.slice(0, 3).map((alert, idx) => (
            <motion.div
              key={idx}
              initial={{ x: 400, opacity: 0, scale: 0.8 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 400, opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              className="card-base border-l-4 border-l-red-600 rounded-2xl shadow-2xl shadow-red-600/20 flex items-center gap-4 min-w-[340px] relative overflow-hidden group pointer-events-auto"
            >
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-gradient-to-br from-red-600 to-red-700 p-3 rounded-xl shadow-lg shadow-red-600/40 flex-shrink-0"
              >
                <AlertTriangle className="w-5 h-5 text-white" />
              </motion.div>
              
              <div className="flex-1 min-w-0">
                <p className="font-display font-black text-xs uppercase tracking-widest text-red-600 mb-1">
                  Emergency Alert
                </p>
                <p className="text-gray-900 font-medium text-sm leading-snug truncate">
                  {alert.description || alert.message}
                </p>
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAlerts(prev => prev.filter((_, i) => i !== idx))}
                className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded-lg text-gray-400 hover:text-red-600 transition-all flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </motion.button>

              <motion.div 
                animate={{ scaleX: [1, 0] }}
                transition={{ duration: 5, ease: "linear" }}
                onAnimationComplete={() => setAlerts(prev => prev.filter((_, i) => i !== idx))}
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-red-600 to-red-400 origin-left"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
