import React, { useState } from "react";
import {
  BellIcon,
  SearchIcon,
  MenuIcon,
  LogoutIcon,
} from "@heroicons/react/outline";
import { useAuth } from "../contexts/AuthContext";

const TopBar = ({ toggleSidebar }) => {
  const { signOut, user } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="bg-white h-16 px-6 flex items-center justify-between border-b shadow-sm">
      {/* Botão de menu móvel */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none bg-[#F9FAFB]"
        aria-label="Abrir menu"
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      {/* Campo de busca */}
      <div className="relative flex-1 max-w-xl ml-2 lg:ml-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          className="block w-full pl-10 pr-3 py-2 rounded-md bg-gray-100 border border-transparent focus:bg-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
          type="text"
          placeholder="Pesquisar..."
        />
      </div>

      {/* Ícones de ação */}
      <div className="flex items-center space-x-4">
        {/* Notificações */}
        <button
          className="p-2 rounded-md hover:bg-gray-100 focus:outline-none relative bg-[#F9FAFB]"
          aria-label="Notificações"
        >
          <BellIcon className="h-6 w-6" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-[#f57f7f]"></span>
        </button>

        {/* Perfil do usuário */}
        <div className="flex items-center space-x-3 relative">
          <img
            src="https://i.pravatar.cc/150?img=8"
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover border-2 border-primary"
          />
          <div className="hidden md:block">
            <p className="text-sm font-medium">{user?.email || "Usuário"}</p>
            <p className="text-xs text-gray-500">Professor</p>
          </div>

          {/* Botão de Logout */}
          <button
            onClick={() => setShowLogoutConfirm(!showLogoutConfirm)}
            className="p-1.5 rounded-md hover:bg-gray-100 focus:outline-none bg-[#F9FAFB]"
            aria-label="Sair"
          >
            <LogoutIcon className="h-5 w-5" />
          </button>

          {/* Confirmação de Logout */}
          {showLogoutConfirm && (
            <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-md py-2 px-3 border z-10">
              <p className="text-sm mb-2">Tem certeza que deseja sair?</p>
              <div className="flex space-x-2">
                <button
                  onClick={handleLogout}
                  className="bg-[#f57f7f] text-white px-3 py-1.5 text-xs rounded-md hover:bg-[#e66d6d]"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="bg-gray-200 text-gray-600 px-3 py-1.5 text-xs rounded-md hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
