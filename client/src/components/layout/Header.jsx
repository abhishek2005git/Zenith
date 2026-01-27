import React, { useState } from 'react';
import { Search, Bell, LogIn, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx'; // Import hook

const Header = () => {
  const { user, logout } = useAuth(); // <--- MAGIC HAPPENS HERE
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogin = () => {
    const apiUrl = import.meta.env?.VITE_API_URL || 'http://localhost:4000';
    window.open(`${apiUrl}/auth/google`, '_self');
  };

  return (
    <header className="flex justify-between items-center mb-8 px-2 relative z-50">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wide">ZENITH</h1>
        <p className="text-xs text-gray-500 font-mono mt-1">ORBITAL COMMAND CENTER</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Only show "Commander" UI if logged in */}
        {user ? (
          <div className="relative">
            {/* User Chip */}
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-3 pl-4 border-l border-white/10 hover:bg-white/5 p-2 rounded-lg transition-all"
            >
                <div className="text-right hidden md:block">
                    <div className="text-sm text-white font-bold">{user.displayName}</div>
                    <div className="text-[10px] text-space-accent font-mono uppercase">
                        LEVEL 1 COMMANDER
                    </div>
                </div>
                
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-space-accent to-purple-500 p-[1px]">
                    <img src={user.image} alt="Profile" className="w-full h-full rounded-full object-cover" />
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#0B0D17] border border-white/10 rounded-xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-white/5 mb-2">
                        <p className="text-xs text-gray-400">Signed in as</p>
                        <p className="text-sm text-white truncate">{user.email}</p>
                    </div>
                    
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2">
                        <User size={14} /> Profile
                    </button>
                    
                    <button 
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                    >
                        <LogOut size={14} /> Sign Out
                    </button>
                </div>
            )}
          </div>
        ) : (
          <button 
            onClick={handleLogin}
            className="flex items-center gap-2 bg-space-accent/10 hover:bg-space-accent/20 text-space-accent px-5 py-2.5 rounded-lg border border-space-accent/30 transition-all font-mono text-sm tracking-wide"
          >
            <LogIn size={16} />
            INITIALIZE UPLINK
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;