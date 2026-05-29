import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/panel.css";

/* ── Dummy data (replace with API fetch by id) ──────────────── */
const DUMMY_PELICULAS = [
  {
    id: 1,
    titulo: "Phantom Circuit",
    genero: "Ciencia Ficción",
    duracion: 118,
    clasificacion: "PG-13",
    sinopsis: "Un ingeniero descubre que la red eléctrica global está siendo controlada por una IA.",
    idioma: "Inglés",
    formato: "2D",
    fecha_estreno: "2025-06-01",
    estado: true,
  },
  {
    id: 2,
    titulo: "Iron Carnival",
    genero: "Acción",
    duracion: 132,
    clasificacion: "R",
    sinopsis: "Un ex soldado infiltra un carnaval clandestino donde los combates son a muerte.",
    idioma: "Inglés",
    formato: "IMAX",
    fecha_estreno: "2025-06-15",
    estado: true,
  },
];

/* ── Field config ───────────────────────────────────────────── */
const FIELDS = [
  { key: "titulo",        label: "Título",               type: "text",     placeholder: "Ej. Phantom Circuit",                                          col: "full" },
  { key: "sinopsis",      label: "Sinopsis",             type: "textarea", placeholder: "Describe brevemente la trama de la película...",                col: "full" },
  { key: "genero",        label: "Género",               type: "select",   options: ["Acción","Ciencia Ficción","Comedia","Drama","Fantasy","Romance","Terror","Thriller","Animación","Documental"], col: "half" },
  { key: "clasificacion", label: "Clasificación",        type: "select",   options: ["G","PG","PG-13","R","NC-17"],                                      col: "half" },
  { key: "idioma",        label: "Idioma",               type: "select",   options: ["Español","Inglés","Portugués","Francés","Japonés","Subtitulado"],   col: "half" },
  { key: "formato",       label: "Formato",              type: "select",   options: ["2D","3D","IMAX","4DX","Dolby Atmos"],                              col: "half" },
  { key: "duracion",      label: "Duración (minutos)",   type: "number",   placeholder: "Ej. 120",                                                       col: "half" },
  { key: "fecha_estreno", label: "Fecha de estreno",     type: "date",                                                                                   col: "half" },
];

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

function NotFoundIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
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

/* ── Generic field ──────────────────────────────────────────── */
function Field({ field, value, onChange }) {
  const [focused, setFocused] = useState(false);
  const style = { ...inputBase, ...(focused ? inputFocusStyle : {}) };

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
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ ...style, resize: "vertical", lineHeight: 1.6 }}
        />
      ) : field.type === "select" ? (
        <div style={{ position: "relative" }}>
          <select
            value={value}
            onChange={(e) => onChange(field.key, e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{ ...style, paddingRight: 36, cursor: "pointer" }}
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
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={style}
        />
      )}
    </div>
  );
}

