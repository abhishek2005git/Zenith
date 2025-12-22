import React from 'react';
import { Search, Bell, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="flex justify-between items-center mb-8 px-2">
      {/* Title / Breadcrumbs */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wide">ZENITH</h1>
        <p className="text-xs text-gray-500 font-mono mt-1">ORBITAL COMMAND CENTER</p>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Search Bar (Hidden on mobile) */}
        <div className="hidden md:flex items-center bg-space-800/50 border border-white/10 rounded-full px-4 py-2 w-64 focus-within:border-space-accent/50 transition-colors">
          <Search size={16} className="text-gray-500" />
          <input 
            type="text" 
            placeholder="Search mission ID..." 
            className="bg-transparent border-none outline-none text-sm text-white ml-3 w-full placeholder-gray-600"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-10 h-10 rounded-full bg-space-800 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all">
          <Bell size={18} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="text-right hidden md:block">
            <div className="text-sm text-white font-bold">Commander</div>
            <div className="text-[10px] text-space-accent font-mono">LVL 5 ACCESS</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-space-accent to-purple-500 p-[1px]">
            <div className="w-full h-full rounded-full bg-space-900 flex items-center justify-center overflow-hidden">
               <User size={20} className="text-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;