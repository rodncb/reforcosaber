import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { message, context } = await req.json();
    const openAiKey = Deno.env.get("OPENAI_API_KEY");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4-1106-preview",
        messages: [
          {
            role: "system",
            content: `Você é um assistente especializado para professores do Reforço do Saber.
                     Use o seguinte contexto para fornecer respostas relevantes:
                     - Informações dos alunos: ${JSON.stringify(context.alunos)}
                     - Histórico de aulas: ${JSON.stringify(context.aulas)}
                     
                     Forneça respostas objetivas e práticas, focando em:
                     1. Análise do progresso dos alunos
                     2. Sugestões de atividades personalizadas
                     3. Identificação de padrões e dificuldades
                     4. Recomendações pedagógicas baseadas nos dados`,
          },
          { role: "user", content: message },
        ],
        functions: [
          {
            name: "provide_teaching_assistance",
            parameters: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  description: "Resposta principal para o professor",
                },
                suggestions: {
                  type: "array",
                  items: { type: "string" },
                  description: "Sugestões de próximas perguntas ou ações",
                },
                actions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      type: {
                        type: "string",
                        enum: ["review", "schedule", "contact", "assessment"],
                      },
                      description: { type: "string" },
                      priority: {
                        type: "string",
                        enum: ["high", "medium", "low"],
                      },
                    },
                  },
                },
              },
              required: ["message", "suggestions"],
            },
          },
        ],
        function_call: { name: "provide_teaching_assistance" },
      }),
    });

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.function_call.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
