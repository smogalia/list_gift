import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #f8f9fa;
  padding: 1rem 2rem;
  text-align: center;
  color: #6c757d;
  margin-top: 2rem;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <p>© 2025 Gift Wishlist. Tous droits réservés.</p>
    </FooterContainer>
  );
};

export default Footer;
