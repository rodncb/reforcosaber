import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Apenas para verificação durante desenvolvimento
console.log("Variáveis de ambiente carregadas:");
console.log(
  "URL (primeiros 10 caracteres):",
  import.meta.env.VITE_SUPABASE_URL?.substring(0, 10) || "não definida"
);
console.log(
  "ANON_KEY (primeiros 10 caracteres):",
  import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 10) || "não definida"
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
