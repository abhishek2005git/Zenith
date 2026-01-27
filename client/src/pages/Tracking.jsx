import React, { useState, useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import { useISS } from '../hooks/useISS';
import { Maximize, Minus, Plus, Navigation, Crosshair, Zap, Globe as GlobeIcon } from 'lucide-react';

/**
 * PATH: client/src/pages/Tracking.jsx
 * Optimization: Responsive HUD layout for 3D Globe Telemetry.
 */
const Tracking = () => {
  const globeEl = useRef();
  const { data: iss } = useISS();
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  // 1. Handle Window Resize (Respecting sidebar/bottom-nav)
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setDimensions({ 
        width: window.innerWidth - (isMobile ? 0 : 80), 
        // Subtract bottom nav height on mobile (approx 64px)
        height: window.innerHeight - (isMobile ? 64 : 0) 
      });
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. Auto-Rotate Globe
  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  const gData = iss ? [{
    lat: iss.latitude,
    lng: iss.longitude,
    alt: iss.altitude / 10000,
    name: "ISS",
    velocity: iss.velocity
  }] : [];

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex flex-col">
      
      {/* --- 🛰️ TACTICAL OVERLAY (Responsive) --- */}
      <div className="absolute top-0 left-0 w-full z-20 p-4 md:p-8 pointer-events-none">
        <div className="flex flex-col md:flex-row md:justify-between items-start gap-4">
          
          {/* Header Section */}
          <div className="pointer-events-auto">
            <h1 className="text-xl md:text-4xl font-bold text-white tracking-tight leading-none">
              Orbital Command
            </h1>
            <p className="text-[10px] md:text-sm text-gray-500 font-mono mt-1 md:mt-2 uppercase tracking-widest">
              Real-time Telemetry Uplink
            </p>
          </div>

          {/* Telemetry Card (Pill style on mobile, Card on desktop) */}
          {iss && (
            <div className="pointer-events-auto w-full md:w-64 bg-space-900/80 backdrop-blur-xl border border-white/10 p-3 md:p-6 rounded-xl md:rounded-2xl shadow-2xl">
               <div className="flex items-center justify-between md:justify-start gap-3 mb-2 md:mb-4 md:border-b md:border-white/10 md:pb-4">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Signal Locked</span>
                 </div>
                 <span className="md:hidden text-[8px] text-space-accent font-mono uppercase opacity-50">Z-ISS-Active</span>
               </div>
               
               <div className="grid grid-cols-3 md:grid-cols-1 gap-2 md:gap-4">
                 <div>
                   <div className="text-[7px] md:text-[10px] text-gray-500 font-mono uppercase mb-0.5 md:mb-1">Position</div>
                   <div className="text-white font-mono text-[10px] md:text-sm whitespace-nowrap">
                     {iss.latitude.toFixed(2)}°N, {iss.longitude.toFixed(2)}°E
                   </div>
                 </div>
                 
                 <div className="flex md:grid md:grid-cols-2 gap-4">
                   <div>
                      <div className="text-[7px] md:text-[10px] text-gray-500 font-mono uppercase mb-0.5 md:mb-1">Alt</div>
                      <div className="text-space-accent font-bold font-mono text-[10px] md:text-sm">
                        {Math.round(iss.altitude)}km
                      </div>
                   </div>
                   <div className="ml-auto md:ml-0">
                      <div className="text-[7px] md:text-[10px] text-gray-500 font-mono uppercase mb-0.5 md:mb-1">Vel</div>
                      <div className="text-white font-bold font-mono text-[10px] md:text-sm">
                        {Math.round(iss.velocity / 1000)}k km/h
                      </div>
                   </div>
                 </div>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* --- 🌍 GLOBE VISUALIZATION --- */}
      <div className="flex-1 cursor-grab active:cursor-grabbing">
        <Globe
          ref={globeEl}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          atmosphereColor="#3a228a"
          atmosphereAltitude={0.2}
          
          htmlElementsData={gData}
          htmlLat="lat"
          htmlLng="lng"
          htmlAlt="alt"
          htmlElement={d => {
            const el = document.createElement('div');
            el.innerHTML = `
              <div class="relative flex items-center justify-center">
                <div class="absolute w-12 h-12 md:w-24 md:h-24 bg-blue-500/20 rounded-full animate-ping"></div>
                <div class="absolute w-3 h-3 md:w-4 md:h-4 bg-blue-400 rounded-full shadow-[0_0_20px_rgba(59,130,246,1)] border-2 border-white"></div>
                <div class="absolute top-6 whitespace-nowrap bg-black/80 text-blue-300 text-[8px] md:text-[10px] font-mono px-2 py-1 rounded border border-blue-500/30 backdrop-blur-md pointer-events-none">
                  ISS (Live)
                </div>
              </div>
            `;
            return el;
          }}
        />
      </div>

      {/* --- 🕹️ NAVIGATION CONTROLS --- */}
      <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 z-20 flex flex-col gap-2">
         <button 
           onClick={() => {
             if (iss && globeEl.current) {
               globeEl.current.pointOfView({ lat: iss.latitude, lng: iss.longitude, altitude: 2 }, 2000);
             }
           }}
           className="p-3 bg-space-800/80 backdrop-blur-md text-white rounded-xl hover:bg-space-accent hover:text-black transition-all border border-white/10 shadow-lg"
           title="Locate ISS"
         >
           <Navigation size={18} />
         </button>
      </div>

      {/* Noise/Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
    </div>
  );
};

export default Tracking;