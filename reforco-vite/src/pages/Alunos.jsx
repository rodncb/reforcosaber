import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/outline";
import { useNavigate } from "react-router-dom";

const Alunos = () => {
  const navigate = useNavigate();
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [alunoEditando, setAlunoEditando] = useState(null);
  const [erro, setErro] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    dataNascimento: "",
    anoEscolar: "",
    responsavel: "",
    telefone: "",
    email: "",
    materias: [],
  });

  // Lista de anos escolares disponíveis
  const anosEscolares = [
    "1º ano",
    "2º ano",
    "3º ano",
    "4º ano",
    "5º ano",
    "6º ano",
    "7º ano",
    "8º ano",
    "9º ano",
    "1º ano EM",
    "2º ano EM",
    "3º ano EM",
  ];

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

  // Carregar alunos do Supabase quando o componente montar
  useEffect(() => {
    fetchAlunos();
  }, []);

  const fetchAlunos = async () => {
    try {
      setErro(null);
      setLoading(true);

      const { data, error } = await supabase
        .from("alunos")
        .select("*")
        .order("nome");

      if (error) {
        throw error;
      }

      if (data) {
        setAlunos(data);
      }
    } catch (error) {
      setErro(`Erro ao buscar alunos: ${error.message}`);
      // Usar dados fictícios em caso de erro
      setAlunos([
        {
          id: 1,
          nome: "Maria Silva",
          serie: "9º ano",
          materia: "Matemática",
          proxima_aula: "25/03/2024",
        },
        {
          id: 2,
          nome: "João Santos",
          serie: "7º ano",
          materia: "Português",
          proxima_aula: "26/03/2024",
        },
        {
          id: 3,
          nome: "Ana Oliveira",
          serie: "3º ano EM",
          materia: "Física",
          proxima_aula: "27/03/2024",
        },
        {
          id: 4,
          nome: "Pedro Souza",
          serie: "8º ano",
          materia: "História",
          proxima_aula: "28/03/2024",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Manipular mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Manipular seleção de matérias (checkboxes)
  const handleMateriaChange = (materia) => {
    if (formData.materias.includes(materia)) {
      // Remover matéria se já estiver selecionada
      setFormData({
        ...formData,
        materias: formData.materias.filter((m) => m !== materia),
      });
    } else {
      // Adicionar matéria se não estiver selecionada
      setFormData({
        ...formData,
        materias: [...formData.materias, materia],
      });
    }
  };

  // Abrir modal de edição e preencher com dados do aluno
  const handleOpenEditModal = (aluno) => {
    const materias = aluno.materias
      ? typeof aluno.materias === "string"
        ? aluno.materias.split(", ")
        : aluno.materias
      : [];

    setFormData({
      nome: aluno.nome || "",
      dataNascimento: aluno.data_nascimento || "",
      anoEscolar: aluno.serie || "",
      responsavel: aluno.responsavel || "",
      telefone: aluno.telefone || "",
      email: aluno.email || "",
      materias: materias,
    });

    setAlunoEditando(aluno);
    setShowEditModal(true);
  };

  // Resetar formulário
  const resetForm = () => {
    setFormData({
      nome: "",
      dataNascimento: "",
      anoEscolar: "",
      responsavel: "",
      telefone: "",
      email: "",
      materias: [],
    });
    setAlunoEditando(null);
  };

  // Fechar modal e resetar formulário
  const handleCloseModal = () => {
    setShowModal(false);
    setShowEditModal(false);
    resetForm();
  };

  // Enviar formulário para criar novo aluno
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);

    try {
      setLoading(true);

      // Formatando os dados para inserção no Supabase
      const novoAluno = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        serie: formData.anoEscolar,
        materias: formData.materias.join(", "),
        responsavel: formData.responsavel,
        data_nascimento: formData.dataNascimento,
      };

      // Inserindo no Supabase
      const { error } = await supabase
        .from("alunos")
        .insert([novoAluno])
        .select();

      if (error) {
        throw error;
      }

      // Atualizando a lista de alunos
      fetchAlunos();

      // Fechando o modal e resetando o formulário
      handleCloseModal();
    } catch (error) {
      setErro(`Erro ao cadastrar aluno: ${error.message}`);
      alert("Erro ao cadastrar aluno. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Enviar formulário para atualizar aluno
  const handleUpdate = async (e) => {
    e.preventDefault();
    setErro(null);

    if (!alunoEditando) return;

    try {
      setLoading(true);

      // Formatando os dados para atualização no Supabase
      const alunoAtualizado = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        serie: formData.anoEscolar,
        materias: formData.materias.join(", "),
        responsavel: formData.responsavel,
        data_nascimento: formData.dataNascimento,
      };

      // Atualizando no Supabase
      const { error } = await supabase
        .from("alunos")
        .update(alunoAtualizado)
        .eq("id", alunoEditando.id)
        .select();

      if (error) {
        throw error;
      }

      // Atualizando a lista de alunos
      fetchAlunos();

      // Fechando o modal e resetando o formulário
      handleCloseModal();
    } catch (error) {
      setErro(`Erro ao atualizar aluno: ${error.message}`);
      alert("Erro ao atualizar aluno. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Excluir aluno
  const handleExcluir = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este aluno?")) {
      setErro(null);
      try {
        setLoading(true);

        const { error } = await supabase.from("alunos").delete().eq("id", id);

        if (error) {
          throw error;
        }

        // Atualizando a lista de alunos
        fetchAlunos();
      } catch (error) {
        setErro(`Erro ao excluir aluno: ${error.message}`);
        alert("Erro ao excluir aluno. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }
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
          <h1 className="text-2xl font-bold">Alunos</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Adicionar Aluno
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
          {/* Tabela para telas maiores */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Série
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Matéria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Próxima Aula
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {alunos.map((aluno) => (
                  <tr key={aluno.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {aluno.nome}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{aluno.serie}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {aluno.materia || aluno.materias}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {aluno.proxima_aula || "Não agendada"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        className="bg-primary text-white px-3 py-1 rounded-md hover:bg-primary-dark transition-colors"
                        onClick={() => handleOpenEditModal(aluno)}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-secondary text-white px-3 py-1 rounded-md hover:bg-secondary-dark transition-colors"
                        onClick={() => handleExcluir(aluno.id)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards para telas menores */}
          <div className="md:hidden">
            {alunos.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {alunos.map((aluno) => (
                  <div key={aluno.id} className="p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {aluno.nome}
                        </h3>
                        <p className="text-sm text-gray-500">{aluno.serie}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenEditModal(aluno)}
                          className="text-white bg-primary p-2 rounded-md hover:bg-primary-dark transition-colors"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleExcluir(aluno.id)}
                          className="text-white bg-secondary p-2 rounded-md hover:bg-secondary-dark transition-colors"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Matérias: {aluno.materias}</p>
                      <p>Email: {aluno.email}</p>
                      <p>Telefone: {aluno.telefone}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-4 text-center text-gray-500">
                Nenhum aluno encontrado
              </p>
            )}
          </div>
        </div>
      )}

      {/* Modal Adicionar Aluno */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full overflow-y-auto max-h-[90vh]">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Novo Aluno</h2>
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
                  {/* Nome do Aluno */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Nome do Aluno
                    </label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Data de Nascimento */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Data de Nascimento
                      </label>
                      <input
                        type="date"
                        name="dataNascimento"
                        value={formData.dataNascimento}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    {/* Ano Escolar */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Ano Escolar
                      </label>
                      <select
                        name="anoEscolar"
                        value={formData.anoEscolar}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Selecione o ano</option>
                        {anosEscolares.map((ano) => (
                          <option key={ano} value={ano}>
                            {ano}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Nome do Responsável */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Nome do Responsável
                    </label>
                    <input
                      type="text"
                      name="responsavel"
                      value={formData.responsavel}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Telefone */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Matérias */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Matérias
                    </label>
                    <div className="grid grid-cols-2 gap-2 border border-gray-300 rounded-md p-4">
                      {materiasDisponiveis.map((materia) => (
                        <div key={materia} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`materia-${materia}`}
                            checked={formData.materias.includes(materia)}
                            onChange={() => handleMateriaChange(materia)}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`materia-${materia}`}
                            className="ml-2 text-sm text-gray-700"
                          >
                            {materia}
                          </label>
                        </div>
                      ))}
                    </div>
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
                      {loading ? "Cadastrando..." : "Cadastrar"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar aluno */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full overflow-y-auto max-h-[90vh]">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Editar Aluno</h2>
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

              <form onSubmit={handleUpdate}>
                <div className="space-y-6">
                  {/* Nome */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Nome
                    </label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Data de Nascimento */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Data de Nascimento
                      </label>
                      <input
                        type="date"
                        name="dataNascimento"
                        value={formData.dataNascimento}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    {/* Ano Escolar */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Ano Escolar
                      </label>
                      <select
                        name="anoEscolar"
                        value={formData.anoEscolar}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Selecione o ano escolar</option>
                        {anosEscolares.map((ano) => (
                          <option key={ano} value={ano}>
                            {ano}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Responsável */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Responsável
                      </label>
                      <input
                        type="text"
                        name="responsavel"
                        value={formData.responsavel}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    {/* Telefone */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Matérias */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Matérias
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {materiasDisponiveis.map((materia) => (
                        <div key={materia} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`materia-edit-${materia}`}
                            checked={formData.materias.includes(materia)}
                            onChange={() => handleMateriaChange(materia)}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`materia-edit-${materia}`}
                            className="ml-2 block text-sm text-gray-900"
                          >
                            {materia}
                          </label>
                        </div>
                      ))}
                    </div>
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
                      {loading ? "Salvando..." : "Salvar Alterações"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alunos;
