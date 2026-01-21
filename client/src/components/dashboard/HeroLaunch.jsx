import React, { useState, useEffect } from 'react';
import { useNextLaunch } from '../../hooks/useLaunches.js';
import { format } from 'date-fns';
import FavoriteButton from '../ui/FavoriteButton.jsx';
import CalendarSyncButton from './CalendarSyncButton.jsx';
import { Rocket, Clock, MapPin } from 'lucide-react';

/**
 * HeroLaunch - Primary Mission Telemetry
 * Updated to include T-Plus/T-Minus logic and Google Calendar Integration.
 */
const HeroLaunch = ({ onOpenDetails }) => {
  const { data: launch, isLoading, isError } = useNextLaunch();
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!launch?.net) return;

    const interval = setInterval(() => {
      const now = new Date();
      const launchDate = new Date(launch.net);
      const diff = launchDate - now;

      // MISSION CLOCK CALCULATION
      const isFuture = diff > 0;
      const elapsed = Math.abs(diff);
      
      const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
      const hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((elapsed / 1000 / 60) % 60);
      const seconds = Math.floor((elapsed / 1000) % 60);

      const timeStr = `${isFuture ? 'T-' : 'T+'} ${days}d : ${hours.toString().padStart(2, '0')}h : ${minutes.toString().padStart(2, '0')}m : ${seconds.toString().padStart(2, '0')}s`;
      setTimeLeft(timeStr);
    }, 1000);

    return () => clearInterval(interval);
  }, [launch]);

  if (isLoading) return <LoadingSkeleton />;
  if (isError) return <div className="p-8 text-red-400 bg-red-400/10 rounded-3xl border border-red-500/20">Uplink Failed: Unable to retrieve mission telemetry.</div>;

  return (
    <div className="relative h-full rounded-3xl overflow-hidden group border border-white/10 shadow-2xl bg-[#0B0D17]">
      
      {/* Background Layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] group-hover:scale-105 opacity-60"
        style={{ backgroundImage: `url(${launch.rocketImage || 'https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=1200'})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D17] via-[#0B0D17]/70 to-transparent" />

      {/* Interface Layer */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-8">
        
        {/* Telemetry Header */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <span className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider border w-fit ${
              launch.status?.includes('Success') || launch.status === 'Go' 
                ? 'bg-green-500/20 border-green-500/50 text-green-400' 
                : 'bg-blue-500/20 border-blue-500/50 text-blue-400'
            }`}>
              {launch.status || 'PRE-FLIGHT'}
            </span>
            <span className="text-[10px] text-gray-500 font-mono mt-1">ID: {launch.id?.substring(0, 8)}...</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest">Live Uplink</span>
            </div>
            <FavoriteButton launchId={launch.id} className="!bg-black/20 !backdrop-blur-xl" />
          </div>
        </div>

        {/* Mission Identification */}
        <div className="mt-auto">
          <h3 className="text-space-accent text-[10px] font-mono tracking-[0.3em] mb-2 uppercase">
            Primary Mission Objective
          </h3>

          {launch.name?.includes('|') ? (
            <>
              <h2 className="text-xl md:text-2xl text-gray-400 font-light mb-1">
                {launch.name.split('|')[0].trim()}
              </h2>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
                {launch.name.split('|')[1].trim()}
              </h1>
            </>
          ) : (
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              {launch.name}
            </h1>
          )}

          <div className="flex flex-wrap gap-x-8 gap-y-3 mb-8 text-gray-400">
             <div className="flex items-center gap-2">
                <Rocket size={14} className="text-space-accent" />
                <span className="text-xs font-mono uppercase text-white">{launch.agency}</span>
             </div>
             <div className="flex items-center gap-2">
                <MapPin size={14} className="text-space-accent" />
                <span className="text-xs font-mono uppercase truncate max-w-[200px]">{launch.pad}</span>
             </div>
          </div>

          {/* Tactical Action Bar */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <p className="text-[10px] text-gray-500 font-mono mb-2 tracking-widest uppercase">
                Mission Countdown
              </p>
              <p className="text-xl md:text-3xl font-mono text-white tracking-widest whitespace-nowrap">
                {timeLeft}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Clock size={12} className="text-gray-600" />
                <p className="text-[10px] text-gray-500 font-mono">
                   TARGET NET: {launch.net ? format(new Date(launch.net), "MMM dd, HH:mm 'UTC'") : 'TBD'}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <CalendarSyncButton launch={launch} />
                <button 
                  onClick={() => onOpenDetails(launch)}
                  className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-space-accent transition-all duration-300 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 group"
                >
                  Mission Details
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="h-full bg-space-900 rounded-3xl animate-pulse p-8 flex flex-col justify-end">
    <div className="h-4 bg-white/5 w-32 rounded mb-4"></div>
    <div className="h-12 bg-white/5 w-3/4 rounded mb-6"></div>
    <div className="h-24 bg-white/5 w-full rounded-2xl"></div>
  </div>
);

export default HeroLaunch;