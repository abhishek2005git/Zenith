import React, { useState, useEffect } from 'react';
import { useNextLaunch } from '../../hooks/useLaunches';
import { format } from 'date-fns';
import FavoriteButton from '../ui/FavoriteButton';

const HeroLaunch = ({ onOpenDetails }) => {
  const { data: launch, isLoading, isError } = useNextLaunch();
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!launch?.net) return;

    const interval = setInterval(() => {
      const now = new Date();
      const launchDate = new Date(launch.net);
      const diff = launchDate - now;

      // 1. IF LAUNCH IS IN THE FUTURE (T-Minus)
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft(`T- ${days}d : ${hours.toString().padStart(2, '0')}h : ${minutes.toString().padStart(2, '0')}m : ${seconds.toString().padStart(2, '0')}s`);
      } 
      // 2. IF LAUNCH HAS HAPPENED (T-Plus)
      else {
        // Calculate time ELAPSED (use Math.abs to flip the negative number)
        const elapsed = Math.abs(diff);
        
        const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
        const hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((elapsed / 1000 / 60) % 60);
        const seconds = Math.floor((elapsed / 1000) % 60);

        // Show "T+" instead of "T-"
        setTimeLeft(`T+ ${days}d : ${hours.toString().padStart(2, '0')}h : ${minutes.toString().padStart(2, '0')}m : ${seconds.toString().padStart(2, '0')}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [launch]);

  if (isLoading) return <LoadingSkeleton />;
  if (isError) return <div className="text-red-400">Failed to load mission data.</div>;

  return (
    <div className="relative col-span-1 md:col-span-2 row-span-2 rounded-3xl overflow-hidden group border border-white/10 shadow-2xl bg-space-900">
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${launch.rocketImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-space-900 via-space-900/60 to-transparent" />

      {/* Content Layer */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-8">
        
        {/* Top Badge */}
        <div className="flex justify-between items-start">
          <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${
            launch.status.includes('Success') ? 'bg-green-500/20 border-green-500 text-green-300' 
            : 'bg-blue-500/20 border-blue-500 text-blue-300'
          }`}>
            {launch.status}
          </span>
          <div className="flex items-center gap-2">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            <span className="text-xs font-mono text-red-400">LIVE TRACKING</span>
          </div>
        </div>

        {/* Bottom Info */}
        <div>
          <h3 className="text-space-accent text-sm font-mono tracking-widest mb-1 uppercase">
            Upcoming Mission
          </h3>

          <div className="absolute top-4 right-4 z-20">
       <FavoriteButton launchId={launch.id} />
    </div>

          {/* SPLIT LOGIC */}
          {launch.name.includes('|') ? (
            <>
              {/* 1. Rocket Name */}
              <h2 className="text-xl md:text-2xl text-gray-300 font-sans font-light mb-0 truncate">
                {launch.name.split('|')[0].trim()}
              </h2>
              {/* 2. Mission Name - FIXED: Reduced font size to 'text-5xl' max and kept line-clamp */}
              <h1 className="text-3xl md:text-5xl font-sans font-bold text-white mb-4 leading-tight line-clamp-2 overflow-hidden text-ellipsis">
                {launch.name.split('|')[1].trim()}
              </h1>
            </>
          ) : (
            // Fallback - FIXED: Reduced font size to 'text-4xl' max
            <h1 className="text-3xl md:text-4xl font-sans font-bold text-white mb-2 leading-tight line-clamp-2 overflow-hidden text-ellipsis">
              {launch.name}
            </h1>
          )}

          <p className="text-gray-300 text-sm mb-6 max-w-md">
             Provider: <span className="text-white font-semibold">{launch.agency}</span> 
             • Pad: {launch.pad}
          </p>

          {/* Glassmorphism Timer Box */}
          {/* Glassmorphism Timer Box */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-400 font-mono mb-1 text-center md:text-left">
                MISSION CLOCK
              </p>
              
              {/* FIXED: 
                  1. Reduced size to 'text-xl md:text-2xl' (was 3xl) 
                  2. Added 'whitespace-nowrap' to forbid wrapping
              */}
              <p className="text-xl md:text-2xl font-mono text-white tracking-widest whitespace-nowrap">
                {timeLeft}
              </p>
              
              <p className="text-[10px] text-gray-400 font-mono mt-1 text-center md:text-left">
                TARGET: {launch.net ? format(new Date(launch.net), "MMM dd, HH:mm") : 'TBD'}
              </p>
            </div>
            
            <button 
              // FIX: Pass the 'launch' object to the function!
              onClick={() => onOpenDetails(launch)}
              className="bg-white text-space-900 px-5 py-2 md:px-6 md:py-3 rounded-lg font-bold hover:bg-space-accent transition-colors text-sm md:text-base whitespace-nowrap w-full md:w-auto flex items-center justify-center gap-2"
            >
              Mission Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="col-span-2 row-span-2 bg-space-800 rounded-3xl animate-pulse p-8 flex flex-col justify-end">
    <div className="h-4 bg-white/10 w-32 rounded mb-4"></div>
    <div className="h-10 bg-white/10 w-3/4 rounded mb-6"></div>
    <div className="h-20 bg-white/10 w-full rounded"></div>
  </div>
);

export default HeroLaunch;