import React from 'react';
import HeroLaunch from '../components/dashboard/HeroLaunch';
import CosmicWeather from '../components/dashboard/CosmicWeather';
import MissionTimeline from '../components/dashboard/MissionTimeline';
import ISSTracker from '../components/dashboard/ISSTracker';

const Dashboard = ({ onOpenDrawer }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[450px]">
        <div className="lg:col-span-2 h-full min-h-[400px]">
          <HeroLaunch onOpenDetails={onOpenDrawer} />
        </div>
        <div className="lg:col-span-1 h-full min-h-[400px]">
          <CosmicWeather />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[480px]">
        <div className="lg:col-span-2 h-full min-h-[350px]">
           <ISSTracker />
        </div>
        <div className="lg:col-span-1 h-full min-h-[350px]">
           <MissionTimeline onSelectMission={onOpenDrawer} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;