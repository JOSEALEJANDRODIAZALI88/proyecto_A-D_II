import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Recover from "./pages/recover";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import Home from "./pages/user/Home";
import ProtectedRoute from "./routes/protectedRoute";
import PanelNav from "./pages/admin/control-panel";
import { Funciones } from "./pages/admin/PanelPlaceholders";
import PeliculasList from "./pages/admin/PeliculasList";
import AddPelicula from "./pages/admin/AddPelicula.jsx";
import EditPelicula from "./pages/admin/EditPelicula";
import UsuariosList from "./pages/admin/UsuariosList";
import AddUsuario from "./pages/admin/AddUsuario";
import EditUsuario from "./pages/admin/EditUsuario";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recover" element={<Recover />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/control-panel"
          element={
            <ProtectedRoute allowedRole="admin">
              <PanelNav />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="usuarios" replace />} />

          <Route path="usuarios" element={<UsuariosList />} />
          <Route path="usuarios/nuevo" element={<AddUsuario />} />
          <Route path="usuarios/editar/:id" element={<EditUsuario />} />

          <Route path="funciones" element={<Funciones />} />

          <Route path="peliculas" element={<PeliculasList />} />
          <Route path="peliculas/nuevo" element={<AddPelicula />} />
          <Route path="peliculas/editar/:id" element={<EditPelicula />} />
        </Route>

        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRole="usuario">
              <Home />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}