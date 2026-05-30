import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authservice.js";
import "../styles/login.css";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const correoTrim = correo.trim();

    if (!correoTrim) {
      setError("El correo es obligatorio");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoTrim)) {
      setError("Ingrese un correo valido");
      return;
    }

    if (!password) {
      setError("La contrasena es obligatoria");
      return;
    }

    if (password.length < 6) {
      setError("La contrasena debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const data = await login(correoTrim, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("rol", data.rol);

      if (data.rol === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch {
      setError("Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-root">
      <section className="login-card">
        <div className="login-header">
          <div className="login-logo-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z" />
            </svg>
          </div>

          <div className="login-title-box">
            <span className="login-brand">Cine Verde</span>
            <h1>Bienvenido</h1>
          </div>
        </div>

        <p className="login-subtitle">
          Ingresa tus credenciales para continuar
        </p>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleLogin}>
          <div className="field-group">
            <label className="field-label">Correo electronico</label>

            <div className="field-wrap">
              <span className="field-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <path d="m22 6-10 7L2 6" />
                </svg>
              </span>

              <input
                type="email"
                className="field-input"
                placeholder="admincine@gmail.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Contrasena</label>

            <div className="field-wrap">
              <span className="field-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>

              <input
                type="password"
                className="field-input"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="divider">
            <span></span>
            <p>acceso seguro</p>
            <span></span>
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? (
              <span className="btn-content">
                <span className="spinner"></span>
                Ingresando...
              </span>
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        <div className="login-actions">
          <button
            type="button"
            className="login-link"
            onClick={() => navigate("/recover")}
          >
            Recuperala aqui
          </button>

          <span className="login-dot"></span>

          <button
            type="button"
            className="login-link"
            onClick={() => navigate("/register")}
          >
            Crear cuenta nueva
          </button>
        </div>

        <div className="login-secure">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
          </svg>
          <span>Conexion cifrada y segura</span>
        </div>
      </section>
    </main>
  );
}