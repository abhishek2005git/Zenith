import React from 'react';
import { LayoutDashboard, Rocket, Globe, Calendar, LogOut, Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * PATH: client/src/components/layout/Sidebar.jsx
 * Updated: Responsive design with fixed import resolution for AuthContext.
 */
const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dash', path: '/' },
    { icon: Rocket, label: 'Missions', path: '/missions' },
    { icon: Heart, label: 'Fleet', path: '/favorites' },
    { icon: Globe, label: 'Track', path: '/tracking' },
    { icon: Calendar, label: 'Plan', path: '/schedule' },
  ];

  return (
    <>
      {/* 🖥️ DESKTOP SIDEBAR (Visible on md+) */}
      <aside className="fixed left-0 top-0 h-screen w-20 bg-space-900/40 backdrop-blur-xl border-r border-white/10 flex-col items-center py-8 z-50 hidden md:flex">
        {/* Brand Logo */}
        <div className="mb-12">
          <Link 
            to="/" 
            className="group relative w-12 h-12 flex items-center justify-center bg-space-accent/10 rounded-xl border border-space-accent/20 hover:border-space-accent/50 transition-all duration-500 shadow-[0_0_20px_rgba(56,189,248,0.1)]"
          >
            <svg viewBox="0 0 100 100" className="w-8 h-8 fill-none stroke-space-accent stroke-[6]">
              <circle cx="50" cy="50" r="35" className="opacity-20" />
              <path d="M15 50 A35 35 0 0 1 85 50" className="stroke-space-accent" strokeLinecap="round" />
              <path d="M50 25 L55 45 L75 50 L55 55 L50 75 L45 55 L25 50 L45 45 Z" fill="currentColor" />
            </svg>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="flex-1 flex flex-col gap-6 w-full px-4">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-300 group relative ${
                  isActive ? 'bg-white/10 text-space-accent' : 'text-gray-500 hover:text-white'
                }`}
              >
                <item.icon size={22} strokeWidth={1.5} />
                <span className="absolute left-full ml-4 px-2 py-1 bg-space-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 z-50">
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-space-accent rounded-r-full shadow-[0_0_10px_rgba(56,189,248,1)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-4">
          <button 
            onClick={logout} 
            className="w-full aspect-square rounded-xl flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={22} strokeWidth={1.5} />
          </button>
        </div>
      </aside>

      {/* 📱 MOBILE BOTTOM NAV (Visible on small screens) */}
      <nav className="fixed bottom-0 left-0 w-full h-16 bg-black/80 backdrop-blur-2xl border-t border-white/10 flex md:hidden items-center justify-around px-2 z-50 pb-safe">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors relative ${
                isActive ? 'text-space-accent' : 'text-gray-500'
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-[9px] font-mono uppercase tracking-tighter">
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 w-8 h-0.5 bg-space-accent shadow-[0_0_10px_rgba(56,189,248,1)]" />
              )}
            </Link>
          );
        })}
        
        {/* Mobile Logout */}
        <button 
          onClick={logout}
          className="flex flex-col items-center justify-center gap-1 flex-1 h-full text-red-500/60"
        >
          <LogOut size={18} strokeWidth={1.5} />
          <span className="text-[9px] font-mono uppercase tracking-tighter">Exit</span>
        </button>
      </nav>
    </>
  );
};

export default Sidebar;