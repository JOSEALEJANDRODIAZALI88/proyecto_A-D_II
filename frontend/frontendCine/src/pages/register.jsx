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

    if (!/^[0-9]{6,15}$/.test(telefonoValue)) {
      setError("Ingrese un telefono valido");
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

      setNombre("");
      setCorreo("");
      setTelefono("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      const message = error.response?.data?.message || "No se pudo registrar el usuario";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card auth-card-register" onSubmit={handleRegister} autoComplete="off">
        <div className="auth-header">
          <div className="auth-icon">+</div>
          <span className="auth-brand">Cine Verde</span>
          <h1>Crear cuenta</h1>
          <p>Registra tus datos para comprar tickets de cine online</p>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <div className="auth-grid">
          <div className="auth-field">
            <label htmlFor="nombre">Nombre completo</label>
            <input
              id="nombre"
              name="nombre_cliente"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Juan Perez"
              autoComplete="name"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="telefono">Telefono</label>
            <input
              id="telefono"
              name="telefono_cliente"
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ""))}
              placeholder="77777777"
              autoComplete="tel"
              inputMode="numeric"
              maxLength="15"
            />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="correo">Correo electronico</label>
          <input
            id="correo"
            name="correo_cliente"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="correo@gmail.com"
            autoComplete="email"
          />
        </div>

        <div className="auth-grid">
          <div className="auth-field">
            <label htmlFor="password">Contrasena</label>
            <input
              id="password"
              name="password_nueva_cliente"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimo 6 caracteres"
              autoComplete="new-password"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="confirmPassword">Confirmar contrasena</label>
            <input
              id="confirmPassword"
              name="confirmar_password_nueva_cliente"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repita su contrasena"
              autoComplete="new-password"
            />
          </div>
        </div>

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrarse"}
        </button>

        <div className="auth-footer">
          <span>Ya tienes cuenta?</span>
          <button type="button" onClick={() => navigate("/login")}>
            Iniciar sesion
          </button>
        </div>

        <div className="auth-secure">
          Conexion cifrada y segura
        </div>
      </form>
    </main>
  );
}