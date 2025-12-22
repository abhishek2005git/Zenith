import React, { useEffect } from 'react';
import { useISS } from '../../hooks/useISS';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, Activity, Satellite } from 'lucide-react'; // Added Satellite icon

// --- CUSTOM ISS ICON ---
const issIcon = new L.DivIcon({
  className: 'custom-iss-icon',
  html: `
    <div class="relative">
      <div class="absolute -left-6 -top-6 w-12 h-12 border border-blue-400/30 rounded-full animate-ping"></div>
      <div class="absolute -left-3 -top-3 w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_20px_rgba(59,130,246,0.8)]"></div>
    </div>
  `,
  iconSize: [0, 0],
  iconAnchor: [0, 0],
});

// --- MAP CONTROLLER ---
const MapController = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], map.getZoom(), { animate: true, duration: 1.5 });
    }
  }, [lat, lng, map]);
  return null;
};

const ISSTracker = () => {
  const { data: iss, isLoading } = useISS();

  if (isLoading) return <SkeletonLoader />;

  const position = iss ? [iss.latitude, iss.longitude] : [0, 0];

  return (
    <div className="col-span-1 md:col-span-2 h-full min-h-[300px] relative group overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-space-900 flex flex-col">
      
      {/* 1. HEADER OVERLAY */}
      <div className="absolute top-0 left-0 right-0 p-5 z-[400] flex justify-between items-start pointer-events-none">
        
        {/* UPDATED: Explicit Title Badge */}
        <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2 pointer-events-auto shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-[10px] font-mono uppercase text-white tracking-widest font-bold flex items-center gap-2">
            ISS LIVE TRACKING
          </span>
        </div>
        
        {/* Live Data Box */}
        {iss && (
          <div className="flex flex-col gap-1 pointer-events-auto">
             <div className="bg-black/80 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 text-right shadow-xl">
                <div className="text-[9px] text-gray-400 font-mono uppercase tracking-wider mb-0.5">Velocity</div>
                <div className="text-sm font-bold text-space-accent font-mono">
                  {Math.round(iss.velocity).toLocaleString()} <span className="text-[10px] text-gray-500">km/h</span>
                </div>
             </div>
             <div className="bg-black/80 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 text-right shadow-xl">
                <div className="text-[9px] text-gray-400 font-mono uppercase tracking-wider mb-0.5">Altitude</div>
                <div className="text-sm font-bold text-white font-mono">
                  {Math.round(iss.altitude)} <span className="text-[10px] text-gray-500">km</span>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* 2. LEAFLET MAP */}
      <div className="relative flex-1 bg-black z-0">
         <MapContainer 
            center={position} 
            zoom={3} 
            scrollWheelZoom={false} 
            className="w-full h-full bg-[#0a0a0a]"
            zoomControl={false} 
            dragging={true}
         >
            {/* SATELLITE TILES (The Best Look) */}
            <TileLayer
              attribution='&copy; Esri'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
            
            {/* Dark Overlay to make text pop (Optional: remove 'opacity-20' if you want brighter map) */}
            <div className="absolute inset-0 bg-black/20 pointer-events-none z-[300]"></div>
            
            {iss && (
              <>
                <Marker position={position} icon={issIcon} />
                <MapController lat={iss.latitude} lng={iss.longitude} />
              </>
            )}
         </MapContainer>
      </div>

      {/* 3. FOOTER OVERLAY */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent z-[400] flex justify-between items-end pointer-events-none">
         <div className="pointer-events-auto">
            {/* UPDATED: Clear Name Label */}
            <div className="flex items-center gap-2 mb-1 text-gray-300">
                <Satellite size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">International Space Station</span>
            </div>
            <p className="text-xs text-white font-mono pl-6">
               LAT: {iss?.latitude.toFixed(4)}&deg; &nbsp; LNG: {iss?.longitude.toFixed(4)}&deg;
            </p>
         </div>
         <Navigation className="text-gray-500" size={16} />
      </div>

    </div>
  );
};

const SkeletonLoader = () => (
  <div className="col-span-1 md:col-span-2 h-full min-h-[300px] bg-space-800 rounded-3xl animate-pulse border border-white/10 relative overflow-hidden flex items-center justify-center">
     <Activity className="text-white/10 w-16 h-16" />
  </div>
);

export default ISSTracker;