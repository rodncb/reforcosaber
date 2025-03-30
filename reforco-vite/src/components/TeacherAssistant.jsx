import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";

const ActionBadge = ({ type, priority }) => {
  const colors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  };

  const icons = {
    review: "📚",
    schedule: "📅",
    contact: "📞",
    assessment: "📝",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[priority]}`}
    >
      {icons[type]} {type}
    </span>
  );
};

const TeacherAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    try {
      setLoading(true);
      const userMessage = { role: "user", content: input };
      setMessages((prev) => [...prev, userMessage]);

      // Buscar contexto relevante do Supabase
      const { data: alunosContext } = await supabase
        .from("alunos")
        .select("*")
        .limit(5);

      const { data: aulasContext } = await supabase
        .from("aulas")
        .select("*, alunos(*)")
        .order("data", { ascending: false })
        .limit(5);

      // Chamada para a Edge Function do Supabase
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/teacher-assistant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            message: input,
            context: {
              alunos: alunosContext,
              aulas: aulasContext,
            },
          }),
        }
      );

      const assistantResponse = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: assistantResponse.message,
          suggestions: assistantResponse.suggestions,
          actions: assistantResponse.actions,
        },
      ]);

      setInput("");
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Assistente do Professor</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-primary text-white"
                  : "bg-gray-100"
              }`}
            >
              <p>{message.content}</p>
              {message.actions && (
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-medium">Ações Recomendadas:</p>
                  <div className="flex flex-wrap gap-2">
                    {message.actions.map((action, idx) => (
                      <ActionBadge
                        key={idx}
                        type={action.type}
                        priority={action.priority}
                      />
                    ))}
                  </div>
                </div>
              )}
              {message.suggestions && (
                <div className="mt-2 space-y-1">
                  {message.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(suggestion)}
                      className="text-sm text-primary-dark hover:underline block"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua pergunta..."
            className="flex-1 p-2 border rounded-lg"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherAssistant;
