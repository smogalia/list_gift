import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: #4CAF50;
  padding: 1rem 2rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  margin: 0;
`;

const Nav = styled.nav`
  a {
    color: white;
    margin-left: 1rem;
    text-decoration: none;
    font-weight: 600;
  }

  a:hover {
    text-decoration: underline;
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Logo>Gift Wishlist</Logo>
      <Nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/wishlists/new">Nouvelle Liste</Link>
        <Link to="/profile">Profil</Link>
        <Link to="/login">Déconnexion</Link>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
