import { useState } from "react";
import { login } from "../services/authservice.js";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [correoError, setCorreoError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const validateCorreo = (value) => {
    const correoTrim = value.trim();

    if (!correoTrim) {
      return "El correo es obligatorio";
    }

    if (value.includes(" ")) {
      return "El correo no debe tener espacios";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoTrim)) {
      return "Ingrese un correo valido";
    }

    return "";
  };

  const validatePassword = (value) => {
    if (!value) {
      return "La contrasena es obligatoria";
    }

    if (value.length < 6) {
      return "La contrasena debe tener al menos 6 caracteres";
    }

    return "";
  };

  const handleCorreoChange = (e) => {
    const value = e.target.value;
    setCorreo(value);
    setCorreoError(validateCorreo(value));
    setError("");
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const newCorreoError = validateCorreo(correo);
    const newPasswordError = validatePassword(password);

    setCorreoError(newCorreoError);
    setPasswordError(newPasswordError);

    if (newCorreoError || newPasswordError) {
      setError("Corrige los campos marcados");
      return;
    }

    setLoading(true);

    try {
      const correoTrim = correo.trim();
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

  return (
    <>
      <style>{`
        .login-root {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(circle at 12% 28%, rgba(0, 156, 41, 0.14), transparent 28%),
            radial-gradient(circle at 88% 82%, rgba(0, 194, 51, 0.16), transparent 30%),
            linear-gradient(135deg, #f7fcf9 0%, #eefaf2 100%);
          font-family: "Segoe UI", Arial, sans-serif;
          padding: 30px 16px;
          overflow: hidden;
        }

        .login-root * {
          box-sizing: border-box;
        }

        .login-card {
          width: 100%;
          max-width: 440px;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid rgba(0, 156, 41, 0.14);
          border-radius: 30px;
          padding: 42px 42px 36px;
          box-shadow:
            0 24px 70px rgba(0, 100, 38, 0.14),
            0 2px 8px rgba(0, 0, 0, 0.04);
          position: relative;
          z-index: 2;
        }

        .login-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 30px;
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(238, 250, 242, 0.5));
          z-index: -1;
        }

        .login-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 30px;
        }

        .login-logo {
          width: 62px;
          height: 62px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #00b832 0%, #008f27 100%);
          color: #ffffff;
          box-shadow: 0 16px 34px rgba(0, 156, 41, 0.32);
          margin-bottom: 18px;
        }

        .login-logo svg {
          width: 31px;
          height: 31px;
          fill: #ffffff;
        }

        .login-title {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 40px;
          line-height: 1;
          color: #102319;
          font-weight: 900;
          letter-spacing: -0.8px;
        }

        .login-subtitle {
          margin: 14px 0 0;
          color: #6c8f76;
          font-size: 15px;
          font-weight: 500;
        }

        .login-alert {
          width: 100%;
          margin-bottom: 20px;
          padding: 12px 14px;
          border-radius: 16px;
          background: #fff0f0;
          border: 1px solid #ffc7c7;
          color: #c62828;
          font-size: 13px;
          font-weight: 700;
          text-align: center;
        }

        .login-form {
          width: 100%;
        }

        .field-group {
          width: 100%;
          margin-bottom: 18px;
        }

        .field-label {
          display: block;
          margin-bottom: 9px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #365940;
        }

        .field-wrap {
          width: 100%;
          height: 56px;
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1.5px solid #d4e8d9;
          border-radius: 16px;
          background: #f1f8f4;
          padding: 0 15px;
          transition: 0.2s ease;
        }

        .field-wrap:focus-within {
          border-color: #009c29;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(0, 156, 41, 0.12);
        }

        .field-wrap.field-error {
          border-color: #d93025;
          background: #fffafa;
          box-shadow: 0 0 0 4px rgba(217, 48, 37, 0.1);
        }

        .field-icon {
          width: 19px;
          height: 19px;
          color: #8aaa94;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .field-wrap:focus-within .field-icon {
          color: #009c29;
        }

        .field-input {
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: #102319;
          font-size: 15px;
          font-weight: 600;
          font-family: "Segoe UI", Arial, sans-serif;
        }

        .field-input::placeholder {
          color: #a0b9a8;
          font-weight: 500;
        }

        .field-button {
          width: 34px;
          height: 34px;
          border: none;
          outline: none;
          background: transparent;
          color: #789f84;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          border-radius: 10px;
          transition: 0.18s ease;
        }

        .field-button:hover {
          color: #009c29;
          background: rgba(0, 156, 41, 0.08);
        }

        .field-message {
          margin-top: 7px;
          color: #d93025;
          font-size: 13px;
          font-weight: 700;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 26px 0 20px;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, #cfe6d5, transparent);
        }

        .divider-text {
          color: #94b49e;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.6px;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .btn-login {
          width: 100%;
          height: 58px;
          border: none;
          border-radius: 17px;
          background: linear-gradient(135deg, #00a832 0%, #007f24 100%);
          color: #ffffff;
          font-size: 16px;
          font-weight: 800;
          font-family: "Segoe UI", Arial, sans-serif;
          cursor: pointer;
          box-shadow: 0 16px 34px rgba(0, 156, 41, 0.28);
          transition: 0.18s ease;
        }

        .btn-login:hover {
          transform: translateY(-1px);
          box-shadow: 0 20px 40px rgba(0, 156, 41, 0.34);
          background: linear-gradient(135deg, #00bd39 0%, #008f27 100%);
        }

        .btn-login:active {
          transform: translateY(0);
        }

        .btn-login:disabled {
          opacity: 0.68;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .btn-label {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
        }

        .spinner {
          width: 17px;
          height: 17px;
          border: 2px solid rgba(255, 255, 255, 0.42);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.75s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .login-links {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-top: 18px;
        }

        .login-link {
          border: none;
          outline: none;
          background: transparent;
          color: #009c29;
          font-size: 14px;
          font-weight: 800;
          font-family: "Segoe UI", Arial, sans-serif;
          cursor: pointer;
          text-decoration: none;
          padding: 0;
          transition: 0.18s ease;
        }

        .login-link:hover {
          color: #006b1d;
        }

        .login-separator {
          width: 1px;
          height: 16px;
          background: #cfe6d5;
        }

        .badge-secure {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 20px;
          color: #9db9a5;
          font-size: 12px;
          font-weight: 700;
        }

        .badge-secure svg {
          width: 14px;
          height: 14px;
          fill: #9db9a5;
        }

        @media (max-width: 520px) {
          .login-card {
            padding: 34px 24px 30px;
            border-radius: 24px;
          }

          .login-title {
            font-size: 34px;
          }

          .login-links {
            flex-direction: column;
            gap: 9px;
          }

          .login-separator {
            display: none;
          }
        }
      `}</style>

      <div className="login-root">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
              </svg>
            </div>

            <h1 className="login-title">Bienvenido</h1>
            <p className="login-subtitle">Ingresa tus credenciales para continuar</p>
          </div>

          {error && <div className="login-alert">{error}</div>}

          <form className="login-form" onSubmit={handleLogin}>
            <div className="field-group">
              <label className="field-label">Correo electronico</label>

              <div className={`field-wrap ${correoError ? "field-error" : ""}`}>
                <span className="field-icon">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>

                <input
                  type="email"
                  placeholder="tu@correo.com"
                  className="field-input"
                  value={correo}
                  onChange={handleCorreoChange}
                />
              </div>

              {correoError && <div className="field-message">{correoError}</div>}
            </div>

            <div className="field-group">
              <label className="field-label">Contrasena</label>

              <div className={`field-wrap ${passwordError ? "field-error" : ""}`}>
                <span className="field-icon">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contrasena"
                  className="field-input"
                  value={password}
                  onChange={handlePasswordChange}
                />

                <button
                  type="button"
                  className="field-button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.89 1 12c.8-2.27 2.24-4.2 4.06-5.55" />
                      <path d="M9.9 4.24A10.74 10.74 0 0 1 12 4c5 0 9.27 3.11 11 8a11.84 11.84 0 0 1-2.16 3.19" />
                      <path d="M14.12 14.12A3 3 0 0 1 9.88 9.88" />
                      <path d="M1 1l22 22" />
                    </svg>
                  ) : (
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              {passwordError && <div className="field-message">{passwordError}</div>}
            </div>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">Acceso seguro</span>
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

          <div className="login-links">
            <button type="button" className="login-link" onClick={() => navigate("/recover")}>
              Recuperala aqui
            </button>

            <span className="login-separator" />

            <button type="button" className="login-link" onClick={() => navigate("/register")}>
              Crear cuenta nueva
            </button>
          </div>

          <div className="badge-secure">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
            Conexion cifrada y segura
          </div>
        </div>
      </div>
    </>
  );
}