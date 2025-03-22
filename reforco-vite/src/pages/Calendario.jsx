import React from "react";

const Calendario = () => {
  // Dados mockados de aulas para o calendário
  const eventos = [
    {
      id: 1,
      dia: 22,
      hora: "14:00",
      aluno: "Maria Silva",
      materia: "Matemática",
    },
    {
      id: 2,
      dia: 23,
      hora: "09:00",
      aluno: "Pedro Souza",
      materia: "História",
    },
    { id: 3, dia: 24, hora: "10:00", aluno: "Ana Oliveira", materia: "Física" },
    {
      id: 4,
      dia: 25,
      hora: "14:00",
      aluno: "Maria Silva",
      materia: "Matemática",
    },
    {
      id: 5,
      dia: 26,
      hora: "15:30",
      aluno: "João Santos",
      materia: "Português",
    },
  ];

  // Criar dias do mês atual (Março 2024)
  const diasDoMes = Array(31)
    .fill()
    .map((_, i) => i + 1);

  // Nomes dos dias da semana
  const diasDaSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  // Calendário começa em uma sexta-feira (dia 1 de março)
  const primeiroDiaDaSemana = 5; // 0 = Domingo, 5 = Sexta
  const diasAntes = primeiroDiaDaSemana;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Calendário</h1>
        <div>
          <span className="text-xl font-medium">Março 2024</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Cabeçalho dos dias da semana */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {diasDaSemana.map((dia, index) => (
            <div
              key={index}
              className="bg-gray-50 py-2 text-center text-sm font-medium text-gray-500"
            >
              {dia}
            </div>
          ))}
        </div>

        {/* Grade do calendário */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {/* Dias vazios antes do primeiro dia do mês */}
          {Array(diasAntes)
            .fill()
            .map((_, index) => (
              <div key={`empty-${index}`} className="h-32 bg-gray-50 p-2"></div>
            ))}

          {/* Dias do mês */}
          {diasDoMes.map((dia) => {
            const eventosNoDia = eventos.filter((e) => e.dia === dia);

            return (
              <div key={dia} className="h-32 bg-white p-2 border-b border-r">
                <div
                  className={`text-sm font-medium ${
                    dia === 22 ? "text-primary font-bold" : "text-gray-700"
                  }`}
                >
                  {dia}
                </div>

                {/* Eventos no dia */}
                <div className="mt-1 space-y-1 max-h-24 overflow-y-auto">
                  {eventosNoDia.map((evento) => (
                    <div
                      key={evento.id}
                      className="bg-primary/20 rounded-sm p-1 text-xs truncate"
                      title={`${evento.hora} - ${evento.aluno} - ${evento.materia}`}
                    >
                      <div className="font-medium">{evento.hora}</div>
                      <div className="truncate">{evento.aluno}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-medium mb-3">Próximas Aulas</h2>
        <div className="space-y-2">
          {eventos
            .filter((e) => e.dia >= 22)
            .sort((a, b) => a.dia - b.dia)
            .map((evento) => (
              <div
                key={evento.id}
                className="flex items-center p-2 hover:bg-gray-50 rounded-md"
              >
                <div className="w-16 text-sm text-gray-600">
                  {evento.dia}/03
                </div>
                <div className="w-16 text-sm text-gray-600">{evento.hora}</div>
                <div className="flex-1 font-medium">{evento.aluno}</div>
                <div className="text-sm text-gray-600">{evento.materia}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Calendario;
