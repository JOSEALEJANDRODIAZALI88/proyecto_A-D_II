import { useState } from "react";
import { login } from "../services/authservice.js";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [error, setError] = useState("");




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
  } catch (error) {
    setError("Credenciales incorrectas");
  } finally {
    setLoading(false);
  }
};
{error && (
  <div className="login-error">
    {error}
  </div>
)}

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --green-base: #009c29;
          --green-dark: #007a20;
          --green-darker: #005c18;
          --green-light: #00c233;
          --green-pale: #e6f7eb;
          --green-mist: #f0faf3;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f4faf6;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Background organic blobs */
        .login-root::before {
          content: '';
          position: fixed;
          top: -120px;
          left: -120px;
          width: 520px;
          height: 520px;
          background: radial-gradient(circle, rgba(0,156,41,0.12) 0%, transparent 70%);
          border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%;
          animation: blobDrift 14s ease-in-out infinite alternate;
        }

        .login-root::after {
          content: '';
          position: fixed;
          bottom: -100px;
          right: -80px;
          width: 420px;
          height: 420px;
          background: radial-gradient(circle, rgba(0,194,51,0.10) 0%, transparent 70%);
          border-radius: 45% 55% 40% 60% / 60% 40% 55% 45%;
          animation: blobDrift 18s ease-in-out infinite alternate-reverse;
        }

        @keyframes blobDrift {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(20px, 30px) scale(1.04); }
          100% { transform: translate(-10px, 15px) scale(0.97); }
        }

        .login-card {
          position: relative;
          z-index: 1;
          background: #ffffff;
          border-radius: 28px;
          padding: 52px 48px 44px;
          width: 420px;
          box-shadow:
            0 4px 6px rgba(0,156,41,0.06),
            0 20px 60px rgba(0,156,41,0.10),
            0 1px 2px rgba(0,0,0,0.04);
          border: 1px solid rgba(0,156,41,0.12);
          animation: cardIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .login-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 32px;
        }

        .login-logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, var(--green-base), var(--green-light));
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(0,156,41,0.35);
        }

        .login-logo-icon svg {
          width: 22px;
          height: 22px;
          fill: white;
        }

        .login-heading {
          font-family: 'DM Serif Display', serif;
          font-size: 32px;
          color: #0d1f13;
          line-height: 1;
        }

        .login-subtitle {
          font-size: 14px;
          color: #6b8a73;
          text-align: center;
          margin-bottom: 36px;
          margin-top: 6px;
          font-weight: 400;
          letter-spacing: 0.01em;
        }

        .field-group {
          margin-bottom: 18px;
        }

        .field-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #3a5c42;
          margin-bottom: 8px;
        }

        .field-wrap {
          position: relative;
        }

        .field-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ab8a0;
          display: flex;
          align-items: center;
          pointer-events: none;
          transition: color 0.2s;
        }

        .field-input {
          width: 100%;
          padding: 13px 14px 13px 42px;
          border: 1.5px solid #d4e8d9;
          border-radius: 12px;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          color: #0d1f13;
          background: var(--green-mist);
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          outline: none;
        }

        .field-input::placeholder {
          color: #a8c4ae;
        }

        .field-input:focus {
          border-color: var(--green-base);
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(0,156,41,0.12);
        }

        .field-input:focus + .field-focus-bar,
        .field-wrap:focus-within .field-icon {
          color: var(--green-base);
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 28px 0;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, #d4e8d9, transparent);
        }

        .divider-text {
          font-size: 11px;
          color: #9ab8a0;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .btn-login {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, var(--green-base) 0%, var(--green-dark) 100%);
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          letter-spacing: 0.03em;
          position: relative;
          overflow: hidden;
          transition: transform 0.15s, box-shadow 0.2s, background 0.2s;
          box-shadow: 0 6px 22px rgba(0,156,41,0.35);
        }

        .btn-login::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--green-light) 0%, var(--green-base) 100%);
          opacity: 0;
          transition: opacity 0.2s;
        }

        .btn-login:hover::before { opacity: 1; }
        .btn-login:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 30px rgba(0,156,41,0.40);
        }

        .btn-login:active {
          transform: translateY(0);
          box-shadow: 0 4px 14px rgba(0,156,41,0.30);
        }

        .btn-login:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
        }

        .btn-label {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .login-footer {
          text-align: center;
          margin-top: 24px;
          font-size: 13px;
          color: #9ab8a0;
        }

        .login-footer a {
          color: var(--green-base);
          font-weight: 600;
          text-decoration: none;
          transition: color 0.15s;
        }

        .login-footer a:hover { color: var(--green-dark); }

        .badge-secure {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          margin-top: 20px;
          font-size: 11px;
          color: #b0cab7;
          letter-spacing: 0.04em;
        }

        .badge-secure svg {
          width: 12px;
          height: 12px;
          fill: #b0cab7;
        }
      `}</style>

      <div className="login-root">
        <div className="login-card">

          {/* Logo + heading */}
          <div className="login-logo">
            <div className="login-logo-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
              </svg>
            </div>
            <span className="login-heading">Bienvenido</span>
          </div>

          <p className="login-subtitle">Ingresa tus credenciales para continuar</p>

          <form onSubmit={handleLogin}>

            {/* Email field */}
            <div className="field-group">
              <label className="field-label">Correo electrónico</label>
              <div className="field-wrap">
                <span className="field-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder="tu@correo.com"
                  className="field-input"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="field-group">
              <label className="field-label">Contraseña</label>
              <div className="field-wrap">
                <span className="field-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="field-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">acceso seguro</span>
              <div className="divider-line" />
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              <span className="btn-label">
                {loading ? (
                  <>
                    <span className="spinner" />
                    Ingresando...
                  </>
                ) : (
                  "Entrar"
                )}
              </span>
            </button>

          </form>

          <p className="login-footer">
            ¿Olvidaste tu contraseña? <a href="#">Recupérala aquí</a>
          </p>

          <div className="badge-secure">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
            Conexión cifrada y segura
          </div>

        </div>
      </div>
    </>
  );
}