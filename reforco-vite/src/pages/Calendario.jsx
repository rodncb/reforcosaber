import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";

const Calendario = () => {
  const navigate = useNavigate();
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mesAtual, setMesAtual] = useState(new Date());

  // Buscar aulas do Supabase
  useEffect(() => {
    fetchAulas();
  }, [mesAtual]);

  const fetchAulas = async () => {
    try {
      setLoading(true);

      // Calcula o primeiro e último dia do mês atual
      const primeiroDia = new Date(
        mesAtual.getFullYear(),
        mesAtual.getMonth(),
        1
      );
      const ultimoDia = new Date(
        mesAtual.getFullYear(),
        mesAtual.getMonth() + 1,
        0
      );

      // Formata as datas para o formato ISO
      const dataInicio = primeiroDia.toISOString().split("T")[0];
      const dataFim = ultimoDia.toISOString().split("T")[0];

      console.log(`Buscando aulas de ${dataInicio} até ${dataFim}`);

      // Busca aulas no intervalo de datas sem usar join automático
      const { data, error } = await supabase
        .from("aulas")
        .select("*")
        .gte("data", dataInicio)
        .lte("data", dataFim)
        .order("data", { ascending: true });

      if (error) {
        console.error("Erro detalhado do Supabase:", error);
        throw error;
      }

      if (data && data.length > 0) {
        console.log(
          `Aulas carregadas: ${data.length} registros para o mês de ${nomeMes}`
        );

        // Buscar informações dos alunos separadamente
        const alunosIds = [...new Set(data.map((aula) => aula.aluno_id))];
        const { data: alunosData, error: alunosError } = await supabase
          .from("alunos")
          .select("id, nome")
          .in("id", alunosIds);

        if (alunosError) {
          console.error("Erro ao buscar informações dos alunos:", alunosError);
        } else {
          // Mapeando os nomes dos alunos para as aulas
          const aulasComAlunos = data.map((aula) => {
            const alunoEncontrado = alunosData?.find(
              (aluno) => aluno.id === aula.aluno_id
            );
            return {
              ...aula,
              alunos: alunoEncontrado
                ? { nome: alunoEncontrado.nome }
                : { nome: "Aluno não encontrado" },
            };
          });

          setAulas(aulasComAlunos);
        }
      } else {
        console.log(`Nenhuma aula encontrada para o mês de ${nomeMes}`);
        setAulas([]);
      }
    } catch (error) {
      console.error("Erro ao buscar aulas:", error.message);
      // Não usar dados mockados em produção
      setAulas([]);
      // Exibe um alerta para o usuário
      alert(
        `Erro ao carregar aulas: ${error.message}. Por favor, tente novamente.`
      );
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

  // Função para formatar a data para exibição
  const formatarData = (dataStr) => {
    try {
      const data = new Date(dataStr);
      return `${String(data.getDate()).padStart(2, "0")}/${String(
        data.getMonth() + 1
      ).padStart(2, "0")}`;
    } catch {
      return dataStr;
    }
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

      {loading ? (
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
