import React from 'react';
import { LayoutDashboard, Rocket, Globe, Calendar, Settings, LogOut, Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Rocket, label: 'Missions', path: '/missions' },
    { icon: Heart, label: 'My Fleet', path: '/favorites' }, // New Favorites Link
    { icon: Globe, label: 'Tracking', path: '/tracking' },
    { icon: Calendar, label: 'Schedule', path: '/schedule' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 bg-space-900 border-r border-white/10 flex flex-col items-center py-8 z-50 hidden md:flex">
      <div className="mb-12">
        <div className="w-10 h-10 bg-space-accent rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.5)]">
          <Rocket className="text-black rotate-45" size={24} />
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-6 w-full px-4">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={index}
              to={item.path}
              className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-300 group relative ${
                isActive 
                  ? 'bg-white/10 text-space-accent shadow-[0_0_15px_rgba(56,189,248,0.2)]' 
                  : 'text-gray-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={22} strokeWidth={1.5} />
              
              <span className="absolute left-full ml-4 px-2 py-1 bg-space-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10 z-50">
                {item.label}
              </span>
              
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-space-accent rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-6 w-full px-4">
        <button className="w-full aspect-square rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-colors">
          <Settings size={22} strokeWidth={1.5} />
        </button>
        <button 
          onClick={logout}
          className="w-full aspect-square rounded-xl flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={22} strokeWidth={1.5} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;