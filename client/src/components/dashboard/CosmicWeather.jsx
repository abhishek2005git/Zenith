import React from 'react';
import { useWeather } from '../../hooks/useWeather';
import { Info, MapPin, Radio, ShieldAlert } from 'lucide-react';

// Larger Tooltip for better readability
const InfoTooltip = ({ term, definition }) => (
  <div className="group relative inline-flex items-center ml-2 cursor-help z-50">
    <Info size={14} className="text-gray-500 hover:text-white transition-colors" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 bg-space-900 border border-white/20 text-xs text-gray-300 p-4 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-[999]">
      <div className="font-bold text-white mb-1 text-sm">{term}</div>
      {definition}
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-space-900"></div>
    </div>
  </div>
);

const EarthStatus = ({ isStorm }) => (
  // INCREASED SIZE: w-28 h-28 (was w-20)
  <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/2/22/Earth_Western_Hemisphere_transparent_background.png" 
      alt="Earth"
      className="w-full h-full object-contain z-10 relative opacity-90" 
    />
    <div className={`absolute inset-0 rounded-full z-0 transition-all duration-1000 ${
      isStorm 
        ? 'bg-red-500/20 shadow-[0_0_60px_rgba(239,68,68,0.6)] animate-pulse' 
        : 'bg-blue-500/10 shadow-[0_0_40px_rgba(59,130,246,0.5)]'
    }`}></div>
  </div>
);

const CosmicWeather = () => {
  const { data: weather, isLoading, isError } = useWeather();

  if (isLoading) return <SkeletonLoader />;
  if (isError) return <ErrorState />;

  const kp = weather?.geomagnetic?.kpIndex || 1;
  const isStorm = kp >= 5;

  const getAuroraStatus = (k) => {
    if (k >= 7) return { text: "Visible Mid-Latitudes!", color: "text-red-300" };
    if (k >= 5) return { text: "Visible Northern US/Europe", color: "text-yellow-300" };
    return { text: "High Latitudes (Poles Only)", color: "text-green-300" };
  };

  const getTechStatus = (k) => {
    if (k >= 6) return { text: "GPS/Radio Issues Likely", color: "text-red-300" };
    if (k >= 4) return { text: "Minor Fluctuations", color: "text-yellow-300" };
    return { text: "Signals Nominal", color: "text-green-300" };
  };

  const aurora = getAuroraStatus(kp);
  const tech = getTechStatus(kp);

  return (
    // UPDATED: h-full ensures it stretches. p-6 adds more breathing room.
    <div className="h-full w-full bg-space-800/60 backdrop-blur-xl rounded-3xl border border-white/10 relative flex flex-col p-6 overflow-visible justify-between">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none z-0">
          <div className={`absolute -right-24 -top-24 w-80 h-80 rounded-full blur-[120px] opacity-20 transition-colors duration-500 ${
            isStorm ? 'bg-red-500' : 'bg-blue-500'
          }`}></div>
      </div>

      {/* HEADER */}
      <div className="relative z-10 flex justify-between items-start mb-4 flex-none">
        <h3 className="text-gray-400 text-sm font-mono uppercase tracking-widest flex items-center font-bold">
             Planetary Defense
             <InfoTooltip 
               term="Magnetosphere Status" 
               definition="Real-time monitor of Earth's magnetic shield against solar radiation." 
             />
        </h3>
        <span className={`px-3 py-1 rounded text-xs font-mono font-bold uppercase border ${
            isStorm ? 'bg-red-900/50 border-red-500 text-red-200' : 'bg-green-900/50 border-green-500 text-green-200'
        }`}>
            {isStorm ? 'Storm Warning' : 'Safe'}
        </span>
      </div>

      {/* MIDDLE CONTENT: Using flex-grow to distribute space naturally */}
      <div className="relative z-10 flex flex-col xl:flex-row items-center gap-6 flex-grow justify-center py-2">
        
        {/* LEFT: Earth (Now Bigger) */}
        <div className="flex flex-col items-center justify-center gap-3">
          <EarthStatus isStorm={isStorm} />
          <div className="text-center">
             <span className={`text-sm font-bold tracking-wider ${isStorm ? 'text-red-400' : 'text-blue-400'}`}>
                {isStorm ? 'CRITICAL' : 'STABLE'}
             </span>
          </div>
        </div>

        {/* RIGHT: Info Cards (Spaced out more) */}
        <div className="flex flex-col gap-3 w-full justify-center">
          
          <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:bg-white/10 transition-colors">
             <div className="flex items-center gap-2 mb-1">
               <MapPin size={16} className="text-purple-400 flex-shrink-0" />
               <span className="text-xs md:text-sm text-gray-200 font-bold">Aurora Forecast</span>
               <InfoTooltip term="Aurora Borealis" definition="Natural light display caused by solar particles." />
             </div>
             <div className={`text-xs md:text-sm font-mono leading-tight ${aurora.color}`}>
               {aurora.text}
             </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:bg-white/10 transition-colors">
             <div className="flex items-center gap-2 mb-1">
               <Radio size={16} className="text-blue-400 flex-shrink-0" />
               <span className="text-xs md:text-sm text-gray-200 font-bold">Tech Impact</span>
               <InfoTooltip term="Interference" definition="Solar storms can disrupt GPS and radio." />
             </div>
             <div className={`text-xs md:text-sm font-mono leading-tight ${tech.color}`}>
               {tech.text}
             </div>
          </div>

        </div>
      </div>

      {/* FOOTER: Adjusted padding and font sizes */}
      <div className="relative z-10 flex gap-8 text-xs text-gray-500 font-mono pt-4 flex-none mt-auto border-t border-white/5">
         <div className="flex items-center gap-2">
           <span className="uppercase tracking-wider">Kp Index:</span>
           <span className="text-white font-bold text-sm">{kp}/9</span>
         </div>
         <div className="flex items-center gap-2">
           <span className="uppercase tracking-wider">Solar Wind:</span>
           <span className="text-white font-bold text-sm">450 km/s</span>
         </div>
      </div>

    </div>
  );
};

// ... Skeleton & Error (Keep same) ...
const SkeletonLoader = () => (
  <div className="h-full w-full bg-space-800/50 rounded-3xl border border-white/5 p-8 animate-pulse flex items-center justify-center">
    <div className="w-28 h-28 bg-white/10 rounded-full"></div>
  </div>
);

const ErrorState = () => (
    <div className="h-full w-full bg-space-800/50 rounded-3xl border border-red-500/20 p-8 flex flex-col justify-center items-center text-center">
        <ShieldAlert className="text-red-400 mb-3 w-8 h-8" />
        <span className="text-sm text-red-200">Sensor Offline</span>
    </div>
);

export default CosmicWeather;