// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';

// Pages et composants
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import WishlistForm from './pages/WishlistForm';
import WishlistDetail from './pages/WishlistDetail';
import SharedWishlist from './pages/SharedWishlist';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Route protégée qui vérifie si l'utilisateur est connecté
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Chargement...</div>;
  
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <main>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Routes protégées */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            
            <Route path="/wishlists/new" element={
              <PrivateRoute>
                <WishlistForm />
              </PrivateRoute>
            } />
            
            <Route path="/wishlists/:id" element={
              <PrivateRoute>
                <WishlistDetail />
              </PrivateRoute>
            } />
            
            <Route path="/wishlists/:id/edit" element={
              <PrivateRoute>
                <WishlistForm />
              </PrivateRoute>
            } />
            
            {/* Route pour les listes partagées (accessible sans connexion) */}
            <Route path="/shared/:id" element={<SharedWishlist />} />
            
            {/* Redirection par défaut */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
