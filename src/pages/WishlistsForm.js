// src/pages/WishlistForm.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useWishlists } from '../hooks/useWishLists';
import styled from 'styled-components';

const FormContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background-color: #45a049;
  }
`;

const WishlistForm = ({ wishlist }) => {
  const { user } = useAuth();
  const { createWishlist, updateWishlist } = useWishlists(user?.id);
  const navigate = useNavigate();
  
  const [title, setTitle] = useState(wishlist?.title || '');
  const [description, setDescription] = useState(wishlist?.description || '');
  const [eventDate, setEventDate] = useState(wishlist?.event_date || '');
  const [isPublic, setIsPublic] = useState(wishlist?.is_public || false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!title.trim()) {
      setError('Le titre est requis');
      return;
    }
    
    try {
      const wishlistData = {
        title,
        description,
        event_date: eventDate || null,
        is_public: isPublic
      };
      
      let result;
      
      if (wishlist) {
        // Mise à jour
        result = await updateWishlist(wishlist.id, wishlistData);
      } else {
        // Création
        result = await createWishlist(wishlistData);
      }
      
      if (result) {
        navigate(`/wishlists/${result.id}`);
      } else {
        setError('Une erreur est survenue');
      }
    } catch (error) {
      setError(error.message);
    }
  };
  
  return (
    <FormContainer>
      <h2>{wishlist ? 'Modifier la liste' : 'Créer une nouvelle liste'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Titre*</Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="eventDate">Date de l'événement</Label>
          <Input
            id="eventDate"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
        </FormGroup>
        
        <FormGroup>
          <Label>
            <Input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            Liste publique (accessible sans connexion)
          </Label>
        </FormGroup>
        
        <Button type="submit">
          {wishlist ? 'Enregistrer les modifications' : 'Créer la liste'}
        </Button>
      </form>
    </FormContainer>
  );
};

export default WishlistForm;
