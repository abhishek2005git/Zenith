import React, { useState } from 'react';
import { useLaunchSchedule } from '../hooks/useLaunches';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalIcon, Clock, MapPin, Rocket, AlertCircle } from 'lucide-react';

const Schedule = ({ onOpenDrawer }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const { data: launches, isLoading, isError } = useLaunchSchedule();

  // --- CALENDAR LOGIC ---
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Helper: Find launches for a specific day
  const getLaunchesForDay = (day) => {
    // FIX: Check if 'launches' is actually an array before trying to filter it
    if (!Array.isArray(launches)) return [];
    
    return launches.filter(launch => isSameDay(new Date(launch.net), day));
  };

  const selectedDayLaunches = getLaunchesForDay(selectedDate);

  // Helper: Next/Prev Month
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] gap-6 overflow-hidden">
      
      {/* --- LEFT PANEL: CALENDAR GRID --- */}
      <div className="flex-1 flex flex-col bg-space-900/50 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 flex justify-between items-center border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <p className="text-gray-400 text-xs font-mono uppercase tracking-widest mt-1">
              Tactical Timeline
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 bg-space-accent/10 text-space-accent text-xs font-bold rounded border border-space-accent/30 hover:bg-space-accent/20 transition-colors">
              TODAY
            </button>
            <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Grid Header (Mon, Tue...) */}
        <div className="grid grid-cols-7 border-b border-white/5 bg-black/20">
          {weekDays.map(day => (
            <div key={day} className="py-3 text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="flex-1 grid grid-cols-7 auto-rows-fr bg-black/10">
          {calendarDays.map((day, idx) => {
            const dayLaunches = getLaunchesForDay(day);
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isDayToday = isToday(day);

            return (
              <div 
                key={idx}
                onClick={() => setSelectedDate(day)}
                className={`relative border-r border-b border-white/5 p-2 transition-all cursor-pointer group hover:bg-white/5 ${
                  !isCurrentMonth ? 'bg-black/40 text-gray-600' : ''
                } ${isSelected ? 'bg-white/10' : ''}`}
              >
                {/* Date Number */}
                <span className={`text-sm font-mono ${
                  isDayToday 
                    ? 'bg-space-accent text-black font-bold w-6 h-6 flex items-center justify-center rounded-full' 
                    : isSelected ? 'text-white font-bold' : 'text-gray-400'
                }`}>
                  {format(day, 'd')}
                </span>

                {/* Launch Dots */}
                <div className="mt-2 flex flex-wrap gap-1 content-start">
                  {dayLaunches.map((launch) => (
                    <div 
                      key={launch.id}
                      className={`h-1.5 w-1.5 rounded-full ${
                        launch.status?.abbrev === 'Success' ? 'bg-green-500 shadow-[0_0_5px_#22c55e]' :
                        launch.status?.abbrev === 'Go' ? 'bg-blue-400 shadow-[0_0_5px_#60a5fa]' :
                        'bg-yellow-500'
                      }`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- RIGHT PANEL: SELECTED DATE DETAILS --- */}
      <div className="w-full lg:w-96 flex flex-col h-full bg-space-900 border border-white/10 rounded-3xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-space-800 to-black border-b border-white/10">
          <div className="flex items-center gap-2 text-space-accent mb-2">
            <CalIcon size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">
              {format(selectedDate, 'EEEE')}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-white">
            {format(selectedDate, 'MMM dd')}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {selectedDayLaunches.length} Mission{selectedDayLaunches.length !== 1 && 's'} Scheduled
          </p>
        </div>

        {/* Launch List */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3 bg-black/20">
          {isLoading && <div className="text-center text-gray-500 py-10 animate-pulse">Scanning schedule...</div>}
          
          {!isLoading && selectedDayLaunches.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-60">
              <Rocket size={40} className="mb-4" strokeWidth={1} />
              <p className="text-sm">No launches detected</p>
            </div>
          )}

          {selectedDayLaunches.map((launch) => (
            <div 
              key={launch.id}
              onClick={() => onOpenDrawer(launch)} // Connect to Drawer!
              className="bg-space-800/50 hover:bg-space-800 border border-white/5 hover:border-space-accent/30 p-4 rounded-xl cursor-pointer transition-all group"
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                   launch.status?.abbrev === 'Go' ? 'text-blue-300 border-blue-500/30 bg-blue-500/10' : 'text-gray-400 border-gray-500/30'
                }`}>
                  {launch.status?.abbrev || 'TBD'}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {format(new Date(launch.net), 'HH:mm')} UTC
                </span>
              </div>
              
              <h4 className="text-white font-bold text-sm leading-tight mb-1 group-hover:text-space-accent transition-colors">
                {launch.name.split('|')[1]?.trim() || launch.name}
              </h4>
              <div className="text-xs text-gray-500 truncate mb-3">
                {launch.name.split('|')[0]?.trim()}
              </div>

              <div className="flex items-center gap-2 text-[10px] text-gray-400 border-t border-white/5 pt-2">
                <MapPin size={10} />
                <span className="truncate">{launch.pad?.location?.name}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Schedule;