import React from "react";

const Dashboard = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-primary/20 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold">Alunos</h2>
          <div className="text-3xl font-bold mt-2">4</div>
        </div>

        <div className="bg-green-100 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold">Total de Aulas</h2>
          <div className="text-3xl font-bold mt-2">5</div>
        </div>

        <div className="bg-purple-100 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold">Aulas Pendentes</h2>
          <div className="text-3xl font-bold mt-2">1</div>
        </div>

        <div className="bg-red-100 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold">Aulas Canceladas</h2>
          <div className="text-3xl font-bold mt-2">2</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Aulas Recentes</h2>
        <div className="text-gray-500">Carregando aulas...</div>
      </div>
    </div>
  );
};

export default Dashboard;
