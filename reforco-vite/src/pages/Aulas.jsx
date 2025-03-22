import React from "react";

const Aulas = () => {
  const aulas = [
    {
      id: 1,
      aluno: "Maria Silva",
      data: "25/03/2024",
      horario: "14:00",
      duracao: "1h30",
      materia: "Matemática",
      status: "Agendada",
    },
    {
      id: 2,
      aluno: "João Santos",
      data: "26/03/2024",
      horario: "15:30",
      duracao: "1h",
      materia: "Português",
      status: "Agendada",
    },
    {
      id: 3,
      aluno: "Ana Oliveira",
      data: "24/03/2024",
      horario: "10:00",
      duracao: "2h",
      materia: "Física",
      status: "Concluída",
    },
    {
      id: 4,
      aluno: "Pedro Souza",
      data: "23/03/2024",
      horario: "09:00",
      duracao: "1h",
      materia: "História",
      status: "Cancelada",
    },
    {
      id: 5,
      aluno: "Maria Silva",
      data: "22/03/2024",
      horario: "14:00",
      duracao: "1h30",
      materia: "Matemática",
      status: "Concluída",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Agendada":
        return "bg-yellow-100 text-yellow-800";
      case "Concluída":
        return "bg-green-100 text-green-800";
      case "Cancelada":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Aulas</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-md">
          Agendar Aula
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
            {aulas.map((aula) => (
              <tr key={aula.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {aula.aluno}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{aula.data}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{aula.horario}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{aula.duracao}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{aula.materia}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      aula.status
                    )}`}
                  >
                    {aula.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button className="text-primary hover:text-primary-dark">
                    Editar
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    Cancelar
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

export default Aulas;
