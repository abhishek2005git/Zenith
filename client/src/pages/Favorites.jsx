import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useUpcomingLaunches, usePastLaunches } from '../hooks/useLaunches';
import { Heart, Rocket, ArrowRight, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import MissionCard from '../components/ui/MissionCard';

const Favorites = ({ onOpenDrawer }) => {
  const { user } = useAuth();
  const { data: upcoming } = useUpcomingLaunches();
  const { data: past } = usePastLaunches();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-20 h-20 bg-space-800 rounded-full flex items-center justify-center mb-6 border border-white/10">
          <ShieldAlert className="text-space-accent" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Uplink Required</h2>
        <p className="text-gray-400 max-w-sm mb-8">Establish a secure connection to access your personal Fleet Command.</p>
        <button 
          onClick={() => {
            // Ensuring base URL is correctly accessed for environment-specific redirects
            const apiUrl = import.meta.env?.VITE_API_URL || 'http://localhost:4000';
            window.open(`${apiUrl}/auth/google`, '_self');
          }}
          className="bg-space-accent text-black px-8 py-3 rounded-xl font-bold hover:bg-white transition-colors"
        >
          LOG IN TO ZENITH
        </button>
      </div>
    );
  }

  const allMissions = [...(upcoming || []), ...(past || [])];
  const favoriteMissions = allMissions.filter(m => user.favorites?.includes(m.id));

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Fleet</h1>
        <p className="text-gray-400 text-sm font-mono uppercase tracking-tighter">Command Profile: {user.displayName} // Saved Objectives</p>
      </div>

      {favoriteMissions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20 overflow-y-auto custom-scrollbar pr-2">
          {favoriteMissions.map((mission) => (
            <MissionCard 
              key={mission.id} 
              mission={mission} 
              onClick={() => onOpenDrawer(mission)} 
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 text-center bg-white/5 border border-dashed border-white/10 rounded-3xl m-4">
          <Heart size={60} className="text-gray-700 mb-6" />
          <h3 className="text-xl font-bold text-white mb-2">Fleet Empty</h3>
          <p className="text-gray-500 mb-8 max-w-xs text-sm">You haven't flagged any missions for priority tracking yet.</p>
          <Link to="/missions" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-2 rounded-full text-xs font-mono transition-all">
            GO TO MISSION ARCHIVES <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Favorites;