import React, { useState } from 'react';
import { Calendar, Check, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';

const CalendarSyncButton = ({ launch }) => {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handleSync = async (e) => {
    e.stopPropagation();
    setStatus('loading');

    try {
      // Pointing to your server on port 4000
      await axios.post('http://localhost:4000/api/calendar/add-launch', {
        launchId: launch.id,
        name: launch.name,
        net: launch.net,
        padLocation: launch.pad?.location?.name || launch.pad || "Orbital Site",
        description: launch.mission?.description || "Zenith Tracking Mission"
      }, { withCredentials: true });

      setStatus('success');
    } catch (err) {
      console.error("Calendar Sync Failed:", err);
      setStatus('error');
      // Reset after 3 seconds so they can try again if it was a network glitch
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <button
      onClick={handleSync}
      disabled={status === 'loading' || status === 'success'}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-mono tracking-widest transition-all duration-300 border ${
        status === 'success' 
          ? 'bg-green-500/10 border-green-500/50 text-green-400' 
          : status === 'error'
          ? 'bg-red-500/10 border-red-500/50 text-red-400'
          : 'bg-space-accent/5 border-space-accent/20 text-space-accent hover:bg-space-accent hover:text-black'
      }`}
    >
      {status === 'loading' ? (
        <Loader2 size={12} className="animate-spin" />
      ) : status === 'success' ? (
        <Check size={12} />
      ) : status === 'error' ? (
        <AlertCircle size={12} />
      ) : (
        <Calendar size={12} />
      )}
      
      {status === 'loading' ? 'SYNCING...' : status === 'success' ? 'IN CALENDAR' : status === 'error' ? 'RE-LOG REQUIRED' : 'ADD TO CALENDAR'}
    </button>
  );
};

export default CalendarSyncButton;