// src/pages/Dashboard.js
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useWishlists } from '../hooks/useWishLists';
import styled from 'styled-components';
import { FaPlus, FaGift } from 'react-icons/fa';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const CreateButton = styled(Link)`
  display: flex;
  align-items: center;
  background-color: #4CAF50;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    background-color: #45a049;
  }
`;

const WishlistsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const WishlistCard = styled.div`
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const WishlistHeader = styled.div`
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
`;

const WishlistBody = styled.div`
  padding: 1.5rem;
`;

const WishlistFooter = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background-color: #f8f9fa;
  border-top: 1px solid #eee;
`;

const Dashboard = () => {
  const { user } = useAuth();
  const { wishlists, loading, error, deleteWishlist } = useWishlists(user?.id);

  if (loading) return <p>Chargement de vos listes...</p>;
  if (error) return <p>Erreur: {error}</p>;

  return (
    <DashboardContainer>
      <Header>
        <h1>Mes Listes de Cadeaux</h1>
        <CreateButton to="/wishlists/new">
          <FaPlus /> Nouvelle Liste
        </CreateButton>
      </Header>
      
      {wishlists.length === 0 ? (
        <div>
          <p>Vous n'avez pas encore créé de liste de cadeaux.</p>
          <p>Créez votre première liste pour commencer à partager vos souhaits!</p>
        </div>
      ) : (
        <WishlistsGrid>
          {wishlists.map(wishlist => (
            <WishlistCard key={wishlist.id}>
              <WishlistHeader>
                <h3>{wishlist.title}</h3>
                {wishlist.event_date && (
                  <p>Date: {new Date(wishlist.event_date).toLocaleDateString()}</p>
                )}
              </WishlistHeader>
              
              <WishlistBody>
                <p>{wishlist.description || 'Aucune description'}</p>
              </WishlistBody>
              
              <WishlistFooter>
                <Link to={`/wishlists/${wishlist.id}`}>
                  <FaGift /> Voir les articles
                </Link>
                <button onClick={() => deleteWishlist(wishlist.id)}>
                  Supprimer
                </button>
              </WishlistFooter>
            </WishlistCard>
          ))}
        </WishlistsGrid>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;
