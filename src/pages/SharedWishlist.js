import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../supabase';
import ItemReservation from '../components/items/ItemReservation';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 1rem;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
`;

const Description = styled.p`
  margin-bottom: 2rem;
`;

const ItemList = styled.ul`
  list-style: none;
  padding: 0;
`;

const Item = styled.li`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ItemInfo = styled.div`
  flex-grow: 1;
  margin-right: 1rem;
`;

const ItemTitle = styled.h3`
  margin: 0 0 0.5rem 0;
`;

const ItemDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #555;
`;

const ItemImage = styled.img`
  max-width: 100px;
  max-height: 100px;
  object-fit: contain;
  border-radius: 4px;
  margin-right: 1rem;
`;

const SharedWishlist = () => {
  const { id } = useParams();
  const [wishlist, setWishlist] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const { data: wishlistData, error: wishlistError } = await supabase
          .from('wishlists')
          .select('*')
          .eq('id', id)
          .eq('is_public', true)
          .single();

        if (wishlistError) throw wishlistError;
        setWishlist(wishlistData);

        const { data: itemsData, error: itemsError } = await supabase
          .from('items')
          .select('*')
          .eq('wishlist_id', id);

        if (itemsError) throw itemsError;

        // Récupérer les réservations
        const itemIds = itemsData.map(item => item.id);
        const { data: reservationsData, error: reservationsError } = await supabase
          .from('reservations')
          .select('*')
          .in('item_id', itemIds);

        if (reservationsError) throw reservationsError;

        // Associer réservations aux articles
        const itemsWithReservations = itemsData.map(item => {
          const reservation = reservationsData.find(r => r.item_id === item.id);
          return {
            ...item,
            reserved: !!reservation,
            reservation: reservation || null
          };
        });

        setItems(itemsWithReservations);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [id]);

  if (loading) return <Container>Chargement...</Container>;
  if (error) return <Container>Erreur: {error}</Container>;
  if (!wishlist) return <Container>Liste non trouvée ou non accessible</Container>;

  return (
    <Container>
      <Title>{wishlist.title}</Title>
      <Description>{wishlist.description}</Description>

      <ItemList>
        {items.map(item => (
          <Item key={item.id}>
            {item.image_url && <ItemImage src={item.image_url} alt={item.title} />}
            <ItemInfo>
              <ItemTitle>{item.title}</ItemTitle>
              <ItemDescription>{item.description}</ItemDescription>
              <p>Prix: {item.price ? `${item.price} €` : 'Non spécifié'}</p>
            </ItemInfo>
            <ItemReservation
              item={item}
              isOwner={false}
            />
          </Item>
        ))}
      </ItemList>
    </Container>
  );
};

export default SharedWishlist;
