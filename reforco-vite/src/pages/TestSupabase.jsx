import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";

function TestSupabase() {
  const [version, setVersion] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("version")
          .select("*")
          .limit(1);

        if (error) throw error;
        setVersion(data[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVersion();
  }, []);

  return (
    <div>
      <h1>Teste de Conexão com Supabase</h1>
      {loading ? <p>Carregando...</p> : null}
      {error ? <p style={{ color: "red" }}>Erro: {error}</p> : null}
      {version ? (
        <div>
          <p>Conexão estabelecida com sucesso!</p>
          <p>Versão: {version.number}</p>
          <p>Atualizada em: {new Date(version.updated_at).toLocaleString()}</p>
        </div>
      ) : null}
    </div>
  );
}

export default TestSupabase;
