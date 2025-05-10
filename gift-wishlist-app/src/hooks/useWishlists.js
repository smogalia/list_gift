// src/hooks/useWishlists.js
import { useState, useEffect } from 'react';
import supabase from '../supabase';

export const useWishlists = (userId) => {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    
    const fetchWishlists = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('wishlists')
          .select('*')
          .eq('user_id', userId);
          
        if (error) throw error;
        setWishlists(data || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlists();
  }, [userId]);

  const createWishlist = async (wishlistData) => {
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .insert([{ ...wishlistData, user_id: userId }]);
        
      if (error) throw error;
      setWishlists([...wishlists, data[0]]);
      return data[0];
    } catch (error) {
      setError(error.message);
      return null;
    }
  };

  const updateWishlist = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .update(updates)
        .eq('id', id);
        
      if (error) throw error;
      setWishlists(wishlists.map(w => w.id === id ? { ...w, ...updates } : w));
      return data[0];
    } catch (error) {
      setError(error.message);
      return null;
    }
  };

  const deleteWishlist = async (id) => {
    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      setWishlists(wishlists.filter(w => w.id !== id));
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  return {
    wishlists,
    loading,
    error,
    createWishlist,
    updateWishlist,
    deleteWishlist
  };
};
