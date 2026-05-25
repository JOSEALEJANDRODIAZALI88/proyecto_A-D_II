import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { recoverPassword } from "../services/authservice";
import "../styles/auth.css";

export default function Recover() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRecover = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const correoValue = correo.trim();

    if (!correoValue || !password || !confirmPassword) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoValue)) {
      setError("Ingrese un correo valido");
      return;
    }

    if (password.length < 6) {
      setError("La nueva contrasena debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contrasenas no coinciden");
      return;
    }

    setLoading(true);

    try {
      await recoverPassword(correoValue, password);
      setSuccess("Contrasena actualizada correctamente");
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      const message = error.response?.data?.message || "No se pudo recuperar la contrasena";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleRecover}>
        <div className="auth-icon">!</div>

        <h1>Recuperar acceso</h1>
        <p>Ingresa tu correo y define una nueva contrasena</p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <label>Correo electronico</label>
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="correo@gmail.com"
        />

        <label>Nueva contrasena</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minimo 6 caracteres"
        />

        <label>Confirmar contrasena</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repita su contrasena"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Actualizando..." : "Actualizar contrasena"}
        </button>

        <button type="button" className="auth-link-button" onClick={() => navigate("/login")}>
          Volver al login
        </button>
      </form>
    </div>
  );
}