import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/panel.css";

/* ── Field config — drives the form ────────────────────────── */
const FIELDS = [
  {
    key: "titulo",
    label: "Título",
    type: "text",
    placeholder: "Ej. Phantom Circuit",
    col: "full",
  },
  {
    key: "sinopsis",
    label: "Sinopsis",
    type: "textarea",
    placeholder: "Describe brevemente la trama de la película...",
    col: "full",
  },
  {
    key: "genero",
    label: "Género",
    type: "select",
    options: ["Acción", "Ciencia Ficción", "Comedia", "Drama", "Fantasy", "Romance", "Terror", "Thriller", "Animación", "Documental"],
    col: "half",
  },
  {
    key: "clasificacion",
    label: "Clasificación",
    type: "select",
    options: ["G", "PG", "PG-13", "R", "NC-17"],
    col: "half",
  },
  {
    key: "idioma",
    label: "Idioma",
    type: "select",
    options: ["Español", "Inglés", "Portugués", "Francés", "Japonés", "Subtitulado"],
    col: "half",
  },
  {
    key: "formato",
    label: "Formato",
    type: "select",
    options: ["2D", "3D", "IMAX", "4DX", "Dolby Atmos"],
    col: "half",
  },
  {
    key: "duracion",
    label: "Duración (minutos)",
    type: "number",
    placeholder: "Ej. 120",
    col: "half",
  },
  {
    key: "fecha_estreno",
    label: "Fecha de estreno",
    type: "date",
    col: "half",
  },
];

const EMPTY_FORM = {
  titulo: "",
  sinopsis: "",
  genero: "",
  clasificacion: "",
  idioma: "",
  formato: "",
  duracion: "",
  fecha_estreno: "",
};

/* ── Icons ──────────────────────────────────────────────────── */
function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ width: 14, height: 14, pointerEvents: "none" }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/* ── Shared input styles ────────────────────────────────────── */
const inputBase = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "10px",
  border: "1.5px solid var(--border)",
  background: "var(--g-mist)",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "14px",
  color: "var(--ink)",
  outline: "none",
  transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
  appearance: "none",
  WebkitAppearance: "none",
};

const inputFocusStyle = {
  borderColor: "var(--g-base)",
  background: "#fff",
  boxShadow: "0 0 0 3px rgba(0,156,41,0.11)",
};

/* ── Single form field ──────────────────────────────────────── */
function Field({ field, value, onChange }) {
  const [focused, setFocused] = useState(false);

  const style = {
    ...inputBase,
    ...(focused ? inputFocusStyle : {}),
  };

  const handleFocus = () => setFocused(true);
  const handleBlur  = () => setFocused(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <label style={{
        fontSize: 11, fontWeight: 700,
        letterSpacing: "0.09em", textTransform: "uppercase",
        color: focused ? "var(--g-dark)" : "var(--ink-soft)",
        transition: "color 0.2s",
      }}>
        {field.label}
      </label>

      {field.type === "textarea" ? (
        <textarea
          placeholder={field.placeholder}
          value={value}
          rows={4}
          onChange={(e) => onChange(field.key, e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={{ ...style, resize: "vertical", lineHeight: 1.6 }}
        />
      ) : field.type === "select" ? (
        <div style={{ position: "relative" }}>
          <select
            value={value}
            onChange={(e) => onChange(field.key, e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={{
              ...style,
              paddingRight: 36,
              cursor: "pointer",
              color: value ? "var(--ink)" : "var(--ink-muted)",
            }}
          >
            <option value="" disabled>Selecciona...</option>
            {field.options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <span style={{
            position: "absolute", right: 12, top: "50%",
            transform: "translateY(-50%)",
            color: "var(--ink-muted)",
            display: "flex", alignItems: "center",
          }}>
            <ChevronIcon />
          </span>
        </div>
      ) : (
        <input
          type={field.type}
          placeholder={field.placeholder}
          value={value}
          min={field.type === "number" ? 1 : undefined}
          onChange={(e) => onChange(field.key, e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={style}
        />
      )}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────── */
export default function AddPelicula() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleGuardar = () => {
    // TODO: POST to API with { ...form, estado: true }
    console.log("Payload →", { ...form, estado: true });
  };

  /* Split fields into rows by col hint */
  const fullFields = FIELDS.filter((f) => f.col === "full");
  const halfFields = FIELDS.filter((f) => f.col === "half");

  // Pair half-width fields into rows of 2
  const halfRows = [];
  for (let i = 0; i < halfFields.length; i += 2) {
    halfRows.push(halfFields.slice(i, i + 2));
  }

  return (
    <div style={{ animation: "slideIn 0.4s cubic-bezier(0.22,1,0.36,1) both" }}>

      {/* ── Header ── */}
      <div style={{
        display: "flex", alignItems: "flex-start",
        justifyContent: "space-between", flexWrap: "wrap",
        gap: 16, marginBottom: 32,
      }}>
        <div>
          <h1 className="panel-page-title">Añadir Película</h1>
          <p className="panel-page-subtitle">Completa los campos para registrar una nueva película.</p>
        </div>

        <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
          <button
            className="panel-btn panel-btn-ghost"
            onClick={() => navigate("/control-panel/peliculas")}
          >
            <ArrowLeftIcon />
            Volver al panel
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

      {/* ── Form card ── */}
      <div className="panel-card">
        <div className="panel-card-header">
          <span className="panel-card-title">Datos de la película</span>
          <span style={{
            fontSize: 11, color: "var(--ink-muted)",
            display: "flex", alignItems: "center", gap: 5,
          }}>
            <span style={{
              display: "inline-block", width: 6, height: 6,
              borderRadius: "50%", background: "var(--g-base)",
            }} />
            Estado: Activa por defecto
          </span>
        </div>

        <div className="panel-card-body" style={{ display: "flex", flexDirection: "column", gap: 22 }}>

          {/* Full-width fields */}
          {fullFields.map((field) => (
            <Field
              key={field.key}
              field={field}
              value={form[field.key]}
              onChange={handleChange}
            />
          ))}

          {/* Divider */}
          <div style={{ height: 1, background: "var(--border)", margin: "2px 0" }} />

          {/* Half-width fields in pairs */}
          {halfRows.map((row, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: row.length === 2 ? "1fr 1fr" : "1fr",
                gap: 20,
              }}
            >
              {row.map((field) => (
                <Field
                  key={field.key}
                  field={field}
                  value={form[field.key]}
                  onChange={handleChange}
                />
              ))}
            </div>
          ))}

        </div>
      </div>    

    </div>
  );
}