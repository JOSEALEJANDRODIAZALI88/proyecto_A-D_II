import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPasswordWithCode, sendRecoveryCode } from "../services/authservice.js";

export default function Recover() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [correoError, setCorreoError] = useState("");
  const [codigoError, setCodigoError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [error, setError] = useState("");
  const [okMessage, setOkMessage] = useState("");

  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [updating, setUpdating] = useState(false);

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

  const validateCodigo = (value) => {
    const valueTrim = value.trim();

    if (!valueTrim) {
      return "El codigo es obligatorio";
    }

    if (!/^[0-9]{6}$/.test(valueTrim)) {
      return "El codigo debe tener 6 numeros";
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

  const handleCorreoChange = (e) => {
    const value = e.target.value;
    setCorreo(value);
    setCorreoError(validateCorreo(value));
    setError("");
    setOkMessage("");
  };

  const handleCodigoChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCodigo(value);
    setCodigoError(validateCodigo(value));
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

  const getErrorMessage = (errorResponse, defaultMessage) => {
    const data = errorResponse.response?.data;

    if (data?.message) {
      return data.message;
    }

    if (data?.detail) {
      return data.detail;
    }

    if (data?.error) {
      return data.error;
    }

    return defaultMessage;
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setOkMessage("");

    const newCorreoError = validateCorreo(correo);
    setCorreoError(newCorreoError);

    if (newCorreoError) {
      setError("Corrige los campos marcados");
      return;
    }

    setSendingCode(true);

    try {
      await sendRecoveryCode(correo.trim());
      setCodeSent(true);
      setOkMessage("Se envio un codigo de recuperacion a tu correo");
    } catch (errorResponse) {
      setError(getErrorMessage(errorResponse, "No se pudo enviar el codigo"));
    } finally {
      setSendingCode(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setOkMessage("");

    const newCorreoError = validateCorreo(correo);
    const newCodigoError = validateCodigo(codigo);
    const newPasswordError = validatePassword(password);
    const newConfirmPasswordError = validateConfirmPassword(confirmPassword);

    setCorreoError(newCorreoError);
    setCodigoError(newCodigoError);
    setPasswordError(newPasswordError);
    setConfirmPasswordError(newConfirmPasswordError);

    if (
      newCorreoError ||
      newCodigoError ||
      newPasswordError ||
      newConfirmPasswordError
    ) {
      setError("Corrige los campos marcados");
      return;
    }

    setUpdating(true);

    try {
      await resetPasswordWithCode(correo.trim(), codigo.trim(), password);
      setOkMessage("Contrasena actualizada correctamente");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (errorResponse) {
      setError(getErrorMessage(errorResponse, "No se pudo actualizar la contrasena"));
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <style>{`
        .recover-root {
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

        .recover-root * {
          box-sizing: border-box;
        }

        .recover-card {
          width: 100%;
          max-width: 500px;
          background: rgba(255, 255, 255, 0.97);
          border: 1px solid rgba(0, 156, 41, 0.14);
          border-radius: 30px;
          padding: 42px 42px 36px;
          box-shadow:
            0 24px 70px rgba(0, 100, 38, 0.14),
            0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .recover-header {
          text-align: center;
          margin-bottom: 28px;
        }

        .recover-icon {
          width: 58px;
          height: 58px;
          margin: 0 auto 18px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #00b832 0%, #008f27 100%);
          color: #ffffff;
          box-shadow: 0 16px 34px rgba(0, 156, 41, 0.32);
          font-size: 32px;
          font-weight: 900;
        }

        .recover-title {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 40px;
          line-height: 1;
          color: #102319;
          font-weight: 900;
          letter-spacing: -0.8px;
        }

        .recover-subtitle {
          margin: 14px 0 0;
          color: #6c8f76;
          font-size: 15px;
          font-weight: 500;
        }

        .recover-alert {
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

        .recover-ok {
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

        .recover-form {
          width: 100%;
        }

        .recover-field {
          margin-bottom: 17px;
        }

        .recover-label {
          display: block;
          margin-bottom: 8px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #365940;
        }

        .recover-input {
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

        .recover-input::placeholder {
          color: #9cb5a4;
          font-weight: 500;
        }

        .recover-input:focus {
          border-color: #009c29;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(0, 156, 41, 0.12);
        }

        .recover-input.input-error {
          border-color: #d93025;
          background: #fffafa;
          box-shadow: 0 0 0 4px rgba(217, 48, 37, 0.1);
        }

        .recover-error-text {
          margin-top: 7px;
          color: #d93025;
          font-size: 13px;
          font-weight: 700;
        }

        .recover-button {
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

        .recover-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 20px 40px rgba(0, 156, 41, 0.34);
          background: linear-gradient(135deg, #00bd39 0%, #008f27 100%);
        }

        .recover-button:disabled {
          opacity: 0.68;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .recover-secondary-button {
          width: 100%;
          height: 50px;
          border: 1.5px solid #cfe6d5;
          border-radius: 15px;
          background: #ffffff;
          color: #008f27;
          font-size: 14px;
          font-weight: 800;
          font-family: "Segoe UI", Arial, sans-serif;
          cursor: pointer;
          margin-top: 12px;
          transition: 0.18s ease;
        }

        .recover-secondary-button:hover {
          background: #f1f8f4;
        }

        .recover-link {
          margin-top: 22px;
          text-align: center;
        }

        .recover-link button {
          border: none;
          background: transparent;
          color: #009c29;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
        }

        .recover-link button:hover {
          color: #006b1d;
        }

        @media (max-width: 560px) {
          .recover-card {
            padding: 32px 24px 30px;
            border-radius: 24px;
          }

          .recover-title {
            font-size: 34px;
          }
        }
      `}</style>

      <div className="recover-root">
        <div className="recover-card">
          <div className="recover-header">
            <div className="recover-icon">!</div>
            <h1 className="recover-title">Recuperar acceso</h1>
            <p className="recover-subtitle">
              Ingresa tu correo y recibe un codigo de recuperacion
            </p>
          </div>

          {error && <div className="recover-alert">{error}</div>}
          {okMessage && <div className="recover-ok">{okMessage}</div>}

          {!codeSent ? (
            <form className="recover-form" onSubmit={handleSendCode} autoComplete="off">
              <div className="recover-field">
                <label className="recover-label">Correo electronico</label>
                <input
                  type="email"
                  name="recover_correo"
                  autoComplete="off"
                  placeholder="correo@gmail.com"
                  className={`recover-input ${correoError ? "input-error" : ""}`}
                  value={correo}
                  onChange={handleCorreoChange}
                />
                {correoError && <div className="recover-error-text">{correoError}</div>}
              </div>

              <button type="submit" className="recover-button" disabled={sendingCode}>
                {sendingCode ? "Enviando codigo..." : "Enviar codigo"}
              </button>
            </form>
          ) : (
            <form className="recover-form" onSubmit={handleResetPassword} autoComplete="off">
              <div className="recover-field">
                <label className="recover-label">Correo electronico</label>
                <input
                  type="email"
                  name="recover_correo"
                  autoComplete="off"
                  placeholder="correo@gmail.com"
                  className={`recover-input ${correoError ? "input-error" : ""}`}
                  value={correo}
                  onChange={handleCorreoChange}
                />
                {correoError && <div className="recover-error-text">{correoError}</div>}
              </div>

              <div className="recover-field">
                <label className="recover-label">Codigo recibido</label>
                <input
                  type="text"
                  name="recover_codigo"
                  autoComplete="off"
                  placeholder="Ej. 123456"
                  className={`recover-input ${codigoError ? "input-error" : ""}`}
                  value={codigo}
                  onChange={handleCodigoChange}
                />
                {codigoError && <div className="recover-error-text">{codigoError}</div>}
              </div>

              <div className="recover-field">
                <label className="recover-label">Nueva contrasena</label>
                <input
                  type="password"
                  name="recover_password"
                  autoComplete="new-password"
                  placeholder="Ingrese su nueva contrasena"
                  className={`recover-input ${passwordError ? "input-error" : ""}`}
                  value={password}
                  onChange={handlePasswordChange}
                />
                {passwordError && <div className="recover-error-text">{passwordError}</div>}
              </div>

              <div className="recover-field">
                <label className="recover-label">Confirmar contrasena</label>
                <input
                  type="password"
                  name="recover_confirm_password"
                  autoComplete="new-password"
                  placeholder="Repita su nueva contrasena"
                  className={`recover-input ${confirmPasswordError ? "input-error" : ""}`}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                />
                {confirmPasswordError && (
                  <div className="recover-error-text">{confirmPasswordError}</div>
                )}
              </div>

              <button type="submit" className="recover-button" disabled={updating}>
                {updating ? "Actualizando..." : "Actualizar contrasena"}
              </button>

              <button
                type="button"
                className="recover-secondary-button"
                disabled={sendingCode}
                onClick={handleSendCode}
              >
                Reenviar codigo
              </button>
            </form>
          )}

          <div className="recover-link">
            <button type="button" onClick={() => navigate("/login")}>
              Volver al login
            </button>
          </div>
        </div>
      </div>
    </>
  );
}