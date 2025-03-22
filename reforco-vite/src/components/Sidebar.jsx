import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  CalendarIcon,
  AcademicCapIcon,
  UserIcon,
  CogIcon,
} from "@heroicons/react/outline";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/", name: "Dashboard", icon: HomeIcon },
    { path: "/alunos", name: "Alunos", icon: UserGroupIcon },
    { path: "/aulas", name: "Aulas", icon: AcademicCapIcon },
    { path: "/calendario", name: "Calendário", icon: CalendarIcon },
    { path: "/usuarios", name: "Usuários", icon: UserIcon },
  ];

  return (
    <div className="bg-white h-full shadow-md w-64 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-lg">RS</span>
          </div>
          <span className="text-primary font-bold text-xl">ReforçoSaber</span>
        </Link>
      </div>

      {/* Menu Principal */}
      <div className="flex-1 py-6 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-md transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer com Perfil */}
      <div className="border-t p-4">
        <Link
          to="/perfil"
          className={`flex items-center space-x-3 px-3 py-2.5 rounded-md transition-colors ${
            location.pathname === "/perfil"
              ? "bg-primary text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <CogIcon className="w-5 h-5" />
          <span className="font-medium">Perfil</span>
        </Link>

        <div className="mt-4 flex items-center space-x-3 px-3">
          <img
            src="https://i.pravatar.cc/150?img=8"
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium">João Professor</p>
            <p className="text-xs text-gray-500">Professor</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
