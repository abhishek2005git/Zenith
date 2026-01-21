import React from 'react';
import { useUpcomingLaunches } from '../../hooks/useLaunches.js';
import { format } from 'date-fns';
import { Calendar, Rocket, MapPin, AlertCircle, ChevronRight } from 'lucide-react';
import CalendarSyncButton from './CalendarSyncButton.jsx';

/**
 * Mission Timeline - Scrollable Fleet Schedule
 * Updated with Integrated Calendar Synchronization and Optimized Tactical UI.
 */
const MissionTimeline = ({ onSelectMission }) => {
  const { data: launches, isLoading, isError } = useUpcomingLaunches();

  if (isLoading) return <TimelineSkeleton />;
  
  if (isError) {
    return (
      <div className="h-full bg-[#0B0D17]/60 rounded-3xl border border-red-500/30 p-6 flex flex-col items-center justify-center text-center">
        <AlertCircle className="text-red-400 mb-3" size={32} />
        <h3 className="text-white font-bold text-sm mb-1">Telemetry Interrupted</h3>
        <p className="text-[10px] text-gray-500 font-mono">EXTERNAL API UPLINK OFFLINE</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#0B0D17]/40 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden flex flex-col w-full">
      
      {/* Header - Tactical Status */}
      <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#0B0D17]/50 flex-none">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-space-accent/10 rounded-lg">
            <Calendar size={14} className="text-space-accent" />
          </div>
          <h3 className="text-white text-xs font-mono uppercase tracking-widest font-bold">
            Flight Schedule
          </h3>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] text-gray-500 font-mono">UPLINK ACTIVE</span>
        </div>
      </div>

      {/* Scrollable Mission List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {launches?.map((launch) => (
          <div 
            key={launch.id}
            className="group relative bg-white/5 hover:bg-white/10 border border-white/5 hover:border-space-accent/30 rounded-2xl p-4 transition-all duration-300"
          >
            <div className="flex items-start gap-4 mb-4">
              {/* Date Block */}
              <div className="flex flex-col items-center justify-center bg-black/40 rounded-xl h-14 w-14 border border-white/5 flex-shrink-0">
                <span className="text-[9px] text-gray-500 font-mono uppercase mb-0.5 tracking-tighter">
                  {launch.net ? format(new Date(launch.net), 'MMM') : '-'}
                </span>
                <span className="text-lg font-bold text-white font-mono leading-none">
                  {launch.net ? format(new Date(launch.net), 'dd') : '-'}
                </span>
              </div>

              {/* Mission Metadata */}
              <div className="flex-1 min-w-0" onClick={() => onSelectMission && onSelectMission(launch)}>
                <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-white font-bold text-sm group-hover:text-space-accent transition-colors truncate cursor-pointer">
                        {launch.name.split('|')[1]?.trim() || launch.name}
                    </h4>
                    <ChevronRight size={14} className="text-gray-700 group-hover:text-white transition-colors" />
                </div>
                
                <div className="flex items-center gap-3 text-[10px] text-gray-500 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Rocket size={10} className="text-gray-600" />
                    {launch.agency}
                  </span>
                  <span className="flex items-center gap-1.5 truncate">
                    <MapPin size={10} className="text-gray-600" />
                    {launch.location?.split(',')[0] || 'TBD'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tactical Footer: Status & Sync Action */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${
                    launch.status === 'Go' || launch.status === 'Success'
                    ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                    : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                }`}>
                    {launch.status || 'TBC'}
                </div>

                <CalendarSyncButton launch={launch} />
            </div>
          </div>
        ))}
      </div>

      {/* Footer Navigation */}
      <div className="p-4 border-t border-white/5 bg-[#0B0D17]/30 flex-none">
        <button className="w-full py-2 text-[10px] text-gray-500 hover:text-white font-mono uppercase tracking-widest transition-colors border border-transparent hover:border-white/10 rounded-lg">
          Load Archival Mission Logs
        </button>
      </div>
    </div>
  );
};

const TimelineSkeleton = () => (
  <div className="h-full bg-[#0B0D17]/60 rounded-3xl border border-white/5 p-6 flex flex-col gap-4 animate-pulse">
    <div className="h-4 w-32 bg-white/5 rounded"></div>
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-24 bg-white/5 rounded-2xl w-full"></div>
    ))}
  </div>
);

export default MissionTimeline;