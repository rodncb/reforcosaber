import React from "react";
import { BellIcon, SearchIcon, MenuIcon } from "@heroicons/react/outline";
import { useAuth } from "../contexts/AuthContext";

const TopBar = ({ toggleSidebar }) => {
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      // O redirecionamento será automático através das rotas protegidas
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="bg-white h-16 px-6 flex items-center justify-between border-b">
      {/* Botão de menu móvel */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none"
      >
        <MenuIcon className="h-6 w-6 text-gray-600" />
      </button>

      {/* Campo de busca */}
      <div className="relative flex-1 max-w-xl ml-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          className="block w-full pl-10 pr-3 py-2 rounded-md bg-gray-100 border border-transparent focus:bg-white focus:border-gray-300 focus:outline-none focus:ring-0 text-sm"
          type="text"
          placeholder="Pesquisar..."
        />
      </div>

      {/* Ícones de ação */}
      <div className="flex items-center space-x-4">
        {/* Notificações */}
        <button className="p-2 rounded-md hover:bg-gray-100 focus:outline-none relative">
          <BellIcon className="h-6 w-6 text-gray-600" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* Perfil do usuário */}
        <div className="flex items-center space-x-3">
          <img
            src="https://i.pravatar.cc/150?img=8"
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="hidden md:block">
            <p className="text-sm font-medium">{user?.email || "Usuário"}</p>
            <p className="text-xs text-gray-500">Professor</p>
          </div>

          {/* Botão de Logout */}
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-500"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
