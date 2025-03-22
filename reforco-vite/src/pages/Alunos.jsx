import React from "react";

const Alunos = () => {
  const alunos = [
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
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Alunos</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-md">
          Adicionar Aluno
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                  <div className="text-sm text-gray-500">{aluno.materia}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {aluno.proxima_aula}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button className="text-primary hover:text-primary-dark">
                    Editar
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Alunos;
