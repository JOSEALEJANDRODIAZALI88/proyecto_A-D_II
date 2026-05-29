import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/panel.css";

/* ── Dummy data ─────────────────────────────────────────────── */
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
  {
    // estado: false — should NOT appear in the list
    id: 3,
    titulo: "The Last Bloom",
    genero: "Romance",
    duracion: 97,
    clasificacion: "PG",
    sinopsis: "Oculta para demostrar que el filtro funciona.",
    idioma: "Español",
    formato: "2D",
    fecha_estreno: "2025-05-10",
    estado: false,
  },
];

/* ── Icons ──────────────────────────────────────────────────── */
function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

/* ── Delete confirmation modal ──────────────────────────────── */
function DeleteModal({ pelicula, onConfirm, onCancel }) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onCancel}
        style={{
          position: "fixed", inset: 0, zIndex: 400,
          background: "rgba(0,0,0,0.40)",
          backdropFilter: "blur(3px)",
          animation: "fadeIn 0.18s ease both",
        }}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: "fixed", inset: 0, zIndex: 401,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "16px",
        }}
      >
        <div style={{
          background: "var(--surface)",
          borderRadius: "20px",
          padding: "36px 32px 28px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          border: "1px solid var(--border)",
          animation: "modalIn 0.22s cubic-bezier(0.22,1,0.36,1) both",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0",
          textAlign: "center",
        }}>
          <style>{`
            @keyframes modalIn {
              from { opacity:0; transform: scale(0.93) translateY(12px); }
              to   { opacity:1; transform: scale(1)    translateY(0); }
            }
          `}</style>

          {/* Warning icon */}
          <div style={{
            width: 54, height: 54, borderRadius: "16px",
            background: "#fff4f3",
            border: "1px solid rgba(192,57,43,0.18)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#c0392b", marginBottom: "18px",
          }}>
            <AlertIcon />
          </div>

          <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: "0.04em", color: "var(--ink)", marginBottom: 8 }}>
            Eliminar película
          </p>

          <p style={{ fontSize: 14, color: "var(--ink-muted)", lineHeight: 1.6, marginBottom: 6 }}>
            ¿Estás seguro de que deseas eliminar
          </p>
          <p style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 20 }}>
            "{pelicula.titulo}"
          </p>
          <p style={{ fontSize: 13, color: "var(--ink-muted)", marginBottom: 28, lineHeight: 1.5 }}>
            Esta acción no se puede deshacer. La película dejará de aparecer en la cartelera.
          </p>

          <div style={{ display: "flex", gap: 10, width: "100%" }}>
            <button
              onClick={onCancel}
              style={{
                flex: 1, padding: "11px 0",
                borderRadius: "10px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14, fontWeight: 600,
                cursor: "pointer",
                background: "transparent",
                color: "var(--ink-soft)",
                border: "1.5px solid var(--border)",
                transition: "all 0.16s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              Cancelar
            </button>
            <button
              onClick={() => onConfirm(pelicula.id)}
              style={{
                flex: 1, padding: "11px 0",
                borderRadius: "10px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14, fontWeight: 600,
                cursor: "pointer",
                background: "#c0392b",
                color: "white",
                border: "none",
                boxShadow: "0 4px 14px rgba(192,57,43,0.30)",
                transition: "all 0.16s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#a93226"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#c0392b"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Sí, eliminar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Genre color dot ────────────────────────────────────────── */
const GENRE_COLORS = {
  "Ciencia Ficción": "#006699",
  "Acción":          "#7a0000",
  "Drama":           "#5a0080",
  "Romance":         "#7a0033",
  "Thriller":        "#003366",
  "Fantasy":         "#004d26",
  "Comedia":         "#7a5c00",
};

/* ── Main component ─────────────────────────────────────────── */
export default function PeliculasList() {
  const navigate = useNavigate();
  const [peliculas, setPeliculas] = useState(DUMMY_PELICULAS);
  const [toDelete, setToDelete]   = useState(null); // pelicula object pending deletion

  // Only show active ones
  const active = peliculas.filter((p) => p.estado);

  const handleConfirmDelete = (id) => {
    setPeliculas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, estado: false } : p))
    );
    setToDelete(null);
  };

  return (
    <>
      {/* ── Page heading ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
        <div>
          <h1 className="panel-page-title">Lista de Películas</h1>
          <p className="panel-page-subtitle">
            {active.length} película{active.length !== 1 ? "s" : ""} activa{active.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
          <button
            className="panel-btn panel-btn-outline"
            onClick={() => { /* TODO: fetch from API */ }}
            title="Refrescar lista"
          >
            <RefreshIcon />
            Refrescar
          </button>

          <button
            className="panel-btn panel-btn-primary"
            onClick={() => navigate("/control-panel/peliculas/nueva")}
          >
            <PlusIcon />
            Añadir película
          </button>
        </div>
      </div>

      {/* ── List ── */}
      {active.length === 0 ? (
        <div className="panel-card">
          <div className="panel-placeholder">
            <div className="panel-placeholder-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.6l13.5-4.6c1-.3 2.1.3 2.4 1.3L20.2 6Z"/>
                <path d="m6.2 5.3 3.1 3.9"/><path d="m12.4 3.4 3.1 3.9"/>
                <path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8Z"/>
              </svg>
            </div>
            <p className="panel-placeholder-title">Sin películas activas</p>
            <p className="panel-placeholder-sub">Añade una nueva película para que aparezca aquí.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {active.map((pelicula, idx) => (
            <PeliculaRow
              key={pelicula.id}
              pelicula={pelicula}
              idx={idx}
              onEdit={() => navigate(`/control-panel/peliculas/editar/${pelicula.id}`)}
              onDelete={() => setToDelete(pelicula)}
            />
          ))}
        </div>
      )}

      {/* ── Delete modal ── */}
      {toDelete && (
        <DeleteModal
          pelicula={toDelete}
          onConfirm={handleConfirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </>
  );
}

/* ── Single row card ────────────────────────────────────────── */
function PeliculaRow({ pelicula, idx, onEdit, onDelete }) {
  const accentColor = GENRE_COLORS[pelicula.genero] ?? "var(--g-darker)";

  return (
    <div
      className="panel-card"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        overflow: "hidden",
        animation: `slideIn 0.4s cubic-bezier(0.22,1,0.36,1) ${idx * 0.07}s both`,
      }}
    >
      {/* Left accent stripe */}
      <div style={{ width: 4, alignSelf: "stretch", background: accentColor, flexShrink: 0 }} />

      {/* Row number */}
      <span style={{
        padding: "0 18px",
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 22,
        color: "var(--border)",
        flexShrink: 0,
        minWidth: 52,
        textAlign: "center",
        letterSpacing: "0.05em",
      }}>
        {String(idx + 1).padStart(2, "0")}
      </span>

      {/* Main info */}
      <div style={{ flex: 1, padding: "18px 0", minWidth: 0 }}>
        <p style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 20,
          letterSpacing: "0.04em",
          color: "var(--ink)",
          marginBottom: 6,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
          {pelicula.titulo}
        </p>

        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          {/* Genre pill */}
          <span style={{
            fontSize: 11, fontWeight: 700,
            letterSpacing: "0.07em", textTransform: "uppercase",
            color: "white",
            background: accentColor,
            padding: "3px 9px", borderRadius: 20,
          }}>
            {pelicula.genero}
          </span>

          {/* Duration */}
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "var(--ink-muted)" }}>
            <span style={{ width: 14, height: 14, display: "inline-flex" }}><ClockIcon /></span>
            {pelicula.duracion} min
          </span>

          {/* Rating badge */}
          <span style={{
            fontSize: 11, fontWeight: 700,
            letterSpacing: "0.06em",
            color: "var(--g-dark)",
            background: "var(--g-pale)",
            border: "1px solid rgba(0,156,41,0.18)",
            padding: "3px 9px", borderRadius: 20,
          }}>
            {pelicula.clasificacion}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, padding: "0 20px", flexShrink: 0 }}>
        <button
          className="panel-btn panel-btn-outline"
          onClick={onEdit}
          title="Editar"
          style={{ padding: "8px 14px" }}
        >
          <EditIcon />
          Editar
        </button>
        <button
          className="panel-btn panel-btn-danger"
          onClick={onDelete}
          title="Eliminar"
          style={{ padding: "8px 12px" }}
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}