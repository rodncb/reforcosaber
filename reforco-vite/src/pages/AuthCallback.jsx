import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Esta função não faz nada ativo, mas é necessária para
    // garantir que a biblioteca do Supabase capture
    // os parâmetros de autenticação da URL
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        // Redirecionar para o dashboard após o login
        navigate("/dashboard");
      }
    });

    // Tentar obter o hash da URL e processar a sessão
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate("/dashboard");
      } else {
        // Se não houver sessão, redireciona para a página de login
        navigate("/login");
      }
    });

    return () => {
      // Limpar o listener quando o componente for desmontado
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Autenticando...</h2>
        <p className="text-gray-600">
          Por favor, aguarde enquanto processamos seu login.
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
