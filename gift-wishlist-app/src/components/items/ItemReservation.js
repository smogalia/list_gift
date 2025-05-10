// src/components/items/ItemReservation.js
import { useState } from 'react';
import styled from 'styled-components';
import { FaGift, FaUndo } from 'react-icons/fa';
import supabase from '../../supabase';
import { useAuth } from '../../hooks/useAuth';

const ReservationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.reserved ? '#dc3545' : '#28a745'};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
  
  &:hover {
    background-color: ${props => props.reserved ? '#c82333' : '#218838'};
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const ReservationInfo = styled.div`
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6c757d;
`;

const ItemReservation = ({ item, isOwner, onReservationChange }) => {
  const { user } = useAuth();
  const [reserved, setReserved] = useState(item.reserved || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Si l'utilisateur est le propriétaire de la liste, il ne peut pas réserver
  if (isOwner) {
    return (
      <ReservationInfo>
        {reserved ? 'Cet article a été réservé' : 'Cet article est disponible'}
      </ReservationInfo>
    );
  }

  const toggleReservation = async () => {
    if (!user) {
      setError('Vous devez être connecté pour réserver un article');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      if (reserved) {
        // Annuler la réservation
        const { error } = await supabase
          .from('reservations')
          .delete()
          .eq('item_id', item.id)
          .eq('reserved_by', user.id);
          
        if (error) throw error;
      } else {
        // Créer une réservation
        const { error } = await supabase
          .from('reservations')
          .insert([{
            item_id: item.id,
            reserved_by: user.id,
            is_anonymous: true
          }]);
          
        if (error) throw error;
      }
      
      // Mettre à jour l'état local
      setReserved(!reserved);
      
      // Notifier le composant parent
      if (onReservationChange) {
        onReservationChange(item.id, !reserved);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ReservationButton 
        onClick={toggleReservation} 
        disabled={loading}
        reserved={reserved}
      >
        {reserved 
          ? <><FaUndo /> Annuler la réservation</> 
          : <><FaGift /> Réserver cet article</>
        }
      </ReservationButton>
      
      {error && <p style={{ color: 'red', fontSize: '0.875rem' }}>{error}</p>}
      
      <ReservationInfo>
        {reserved 
          ? 'Vous avez réservé cet article. Le créateur de la liste ne saura pas qui l\'a réservé.' 
          : 'Réserver cet article pour l\'offrir. Votre réservation restera anonyme.'}
      </ReservationInfo>
    </>
  );
};

export default ItemReservation;
