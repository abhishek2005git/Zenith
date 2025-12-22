import React, { useState, useEffect } from 'react';
import { useAPOD } from '../../hooks/useAstronomy';
import { Sparkles, Maximize2, X, PlayCircle, ImageOff, ExternalLink, Minimize2 } from 'lucide-react';

const DailyAstronomy = () => {
  const { data: apod, isLoading, isError } = useAPOD();
  const [isExpanded, setIsExpanded] = useState(false);

  // --- 1. LOCK BODY SCROLL WHEN MODAL IS OPEN ---
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden'; // Freeze background
    } else {
      document.body.style.overflow = 'unset';  // Unfreeze
    }
    return () => {
      document.body.style.overflow = 'unset'; // Cleanup
    };
  }, [isExpanded]);

  if (isLoading) return <SkeletonLoader />;
  if (isError) return <ErrorState />;

  const isVideo = apod?.media_type === 'video';
  const fallbackImage = "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2048&auto=format&fit=crop";

  return (
    <>
      {/* --- WIDGET CARD (The Dashboard View) --- */}
      <div className="col-span-1 md:col-span-2 h-full relative group overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-space-900 flex flex-col">
        
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          {isVideo ? (
            <>
               {/* Fallback image prevents black void while video loads */}
               <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${fallbackImage})` }} />
               {/* Pointer-events-none ensures you can't click the video in card mode */}
               <div className="absolute inset-0 bg-black/40" /> 
               <iframe 
                  src={`${apod.url}&autoplay=0&mute=1&controls=0&loop=1`} 
                  className="absolute inset-0 w-full h-full scale-[1.5] opacity-50 pointer-events-none grayscale hover:grayscale-0 transition-all duration-700"
                  title="APOD Background"
              />
            </>
          ) : (
            <div 
              className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${apod.url})` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-space-900 via-space-900/60 to-transparent" />
        </div>

        {/* Card Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end z-10 pointer-events-none">
          <div className="self-start mb-auto pointer-events-auto">
               <span className="bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-mono uppercase text-space-accent flex items-center gap-2 shadow-lg">
                  <Sparkles size={12} />
                  APOD
               </span>
          </div>
          <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white leading-tight drop-shadow-lg line-clamp-1">
                  {apod.title}
              </h2>
              <p className="text-gray-300 text-sm line-clamp-2 max-w-xl drop-shadow-md">
                  {apod.explanation}
              </p>
          </div>
          <div className="flex items-center gap-4 mt-4 pointer-events-auto">
              <button 
                  onClick={() => setIsExpanded(true)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2 rounded-lg text-xs font-bold text-white transition-all backdrop-blur-md"
              >
                  <Maximize2 size={14} />
                  Read Full Story
              </button>
          </div>
        </div>
      </div>

      {/* --- CINEMA MODE (Full Screen Modal) --- */}
      {isExpanded && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8">
          
          {/* Backdrop (Closes on click) */}
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsExpanded(false)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-5xl bg-space-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh]">
            
            {/* LEFT: Media Section (Video/Image) */}
            {/* FIX: 'aspect-video' forces 16:9 ratio so it never collapses to 0 height */}
            <div className="w-full md:w-[60%] bg-black relative aspect-video md:aspect-auto">
               {isVideo ? (
                 <iframe 
                    src={apod.url} 
                    className="w-full h-full absolute inset-0"
                    title="APOD Full Video"
                    allow="autoplay; encrypted-media; fullscreen"
                    allowFullScreen
                 />
               ) : (
                 <img 
                    src={apod.hdurl || apod.url} 
                    alt={apod.title}
                    className="w-full h-full object-cover"
                 />
               )}
               
               {/* Mobile Close Button */}
               <button 
                 onClick={() => setIsExpanded(false)}
                 className="absolute top-4 right-4 md:hidden bg-black/50 p-2 rounded-full text-white backdrop-blur-md z-20"
               >
                 <X size={20} />
               </button>
            </div>

            {/* RIGHT: Text Content */}
            <div className="w-full md:w-[40%] flex flex-col bg-space-900 border-l border-white/10">
               
               {/* Header (Sticky) */}
               <div className="p-6 md:p-8 pb-4 flex justify-between items-start border-b border-white/5">
                 <div>
                   <span className="text-space-accent text-xs font-mono uppercase tracking-widest mb-2 block">
                     {apod.date}
                   </span>
                   <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                     {apod.title}
                   </h2>
                 </div>
                 {/* Desktop Close Button */}
                 <button 
                   onClick={() => setIsExpanded(false)}
                   className="hidden md:block text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-lg"
                 >
                   <X size={20} />
                 </button>
               </div>

               {/* Scrollable Text Area */}
               <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                 <div className="prose prose-invert prose-sm text-gray-300 leading-relaxed">
                   {apod.explanation}
                 </div>
               </div>

               {/* Footer (Copyright) */}
               <div className="p-6 border-t border-white/5 bg-black/20 text-xs text-gray-500 flex justify-between items-center">
                  <span>© {apod.copyright ? apod.copyright.trim() : 'Public Domain'}</span>
                  {apod.hdurl && !isVideo && (
                    <a href={apod.hdurl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-space-accent hover:underline">
                       <ExternalLink size={12} /> HD Image
                    </a>
                  )}
               </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

// ... Skeleton & Error (Keep existing) ...
const SkeletonLoader = () => (
    <div className="col-span-1 md:col-span-2 h-full bg-space-800 rounded-3xl animate-pulse p-6 flex flex-col justify-end border border-white/10 min-h-[300px]">
        <div className="h-4 w-32 bg-white/10 rounded mb-auto"></div>
        <div className="h-8 w-3/4 bg-white/10 rounded mb-2"></div>
        <div className="h-4 w-1/2 bg-white/10 rounded mb-4"></div>
        <div className="h-10 w-full bg-white/5 rounded"></div>
    </div>
);

const ErrorState = () => (
    <div className="col-span-1 md:col-span-2 h-full bg-space-900 rounded-3xl border border-white/10 p-6 flex flex-col items-center justify-center text-center text-gray-500">
        <ImageOff size={48} className="mb-4 opacity-50" />
        <p className="text-sm">Unable to load daily astronomy content.</p>
    </div>
);

export default DailyAstronomy;