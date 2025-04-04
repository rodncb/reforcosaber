import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";
import { formatarData } from "../utils/formatters";

const Calendario = () => {
  const navigate = useNavigate();
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [mesAtual, setMesAtual] = useState(new Date());
  const [aulasProximas, setAulasProximas] = useState([]);
  const [loadingProximas, setLoadingProximas] = useState(true);

  // Buscar aulas do Supabase
  useEffect(() => {
    fetchAulas();
  }, [mesAtual]);

  // Buscar aulas dos próximos 7 dias
  useEffect(() => {
    fetchAulasProximas();
  }, []);

  // Função para carregar as aulas do mês selecionado
  const fetchAulas = async (
    mes = mesAtual.getMonth() + 1,
    ano = mesAtual.getFullYear()
  ) => {
    try {
      setLoading(true);
      setErro(null);

      const dataInicio = `${ano}-${String(mes).padStart(2, "0")}-01`;
      const ultimoDia = new Date(ano, mes, 0).getDate();
      const dataFim = `${ano}-${String(mes).padStart(2, "0")}-${ultimoDia}`;

      let { data: aulasData, error } = await supabase
        .from("aulas")
        .select("*, alunos(nome)")
        .gte("data", dataInicio)
        .lte("data", dataFim)
        .order("data", { ascending: true });

      if (error) throw error;

      // Garantir que temos um array, mesmo que vazio
      setAulas(aulasData || []);
    } catch (error) {
      setErro(`Erro ao carregar aulas: ${error.message}`);
      setAulas([]);
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar especificamente as aulas dos próximos 7 dias
  const fetchAulasProximas = async () => {
    try {
      setLoadingProximas(true);
      setErro(null);

      const hoje = new Date();
      const dataInicio = hoje.toISOString().split("T")[0];

      const proximaSemana = new Date(hoje);
      proximaSemana.setDate(hoje.getDate() + 7);
      const dataFim = proximaSemana.toISOString().split("T")[0];

      let { data: aulasData, error } = await supabase
        .from("aulas")
        .select("*, alunos(nome)")
        .gte("data", dataInicio)
        .lte("data", dataFim)
        .order("data", { ascending: true });

      if (error) throw error;

      setAulasProximas(aulasData || []);
    } catch (error) {
      setErro(`Erro ao carregar próximas aulas: ${error.message}`);
      setAulasProximas([]);
    } finally {
      setLoadingProximas(false);
    }
  };

  // Função para navegar para a página de aulas e abrir o modal
  const agendarAula = () => {
    navigate("/aulas", { state: { openModal: true } });
  };

  // Função para ir para o mês anterior
  const mesAnterior = () => {
    setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() - 1, 1));
  };

  // Função para ir para o próximo mês
  const proximoMes = () => {
    setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 1));
  };

  // Obter nome do mês atual
  const nomeMes = mesAtual.toLocaleString("pt-BR", { month: "long" });
  const ano = mesAtual.getFullYear();

  // Criar dias do mês atual
  const diasDoMes = Array(
    new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 0).getDate()
  )
    .fill()
    .map((_, i) => i + 1);

  // Nomes dos dias da semana
  const diasDaSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  // Calendário começa no dia da semana correto
  const primeiroDiaDaSemana = new Date(
    mesAtual.getFullYear(),
    mesAtual.getMonth(),
    1
  ).getDay();

  // Função para obter eventos de um dia específico
  const getEventosDoDia = (dia) => {
    const dataString = `${mesAtual.getFullYear()}-${String(
      mesAtual.getMonth() + 1
    ).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
    return aulas.filter((aula) => aula.data === dataString);
  };

  // Verificar se um dia é o dia atual
  const isHoje = (dia) => {
    const hoje = new Date();
    return (
      dia === hoje.getDate() &&
      mesAtual.getMonth() === hoje.getMonth() &&
      mesAtual.getFullYear() === hoje.getFullYear()
    );
  };

  // Função para tentar reconectar
  const tentarNovamente = () => {
    fetchAulas();
    fetchAulasProximas();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            Voltar
          </button>
          <h1 className="text-2xl font-bold">Calendário</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={mesAnterior}
            className="p-1 rounded-full hover:bg-gray-200 bg-[#F9FAFB]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <span className="text-xl font-medium capitalize">
            {nomeMes} {ano}
          </span>
          <button
            onClick={proximoMes}
            className="p-1 rounded-full hover:bg-gray-200 bg-[#F9FAFB]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          <button
            onClick={agendarAula}
            className="bg-primary text-white px-4 py-2 rounded-md ml-4"
          >
            Agendar Aula
          </button>
        </div>
      </div>

      {erro && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold">Erro de conexão</p>
              <p>{erro}</p>
            </div>
            <button
              onClick={tentarNovamente}
              className="px-4 py-1 rounded text-white bg-red-700 hover:bg-red-800"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : erro ? (
        <div className="text-red-600 text-center p-4">
          {erro}
          <button
            onClick={fetchAulas}
            className="ml-2 text-primary hover:underline"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Cabeçalho dos dias da semana */}
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {diasDaSemana.map((dia, index) => (
              <div
                key={index}
                className="bg-gray-50 py-2 text-center text-sm font-medium text-gray-500"
              >
                {dia}
              </div>
            ))}
          </div>

          {/* Grade do calendário */}
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {/* Dias vazios antes do primeiro dia do mês */}
            {Array(primeiroDiaDaSemana)
              .fill()
              .map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="h-32 bg-gray-50 p-2"
                ></div>
              ))}

            {/* Dias do mês */}
            {diasDoMes.map((dia) => {
              const eventosDoDia = getEventosDoDia(dia);
              const ehHoje = isHoje(dia);

              return (
                <div
                  key={dia}
                  className={`h-32 ${
                    ehHoje ? "bg-blue-50" : "bg-white"
                  } p-2 border-b border-r relative`}
                >
                  <div
                    className={`text-sm font-medium ${
                      ehHoje
                        ? "text-primary font-bold bg-primary/20 rounded-full w-7 h-7 flex items-center justify-center"
                        : "text-gray-700"
                    }`}
                  >
                    {dia}
                  </div>

                  {/* Eventos no dia */}
                  <div className="mt-1 space-y-1 max-h-24 overflow-y-auto">
                    {eventosDoDia.map((evento) => (
                      <div
                        key={evento.id}
                        className="bg-primary/20 rounded-sm p-1 text-xs truncate cursor-pointer hover:bg-primary/30"
                        title={`${evento.horario} - ${
                          evento.alunos?.nome || "Aluno"
                        } - ${evento.materia}`}
                        onClick={() => navigate(`/aulas`)}
                      >
                        <div className="font-medium">{evento.horario}</div>
                        <div className="truncate">
                          {evento.alunos?.nome || "Aluno"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-6 bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-medium mb-3">Próximas Aulas</h2>
        {loadingProximas ? (
          <div className="flex justify-center items-center h-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-2">
            {aulasProximas.length > 0 ? (
              aulasProximas
                .sort((a, b) => {
                  // Ordenar por data primeiro
                  const dataA = new Date(a.data);
                  const dataB = new Date(b.data);
                  if (dataA.getTime() !== dataB.getTime()) {
                    return dataA - dataB;
                  }
                  // Depois por horário
                  return a.horario?.localeCompare(b.horario) || 0;
                })
                .slice(0, 5)
                .map((aula) => (
                  <div
                    key={aula.id}
                    className="flex items-center p-3 hover:bg-gray-50 rounded-md cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
                    onClick={() => navigate(`/aulas`)}
                  >
                    <div className="w-24 text-sm font-medium text-gray-600">
                      {formatarData(aula.data)}
                    </div>
                    <div className="w-20 text-sm font-medium text-gray-600">
                      {aula.horario}
                    </div>
                    <div className="flex-1 font-medium text-gray-800">
                      {aula.alunos?.nome || "Aluno"}
                    </div>
                    <div className="text-sm bg-primary/10 text-primary-dark px-3 py-1 rounded-full">
                      {aula.materia}
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                Nenhuma aula agendada para os próximos 7 dias
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendario;
