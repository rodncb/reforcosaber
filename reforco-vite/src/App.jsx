import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Alunos from "./pages/Alunos";
import Aulas from "./pages/Aulas";
import Calendario from "./pages/Calendario";
import Usuarios from "./pages/Usuarios";
import Perfil from "./pages/Perfil";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import TestSupabase from "./pages/TestSupabase";
import TestTables from "./pages/TestTables";
import TeacherAssistant from "./components/TeacherAssistant";

// Componente para rotas protegidas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Enquanto verifica autenticação, mostra uma tela de carregamento
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redireciona para login se não autenticado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Renderiza o componente filho se autenticado
  return children;
};

function App() {
  // Determina o basename baseado no ambiente
  // No GitHub Pages o caminho será /reforcosaber/
  const basename = import.meta.env.DEV ? "/" : "/reforcosaber/";

  return (
    <AuthProvider>
      <Router basename={basename}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/auth-callback" element={<AuthCallback />} />
          <Route path="/test-supabase" element={<TestSupabase />} />
          <Route path="/test-tables" element={<TestTables />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="alunos" element={<Alunos />} />
            <Route path="aulas" element={<Aulas />} />
            <Route path="calendario" element={<Calendario />} />
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="assistant" element={<TeacherAssistant />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
