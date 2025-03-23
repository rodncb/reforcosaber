import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log(
  "Inicializando Supabase com URL (primeiros 10 caracteres):",
  supabaseUrl?.substring(0, 10) + "..."
);

// Inicializa o cliente Supabase com opções extras para lidar com GitHub Pages
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: "reforcosaber-storage",
  },
});

// Testa conexão básica
supabase
  .from("version")
  .select("*")
  .limit(1)
  .then(({ data, error }) => {
    if (error) {
      console.error("Erro ao testar conexão com Supabase:", error);
    } else {
      console.log(
        "Conexão com Supabase estabelecida com sucesso:",
        data ? "Dados recebidos" : "Nenhum dado"
      );
    }
  })
  .catch((err) => {
    console.error("Exceção ao testar conexão:", err);
  });

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
    console.log(
      "Fazendo login com email:",
      email?.substring(0, 3) + "..." + email?.substring(email.indexOf("@"))
    );

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Erro ao fazer login:", error.message);
        return { error };
      }

      console.log(
        "Login bem-sucedido, sessão criada:",
        data?.session ? "Sim" : "Não"
      );
      return data;
    } catch (err) {
      console.error("Exceção durante login:", err.message);
      return { error: err };
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
