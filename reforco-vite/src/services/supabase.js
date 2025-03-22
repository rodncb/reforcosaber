import { createClient } from "@supabase/supabase-js";

// Hardcoded para diagnóstico
const supabaseUrl = "https://wmorozzczawgbgzvpaby.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indtb3JvenpjemF3Z2JnenZwYWJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NjMwNDksImV4cCI6MjA1ODIzOTA0OX0.p-z9fe2VGNVAJquRKWSydUWvzm_xFCzb3tREI0T9Zag";

// Log para depuração detalhada
console.log("URL do Supabase (hardcoded):", supabaseUrl);
console.log(
  "Chave Anon (hardcoded):",
  supabaseAnonKey.substring(0, 20) + "..."
);

// Inicialização do cliente Supabase
console.log("Inicializando cliente Supabase com URL e chave hardcoded");
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
export default supabase;
