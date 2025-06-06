import React, { useState } from "react";
import { supabase } from "../services/supabase";

const TestTables = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const testInserirAluno = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      // Dados de teste para um novo aluno
      const novoAluno = {
        nome: "Aluno Teste",
        email: "aluno@teste.com",
        telefone: "123456789",
        serie: "9º ano",
        materias: "Matemática, Português",
        responsavel: "Responsável Teste",
        data_nascimento: "2010-01-01",
      };

      // Tentativa de inserção
      const { data, error } = await supabase
        .from("alunos")
        .insert([novoAluno])
        .select();

      if (error) {
        setError({
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
      } else {
        setResult(data);
      }
    } catch (err) {
      setError({ message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const testarInsercaoAula = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      // Primeiro, buscamos um aluno existente
      const { data: alunos, error: alunosError } = await supabase
        .from("alunos")
        .select("id")
        .limit(1);

      if (alunosError) throw alunosError;
      if (!alunos || alunos.length === 0) {
        throw new Error(
          "Nenhum aluno encontrado para testar a inserção de aula"
        );
      }

      // Dados de teste para uma nova aula
      const novaAula = {
        aluno_id: alunos[0].id,
        data: new Date().toISOString().split("T")[0], // Data de hoje
        horario: "15:00",
        duracao: "1h",
        materia: "Matemática",
        status: "Agendada",
        observacoes: "Aula de teste",
      };

      // Tentativa de inserção
      const { data, error } = await supabase
        .from("aulas")
        .insert([novaAula])
        .select();

      if (error) {
        setError({
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
      } else {
        setResult(data);
      }
    } catch (err) {
      setError({ message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const verificarEstruturaTabela = async (tabela) => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      // Tentativa de seleção de dados
      const { data, error } = await supabase.from(tabela).select().limit(1);

      if (error) {
        setError({
          message: `Erro ao verificar tabela ${tabela}: ${error.message}`,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
      } else {
        const estrutura = data && data[0] ? Object.keys(data[0]) : [];
        setResult({
          message: `Estrutura da tabela ${tabela}`,
          estrutura,
        });
      }
    } catch (err) {
      setError({ message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const testBuscarAulas = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      // Tentativa de buscar aulas junto com dados do aluno
      const { data, error } = await supabase
        .from("aulas")
        .select(
          `
          *,
          alunos (
            nome
          )
        `
        )
        .limit(10);

      if (error) {
        setError({
          message: `Erro ao buscar aulas: ${error.message}`,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
      } else {
        setResult({
          message: `Aulas encontradas: ${data.length}`,
          data,
        });
      }
    } catch (err) {
      setError({ message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Teste de Tabelas</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => verificarEstruturaTabela("alunos")}
          className="bg-tertiary text-white px-4 py-2 rounded-md hover:bg-tertiary-dark transition-colors"
          disabled={loading}
        >
          {loading ? "Verificando..." : "Verificar Estrutura da Tabela Alunos"}
        </button>

        <button
          onClick={() => verificarEstruturaTabela("aulas")}
          className="bg-tertiary text-white px-4 py-2 rounded-md hover:bg-tertiary-dark transition-colors"
          disabled={loading}
        >
          {loading ? "Verificando..." : "Verificar Estrutura da Tabela Aulas"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={testInserirAluno}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
          disabled={loading}
        >
          {loading ? "Testando..." : "Testar Inserção de Aluno"}
        </button>

        <button
          onClick={testarInsercaoAula}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
          disabled={loading}
        >
          {loading ? "Testando..." : "Testar Inserção de Aula"}
        </button>
      </div>

      <div className="mb-6">
        <button
          onClick={testBuscarAulas}
          className="bg-tertiary text-white px-4 py-2 rounded-md hover:bg-tertiary-dark transition-colors"
          disabled={loading}
        >
          {loading ? "Buscando..." : "Buscar Todas as Aulas"}
        </button>
      </div>

      {loading && (
        <div className="mt-4">
          <p>Carregando...</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-300 rounded">
          <h3 className="font-bold text-red-700">Erro:</h3>
          <p className="text-red-600">{error.message}</p>
          {error.details && (
            <div className="mt-2">
              <p className="font-semibold">Detalhes:</p>
              <pre className="text-sm bg-red-100 p-2 mt-1 rounded">
                {typeof error.details === "object"
                  ? JSON.stringify(error.details, null, 2)
                  : error.details}
              </pre>
            </div>
          )}
          {error.hint && (
            <div className="mt-2">
              <p className="font-semibold">Dica:</p>
              <p className="text-sm">{error.hint}</p>
            </div>
          )}
          {error.code && (
            <div className="mt-2">
              <p className="font-semibold">Código:</p>
              <p className="text-sm">{error.code}</p>
            </div>
          )}
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-green-50 border border-green-300 rounded">
          <h3 className="font-bold text-green-700">Resultado:</h3>
          <pre className="text-sm bg-green-100 p-2 mt-1 rounded overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestTables;
