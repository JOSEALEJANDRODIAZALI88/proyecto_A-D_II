import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { register, registerWithGoogle } from "../services/authservice.js";

export default function Register() {
  const navigate = useNavigate();

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
  const googleReady =
    googleClientId &&
    googleClientId.includes(".apps.googleusercontent.com");

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [nombreError, setNombreError] = useState("");
  const [correoError, setCorreoError] = useState("");
  const [telefonoError, setTelefonoError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [error, setError] = useState("");
  const [okMessage, setOkMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const validateNombre = (value) => {
    const valueTrim = value.trim();

    if (!valueTrim) {
      return "El nombre es obligatorio";
    }

    if (valueTrim.length < 3) {
      return "El nombre debe tener al menos 3 caracteres";
    }

    if (!/^[a-zA-Z\s]+$/.test(valueTrim)) {
      return "El nombre solo debe contener letras";
    }

    return "";
  };

  const validateCorreo = (value) => {
    const valueTrim = value.trim();

    if (!valueTrim) {
      return "El correo es obligatorio";
    }

    if (value.includes(" ")) {
      return "El correo no debe tener espacios";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valueTrim)) {
      return "Ingrese un correo valido";
    }

    return "";
  };

  const validateTelefono = (value) => {
    const valueTrim = value.trim();

    if (!valueTrim) {
      return "El telefono es obligatorio";
    }

    if (!/^[0-9]+$/.test(valueTrim)) {
      return "El telefono solo debe contener numeros";
    }

    if (valueTrim.length < 7 || valueTrim.length > 12) {
      return "El telefono debe tener entre 7 y 12 numeros";
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

    if (!/[A-Za-z]/.test(value)) {
      return "La contrasena debe incluir una letra";
    }

    if (!/[0-9]/.test(value)) {
      return "La contrasena debe incluir un numero";
    }

    return "";
  };

  const validateConfirmPassword = (value) => {
    if (!value) {
      return "Debe confirmar la contrasena";
    }

    if (value !== password) {
      return "Las contrasenas no coinciden";
    }

    return "";
  };

  const saveSession = (data) => {
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    if (data.refresh) {
      localStorage.setItem("refresh", data.refresh);
    }

    if (data.rol) {
      localStorage.setItem("rol", data.rol);
    }

    if (data.role) {
      localStorage.setItem("rol", data.role);
    }

    if (data.usuario) {
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
    }

    if (data.user) {
      localStorage.setItem("usuario", JSON.stringify(data.user));
    }
  };

  const handleNombreChange = (e) => {
    const value = e.target.value;
    setNombre(value);
    setNombreError(validateNombre(value));
    setError("");
    setOkMessage("");
  };

  const handleCorreoChange = (e) => {
    const value = e.target.value;
    setCorreo(value);
    setCorreoError(validateCorreo(value));
    setError("");
    setOkMessage("");
  };

  const handleTelefonoChange = (e) => {
    const value = e.target.value;
    setTelefono(value);
    setTelefonoError(validateTelefono(value));
    setError("");
    setOkMessage("");
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));

    if (confirmPassword) {
      setConfirmPasswordError(
        value !== confirmPassword ? "Las contrasenas no coinciden" : ""
      );
    }

    setError("");
    setOkMessage("");
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setConfirmPasswordError(
      value !== password ? "Las contrasenas no coinciden" : ""
    );
    setError("");
    setOkMessage("");
  };

  const validateForm = () => {
    const newNombreError = validateNombre(nombre);
    const newCorreoError = validateCorreo(correo);
    const newTelefonoError = validateTelefono(telefono);
    const newPasswordError = validatePassword(password);
    const newConfirmPasswordError = validateConfirmPassword(confirmPassword);

    setNombreError(newNombreError);
    setCorreoError(newCorreoError);
    setTelefonoError(newTelefonoError);
    setPasswordError(newPasswordError);
    setConfirmPasswordError(newConfirmPasswordError);

    return (
      !newNombreError &&
      !newCorreoError &&
      !newTelefonoError &&
      !newPasswordError &&
      !newConfirmPasswordError
    );
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setOkMessage("");

    if (!validateForm()) {
      setError("Corrige los campos marcados");
      return;
    }

    setLoading(true);

    try {
      const data = await register({
        nombre: nombre.trim(),
        correo: correo.trim(),
        telefono: telefono.trim(),
        password,
        confirmPassword,
      });

      saveSession(data);
      setOkMessage("Cuenta creada correctamente");

      setTimeout(() => {
        navigate("/login");
      }, 900);
    } catch (errorResponse) {
      const status = errorResponse.response?.status;
      const data = errorResponse.response?.data;

      if (data?.errors) {
        const errors = data.errors;

        if (errors.nombre?.[0]) {
          setNombreError(errors.nombre[0]);
        }

        if (errors.correo?.[0]) {
          setCorreoError(errors.correo[0]);
        }

        if (errors.telefono?.[0]) {
          setTelefonoError(errors.telefono[0]);
        }

        if (errors.password?.[0]) {
          setPasswordError(errors.password[0]);
        }

        setError("Revisa los datos ingresados");
      } else if (status === 400) {
        setError("Revisa los datos ingresados");
      } else if (data?.error) {
        setError(data.error);
      } else if (data?.detail) {
        setError(data.detail);
      } else if (data?.message) {
        setError(data.message);
      } else {
        setError("No se pudo crear la cuenta");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setOkMessage("");

    if (!credentialResponse.credential) {
      setError("Google no devolvio una credencial valida");
      return;
    }

    setGoogleLoading(true);

    try {
      const data = await registerWithGoogle(credentialResponse.credential);
      saveSession(data);

      const rol = data.rol || data.role || "usuario";

      if (rol === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (errorResponse) {
      const status = errorResponse.response?.status;
      const data = errorResponse.response?.data;

      if (status === 404) {
        setError("Falta crear el endpoint /api/auth/google/ en Django");
      } else if (data?.error) {
        setError(data.error);
      } else if (data?.detail) {
        setError(data.detail);
      } else if (data?.message) {
        setError(data.message);
      } else {
        setError("No se pudo registrar con Google");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .register-root {
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
          padding: 34px 16px;
        }

        .register-root * {
          box-sizing: border-box;
        }

        .register-card {
          width: 100%;
          max-width: 500px;
          background: rgba(255, 255, 255, 0.97);
          border: 1px solid rgba(0, 156, 41, 0.14);
          border-radius: 30px;
          padding: 38px 42px 34px;
          box-shadow:
            0 24px 70px rgba(0, 100, 38, 0.14),
            0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .register-header {
          text-align: center;
          margin-bottom: 28px;
        }

        .register-title {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 40px;
          line-height: 1;
          color: #102319;
          font-weight: 900;
          letter-spacing: -0.8px;
        }

        .register-subtitle {
          margin: 14px 0 0;
          color: #6c8f76;
          font-size: 15px;
          font-weight: 500;
        }

        .register-alert {
          width: 100%;
          margin-bottom: 18px;
          padding: 12px 14px;
          border-radius: 16px;
          background: #fff0f0;
          border: 1px solid #ffc7c7;
          color: #c62828;
          font-size: 13px;
          font-weight: 700;
          text-align: center;
        }

        .register-ok {
          width: 100%;
          margin-bottom: 18px;
          padding: 12px 14px;
          border-radius: 16px;
          background: #effaf2;
          border: 1px solid #bfe8ca;
          color: #087b28;
          font-size: 13px;
          font-weight: 700;
          text-align: center;
        }

        .register-form {
          width: 100%;
        }

        .register-field {
          margin-bottom: 17px;
        }

        .register-label {
          display: block;
          margin-bottom: 8px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #365940;
        }

        .register-input {
          width: 100%;
          height: 56px;
          border: 1.5px solid #d4e8d9;
          border-radius: 16px;
          background: #f1f8f4;
          padding: 0 17px;
          color: #102319;
          font-size: 15px;
          font-weight: 600;
          font-family: "Segoe UI", Arial, sans-serif;
          outline: none;
          transition: 0.2s ease;
        }

        .register-input::placeholder {
          color: #9cb5a4;
          font-weight: 500;
        }

        .register-input:focus {
          border-color: #009c29;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(0, 156, 41, 0.12);
        }

        .register-input.input-error {
          border-color: #d93025;
          background: #fffafa;
          box-shadow: 0 0 0 4px rgba(217, 48, 37, 0.1);
        }

        .register-error-text {
          margin-top: 7px;
          color: #d93025;
          font-size: 13px;
          font-weight: 700;
        }

        .register-button {
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
          margin-top: 6px;
        }

        .register-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 20px 40px rgba(0, 156, 41, 0.34);
          background: linear-gradient(135deg, #00bd39 0%, #008f27 100%);
        }

        .register-button:disabled {
          opacity: 0.68;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .register-button-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
        }

        .register-spinner {
          width: 17px;
          height: 17px;
          border: 2px solid rgba(255, 255, 255, 0.42);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: registerSpin 0.75s linear infinite;
        }

        @keyframes registerSpin {
          to {
            transform: rotate(360deg);
          }
        }

        .register-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0 18px;
        }

        .register-divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, #cfe6d5, transparent);
        }

        .register-divider-text {
          color: #94b49e;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .google-box {
          display: flex;
          justify-content: center;
          width: 100%;
          min-height: 44px;
        }

        .google-loading {
          width: 100%;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #6c8f76;
          font-size: 13px;
          font-weight: 700;
          border: 1px dashed #cfe6d5;
          border-radius: 14px;
          padding: 10px 14px;
          background: #f7fcf9;
        }

        .register-login {
          margin-top: 22px;
          text-align: center;
          color: #6c8f76;
          font-size: 14px;
          font-weight: 600;
        }

        .register-login button {
          border: none;
          background: transparent;
          color: #009c29;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          margin-left: 4px;
        }

        .register-login button:hover {
          color: #006b1d;
        }

        @media (max-width: 560px) {
          .register-card {
            padding: 32px 24px 30px;
            border-radius: 24px;
          }

          .register-title {
            font-size: 34px;
          }
        }
      `}</style>

      <div className="register-root">
        <div className="register-card">
          <div className="register-header">
            <h1 className="register-title">Crear cuenta</h1>
            <p className="register-subtitle">
              Registra tus datos para comprar tickets
            </p>
          </div>

          {error && <div className="register-alert">{error}</div>}
          {okMessage && <div className="register-ok">{okMessage}</div>}

          <form className="register-form" onSubmit={handleRegister} autoComplete="off">
            <div className="register-field">
              <label className="register-label">Nombre completo</label>
              <input
                type="text"
                name="registro_nombre"
                autoComplete="off"
                placeholder="Ej. Juan Perez"
                className={`register-input ${nombreError ? "input-error" : ""}`}
                value={nombre}
                onChange={handleNombreChange}
              />
              {nombreError && <div className="register-error-text">{nombreError}</div>}
            </div>

            <div className="register-field">
              <label className="register-label">Correo electronico</label>
              <input
                type="email"
                name="registro_correo"
                autoComplete="off"
                placeholder="correo@gmail.com"
                className={`register-input ${correoError ? "input-error" : ""}`}
                value={correo}
                onChange={handleCorreoChange}
              />
              {correoError && <div className="register-error-text">{correoError}</div>}
            </div>

            <div className="register-field">
              <label className="register-label">Telefono</label>
              <input
                type="tel"
                name="registro_telefono"
                autoComplete="off"
                placeholder="Ej. 77777777"
                className={`register-input ${telefonoError ? "input-error" : ""}`}
                value={telefono}
                onChange={handleTelefonoChange}
              />
              {telefonoError && <div className="register-error-text">{telefonoError}</div>}
            </div>

            <div className="register-field">
              <label className="register-label">Contrasena</label>
              <input
                type="password"
                name="registro_password"
                autoComplete="new-password"
                placeholder="Ingrese su contrasena"
                className={`register-input ${passwordError ? "input-error" : ""}`}
                value={password}
                onChange={handlePasswordChange}
              />
              {passwordError && <div className="register-error-text">{passwordError}</div>}
            </div>

            <div className="register-field">
              <label className="register-label">Confirmar contrasena</label>
              <input
                type="password"
                name="registro_confirm_password"
                autoComplete="new-password"
                placeholder="Repita su contrasena"
                className={`register-input ${confirmPasswordError ? "input-error" : ""}`}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              {confirmPasswordError && (
                <div className="register-error-text">{confirmPasswordError}</div>
              )}
            </div>

            <button type="submit" className="register-button" disabled={loading}>
              <span className="register-button-content">
                {loading ? (
                  <>
                    <span className="register-spinner" />
                    Registrando...
                  </>
                ) : (
                  "Registrarse"
                )}
              </span>
            </button>
          </form>

          {googleReady && (
            <>
              <div className="register-divider">
                <div className="register-divider-line" />
                <span className="register-divider-text">O registrate con</span>
                <div className="register-divider-line" />
              </div>

              <div className="google-box">
                {googleLoading ? (
                  <div className="google-loading">Conectando con Google...</div>
                ) : (
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError("No se pudo conectar con Google")}
                    text="signup_with"
                    shape="pill"
                    size="large"
                    width="320"
                  />
                )}
              </div>
            </>
          )}

          <div className="register-login">
            Ya tienes cuenta?
            <button type="button" onClick={() => navigate("/login")}>
              Iniciar sesion
            </button>
          </div>
        </div>
      </div>
    </>
  );
}