import React from "react";
import { useNavigate } from "react-router-dom";

const Usuarios = () => {
  const navigate = useNavigate();
  const usuarios = [
    {
      id: 1,
      nome: "Admin",
      email: "admin@reforcosaber.com",
      cargo: "Administrador",
      ultimoLogin: "22/03/2024 15:30",
    },
    {
      id: 2,
      nome: "João Professor",
      email: "joao@reforcosaber.com",
      cargo: "Professor",
      ultimoLogin: "22/03/2024 14:15",
    },
    {
      id: 3,
      nome: "Maria Secretária",
      email: "maria@reforcosaber.com",
      cargo: "Secretária",
      ultimoLogin: "22/03/2024 09:45",
    },
  ];

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
          <h1 className="text-2xl font-bold">Usuários</h1>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-md">
          Adicionar Usuário
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
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cargo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Último Login
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {usuario.nome}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{usuario.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{usuario.cargo}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {usuario.ultimoLogin}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button className="bg-primary text-white px-3 py-1 rounded-md hover:bg-primary-dark transition-colors">
                    Editar
                  </button>
                  <button className="bg-secondary text-white px-3 py-1 rounded-md hover:bg-secondary-dark transition-colors">
                    Desativar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Permissões</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-2">Administrador</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Acesso completo ao sistema</li>
              <li>• Gerenciamento de usuários</li>
              <li>• Relatórios avançados</li>
              <li>• Configurações do sistema</li>
            </ul>
          </div>
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-2">Professor</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Gerenciamento de aulas</li>
              <li>• Visualização de alunos</li>
              <li>• Acesso ao calendário</li>
              <li>• Relatórios básicos</li>
            </ul>
          </div>
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-2">Secretária</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Agendamento de aulas</li>
              <li>• Cadastro de alunos</li>
              <li>• Acesso ao calendário</li>
              <li>• Relatórios básicos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Usuarios;
