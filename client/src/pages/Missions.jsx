import React, { useState } from 'react';
import { useUpcomingLaunches, usePastLaunches } from '../hooks/useLaunches';
import { Search, Calendar, MapPin, Rocket, Filter, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

const Missions = ({ onOpenDrawer }) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: upcomingData, isLoading: isUpcomingLoading, isError: isUpcomingError } = useUpcomingLaunches();
  const { data: pastData, isLoading: isPastLoading, isError: isPastError } = usePastLaunches();

  const activeData = activeTab === 'upcoming' ? upcomingData : pastData;
  const isLoading = activeTab === 'upcoming' ? isUpcomingLoading : isPastLoading;
  const isError = activeTab === 'upcoming' ? isUpcomingError : isPastError;

  // --- FIX 1: SAFETY CHECKS FOR SEARCH ---
  // We add ( ... || '') before .toLowerCase() to prevent "undefined" crashes
  const filteredMissions = activeData?.filter(mission => {
    const name = (mission.name || '').toLowerCase();
    const rocket = (mission.rocket?.configuration?.name || '').toLowerCase();
    const agency = (mission.launch_service_provider?.name || '').toLowerCase();
    const search = searchTerm.toLowerCase();

    return name.includes(search) || rocket.includes(search) || agency.includes(search);
  }) || [];

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Mission Archives</h1>
          <p className="text-gray-400 text-sm">Explore the history and future of human spaceflight.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search rockets, agencies..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-space-800 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:border-space-accent outline-none transition-colors"
            />
          </div>
          <button className="bg-space-800 border border-white/10 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-6 border-b border-white/10 mb-6">
        <TabButton label="Upcoming Launches" active={activeTab === 'upcoming'} onClick={() => setActiveTab('upcoming')} />
        <TabButton label="Past Missions" active={activeTab === 'past'} onClick={() => setActiveTab('past')} />
      </div>

      {/* GRID */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
             <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
               <AlertTriangle className="text-red-400" size={32} />
             </div>
             <h3 className="text-white font-bold text-lg mb-2">Connection Interrupted</h3>
             <p className="text-gray-400 max-w-md">
               We couldn't fetch the mission data. This usually happens if the API rate limit is exceeded (15 req/hour).
             </p>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {filteredMissions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                {filteredMissions.map((mission) => (
                  <MissionCard key={mission.id} mission={mission} onClick={() => onOpenDrawer(mission)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500">
                <Rocket size={48} className="mx-auto mb-4 opacity-20" />
                <p>No missions found matching "{searchTerm}".</p>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
};

// --- SUB COMPONENTS ---

const TabButton = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${
      active ? 'text-space-accent border-space-accent' : 'text-gray-500 border-transparent hover:text-gray-300'
    }`}
  >
    {label}
  </button>
);

// ... (keep imports and main component same) ...

const MissionCard = ({ mission, onClick }) => {
  // 1. Safe Status Access
  const statusName = mission.status?.abbrev || mission.status?.name || mission.status || 'TBD';
  
  const statusColor = ['Success', 'Go'].includes(statusName) 
    ? 'text-green-400 bg-green-500/10 border-green-500/20' 
    : ['Failure', 'Hold'].includes(statusName)
    ? 'text-red-400 bg-red-500/10 border-red-500/20'
    : 'text-blue-400 bg-blue-500/10 border-blue-500/20';

  // 2. Smart Image Selector
  const getSmartImage = () => {
    // If API provided an image, ALWAYS use it first.
    if (mission.image) return mission.image;

    // Otherwise, check the rocket/agency name
    const rName = (mission.rocket?.configuration?.name || '').toLowerCase();
    const agency = (mission.launch_service_provider?.name || '').toLowerCase();
    
    // --- DICTIONARY OF ROCKETS ---
    if (rName.includes('falcon') || rName.includes('starship')) return "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=800&auto=format&fit=crop"; // SpaceX
    if (rName.includes('electron')) return "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?q=80&w=800&auto=format&fit=crop"; // Rocket Lab
    if (rName.includes('soyuz') || agency.includes('russian')) return "https://upload.wikimedia.org/wikipedia/commons/9/9a/Soyuz_TMA-9_launch.jpg"; // Russian
    if (rName.includes('long march') || agency.includes('china')) return "https://upload.wikimedia.org/wikipedia/commons/6/6b/Long_March_2D_launching_VRSS-1.jpg"; // Chinese
    
    // FIX: Explicit support for H3 / Japanese Rockets (matches your Michibiki mission)
    if (rName.includes('h-ii') || rName.includes('h3') || agency.includes('jaxa') || agency.includes('mitsubishi')) {
        return "https://global.jaxa.jp/projects/rockets/h3/images/h3_main_001.jpg"; 
    }
    
    if (rName.includes('ariane')) return "https://images.unsplash.com/photo-1518364538800-6bae3c2db0f2?q=80&w=800&auto=format&fit=crop"; // European
    if (rName.includes('sls') || rName.includes('atlas') || rName.includes('delta')) return "https://images.unsplash.com/photo-1541185933-710f50746716?q=80&w=800&auto=format&fit=crop"; // NASA/ULA

    // --- RANDOM VARIETY FOR UNKNOWNS ---
    // If we don't know the rocket, pick a cool space background based on the ID
    // This ensures "Mission A" always gets "Image A", instead of random flickering.
    const genericImages = [
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800&auto=format&fit=crop", // Orbit
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop", // Earth
      "https://images.unsplash.com/photo-1542382257-80dedb725088?q=80&w=800&auto=format&fit=crop", // Deep Space
      "https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=800&auto=format&fit=crop", // Galaxy
    ];

    const idStr = mission.id || 'default';
    let hash = 0;
    for (let i = 0; i < idStr.length; i++) hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
    
    return genericImages[Math.abs(hash) % genericImages.length];
  };

  return (
    <div 
      onClick={onClick}
      className="group bg-space-800/50 hover:bg-space-800 border border-white/5 hover:border-space-accent/30 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col shadow-lg hover:shadow-space-accent/10"
    >
      {/* Image Header */}
      <div className="h-40 bg-black relative overflow-hidden">
        <img 
          src={getSmartImage()} 
          alt={mission.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
        />
        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/60 to-transparent" />
        <div className="absolute top-3 right-3">
           <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase backdrop-blur-md ${statusColor}`}>
             {statusName}
           </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="text-white font-bold text-lg leading-tight mb-1 line-clamp-1 group-hover:text-space-accent transition-colors">
            {mission.name.split('|')[1]?.trim() || mission.name}
          </h3>
          <p className="text-gray-400 text-xs font-mono uppercase tracking-wider">
            {mission.name.split('|')[0]?.trim()}
          </p>
        </div>

        <div className="mt-auto space-y-2 text-xs text-gray-400 border-t border-white/5 pt-4">
           <div className="flex items-center gap-2">
             <Calendar size={12} className="text-space-accent" />
             <span>{mission.net ? format(new Date(mission.net), 'MMM dd, yyyy • HH:mm') : 'TBD'}</span>
           </div>
           <div className="flex items-center gap-2">
             <MapPin size={12} className="text-space-accent" />
             <span className="truncate max-w-[200px]">{mission.pad?.location?.name || 'Unknown Location'}</span>
           </div>
        </div>
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="bg-space-800/50 rounded-2xl p-4 animate-pulse h-[300px]">
    <div className="h-32 bg-white/5 rounded-xl mb-4"></div>
    <div className="h-6 w-3/4 bg-white/5 rounded mb-2"></div>
    <div className="h-4 w-1/2 bg-white/5 rounded mb-4"></div>
  </div>
);

export default Missions;