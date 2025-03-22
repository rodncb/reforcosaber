import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Abordagem diferente
const TestSupabase = () => {
  const [status, setStatus] = useState("Não testado");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Função para testar a conexão
  const testConnection = async () => {
    try {
      setStatus("Testando...");

      // Abordagem 1: Usando a nova implementação
      const supabaseUrl = "https://wmorozzczawgbgzvpaby.supabase.co";
      const supabaseKey =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indtb3JvenpjemF3Z2JnenZwYWJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NjMwNDksImV4cCI6MjA1ODIzOTA0OX0.p-z9fe2VGNVAJquRKWSydUWvzm_xFCzb3tREI0T9Zag";

      console.log("URL:", supabaseUrl);
      console.log("Key:", supabaseKey);

      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
      });

      // Tentando testar autenticação diretamente
      try {
        // Primeiro, vamos tentar obter a versão do Supabase para testar a conexão básica
        const { data: versionData, error: versionError } = await supabase.rpc(
          "get_supabase_version"
        );

        if (versionError) {
          console.log("Erro ao verificar versão:", versionError);
          // Se falhou no get_supabase_version, vamos tentar outro método para verificar a conexão

          // Tentar login anônimo para testar a conexão de autenticação
          const { data: authData, error: authError } =
            await supabase.auth.signInWithPassword({
              email: "teste@example.com",
              password: "senhadeteste",
            });

          if (authError) {
            if (authError.message.includes("Invalid login credentials")) {
              // Este erro é esperado se as credenciais estiverem erradas, mas significa que a conexão funciona
              setStatus(
                "Conexão com autenticação funcionando, mas credenciais inválidas"
              );
              setResult("Conexão de autenticação OK!");
            } else if (authError.message.includes("Invalid API key")) {
              // Erro de chave API inválida
              throw new Error(
                "Chave API inválida. Verifique suas credenciais do Supabase."
              );
            } else {
              // Outro erro de autenticação
              throw authError;
            }
          } else {
            // Autenticação bem-sucedida (improvável com credenciais de teste)
            setStatus("Autenticado com sucesso no Supabase");
            setResult(authData);
          }
        } else {
          // get_supabase_version funcionou
          setStatus("Conectado ao Supabase com sucesso");
          setResult(`Versão do Supabase: ${versionData}`);
        }
      } catch (innerErr) {
        console.error("Erro específico de teste:", innerErr);
        throw innerErr;
      }
    } catch (err) {
      console.error("Erro ao testar conexão:", err);
      setStatus("Erro na conexão");
      setError(err.message || String(err));
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Teste de Conexão com Supabase</h1>

      <div className="mb-4">
        <button
          onClick={testConnection}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Testar Conexão
        </button>
      </div>

      <div className="mb-4">
        <p>
          <strong>Status:</strong> {status}
        </p>
      </div>

      {result && (
        <div className="mb-4 p-4 bg-green-100 rounded">
          <h2 className="text-lg font-semibold mb-2">Resultado:</h2>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 rounded">
          <h2 className="text-lg font-semibold mb-2">Erro:</h2>
          <p className="text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
};

export default TestSupabase;
