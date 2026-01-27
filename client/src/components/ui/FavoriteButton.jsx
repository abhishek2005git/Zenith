import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const FavoriteButton = ({ launchId, className = "" }) => {
  const { user, refreshUser } = useAuth(); // Import refreshUser
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync state with user profile
  useEffect(() => {
    if (user && user.favorites?.includes(launchId)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [user, launchId]);

  const handleToggle = async (e) => {
    e.stopPropagation(); 
    if (!user) {
      alert("Please login to save missions.");
      return;
    }

    // Optimistic UI update
    const previousState = isLiked;
    setIsLiked(!isLiked);
    setLoading(true);

    try {
      await api.post('/api/user/favorites', 
        { launchId }, 
        { withCredentials: true }
      );
      
      // CRITICAL: Tell the app to re-fetch the user profile so the state persists!
      await refreshUser(); 

    } catch (error) {
      console.error("Failed to favorite", error);
      setIsLiked(previousState); // Revert on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={loading}
      className={`p-2 rounded-full backdrop-blur-md border transition-all duration-300 group z-30 relative ${
        isLiked 
          ? 'bg-red-500/10 border-red-500 text-red-500' 
          : 'bg-black/40 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
      } ${className}`}
    >
      <Heart 
        size={18} 
        className={`transition-transform duration-300 ${isLiked ? 'fill-current scale-110' : 'group-hover:scale-110'}`} 
      />
    </button>
  );
};

export default FavoriteButton;