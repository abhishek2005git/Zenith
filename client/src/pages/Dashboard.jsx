import React from 'react';
import HeroLaunch from '../components/dashboard/HeroLaunch';
import CosmicWeather from '../components/dashboard/CosmicWeather';
import MissionTimeline from '../components/dashboard/MissionTimeline';
import ISSTracker from '../components/dashboard/ISSTracker';

/**
 * Zenith Dashboard - Command Center v2.5
 * Synchronizes Row 2 heights to ensure the ISS Tracker is fully visible 
 * and the Mission Timeline stays contained with internal scrolling.
 */
const Dashboard = ({ onOpenDrawer }) => {
  return (
    <div className="flex flex-col gap-6 pb-8 w-full">
      {/* ROW 1: PRIMARY MISSION & WEATHER DATA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Launch Card */}
        <div className="lg:col-span-2 min-h-[420px]">
          <HeroLaunch onOpenDetails={onOpenDrawer} />
        </div>
        
        {/* Weather Sidebar */}
        <div className="lg:col-span-1 min-h-[420px]">
          <CosmicWeather />
        </div>
      </div>

      {/* ROW 2: ORBITAL TELEMETRY & FLIGHT SCHEDULE
          - We lock both containers to h-[500px]
          - This ensures the ISS Tracker maintains its aspect ratio
          - The Mission Timeline will scroll internally within this height
      */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D ISS Orbital Tracker */}
        <div className="lg:col-span-2 h-[500px]">
          <div className="h-full w-full bg-space-900/40 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden">
            <ISSTracker />
          </div>
        </div>
        
        {/* Scrollable Mission Schedule */}
        <div className="lg:col-span-1 h-[500px]">
          <div className="h-full w-full bg-space-900/40 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden">
            <MissionTimeline onSelectMission={onOpenDrawer} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;