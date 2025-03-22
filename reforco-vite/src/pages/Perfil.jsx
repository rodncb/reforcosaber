import React from "react";

const Perfil = () => {
  // Dados do usuário mockados
  const usuario = {
    nome: "João Professor",
    email: "joao@reforcosaber.com",
    cargo: "Professor",
    telefone: "(11) 98765-4321",
    dataCadastro: "15/01/2024",
    ultimoLogin: "22/03/2024 14:15",
    fotoPerfil: "https://i.pravatar.cc/150?img=8",
    materias: ["Matemática", "Física", "Química"],
    bio: "Professor com mais de 10 anos de experiência em ensino de exatas para alunos do ensino fundamental e médio.",
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Perfil</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coluna de informações principais */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col items-center">
              <img
                src={usuario.fotoPerfil}
                alt={`Foto de ${usuario.nome}`}
                className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
              />
              <h2 className="mt-4 text-xl font-semibold">{usuario.nome}</h2>
              <p className="text-primary">{usuario.cargo}</p>

              <div className="mt-6 w-full space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{usuario.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telefone</p>
                  <p className="font-medium">{usuario.telefone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data de Cadastro</p>
                  <p className="font-medium">{usuario.dataCadastro}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Último Login</p>
                  <p className="font-medium">{usuario.ultimoLogin}</p>
                </div>
              </div>

              <button className="mt-6 w-full bg-primary text-white px-4 py-2 rounded-md">
                Editar Perfil
              </button>
            </div>
          </div>
        </div>

        {/* Coluna de conteúdo principal */}
        <div className="md:col-span-2 space-y-6">
          {/* Informações biográficas */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-3">Sobre</h3>
            <p className="text-gray-700">{usuario.bio}</p>

            <h3 className="text-lg font-semibold mt-5 mb-3">Matérias</h3>
            <div className="flex flex-wrap gap-2">
              {usuario.materias.map((materia, index) => (
                <span
                  key={index}
                  className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                >
                  {materia}
                </span>
              ))}
            </div>
          </div>

          {/* Alterar senha */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Alterar Senha</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha Atual
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nova Senha
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white px-4 py-2 rounded-md"
              >
                Alterar Senha
              </button>
            </form>
          </div>

          {/* Notificações */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              Preferências de Notificação
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Novas Aulas Agendadas</h4>
                  <p className="text-sm text-gray-500">
                    Receba notificações quando novas aulas forem agendadas.
                  </p>
                </div>
                <div className="relative inline-block w-12 h-6 border-2 rounded-full cursor-pointer bg-primary">
                  <span className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform"></span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Aulas Canceladas</h4>
                  <p className="text-sm text-gray-500">
                    Receba notificações quando aulas forem canceladas.
                  </p>
                </div>
                <div className="relative inline-block w-12 h-6 border-2 rounded-full cursor-pointer bg-primary">
                  <span className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform"></span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Lembretes</h4>
                  <p className="text-sm text-gray-500">
                    Receba lembretes 1 hora antes das aulas agendadas.
                  </p>
                </div>
                <div className="relative inline-block w-12 h-6 border-2 rounded-full cursor-pointer bg-gray-300">
                  <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
