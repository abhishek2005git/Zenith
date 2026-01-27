import React, { useEffect, useState } from 'react';
import { ShieldAlert, X, Info, CheckCircle } from 'lucide-react';

/**
 * Tactical Toast - Mission Status Alerts
 * @param {string} message - The message to display
 * @param {string} type - 'error' | 'info' | 'success'
 * @param {function} onClose - Callback to close toast
 */
const Toast = ({ message, type = 'error', onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entry animation
    setIsVisible(true);
    
    // Auto-close after 5 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Wait for exit animation before unmounting
    setTimeout(onClose, 500); 
  };

  const themes = {
    error: {
      border: 'border-red-500/50',
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      icon: <ShieldAlert size={18} />
    },
    info: {
      border: 'border-space-accent/50',
      bg: 'bg-space-accent/10',
      text: 'text-space-accent',
      icon: <Info size={18} />
    },
    success: {
      border: 'border-green-500/50',
      bg: 'bg-green-500/10',
      text: 'text-green-400',
      icon: <CheckCircle size={18} />
    }
  };

  const theme = themes[type];

  return (
    <div className={`fixed top-6 right-6 z-[9999] transition-all duration-500 ease-out transform ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
    }`}>
      <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${theme.border} ${theme.bg} ${theme.text}`}>
        <div className="p-2 bg-black/20 rounded-lg">
          {theme.icon}
        </div>
        
        <div className="flex flex-col">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-50 mb-0.5">
            System Alert
          </span>
          <span className="text-sm font-bold tracking-tight">
            {message}
          </span>
        </div>

        <button 
          onClick={handleClose}
          className="ml-4 p-1 hover:bg-white/10 rounded-full transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default Toast;