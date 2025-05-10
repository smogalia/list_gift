// src/contexts/AuthContext.js
import { createContext, useState, useEffect } from 'react';
import supabase from '../supabase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier la session au chargement
    const session = supabase.auth.session();
    setUser(session?.user ?? null);
    
    // Configurer l'écouteur d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    setLoading(false);
    
    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  // Fonctions d'authentification
  const signUp = (email, password) => 
    supabase.auth.signUp({ email, password });
  
  const signIn = (email, password) => 
    supabase.auth.signIn({ email, password });
  
  const signOut = () => supabase.auth.signOut();

  const resetPassword = (email) => 
    supabase.auth.api.resetPasswordForEmail(email);

  return (
    <AuthContext.Provider value={{ 
      user, 
      signUp, 
      signIn, 
      signOut, 
      resetPassword, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
