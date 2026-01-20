import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import FavoriteButton from './FavoriteButton';

const MissionCard = ({ mission, onClick }) => {
  const statusName = mission.status?.abbrev || mission.status?.name || mission.status || 'TBD';
  
  const statusColor = ['Success', 'Go'].includes(statusName) 
    ? 'text-green-400 bg-green-500/10 border-green-500/20' 
    : ['Failure', 'Hold'].includes(statusName)
    ? 'text-red-400 bg-red-500/10 border-red-500/20'
    : 'text-blue-400 bg-blue-500/10 border-blue-500/20';

  const getSmartImage = () => {
    if (mission.image) return mission.image;
    const rName = (mission.rocket?.configuration?.name || '').toLowerCase();
    const agency = (mission.launch_service_provider?.name || '').toLowerCase();
    
    if (rName.includes('falcon') || rName.includes('starship')) return "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=800"; 
    if (rName.includes('electron')) return "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?q=80&w=800"; 
    
    const genericImages = [
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800", 
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800", 
      "https://images.unsplash.com/photo-1542382257-80dedb725088?q=80&w=800", 
    ];

    const idStr = mission.id || 'default';
    let hash = 0;
    for (let i = 0; i < idStr.length; i++) hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
    return genericImages[Math.abs(hash) % genericImages.length];
  };

  return (
    <div 
      onClick={onClick}
      className="group bg-space-800/50 hover:bg-space-800 border border-white/5 hover:border-space-accent/30 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col shadow-lg hover:shadow-space-accent/10 relative"
    >
      <div className="h-40 bg-black relative overflow-hidden">
        <img 
          src={getSmartImage()} 
          alt={mission.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
        />
        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/60 to-transparent" />
        
        <div className="absolute top-3 left-3 z-20">
           <FavoriteButton launchId={mission.id} />
        </div>

        <div className="absolute top-3 right-3">
           <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase backdrop-blur-md ${statusColor}`}>
             {statusName}
           </span>
        </div>
      </div>

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
             <span>{mission.net ? format(new Date(mission.net), 'MMM dd, yyyy') : 'TBD'}</span>
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

export default MissionCard;