import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { saveToLocalStorage, getFromLocalStorage } from "../utils/localStorage";

const Dashboard = () => {
  const [estatisticas, setEstatisticas] = useState({
    totalAlunos: 0,
    totalAulas: 0,
    aulasPendentes: 0,
    aulasCanceladas: 0,
  });
  const [aulasRecentes, setAulasRecentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [statusConexao, setStatusConexao] = useState("online");

  useEffect(() => {
    fetchEstatisticas();
    fetchAulasRecentes();

    // Verifica o status da conexão a cada 30 segundos
    const intervalId = setInterval(verificarConexao, 30000);

    // Verifica o status inicial
    verificarConexao();

    // Limpar o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, []);

  // Função para verificar o status da conexão
  const verificarConexao = async () => {
    try {
      // Tenta fazer uma requisição simples
      const { error } = await supabase
        .from("alunos")
        .select("count", { count: "exact", head: true });

      if (error) {
        setStatusConexao("offline");
      } else {
        setStatusConexao("online");
      }
    } catch {
      setStatusConexao("offline");
    }
  };

  const fetchEstatisticas = async () => {
    try {
      // Verificar se há dados em cache
      const dadosCache = getFromLocalStorage("dashboard_estatisticas", 120); // 2 horas

      if (dadosCache) {
        setEstatisticas(dadosCache);
      }

      // Buscar total de alunos
      const { count: totalAlunos, error: erroAlunos } = await supabase
        .from("alunos")
        .select("*", { count: "exact", head: true });

      // Buscar total de aulas
      const { count: totalAulas, error: erroAulas } = await supabase
        .from("aulas")
        .select("*", { count: "exact", head: true });

      // Buscar aulas pendentes
      const { count: aulasPendentes, error: erroPendentes } = await supabase
        .from("aulas")
        .select("*", { count: "exact", head: true })
        .eq("status", "Agendada");

      // Buscar aulas canceladas
      const { count: aulasCanceladas, error: erroCanceladas } = await supabase
        .from("aulas")
        .select("*", { count: "exact", head: true })
        .eq("status", "Cancelada");

      if (erroAlunos || erroAulas || erroPendentes || erroCanceladas) {
        setErro("Erro ao buscar estatísticas.");
        return;
      }

      const novasEstatisticas = {
        totalAlunos: totalAlunos || 0,
        totalAulas: totalAulas || 0,
        aulasPendentes: aulasPendentes || 0,
        aulasCanceladas: aulasCanceladas || 0,
      };

      setEstatisticas(novasEstatisticas);
      saveToLocalStorage("dashboard_estatisticas", novasEstatisticas);
    } catch {
      setErro("Erro ao buscar estatísticas.");
    }
  };

  const fetchAulasRecentes = async () => {
    try {
      setLoading(true);

      // Data atual
      const hoje = new Date();

      // Data daqui a 7 dias
      const emSeteDias = new Date();
      emSeteDias.setDate(hoje.getDate() + 7);

      // Formatar datas para o formato ISO (YYYY-MM-DD)
      const dataInicio = hoje.toISOString().split("T")[0];
      const dataFim = emSeteDias.toISOString().split("T")[0];

      // Buscar aulas dos próximos 7 dias
      const { data, error } = await supabase
        .from("aulas")
        .select("*")
        .gte("data", dataInicio)
        .lte("data", dataFim)
        .order("data", { ascending: true })
        .order("horario", { ascending: true });

      if (error) {
        setErro("Erro ao buscar aulas recentes.");
        return;
      }

      if (data && data.length > 0) {
        // Buscar informações dos alunos
        const alunosIds = [...new Set(data.map((aula) => aula.aluno_id))];
        const { data: alunosData, error: alunosError } = await supabase
          .from("alunos")
          .select("id, nome")
          .in("id", alunosIds);

        if (alunosError) {
          setErro("Erro ao buscar informações dos alunos.");
        } else {
          // Mapeando os nomes dos alunos para as aulas
          const aulasComAlunos = data.map((aula) => {
            const alunoEncontrado = alunosData?.find(
              (aluno) => aluno.id === aula.aluno_id
            );
            return {
              ...aula,
              aluno_nome: alunoEncontrado
                ? alunoEncontrado.nome
                : "Aluno não encontrado",
            };
          });

          setAulasRecentes(aulasComAlunos);
        }
      } else {
        setAulasRecentes([]);
      }
    } catch {
      setErro("Erro ao buscar aulas recentes.");
    } finally {
      setLoading(false);
    }
  };

  // Formatar data para exibição
  const formatarData = (dataStr) => {
    try {
      const data = new Date(dataStr);
      return data.toLocaleDateString("pt-BR");
    } catch {
      return dataStr;
    }
  };

  // Determinar a cor do status
  const getStatusColor = (status) => {
    switch (status) {
      case "Agendada":
        return "text-secondary-dark";
      case "Concluída":
        return "text-primary-dark";
      case "Cancelada":
        return "text-secondary";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {statusConexao === "offline" && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded flex justify-between items-center">
          <div>
            <p className="font-bold">Modo Offline</p>
            <p>
              Você está visualizando dados em cache. Algumas funcionalidades
              podem estar limitadas.
            </p>
          </div>
          <button
            onClick={verificarConexao}
            className="px-4 py-1 rounded text-white bg-yellow-600 hover:bg-yellow-700"
          >
            Verificar conexão
          </button>
        </div>
      )}

      {erro && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p>{erro}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-primary/20 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-tertiary">Alunos</h2>
          <div className="text-3xl font-bold mt-2 text-tertiary-dark">
            {estatisticas.totalAlunos}
          </div>
        </div>

        <div className="bg-primary-light/20 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-tertiary">
            Total de Aulas
          </h2>
          <div className="text-3xl font-bold mt-2 text-tertiary-dark">
            {estatisticas.totalAulas}
          </div>
        </div>

        <div className="bg-secondary/20 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-tertiary">
            Aulas Pendentes
          </h2>
          <div className="text-3xl font-bold mt-2 text-tertiary-dark">
            {estatisticas.aulasPendentes}
          </div>
        </div>

        <div className="bg-secondary-light/20 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-tertiary">
            Aulas Canceladas
          </h2>
          <div className="text-3xl font-bold mt-2 text-tertiary-dark">
            {estatisticas.aulasCanceladas}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Aulas Recentes</h2>

        {loading ? (
          <div className="flex justify-center items-center h-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            <p className="ml-2">Carregando aulas...</p>
          </div>
        ) : aulasRecentes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Horário
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aluno
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Matéria
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {aulasRecentes.map((aula) => (
                  <tr key={aula.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatarData(aula.data)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {aula.horario}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {aula.aluno_nome}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {aula.materia}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span
                        className={`font-medium ${getStatusColor(aula.status)}`}
                      >
                        {aula.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            Não há aulas agendadas para os próximos 7 dias
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
