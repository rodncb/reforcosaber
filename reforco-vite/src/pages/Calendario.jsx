import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";
import { formatarData } from "../utils/formatters";
import {
  saveToLocalStorage,
  getFromLocalStorage,
  generateCacheKey,
} from "../utils/localStorage";

const Calendario = () => {
  const navigate = useNavigate();
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [mesAtual, setMesAtual] = useState(new Date());
  const [modoOffline, setModoOffline] = useState(false);

  // Buscar aulas do Supabase
  useEffect(() => {
    fetchAulas();
  }, [mesAtual]);

  // Função para carregar as aulas do mês selecionado
  const fetchAulas = async (
    mes = mesAtual.getMonth() + 1,
    ano = mesAtual.getFullYear()
  ) => {
    setLoading(true);
    setErro(null);

    // Gerar chave para cache
    const cacheKey = generateCacheKey("calendario_aulas", { mes, ano });

    // Verificar se há dados em cache
    const dadosCache = getFromLocalStorage(cacheKey, 60); // Expiração de 60 minutos

    // Se estiver offline e tiver dados em cache, use-os
    if (modoOffline && dadosCache) {
      setAulas(dadosCache);
      setLoading(false);
      return;
    }

    try {
      // Calculando o primeiro e último dia do mês
      const dataInicio = `${ano}-${String(mes).padStart(2, "0")}-01`;
      const ultimoDia = new Date(ano, mes, 0).getDate();
      const dataFim = `${ano}-${String(mes).padStart(2, "0")}-${ultimoDia}`;

      // Se tiver dados em cache, use-os temporariamente enquanto carrega os novos dados
      if (dadosCache) {
        setAulas(dadosCache);
      }

      // Fazendo a consulta ao Supabase
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
        .gte("data", dataInicio)
        .lte("data", dataFim)
        .order("data", { ascending: true });

      if (error) {
        // Se tiver dados em cache, continue usando-os em modo offline
        if (dadosCache) {
          setModoOffline(true);
          setErro(
            "Usando dados offline (último acesso). Falha na conexão: " +
              error.message
          );
          setAulas(dadosCache);
        } else {
          throw error;
        }
      } else {
        // Atualiza o estado com os dados obtidos e salva no cache
        setAulas(data || []);
        setMesAtual(new Date(ano, mes - 1));
        saveToLocalStorage(cacheKey, data || []);
        setModoOffline(false);
      }
    } catch (error) {
      setErro(`Erro ao carregar aulas: ${error.message}`);

      // Se tiver dados em cache, continue usando-os em modo offline
      if (dadosCache) {
        setModoOffline(true);
        setAulas(dadosCache);
        setErro("Usando dados offline (último acesso). Erro: " + error.message);
      } else {
        setAulas([]);
      }
    } finally {
      setLoading(false);
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
    setModoOffline(false);
    fetchAulas();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Calendário</h1>
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
        <div
          className={`border-l-4 p-4 mb-6 rounded ${
            modoOffline
              ? "bg-yellow-100 border-yellow-500 text-yellow-700"
              : "bg-red-100 border-red-500 text-red-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold">
                {modoOffline ? "Modo Offline" : "Erro de conexão"}
              </p>
              <p>{erro}</p>
            </div>
            <button
              onClick={tentarNovamente}
              className={`px-4 py-1 rounded text-white ${
                modoOffline
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : "bg-red-700 hover:bg-red-800"
              }`}
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )}

      {loading && !aulas.length ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
        {loading ? (
          <div className="flex justify-center items-center h-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : aulas.length > 0 ? (
          <div className="space-y-2">
            {aulas
              .filter((aula) => new Date(aula.data) >= new Date())
              .sort((a, b) => new Date(a.data) - new Date(b.data))
              .slice(0, 5) // Mostrar apenas as 5 próximas
              .map((aula) => (
                <div
                  key={aula.id}
                  className="flex items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                  onClick={() => navigate(`/aulas`)}
                >
                  <div className="w-16 text-sm text-gray-600">
                    {formatarData(aula.data)}
                  </div>
                  <div className="w-16 text-sm text-gray-600">
                    {aula.horario}
                  </div>
                  <div className="flex-1 font-medium">
                    {aula.alunos?.nome || "Aluno"}
                  </div>
                  <div className="text-sm text-gray-600">{aula.materia}</div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            Nenhuma aula agendada
          </p>
        )}
      </div>
    </div>
  );
};

export default Calendario;
