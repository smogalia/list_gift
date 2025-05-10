// src/hooks/useItems.js
import { useState, useEffect } from 'react';
import supabase from '../supabase';

export const useItems = (wishlistId) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!wishlistId) return;
    
    const fetchItems = async () => {
      try {
        setLoading(true);
        
        // Récupérer les articles
        const { data: itemsData, error: itemsError } = await supabase
          .from('items')
          .select('*')
          .eq('wishlist_id', wishlistId);
          
        if (itemsError) throw itemsError;
        
        // Récupérer les réservations pour ces articles
        const itemIds = itemsData.map(item => item.id);
        const { data: reservationsData, error: reservationsError } = await supabase
          .from('reservations')
          .select('*')
          .in('item_id', itemIds);
          
        if (reservationsError) throw reservationsError;
        
        // Associer les réservations aux articles
        const itemsWithReservations = itemsData.map(item => {
          const reservation = reservationsData.find(r => r.item_id === item.id);
          return {
            ...item,
            reserved: !!reservation,
            reservation: reservation || null
          };
        });
        
        setItems(itemsWithReservations);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
    
    // Configurer un écouteur en temps réel pour les mises à jour
    const itemsSubscription = supabase
      .from(`items:wishlist_id=eq.${wishlistId}`)
      .on('*', fetchItems)
      .subscribe();
      
    const reservationsSubscription = supabase
      .from('reservations')
      .on('*', fetchItems)
      .subscribe();
    
    return () => {
      supabase.removeSubscription(itemsSubscription);
      supabase.removeSubscription(reservationsSubscription);
    };
  }, [wishlistId]);

  const addItem = async (itemData) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .insert([{ ...itemData, wishlist_id: wishlistId }]);
        
      if (error) throw error;
      setItems([...items, { ...data[0], reserved: false, reservation: null }]);
      return data[0];
    } catch (error) {
      setError(error.message);
      return null;
    }
  };

  const updateItem = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .update(updates)
        .eq('id', id);
        
      if (error) throw error;
      
      setItems(items.map(item => 
        item.id === id 
          ? { ...item, ...updates } 
          : item
      ));
      
      return data[0];
    } catch (error) {
      setError(error.message);
      return null;
    }
  };

  const deleteItem = async (id) => {
    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      setItems(items.filter(item => item.id !== id));
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  return {
    items,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem
  };
};
