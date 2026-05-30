import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/panel.css";

/* ────────────────────────────────────────────── */
/* Datos de prueba */
/* ────────────────────────────────────────────── */

const DUMMY_USUARIOS = [
  {
    id: 1,
    username: "admin",
    tipo: "Administrador",
    cargo: "Administrador General",
    estado: true,
  },
  {
    id: 2,
    username: "juanperez",
    tipo: "Cliente",
    telefono: "77712345",
    direccion: "Av. América",
    estado: true,
  },
];

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
/* Input Style */
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

/* ────────────────────────────────────────────── */
/* Main */
/* ────────────────────────────────────────────── */

export default function EditUsuario() {
  const navigate = useNavigate();
  const { id } = useParams();

  const usuario =
    DUMMY_USUARIOS.find(
      (u) => u.id === Number(id)
    ) || DUMMY_USUARIOS[0];

  const [form, setForm] = useState({
    username: usuario.username || "",
    password: "",
    tipo: usuario.tipo || "Cliente",
    telefono: usuario.telefono || "",
    direccion: usuario.direccion || "",
    cargo: usuario.cargo || "",
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleActualizar = () => {
    console.log("Actualizar usuario", {
      id,
      ...form,
    });

    /*
      PUT /usuarios/:id

      {
        username,
        password,
        telefono,
        direccion,
        cargo
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
      {/* Header */}

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
            Editar Usuario
          </h1>

          <p className="panel-page-subtitle">
            Modifica los datos del usuario.
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
            onClick={handleActualizar}
          >
            <SaveIcon />
            Actualizar
          </button>
        </div>
      </div>

      {/* Card */}

      <div className="panel-card">
        <div className="panel-card-header">
          <span className="panel-card-title">
            Datos del Usuario
          </span>
        </div>

        <div className="panel-card-body">

          <Field
            label="Nombre de Usuario"
            value={form.username}
            onChange={(v) =>
              handleChange("username", v)
            }
          />

          <Field
            label="Nueva Contraseña"
            type="password"
            value={form.password}
            onChange={(v) =>
              handleChange("password", v)
            }
          />

          <div style={{ marginBottom: 20 }}>
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
              Tipo de Usuario
            </label>

            <div style={{ position: "relative" }}>
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
                  transform:
                    "translateY(-50%)",
                }}
              >
                <ChevronIcon />
              </span>
            </div>
          </div>

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