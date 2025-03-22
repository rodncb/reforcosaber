import React, { useState } from "react";
import { supabase } from "../services/supabase";

const TestTables = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  const [error, setError] = useState(null);

  // Lista de tabelas para testar
  const tablesToTest = ["alunos", "aulas", "usuarios"];

  const testTable = async (tableName) => {
    try {
      setLoading(true);
      setError(null);

      // Tenta buscar os primeiros 5 registros da tabela
      const { data, error: queryError } = await supabase
        .from(tableName)
        .select("*")
        .limit(5);

      if (queryError) {
        throw queryError;
      }

      // Atualiza os resultados
      setResults((prev) => ({
        ...prev,
        [tableName]: {
          exists: true,
          count: data.length,
          sample: data,
        },
      }));

      return { success: true, data };
    } catch (err) {
      console.error(`Erro ao testar tabela ${tableName}:`, err);

      // Verifica se o erro é de tabela não encontrada
      const isTableNotFound =
        err.message?.includes("relation") &&
        err.message?.includes("does not exist");

      // Atualiza os resultados
      setResults((prev) => ({
        ...prev,
        [tableName]: {
          exists: !isTableNotFound,
          error: err.message,
        },
      }));

      return { success: false, error: err };
    }
  };

  const testAllTables = async () => {
    setLoading(true);
    setError(null);

    try {
      // Testa cada tabela sequencialmente
      for (const table of tablesToTest) {
        await testTable(table);
      }
    } catch (err) {
      console.error("Erro geral:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Função para exibir um cartão de resultado para cada tabela
  const renderTableCard = (tableName) => {
    const result = results[tableName];

    if (!result) {
      return (
        <div key={tableName} className="bg-gray-100 p-4 rounded-md">
          <h3 className="font-bold text-lg">{tableName}</h3>
          <p className="text-gray-600">Não testado</p>
        </div>
      );
    }

    return (
      <div
        key={tableName}
        className={`p-4 rounded-md ${
          result.exists ? "bg-green-100" : "bg-red-100"
        }`}
      >
        <h3 className="font-bold text-lg">{tableName}</h3>

        {result.exists ? (
          <>
            <div className="text-green-700 font-medium mb-2">
              ✅ Tabela encontrada
            </div>
            <p>Registros: {result.count || 0}</p>

            {result.sample && result.sample.length > 0 && (
              <div className="mt-2">
                <details>
                  <summary className="cursor-pointer text-blue-600">
                    Ver dados de exemplo
                  </summary>
                  <pre className="mt-2 bg-gray-800 text-white p-2 rounded-md text-xs overflow-auto max-h-32">
                    {JSON.stringify(result.sample, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </>
        ) : (
          <div className="text-red-700">
            ❌ Tabela não encontrada ou erro
            <p className="mt-1 text-sm">{result.error}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Teste de Tabelas do Supabase</h1>

      <div className="mb-6">
        <button
          onClick={testAllTables}
          disabled={loading}
          className={`px-4 py-2 rounded-md text-white font-medium ${
            loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Testando..." : "Testar Todas as Tabelas"}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 rounded-md">
          <h2 className="text-lg font-semibold text-red-700 mb-2">Erro:</h2>
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tablesToTest.map(renderTableCard)}
      </div>
    </div>
  );
};

export default TestTables;
