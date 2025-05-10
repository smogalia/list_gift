// src/components/wishlists/WishlistShare.js
import { useState } from 'react';
import styled from 'styled-components';
import { FaCopy, FaEnvelope, FaQrcode } from 'react-icons/fa';
import supabase from '../../supabase';

const ShareContainer = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

const ShareLink = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  
  input {
    flex-grow: 1;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-right: 0.5rem;
  }
  
  button {
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.75rem;
    cursor: pointer;
    
    &:hover {
      background-color: #5a6268;
    }
  }
`;

const EmailShare = styled.div`
  margin-top: 1.5rem;
  
  input {
    width: 70%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-right: 0.5rem;
  }
  
  button {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.75rem 1rem;
    cursor: pointer;
    
    &:hover {
      background-color: #0069d9;
    }
  }
`;

const WishlistShare = ({ wishlist }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const shareUrl = `${window.location.origin}/shared/${wishlist.id}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setMessage('Lien copié dans le presse-papier!');
    setTimeout(() => setMessage(''), 3000);
  };
  
  const shareByEmail = async () => {
    if (!email) {
      setMessage('Veuillez entrer une adresse email');
      return;
    }
    
    try {
      setLoading(true);
      
      // Vérifier si le partage existe déjà
      const { data: existingShare } = await supabase
        .from('shares')
        .select('*')
        .eq('wishlist_id', wishlist.id)
        .eq('email', email);
        
      if (existingShare && existingShare.length > 0) {
        setMessage('Cette liste est déjà partagée avec cet email');
        return;
      }
      
      // Créer un nouveau partage
      const { error } = await supabase
        .from('shares')
        .insert([{
          wishlist_id: wishlist.id,
          email: email,
          access_type: 'view'
        }]);
        
      if (error) throw error;
      
      // Dans une application réelle, vous enverriez un email ici
      // Pour cet exemple, nous simulons juste l'envoi
      console.log(`Email envoyé à ${email} avec le lien ${shareUrl}`);
      
      setMessage(`Liste partagée avec ${email}`);
      setEmail('');
    } catch (error) {
      setMessage(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ShareContainer>
      <h3>Partager cette liste</h3>
      
      <ShareLink>
        <input type="text" value={shareUrl} readOnly />
        <button onClick={copyToClipboard}>
          <FaCopy /> Copier
        </button>
      </ShareLink>
      
      <EmailShare>
        <h4>Partager par email</h4>
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@exemple.com"
          />
          <button onClick={shareByEmail} disabled={loading}>
            <FaEnvelope /> {loading ? 'Envoi...' : 'Envoyer'}
          </button>
        </div>
      </EmailShare>
      
      {message && <p>{message}</p>}
    </ShareContainer>
  );
};

export default WishlistShare;
