import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Layout & UI Components
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import MissionDrawer from './components/dashboard/MissionDrawer';
import Toast from './components/ui/Toast.jsx';

// Pages
import Dashboard from './pages/Dashboard';
import Missions from './pages/Missions';
import Tracking from './pages/Tracking'; 
import Schedule from './pages/Schedule';
import Favorites from './pages/Favorites';

const App = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);
  const [toast, setToast] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  
  const isTrackingPage = location.pathname === '/tracking';
  const isLoginPage = location.pathname === '/login';

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('error') === 'rate_limit') {
      setToast({ message: "Security lockout active. Too many attempts.", type: 'error' });
      navigate(location.pathname, { replace: true });
    }

    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 429) {
          setToast({ message: "Sector traffic too high. Rate limit exceeded.", type: 'error' });
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [location, navigate]);

  const handleOpenDrawer = (mission = null) => {
    setSelectedMission(mission);
    setIsDrawerOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-black font-sans text-gray-100 overflow-x-hidden selection:bg-space-accent selection:text-black">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-space-800 via-black to-black pointer-events-none z-0" />
      
      {/* 🛰️ Responsive Navigation (Sidebar for Desktop, Bottom Nav for Mobile) */}
      {!isLoginPage && <Sidebar />}

      {/* Added pb-20 on mobile (md:pb-0) to ensure content isn't covered 
          by the fixed bottom navigation bar.
      */}
      <main className={`flex-1 relative z-10 transition-all duration-300 pb-20 md:pb-0 ${
        isLoginPage ? 'ml-0' : 'ml-0 md:ml-20'
      } ${
        isTrackingPage 
          ? 'p-0 overflow-hidden h-screen' 
          : 'p-4 md:p-8 max-w-[1920px] mx-auto' 
      }`}>
        
        {!isTrackingPage && !isLoginPage && <Header />}

        <Routes>
          <Route path="/" element={<Dashboard onOpenDrawer={handleOpenDrawer} />} />
          <Route path="/missions" element={<Missions onOpenDrawer={handleOpenDrawer} />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/schedule" element={<Schedule onOpenDrawer={handleOpenDrawer} />} />
          <Route path="/favorites" element={<Favorites onOpenDrawer={handleOpenDrawer} />} />
        </Routes>
      </main>

      <MissionDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        mission={selectedMission}
      />
    </div>
  );
};

export default App;