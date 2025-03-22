import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Inicializa o cliente Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tenta obter o usuário autenticado
const getUser = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (_) {
    return null;
  }
};

// Funções de autenticação
export const authService = {
  // Login com email e senha
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }
    return data;
  },

  // Cadastro com email e senha
  signUp: async (email, password, userData = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });

    if (error) throw error;
    return data;
  },

  // Logout
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Obter usuário atual
  getCurrentUser: async () => {
    try {
      const { data, error } = await supabase.auth.getUser();

      // Se o erro for AuthSessionMissingError, significa que não há usuário logado
      if (error && error.name === "AuthSessionMissingError") {
        return null;
      }

      if (error) {
        throw error;
      }

      return data?.user;
    } catch (err) {
      // Trata a exceção específica de sessão ausente
      if (err.message && err.message.includes("Auth session missing")) {
        return null;
      }
      throw err;
    }
  },

  // Recuperação de senha
  resetPassword: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
    return true;
  },
};

// Exportar para uso em toda a aplicação
export { supabase, getUser };
