import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Função para criar um cliente Supabase com retries
const createSupabaseClient = () => {
  // Verifica se as variáveis de ambiente estão definidas
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "Variáveis de ambiente do Supabase não estão configuradas corretamente"
    );
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storageKey: "reforcosaber-storage",
    },
    global: {
      headers: {
        "X-Client-Info": "ReforçoSaber",
      },
      fetch: async (url, options) => {
        const MAX_RETRIES = 3;
        const RETRY_DELAY = 1000; // ms
        const timeout = 10000; // 10 segundos

        let retries = 0;
        let lastError = null;

        while (retries < MAX_RETRIES) {
          try {
            const controller = new AbortController();
            const { signal } = controller;
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            const response = await fetch(url, { ...options, signal });
            clearTimeout(timeoutId);

            if (response.ok) {
              return response;
            } else {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
          } catch (error) {
            lastError = error;
            retries++;

            if (retries >= MAX_RETRIES) {
              break;
            }

            // Espera antes de tentar novamente
            await new Promise((resolve) =>
              setTimeout(resolve, RETRY_DELAY * retries)
            );
          }
        }

        throw new Error(
          `Falha na conexão após ${MAX_RETRIES} tentativas: ${
            lastError?.message || "Erro desconhecido"
          }`
        );
      },
    },
  });
};

// Criar o cliente Supabase com tratamento de erro
let supabase;
try {
  supabase = createSupabaseClient();

  if (!supabase) {
    throw new Error("Não foi possível inicializar o cliente Supabase");
  }
} catch (error) {
  console.warn("Erro ao inicializar Supabase:", error.message);
  // Cria um cliente mockado para modo offline
  supabase = {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({
        data: null,
        error: new Error("Modo offline"),
      }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({ data: [], error: new Error("Modo offline") }),
        gt: () => ({ data: [], error: new Error("Modo offline") }),
        lt: () => ({ data: [], error: new Error("Modo offline") }),
        gte: () => ({ data: [], error: new Error("Modo offline") }),
        lte: () => ({ data: [], error: new Error("Modo offline") }),
        order: () => ({ data: [], error: new Error("Modo offline") }),
        limit: () => ({ data: [], error: new Error("Modo offline") }),
        single: () => ({ data: null, error: new Error("Modo offline") }),
        in: () => ({ data: [], error: new Error("Modo offline") }),
      }),
      insert: () => ({ data: null, error: new Error("Modo offline") }),
      update: () => ({ data: null, error: new Error("Modo offline") }),
      delete: () => ({ data: null, error: new Error("Modo offline") }),
    }),
  };
}

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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
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
