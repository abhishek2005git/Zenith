import React, { useState, useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import { useISS } from '../hooks/useISS';
import { Maximize, Minus, Plus, Navigation } from 'lucide-react';

const Tracking = () => {
  const globeEl = useRef();
  const { data: iss } = useISS();
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  // 1. Handle Window Resize (Keep globe full screen)
  useEffect(() => {
    const handleResize = () => {
      // Subtracting sidebar width (80px) approximately
      setDimensions({ 
        width: window.innerWidth - (window.innerWidth > 768 ? 80 : 0), 
        height: window.innerHeight 
      });
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Init
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. Auto-Rotate Globe when idle
  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  // 3. Prepare ISS Object for the Globe
  const gData = iss ? [{
    lat: iss.latitude,
    lng: iss.longitude,
    alt: iss.altitude / 10000, // Scale down altitude for visual
    name: "ISS",
    velocity: iss.velocity
  }] : [];

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      
      {/* --- GLOBE VISUALIZATION --- */}
      <Globe
        ref={globeEl}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        atmosphereColor="#3a228a"
        atmosphereAltitude={0.2}
        
        // Render Custom HTML Marker (The Glowing Dot)
        htmlElementsData={gData}
        htmlLat="lat"
        htmlLng="lng"
        htmlAlt="alt"
        htmlElement={d => {
          const el = document.createElement('div');
          el.innerHTML = `
            <div class="relative flex items-center justify-center">
              <div class="absolute w-24 h-24 bg-blue-500/20 rounded-full animate-ping"></div>
              <div class="absolute w-4 h-4 bg-blue-400 rounded-full shadow-[0_0_20px_rgba(59,130,246,1)] border-2 border-white"></div>
              <div class="absolute top-6 whitespace-nowrap bg-black/80 text-blue-300 text-[10px] font-mono px-2 py-1 rounded border border-blue-500/30 backdrop-blur-md">
                ISS (Live)
              </div>
            </div>
          `;
          return el;
        }}
      />

      {/* --- OVERLAY: HEADER --- */}
      <div className="absolute top-8 left-8 z-10">
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
          Orbital Command
        </h1>
        <p className="text-gray-400 text-sm font-mono max-w-md">
          Real-time telemetry and 3D positioning system.
        </p>
      </div>

      {/* --- OVERLAY: TELEMETRY CARD --- */}
      {iss && (
        <div className="absolute top-8 right-8 z-10 bg-space-900/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl w-64 shadow-2xl">
           <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-xs font-bold text-white uppercase tracking-widest">Signal Locked</span>
           </div>
           
           <div className="space-y-4">
             <div>
               <div className="text-[10px] text-gray-500 font-mono uppercase mb-1">Coordinates</div>
               <div className="text-white font-mono text-sm">
                 {iss.latitude.toFixed(2)}° N, {iss.longitude.toFixed(2)}° E
               </div>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
               <div>
                  <div className="text-[10px] text-gray-500 font-mono uppercase mb-1">Altitude</div>
                  <div className="text-space-accent font-bold font-mono">
                    {Math.round(iss.altitude)} km
                  </div>
               </div>
               <div>
                  <div className="text-[10px] text-gray-500 font-mono uppercase mb-1">Velocity</div>
                  <div className="text-white font-bold font-mono">
                    {Math.round(iss.velocity / 1000)}k km/h
                  </div>
               </div>
             </div>
           </div>
        </div>
      )}

      {/* --- OVERLAY: FOOTER CONTROLS --- */}
      <div className="absolute bottom-8 right-8 z-10 flex flex-col gap-2">
         <button 
           onClick={() => {
             // Fly to ISS position
             if (iss && globeEl.current) {
               globeEl.current.pointOfView({ lat: iss.latitude, lng: iss.longitude, altitude: 2 }, 2000);
             }
           }}
           className="p-3 bg-space-800 text-white rounded-xl hover:bg-space-700 transition-colors border border-white/10"
           title="Locate ISS"
         >
           <Navigation size={20} />
         </button>
      </div>

    </div>
  );
};

export default Tracking;