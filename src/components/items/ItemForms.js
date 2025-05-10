// src/components/items/ItemForm.js
import { useState } from 'react';
import { useItems } from '../../hooks/useItems';
import { extractProductInfo } from '../../utils/linkParser';
import styled from 'styled-components';

const FormContainer = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
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
  min-height: 80px;
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

const ItemForm = ({ wishlistId, onItemAdded }) => {
  const { addItem } = useItems(wishlistId);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [price, setPrice] = useState('');
  const [priority, setPriority] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleUrlChange = async (e) => {
    const url = e.target.value;
    setProductUrl(url);
    
    if (url && url.startsWith('http')) {
      try {
        setLoading(true);
        const productInfo = await extractProductInfo(url);
        
        setTitle(productInfo.title || title);
        setDescription(productInfo.description || description);
        setImageUrl(productInfo.image_url || imageUrl);
        if (productInfo.price) setPrice(productInfo.price);
      } catch (error) {
        console.error('Erreur lors de l\'extraction:', error);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!title.trim()) {
      setError('Le titre est requis');
      return;
    }
    
    try {
      const itemData = {
        title,
        description,
        image_url: imageUrl,
        product_url: productUrl,
        price: price ? parseFloat(price) : null,
        priority: parseInt(priority)
      };
      
      const newItem = await addItem(itemData);
      
      if (newItem) {
        // Réinitialiser le formulaire
        setTitle('');
        setDescription('');
        setImageUrl('');
        setProductUrl('');
        setPrice('');
        setPriority(3);
        
        if (onItemAdded) onItemAdded(newItem);
      } else {
        setError('Une erreur est survenue');
      }
    } catch (error) {
      setError(error.message);
    }
  };
  
  return (
    <FormContainer>
      <h3>Ajouter un article</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="productUrl">URL du produit</Label>
          <Input
            id="productUrl"
            type="url"
            value={productUrl}
            onChange={handleUrlChange}
            placeholder="https://exemple.com/produit"
          />
          <small>Collez l'URL d'un produit pour extraire automatiquement ses informations</small>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="title">Titre*</Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Nom du produit"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description du produit"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="imageUrl">URL de l'image</Label>
          <Input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://exemple.com/image.jpg"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="price">Prix (€)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="priority">Priorité</Label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="1">1 - Très basse</option>
            <option value="2">2 - Basse</option>
            <option value="3">3 - Moyenne</option>
            <option value="4">4 - Haute</option>
            <option value="5">5 - Très haute</option>
          </select>
        </FormGroup>
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Chargement...' : 'Ajouter l\'article'}
        </Button>
      </form>
    </FormContainer>
  );
};

export default ItemForm;
