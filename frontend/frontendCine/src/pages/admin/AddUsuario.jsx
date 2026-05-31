import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/panel.css";

/* ────────────────────────────────────────────── */
/* Icons */
/* ────────────────────────────────────────────── */

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      style={{ width: 14, height: 14 }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/* ────────────────────────────────────────────── */
/* Form */
/* ────────────────────────────────────────────── */

const EMPTY_FORM = {
  username: "",
  password: "",
  confirmPassword: "",
  tipo: "Cliente",
  telefono: "",
  direccion: "",
  cargo: "",
};

export default function AddUsuario() {
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleGuardar = () => {
    if (form.password !== form.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    console.log("Usuario a guardar:", form);

    /*
      POST API

      Administrador:
      {
        username,
        password,
        tipo:"Administrador",
        cargo
      }

      Cliente:
      {
        username,
        password,
        tipo:"Cliente",
        telefono,
        direccion
      }
    */
  };

  return (
    <div
      style={{
        animation:
          "slideIn 0.4s cubic-bezier(0.22,1,0.36,1) both",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 30,
        }}
      >
        <div>
          <h1 className="panel-page-title">
            Añadir Usuario
          </h1>

          <p className="panel-page-subtitle">
            Registra un nuevo usuario del sistema.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          <button
            className="panel-btn panel-btn-ghost"
            onClick={() =>
              navigate("/control-panel/usuarios")
            }
          >
            <ArrowLeftIcon />
            Volver
          </button>

          <button
            className="panel-btn panel-btn-primary"
            onClick={handleGuardar}
          >
            <SaveIcon />
            Guardar
          </button>
        </div>
      </div>

      {/* CARD */}

      <div className="panel-card">
        <div className="panel-card-header">
          <span className="panel-card-title">
            Datos del Usuario
          </span>
        </div>

        <div className="panel-card-body">

          {/* Usuario */}

          <Field
            label="Nombre de Usuario"
            value={form.username}
            onChange={(v) =>
              handleChange("username", v)
            }
          />

          {/* Password */}

          <Field
            label="Contraseña"
            type="password"
            value={form.password}
            onChange={(v) =>
              handleChange("password", v)
            }
          />

          {/* Confirmar */}

          <Field
            label="Confirmar Contraseña"
            type="password"
            value={form.confirmPassword}
            onChange={(v) =>
              handleChange("confirmPassword", v)
            }
          />

          {/* Tipo */}

          <div
            style={{
              marginTop: 20,
            }}
          >
            <label className="form-label">
              Tipo de Usuario
            </label>

            <div
              style={{
                position: "relative",
              }}
            >
              <select
                value={form.tipo}
                onChange={(e) =>
                  handleChange(
                    "tipo",
                    e.target.value
                  )
                }
                style={{
                    ...inputStyle,
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    paddingRight: "40px",
                    cursor: "pointer",
                }}
              >
                <option value="Cliente">
                  Cliente
                </option>

                <option value="Administrador">
                  Administrador
                </option>
              </select>

              <span
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <ChevronIcon />
              </span>
            </div>
          </div>

          {/* CLIENTE */}

          {form.tipo === "Cliente" && (
            <>
              <Field
                label="Teléfono"
                value={form.telefono}
                onChange={(v) =>
                  handleChange("telefono", v)
                }
              />

              <Field
                label="Dirección"
                value={form.direccion}
                onChange={(v) =>
                  handleChange("direccion", v)
                }
              />
            </>
          )}

          {/* ADMIN */}

          {form.tipo === "Administrador" && (
            <Field
              label="Cargo"
              value={form.cargo}
              onChange={(v) =>
                handleChange("cargo", v)
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────── */
/* Field */
/* ────────────────────────────────────────────── */

function Field({
  label,
  value,
  onChange,
  type = "text",
}) {
  return (
    <div
      style={{
        marginBottom: 20,
      }}
    >
      <label
        style={{
          display: "block",
          marginBottom: 8,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: ".08em",
          textTransform: "uppercase",
          color: "var(--ink-soft)",
        }}
      >
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        style={inputStyle}
      />
    </div>
  );
}

/* ────────────────────────────────────────────── */
/* Shared Input */
/* ────────────────────────────────────────────── */

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid var(--border)",
  background: "var(--g-mist)",
  fontSize: "14px",
  outline: "none",
};