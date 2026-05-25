import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authservice";
import "../styles/auth.css";

export default function Register() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const nombreValue = nombre.trim();
    const correoValue = correo.trim();
    const telefonoValue = telefono.trim();

    if (!nombreValue || !correoValue || !telefonoValue || !password || !confirmPassword) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoValue)) {
      setError("Ingrese un correo valido");
      return;
    }

    if (password.length < 6) {
      setError("La contrasena debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contrasenas no coinciden");
      return;
    }

    setLoading(true);

    try {
      await registerUser(nombreValue, correoValue, telefonoValue, password);
      setSuccess("Usuario registrado correctamente");
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      const message = error.response?.data?.message || "No se pudo registrar el usuario";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleRegister}>
        <div className="auth-icon">+</div>

        <h1>Crear cuenta</h1>
        <p>Registra tus datos para comprar tickets</p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <label>Nombre completo</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej. Juan Perez"
        />

        <label>Correo electronico</label>
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="correo@gmail.com"
        />

        <label>Telefono</label>
        <input
          type="text"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="77777777"
        />

        <label>Contrasena</label>
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
          {loading ? "Registrando..." : "Registrarse"}
        </button>

        <button type="button" className="auth-link-button" onClick={() => navigate("/login")}>
          Ya tengo cuenta
        </button>
      </form>
    </div>
  );
}