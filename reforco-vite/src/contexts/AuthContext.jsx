import React, { createContext, useContext, useState, useEffect } from "react";
import { authService, supabase } from "../services/supabase";

// Criando o contexto de autenticação
const AuthContext = createContext({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  signUp: async () => {},
});

// Hook personalizado para uso do contexto
export const useAuth = () => useContext(AuthContext);

// Provedor do contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verifica o usuário ao carregar a aplicação
  useEffect(() => {
    const checkUser = async () => {
      // Tentativa de obter o usuário atual - retorna null se não houver
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    checkUser();

    // Configurando listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);
        setLoading(false);
      }
    );

    // Cleanup do listener
    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Função de login
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const { user, error } = await authService.signIn(email, password);

      if (error) {
        throw error;
      }

      setUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  };

  // Função de registro
  const signUp = async (email, password, userData) => {
    setLoading(true);
    try {
      const { user } = await authService.signUp(email, password, userData);
      return user;
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const signOut = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Provendo o contexto para a aplicação
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