/* ── Estado toggle field ────────────────────────────────────── */
function EstadoField({ value, onChange }) {
  const isActivo = value === true;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <label style={{
        fontSize: 11, fontWeight: 700,
        letterSpacing: "0.09em", textTransform: "uppercase",
        color: "var(--ink-soft)",
      }}>
        Estado
      </label>

      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        borderRadius: "10px",
        border: "1.5px solid var(--border)",
        overflow: "hidden",
        background: "var(--g-mist)",
      }}>
        {/* Activo */}
        <button
          type="button"
          onClick={() => onChange("estado", true)}
          style={{
            padding: "11px 0",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, fontWeight: 700,
            letterSpacing: "0.04em",
            border: "none",
            cursor: "pointer",
            borderRight: "1px solid var(--border)",
            transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            background: isActivo
              ? "var(--g-base)"
              : "transparent",
            color: isActivo ? "white" : "var(--ink-muted)",
            boxShadow: isActivo ? "inset 0 1px 4px rgba(0,0,0,0.12)" : "none",
          }}
        >
          <span style={{
            width: 7, height: 7, borderRadius: "50%",
            background: isActivo ? "rgba(255,255,255,0.7)" : "var(--ink-muted)",
            flexShrink: 0,
            boxShadow: isActivo ? "0 0 6px rgba(255,255,255,0.6)" : "none",
            transition: "all 0.2s",
          }} />
          Activo
        </button>

        {/* Inactivo */}
        <button
          type="button"
          onClick={() => onChange("estado", false)}
          style={{
            padding: "11px 0",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, fontWeight: 700,
            letterSpacing: "0.04em",
            border: "none",
            cursor: "pointer",
            transition: "background 0.2s, color 0.2s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            background: !isActivo
              ? "#c0392b"
              : "transparent",
            color: !isActivo ? "white" : "var(--ink-muted)",
            boxShadow: !isActivo ? "inset 0 1px 4px rgba(0,0,0,0.12)" : "none",
          }}
        >
          <span style={{
            width: 7, height: 7, borderRadius: "50%",
            background: !isActivo ? "rgba(255,255,255,0.7)" : "var(--ink-muted)",
            flexShrink: 0,
            transition: "all 0.2s",
          }} />
          Inactivo
        </button>
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────── */
export default function EditPelicula() {
  const { id }    = useParams();
  const navigate  = useNavigate();

  // TODO: replace with useEffect + API fetch by id
  const existing  = DUMMY_PELICULAS.find((p) => p.id === Number(id));

  const [form, setForm] = useState(
    existing
      ? {
          titulo:        existing.titulo,
          sinopsis:      existing.sinopsis,
          genero:        existing.genero,
          clasificacion: existing.clasificacion,
          idioma:        existing.idioma,
          formato:       existing.formato,
          duracion:      String(existing.duracion),
          fecha_estreno: existing.fecha_estreno,
          estado:        existing.estado,
        }
      : null
  );

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleGuardar = () => {
    const payload = {
      ...form,
      duracion: Number(form.duracion),
      estado: form.estado, // true → activo, false → inactivo
    };
    // TODO: PUT/PATCH to API — e.g. updatePelicula(id, payload)
    console.log("Payload →", payload);
  };

  /* ── Movie not found ── */
  if (!existing || !form) {
    return (
      <div style={{ animation: "slideIn 0.4s cubic-bezier(0.22,1,0.36,1) both" }}>
        <h1 className="panel-page-title">Editar Película</h1>
        <p className="panel-page-subtitle">No se encontró la película solicitada.</p>
        <div className="panel-card" style={{ marginTop: 8 }}>
          <div className="panel-placeholder">
            <div className="panel-placeholder-icon">
              <NotFoundIcon />
            </div>
            <p className="panel-placeholder-title">Película no encontrada</p>
            <p className="panel-placeholder-sub">
              El ID <strong>#{id}</strong> no corresponde a ninguna película registrada.
            </p>
            <button
              className="panel-btn panel-btn-outline"
              onClick={() => navigate("/control-panel/peliculas")}
              style={{ marginTop: 8 }}
            >
              <ArrowLeftIcon />
              Volver al panel
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* Split fields */
  const fullFields = FIELDS.filter((f) => f.col === "full");
  const halfFields = FIELDS.filter((f) => f.col === "half");
  const halfRows   = [];
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
          <h1 className="panel-page-title">Editar Película</h1>
          <p className="panel-page-subtitle">
            Modificando: <strong style={{ color: "var(--ink-soft)" }}>{existing.titulo}</strong>
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
          <button className="panel-btn panel-btn-ghost" onClick={() => navigate("/control-panel/peliculas")}>
            <ArrowLeftIcon />
            Volver al panel
          </button>
          <button className="panel-btn panel-btn-primary" onClick={handleGuardar}>
            <SaveIcon />
            Guardar cambios
          </button>
        </div>
      </div>

      {/* ── Form card ── */}
      <div className="panel-card">
        <div className="panel-card-header">
          <span className="panel-card-title">Datos de la película</span>
          {/* Live estado indicator in header */}
          <span style={{
            fontSize: 11, display: "flex", alignItems: "center", gap: 5,
            color: form.estado ? "var(--g-dark)" : "#c0392b",
            fontWeight: 600,
          }}>
            <span style={{
              display: "inline-block", width: 6, height: 6, borderRadius: "50%",
              background: form.estado ? "var(--g-base)" : "#c0392b",
              boxShadow: form.estado ? "0 0 5px var(--g-base)" : "0 0 5px #c0392b",
            }} />
            {form.estado ? "Activa" : "Inactiva"}
          </span>
        </div>

        <div className="panel-card-body" style={{ display: "flex", flexDirection: "column", gap: 22 }}>

          {/* Full-width fields */}
          {fullFields.map((field) => (
            <Field key={field.key} field={field} value={form[field.key]} onChange={handleChange} />
          ))}

          <div style={{ height: 1, background: "var(--border)", margin: "2px 0" }} />

          {/* Half-width field pairs */}
          {halfRows.map((row, i) => (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: row.length === 2 ? "1fr 1fr" : "1fr",
              gap: 20,
            }}>
              {row.map((field) => (
                <Field key={field.key} field={field} value={form[field.key]} onChange={handleChange} />
              ))}
            </div>
          ))}

          <div style={{ height: 1, background: "var(--border)", margin: "2px 0" }} />

          {/* Estado toggle — full width */}
          <EstadoField value={form.estado} onChange={handleChange} />

        </div>
      </div>


    </div>
  );
}