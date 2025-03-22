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
  } catch (error) {
    return null;
  }
};

// Funções de autenticação
export const authService = {
  // Login com email e senha
  signIn: async (email, password) => {
    console.log("Tentando login com:", email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Erro de login:", error.message, error);
        throw error;
      }
      console.log("Login bem-sucedido:", data);
      return data;
    } catch (err) {
      console.error("Exceção durante login:", err);
      throw err;
    }
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
        console.log("Nenhum usuário autenticado");
        return null;
      }

      if (error) {
        console.error("Erro ao obter usuário:", error.message);
        throw error;
      }

      console.log("Usuário atual:", data?.user);
      return data?.user;
    } catch (err) {
      console.error("Exceção ao obter usuário:", err);
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
