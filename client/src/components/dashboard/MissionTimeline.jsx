import React from 'react';
import { useUpcomingLaunches } from '../../hooks/useLaunches';
import { format } from 'date-fns';
import { Calendar, Rocket, MapPin, AlertCircle } from 'lucide-react';

const MissionTimeline = ({ onSelectMission }) => {
  const { data: launches, isLoading, isError, error } = useUpcomingLaunches();

  if (isLoading) return <TimelineSkeleton />;
  
  if (isError) {
    return (
      <div className="h-full bg-space-800/60 rounded-3xl border border-red-500/30 p-4 flex flex-col items-center justify-center text-center">
        <AlertCircle className="text-red-400 mb-2" size={24} />
        <h3 className="text-white font-bold text-sm">Unavailable</h3>
      </div>
    );
  }

  if (!Array.isArray(launches)) return null;

  return (
    // FIX 1: Removed 'col-span' classes (Parent handles layout now)
    <div className="h-full bg-space-800/60 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden flex flex-col w-full">
      
      {/* Header */}
      {/* FIX 2: Reduced padding from 'p-6' to 'p-4' */}
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-space-900/50 flex-none">
        <h3 className="text-gray-400 text-xs font-mono uppercase tracking-widest flex items-center gap-2 font-bold">
          <Calendar size={14} />
          Flight Schedule
        </h3>
        <span className="text-[9px] bg-white/10 px-2 py-1 rounded text-gray-400 font-mono">
          NEXT 10
        </span>
      </div>

      {/* Scrollable List */}
      {/* FIX 3: Reduced padding from 'p-4' to 'p-3' */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
        {launches.map((launch) => (
          <div 
            key={launch.id}
            onClick={() => onSelectMission && onSelectMission(launch)}
            // FIX 4: Compact item padding ('p-3' instead of 'p-4')
            className="group relative bg-white/5 hover:bg-white/10 border border-white/5 hover:border-space-accent/50 rounded-xl p-3 transition-all duration-300 cursor-pointer"
          >
            <div className="flex justify-between items-center gap-3">
              
              {/* Date Box (Compact) */}
              {/* FIX 5: Fixed width 'w-12' to prevent squishing */}
              <div className="flex flex-col items-center justify-center bg-black/30 rounded-lg h-12 w-12 border border-white/5 flex-shrink-0">
                <span className="text-[9px] text-gray-400 font-mono uppercase leading-none mb-0.5">
                  {launch.net ? format(new Date(launch.net), 'MMM') : '-'}
                </span>
                <span className="text-sm font-bold text-white font-mono leading-none">
                  {launch.net ? format(new Date(launch.net), 'dd') : '-'}
                </span>
              </div>

              {/* Info Middle */}
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-bold text-xs md:text-sm group-hover:text-space-accent transition-colors truncate">
                  {launch.name.split('|')[1]?.trim() || launch.name}
                </h4>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-400">
                  <span className="flex items-center gap-1 truncate max-w-[80px]">
                    <Rocket size={10} />
                    {launch.agency}
                  </span>
                  <span className="hidden sm:flex items-center gap-1 truncate max-w-[80px]">
                    <MapPin size={10} />
                    {launch.location ? launch.location.split(',')[0] : 'Unknown'}
                  </span>
                </div>
              </div>

              {/* Status Pill (Tiny) */}
              {/* FIX 6: Smaller text and padding */}
              <div className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase tracking-wider flex-shrink-0 ${
                launch.status === 'Go' 
                  ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                  : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
              }`}>
                {launch.status || 'TBC'}
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TimelineSkeleton = () => (
  <div className="h-full bg-space-800/60 rounded-3xl border border-white/10 p-4 flex flex-col gap-3 animate-pulse">
    <div className="h-5 w-24 bg-white/10 rounded"></div>
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-16 bg-white/5 rounded-xl w-full"></div>
    ))}
  </div>
);

export default MissionTimeline;