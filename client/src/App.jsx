import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import MissionDrawer from './components/dashboard/MissionDrawer';
import Tracking from './pages/Tracking'; 
import Schedule from './pages/Schedule';

// Import Pages
import Dashboard from './pages/Dashboard';
import Missions from './pages/Missions';
import Favorites from './pages/Favorites';

const App = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);

  const location = useLocation();
  const isTrackingPage = location.pathname === '/tracking';

  const handleOpenDrawer = (mission = null) => {
    setSelectedMission(mission);
    setIsDrawerOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-black font-sans text-gray-100 overflow-x-hidden selection:bg-space-accent selection:text-black">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-space-800 via-black to-black pointer-events-none z-0" />
      
      <Sidebar />

      {/* 3. DYNAMIC MAIN LAYOUT */}
      {/* If tracking page: Remove padding and force full height. Keep margin for sidebar. */}
      <main className={`flex-1 relative z-10 transition-all duration-300 ${
        isTrackingPage 
          ? 'ml-0 md:ml-20 p-0 overflow-hidden h-screen' // Full Screen Mode
          : 'ml-0 md:ml-20 p-4 md:p-8 max-w-[1920px] mx-auto' // Standard Mode
      }`}>
        
        {/* 4. HIDE HEADER ON TRACKING PAGE */}
        {!isTrackingPage && <Header />}

        {/* PAGE ROUTING */}
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