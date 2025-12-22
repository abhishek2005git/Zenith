import React, { useEffect, useState } from 'react';
import { X, Calendar, MapPin, Rocket, Clock, MonitorPlay, FileText, Activity, Globe, Youtube } from 'lucide-react';
import { format } from 'date-fns';

const MissionDrawer = ({ isOpen, onClose, mission }) => {
  const [activeTab, setActiveTab] = useState('briefing');

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => (document.body.style.overflow = 'unset');
  }, [isOpen]);

  if (!mission && !isOpen) return null;

  // --- 1. DATA NORMALIZATION (The Fix) ---
  // This ensures we extract strings safely, whether 'mission' comes from Hero (flat) or API (nested)
  
  const missionName = mission?.name?.split('|')[1]?.trim() || mission?.name || "Unknown Mission";
  
  // Handle Rocket Name: Could be flat 'rocketName' OR nested 'rocket.configuration.name'
  const rocketName = mission?.rocketName || mission?.rocket?.configuration?.name || "Unknown Rocket";
  
  // Handle Agency: Could be flat 'agency' OR nested 'launch_service_provider.name'
  const agencyName = mission?.agency || mission?.launch_service_provider?.name || "Unknown Agency";
  
  // Handle Status: Could be string 'Go' OR object { name: 'Go' }
  const statusRaw = mission?.status?.name || mission?.status || 'SCHEDULED';
  const statusLabel = typeof statusRaw === 'string' ? statusRaw : 'SCHEDULED';
  
  // Handle Location: Could be flat 'location' OR nested 'pad.location.name'
  const locationName = mission?.location || mission?.pad?.location?.name || mission?.pad?.name || 'Unknown Location';
  
  // Handle Image:
  const image = mission?.rocketImage || mission?.image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1080&auto=format&fit=crop";

  const description = mission?.missionDescription || mission?.mission?.description || "Classified payload. No public details available.";
  const orbit = mission?.orbit || mission?.mission?.orbit?.name || "Low Earth Orbit";
  
  // Status Color Logic
  const isGood = ['Go', 'Success'].includes(statusLabel);
  const statusColor = isGood 
    ? 'text-green-400 border-green-500/50 bg-green-500/10' 
    : 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10';

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div className={`fixed inset-y-0 right-0 w-full md:w-[650px] bg-space-900 border-l border-white/10 shadow-2xl z-[70] transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* HERO IMAGE */}
        <div className="relative h-48 md:h-64 flex-none group">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-space-900 via-space-900/60 to-transparent" />
          
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur rounded-full hover:bg-white/20 text-white transition-colors z-20">
            <X size={20} />
          </button>

          <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
            {/* FIX: Render the Safe 'statusLabel' string, not the object */}
            <div className={`inline-block px-3 py-1 rounded text-[10px] font-bold uppercase border mb-2 ${statusColor}`}>
               {statusLabel}
            </div>
            <h2 className="text-3xl font-bold text-white leading-tight drop-shadow-lg">
              {missionName}
            </h2>
            <div className="flex items-center gap-2 text-gray-300 text-sm mt-1">
              <Rocket size={14} className="text-space-accent" />
              <span>{rocketName}</span>
              <span className="mx-1">•</span>
              <span>{agencyName}</span>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="flex border-b border-white/10 px-6 gap-6 bg-black/20">
          <button 
            onClick={() => setActiveTab('briefing')}
            className={`py-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'briefing' ? 'border-space-accent text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
          >
            Mission Briefing
          </button>
          <button 
            onClick={() => setActiveTab('stream')}
            className={`py-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'stream' ? 'border-red-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
          >
            Live Feed
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-space-900">
          
          {activeTab === 'briefing' ? (
            <div className="p-6 space-y-8">
              
              <div className="prose prose-invert prose-sm max-w-none">
                <h3 className="text-gray-400 font-mono text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                   <FileText size={14} /> Mission Profile
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                  {description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InfoBox icon={Calendar} label="Launch Date" value={mission?.net ? format(new Date(mission.net), 'MMM dd, yyyy') : 'TBD'} />
                <InfoBox icon={Clock} label="Launch Time" value={mission?.net ? format(new Date(mission.net), 'HH:mm:ss') + ' UTC' : '--:--'} />
                <InfoBox icon={Globe} label="Target Orbit" value={orbit} />
                <InfoBox icon={Activity} label="Status" value={statusLabel} />
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex gap-4 items-start">
                 <div className="bg-space-800 p-2 rounded-full">
                    <MapPin size={20} className="text-space-accent" />
                 </div>
                 <div>
                    <h4 className="text-xs text-gray-400 font-mono uppercase tracking-widest mb-1">Launch Complex</h4>
                    <p className="text-white font-bold text-sm">
                      {locationName}
                    </p>
                 </div>
              </div>

            </div>
          ) : (
            // STREAM TAB
            <div className="h-full flex flex-col">
               {mission?.vidURLs && mission.vidURLs.length > 0 ? (
                  <div className="aspect-video w-full bg-black">
                    <iframe 
                      src={mission.vidURLs[0].url.replace('watch?v=', 'embed/')} 
                      title="Launch Stream"
                      className="w-full h-full"
                      allowFullScreen
                    ></iframe>
                  </div>
               ) : (
                 <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                       <Youtube size={32} className="opacity-50" />
                    </div>
                    <p>No active livestream link available.</p>
                    <button 
                       onClick={() => window.open(`https://www.youtube.com/results?search_query=${missionName} launch`, '_blank')}
                       className="mt-4 text-space-accent text-sm hover:underline"
                    >
                      Search on YouTube
                    </button>
                 </div>
               )}
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-white/10 bg-black/40 backdrop-blur-md flex gap-4">
           <button 
             onClick={() => setActiveTab('stream')}
             className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
           >
             <MonitorPlay size={18} /> Watch Live
           </button>
        </div>

      </div>
    </>
  );
};

// ... InfoBox Helper ...
const InfoBox = ({ icon: Icon, label, value }) => (
  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
    <div className="flex items-center gap-2 text-gray-400 text-xs mb-1.5 uppercase font-mono">
      <Icon size={12} /> {label}
    </div>
    <div className="text-white font-medium text-sm truncate">{value}</div>
  </div>
);

export default MissionDrawer;