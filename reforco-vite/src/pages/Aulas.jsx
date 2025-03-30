import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { useLocation, useNavigate } from "react-router-dom";
import { formatarData } from "../utils/formatters";
import { PencilIcon, TrashIcon } from "@heroicons/react/outline";

const Aulas = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [aulas, setAulas] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(false);
  const [aulaEditando, setAulaEditando] = useState(null);
  const [formData, setFormData] = useState({
    aluno_id: "",
    data: "",
    horario: "",
    duracao: "1h",
    materia: "",
    status: "Agendada",
    observacoes: "",
  });

  // Lista de opções para duração da aula
  const duracaoOpcoes = ["30min", "1h", "1h30", "2h", "2h30", "3h"];

  // Lista de status possíveis
  const statusOpcoes = ["Agendada", "Concluída", "Cancelada"];

  // Lista de matérias disponíveis
  const materiasDisponiveis = [
    "Matemática",
    "Português",
    "Ciências",
    "História",
    "Geografia",
    "Física",
    "Química",
    "Biologia",
    "Inglês",
  ];

  useEffect(() => {
    fetchAulas();
    fetchAlunos();

    // Verifica se deve abrir o modal automaticamente (quando navegado do calendário)
    if (location.state?.openModal) {
      setShowModal(true);
    }
  }, [location.state]);

  const fetchAulas = async () => {
    setLoading(true);
    setErro(null);

    try {
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
        .order("data", { ascending: true });

      if (error) {
        throw new Error(`Erro ao buscar aulas: ${error.message}`);
      }

      setAulas(data || []);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlunos = async () => {
    setLoading(true);
    setErro(null);

    try {
      const { data, error } = await supabase
        .from("alunos")
        .select("*")
        .order("nome", { ascending: true });

      if (error) {
        throw new Error(`Erro ao buscar alunos: ${error.message}`);
      }

      setAlunos(data || []);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Se o aluno for alterado, preencher matérias disponíveis para o aluno
    if (name === "aluno_id") {
      const alunoSelecionado = alunos.find(
        (aluno) => aluno.id.toString() === value
      );
      if (alunoSelecionado && alunoSelecionado.materias) {
        // Se for string, converte para array
        const materias =
          typeof alunoSelecionado.materias === "string"
            ? alunoSelecionado.materias.split(", ")
            : alunoSelecionado.materias;

        // Se houver matérias, seleciona a primeira por padrão
        if (materias && materias.length > 0) {
          setFormData((prev) => ({
            ...prev,
            materia: materias[0],
          }));
        }
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Agendada":
        return "bg-secondary/20 text-secondary-dark";
      case "Concluída":
        return "bg-primary/20 text-primary-dark";
      case "Cancelada":
        return "bg-secondary/30 text-secondary";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const resetForm = () => {
    setFormData({
      aluno_id: "",
      data: "",
      horario: "",
      duracao: "1h",
      materia: "",
      status: "Agendada",
      observacoes: "",
    });
    setEditando(false);
    setAulaEditando(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  // Função para iniciar a edição de uma aula
  const handleEditar = (aula) => {
    setAulaEditando(aula);
    setEditando(true);

    // Formatar a data para o formato YYYY-MM-DD para o input
    let dataFormatada = aula.data;
    if (dataFormatada && !dataFormatada.includes("-")) {
      const partes = dataFormatada.split("/");
      dataFormatada = `${partes[2]}-${partes[1]}-${partes[0]}`;
    }

    setFormData({
      aluno_id: aula.aluno_id.toString(),
      data: dataFormatada,
      horario: aula.horario,
      duracao: aula.duracao,
      materia: aula.materia,
      status: aula.status,
      observacoes: aula.observacoes || "",
    });

    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);

    try {
      setLoading(true);

      // Validação do ID do aluno
      if (!formData.aluno_id || formData.aluno_id === "") {
        throw new Error("Por favor, selecione um aluno");
      }

      // Formatação e preparação dos dados para o Supabase
      const dadosAula = {
        aluno_id: parseInt(formData.aluno_id, 10),
        data: formData.data,
        horario: formData.horario,
        duracao: formData.duracao,
        materia: formData.materia,
        status: formData.status,
        observacoes: formData.observacoes,
      };

      // Validação adicional
      if (isNaN(dadosAula.aluno_id)) {
        throw new Error("ID do aluno inválido");
      }

      let error;

      if (aulaEditando) {
        // Atualização de aula existente
        const { error: updateError } = await supabase
          .from("aulas")
          .update(dadosAula)
          .eq("id", aulaEditando.id);
        error = updateError;
      } else {
        // Inserção de nova aula
        const { error: insertError } = await supabase
          .from("aulas")
          .insert([dadosAula]);
        error = insertError;
      }

      if (error) {
        throw error;
      }

      // Atualizar lista de aulas
      fetchAulas();

      // Fechar modal e resetar formulário
      handleCloseModal();
    } catch (error) {
      setErro(
        `Erro ao ${editando ? "atualizar" : "agendar"} aula: ${error.message}`
      );
      alert(
        `Erro ao ${editando ? "atualizar" : "agendar"} aula. Tente novamente.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta aula?")) {
      setErro(null);
      try {
        setLoading(true);

        const { error } = await supabase.from("aulas").delete().eq("id", id);

        if (error) {
          throw error;
        }

        // Atualizar lista de aulas
        fetchAulas();
      } catch (error) {
        setErro(`Erro ao excluir aula: ${error.message}`);
        alert("Erro ao excluir aula. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }
  };

  const getMateriasDoAluno = (alunoId) => {
    const aluno = alunos.find((a) => a.id.toString() === alunoId);

    if (!aluno || !aluno.materias) return materiasDisponiveis;

    // Se for string, converte para array
    if (typeof aluno.materias === "string") {
      return aluno.materias.split(", ");
    }

    return aluno.materias;
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
          <h1 className="text-2xl font-bold">Aulas</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
        >
          Agendar Aula
        </button>
      </div>

      {erro && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p>{erro}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aluno
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Horário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duração
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Matéria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {aulas.length > 0 ? (
                  aulas.map((aula) => (
                    <tr key={aula.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {aula.alunos?.nome || "Aluno não encontrado"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatarData(aula.data)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {aula.horario}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {aula.duracao}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {aula.materia}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            aula.status
                          )}`}
                        >
                          {aula.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => handleEditar(aula)}
                          className="text-white bg-primary px-3 py-1 rounded-md hover:bg-primary-dark transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleExcluir(aula.id)}
                          className="text-white bg-secondary px-3 py-1 rounded-md hover:bg-secondary-dark transition-colors"
                        >
                          Cancelar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Nenhuma aula encontrada
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Agendamento/Edição */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full overflow-y-auto max-h-[90vh]">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editando ? "Editar Aula" : "Agendar Nova Aula"}
                </h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={handleCloseModal}
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Aluno */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Aluno
                    </label>
                    <select
                      name="aluno_id"
                      value={formData.aluno_id}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Selecione um aluno</option>
                      {alunos.map((aluno) => (
                        <option key={aluno.id} value={aluno.id}>
                          {aluno.nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Data */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Data
                      </label>
                      <input
                        type="date"
                        name="data"
                        value={formData.data}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    {/* Horário */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Horário
                      </label>
                      <input
                        type="time"
                        name="horario"
                        value={formData.horario}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Duração */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Duração
                      </label>
                      <select
                        name="duracao"
                        value={formData.duracao}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {duracaoOpcoes.map((duracao) => (
                          <option key={duracao} value={duracao}>
                            {duracao}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Matéria */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Matéria
                      </label>
                      <select
                        name="materia"
                        value={formData.materia}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Selecione a matéria</option>
                        {formData.aluno_id
                          ? getMateriasDoAluno(formData.aluno_id).map(
                              (materia) => (
                                <option key={materia} value={materia}>
                                  {materia}
                                </option>
                              )
                            )
                          : materiasDisponiveis.map((materia) => (
                              <option key={materia} value={materia}>
                                {materia}
                              </option>
                            ))}
                      </select>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {statusOpcoes.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Observações */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Observações
                    </label>
                    <textarea
                      name="observacoes"
                      value={formData.observacoes}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Observações adicionais sobre a aula..."
                    ></textarea>
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex justify-end space-x-2 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                      disabled={loading}
                    >
                      {loading
                        ? editando
                          ? "Atualizando..."
                          : "Agendando..."
                        : editando
                        ? "Atualizar Aula"
                        : "Agendar Aula"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Cards para telas menores */}
      <div className="md:hidden">
        {aulas.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {aulas.map((aula) => (
              <div key={aula.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {aula.alunos?.nome || "Aluno não encontrado"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatarData(aula.data)} - {aula.horario}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      aula.status
                    )}`}
                  >
                    {aula.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Duração: {aula.duracao}</p>
                  <p>Matéria: {aula.materia}</p>
                  {aula.observacoes && <p>Observações: {aula.observacoes}</p>}
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleEditar(aula)}
                    className="flex-1 text-white bg-primary py-2 rounded-md hover:bg-primary-dark transition-colors flex items-center justify-center gap-1"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span className="text-sm">Editar</span>
                  </button>
                  <button
                    onClick={() => handleExcluir(aula.id)}
                    className="flex-1 text-white bg-secondary py-2 rounded-md hover:bg-secondary-dark transition-colors flex items-center justify-center gap-1"
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span className="text-sm">Cancelar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="p-4 text-center text-gray-500">
            Nenhuma aula encontrada
          </p>
        )}
      </div>
    </div>
  );
};

export default Aulas;
