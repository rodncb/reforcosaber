// Arquivo para testar as variáveis de ambiente
console.log("======== TESTE DE VARIÁVEIS DE AMBIENTE ========");
console.log("URL do Supabase:", import.meta.env.VITE_SUPABASE_URL);
console.log("Chave ANON:", import.meta.env.VITE_SUPABASE_ANON_KEY);

// Verificar se há caracteres problemáticos
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
console.log("Comprimento da chave:", anonKey.length);
console.log(
  "Caracteres na chave:",
  Array.from(anonKey).map((c) => c.charCodeAt(0))
);

// Verificar se há quebras de linha ou espaços em branco
const temQuebraDeLinha = anonKey.includes("\n") || anonKey.includes("\r");
const temEspacos = anonKey.includes(" ");
console.log("Tem quebra de linha?", temQuebraDeLinha);
console.log("Tem espaços?", temEspacos);

// Verificar se o .env está no formato correto
console.log("Formato da chave corrigida:", anonKey.replace(/[\r\n\s]/g, ""));
console.log("======== FIM DO TESTE ========");

export default {};
