import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Determina a URL de redirecionamento com base no ambiente
const getRedirectUrl = () => {
  const isProduction = import.meta.env.PROD;
  if (isProduction) {
    // URL do GitHub Pages
    return "https://rodncb.github.io/reforcosaber/auth-callback";
  }
  // URL para desenvolvimento local
  return "http://localhost:5176/auth-callback";
};

// Inicializa o cliente Supabase com opções adequadas para o ambiente
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: "reforcosaber-storage",
    flowType: "pkce",
    redirectTo: getRedirectUrl(),
  },
});

// Tenta obter o usuário autenticado
const getUser = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
};

// Funções de autenticação
export const authService = {
  // Login com email e senha
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      return data;
    } catch (err) {
      return { error: err };
    }
  },

  // Cadastro com email e senha
  signUp: async (email, password, userData = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: getRedirectUrl(),
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      return { error };
    }
  },

  // Logout
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      return { error };
    }
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
      return null;
    }
  },

  // Recuperação de senha
  resetPassword: async (email) => {
    try {
      const redirectUrl = getRedirectUrl();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) throw error;
      return true;
    } catch (error) {
      return { error };
    }
  },
};

// Exportar para uso em toda a aplicação
export { supabase, getUser };
