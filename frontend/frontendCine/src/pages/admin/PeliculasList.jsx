import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { deletePelicula, getPeliculas } from "../../services/peliculaService";
import "../../styles/panel.css";

const API_HOST = "http://127.0.0.1:8000";

const getPosterUrl = (poster) => {
  if (!poster) {
    return "";
  }

  if (poster.startsWith("http")) {
    return poster;
  }

  return `${API_HOST}${poster}`;
};

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
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

function DeleteModal({ pelicula, onConfirm, onCancel, loading }) {
  return (
    <>
      <div
        onClick={onCancel}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 400,
          background: "rgba(0,0,0,0.40)",
          backdropFilter: "blur(3px)",
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 401,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
        }}
      >
        <div
          style={{
            background: "var(--surface)",
            borderRadius: "20px",
            padding: "36px 32px 28px",
            width: "100%",
            maxWidth: "420px",
            boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
            border: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: "16px",
              background: "#fff4f3",
              border: "1px solid rgba(192,57,43,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#c0392b",
              marginBottom: "18px",
            }}
          >
            <AlertIcon />
          </div>

          <p
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 24,
              letterSpacing: "0.04em",
              color: "var(--ink)",
              marginBottom: 8,
            }}
          >
            Eliminar pelicula
          </p>

          <p style={{ fontSize: 14, color: "var(--ink-muted)", lineHeight: 1.6, marginBottom: 6 }}>
            Estas seguro de que deseas eliminar
          </p>

          <p style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 20 }}>
            {pelicula.titulo}
          </p>

          <p style={{ fontSize: 13, color: "var(--ink-muted)", marginBottom: 28, lineHeight: 1.5 }}>
            Esta accion eliminara la pelicula de la base de datos.
          </p>

          <div style={{ display: "flex", gap: 10, width: "100%" }}>
            <button
              onClick={onCancel}
              disabled={loading}
              style={{
                flex: 1,
                padding: "11px 0",
                borderRadius: "10px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                background: "transparent",
                color: "var(--ink-soft)",
                border: "1.5px solid var(--border)",
              }}
            >
              Cancelar
            </button>

            <button
              onClick={() => onConfirm(pelicula.id)}
              disabled={loading}
              style={{
                flex: 1,
                padding: "11px 0",
                borderRadius: "10px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                background: "#c0392b",
                color: "white",
                border: "none",
                boxShadow: "0 4px 14px rgba(192,57,43,0.30)",
              }}
            >
              {loading ? "Eliminando..." : "Si, eliminar"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

const GENRE_COLORS = {
  "Ciencia Ficcion": "#006699",
  "Ciencia Ficción": "#006699",
  Accion: "#7a0000",
  "Acción": "#7a0000",
  Drama: "#5a0080",
  Romance: "#7a0033",
  Thriller: "#003366",
  Fantasy: "#004d26",
  Comedia: "#7a5c00",
};

export default function PeliculasList() {
  const navigate = useNavigate();
  const location = useLocation();

  const [peliculas, setPeliculas] = useState([]);
  const [toDelete, setToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState(location.state?.message || "");

  const normalizarPeliculas = (data) => {
    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data.results)) {
      return data.results;
    }

    return [];
  };

  const cargarPeliculas = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getPeliculas();
      setPeliculas(normalizarPeliculas(data));
    } catch {
      setError("No se pudieron cargar las peliculas");
      setPeliculas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async (id) => {
    setDeleting(true);
    setError("");

    try {
      const pelicula = peliculas.find((item) => item.id === id);
      await deletePelicula(id);
      setToDelete(null);
      setNotification(`La pelicula "${pelicula?.titulo || ""}" se elimino correctamente`);
      await cargarPeliculas();
    } catch {
      setError("No se pudo eliminar la pelicula");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    cargarPeliculas();
  }, []);

  useEffect(() => {
    if (!notification) {
      return;
    }

    const timer = setTimeout(() => {
      setNotification("");
      navigate(location.pathname, { replace: true, state: null });
    }, 3500);

    return () => clearTimeout(timer);
  }, [notification, navigate, location.pathname]);

  return (
    <>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
        <div>
          <h1 className="panel-page-title">Lista de Peliculas</h1>
          <p className="panel-page-subtitle">
            {peliculas.length} pelicula{peliculas.length !== 1 ? "s" : ""} registrada{peliculas.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
          <button
            className="panel-btn panel-btn-outline"
            onClick={cargarPeliculas}
            title="Refrescar lista"
            disabled={loading}
          >
            <RefreshIcon />
            {loading ? "Cargando..." : "Refrescar"}
          </button>

          <button
            className="panel-btn panel-btn-primary"
            onClick={() => navigate("/control-panel/peliculas/nueva")}
          >
            <PlusIcon />
            Anadir pelicula
          </button>
        </div>
      </div>

      {notification && (
        <div
          className="panel-card"
          style={{
            padding: "14px 18px",
            marginBottom: 16,
            background: "#e8f8ee",
            color: "#057a28",
            fontWeight: 800,
            border: "1px solid #a7e5b8",
          }}
        >
          {notification}
        </div>
      )}

      {error && (
        <div className="panel-card" style={{ padding: 16, marginBottom: 16, color: "#c0392b", fontWeight: 700 }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="panel-card">
          <div className="panel-placeholder">
            <p className="panel-placeholder-title">Cargando peliculas...</p>
            <p className="panel-placeholder-sub">Espere un momento.</p>
          </div>
        </div>
      ) : peliculas.length === 0 ? (
        <div className="panel-card">
          <div className="panel-placeholder">
            <div className="panel-placeholder-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.6l13.5-4.6c1-.3 2.1.3 2.4 1.3L20.2 6Z" />
                <path d="m6.2 5.3 3.1 3.9" />
                <path d="m12.4 3.4 3.1 3.9" />
                <path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8Z" />
              </svg>
            </div>
            <p className="panel-placeholder-title">Sin peliculas registradas</p>
            <p className="panel-placeholder-sub">Anade una nueva pelicula para que aparezca aqui.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {peliculas.map((pelicula, idx) => (
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

      {toDelete && (
        <DeleteModal
          pelicula={toDelete}
          onConfirm={handleConfirmDelete}
          onCancel={() => setToDelete(null)}
          loading={deleting}
        />
      )}
    </>
  );
}

function PeliculaRow({ pelicula, idx, onEdit, onDelete }) {
  const accentColor = GENRE_COLORS[pelicula.genero] ?? "var(--g-darker)";
  const posterUrl = getPosterUrl(pelicula.poster);

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
      <div style={{ width: 4, alignSelf: "stretch", background: accentColor, flexShrink: 0 }} />

      <span
        style={{
          padding: "0 18px",
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 22,
          color: "var(--border)",
          flexShrink: 0,
          minWidth: 52,
          textAlign: "center",
          letterSpacing: "0.05em",
        }}
      >
        {String(idx + 1).padStart(2, "0")}
      </span>

      <div
        style={{
          width: 64,
          height: 88,
          borderRadius: 12,
          overflow: "hidden",
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
          flexShrink: 0,
        }}
      >
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={pelicula.titulo}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              color: "var(--ink-muted)",
              textAlign: "center",
              padding: 6,
            }}
          >
            Sin poster
          </div>
        )}
      </div>

      <div style={{ flex: 1, padding: "18px 18px", minWidth: 0 }}>
        <p
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 20,
            letterSpacing: "0.04em",
            color: "var(--ink)",
            marginBottom: 6,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {pelicula.titulo}
        </p>

        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              color: "white",
              background: accentColor,
              padding: "3px 9px",
              borderRadius: 20,
            }}
          >
            {pelicula.genero || "Sin genero"}
          </span>

          <span style={{ fontSize: 13, color: "var(--ink-muted)" }}>
            {pelicula.duracion || 0} min
          </span>

          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: "var(--g-dark)",
              background: "var(--g-pale)",
              border: "1px solid rgba(0,156,41,0.18)",
              padding: "3px 9px",
              borderRadius: 20,
            }}
          >
            {pelicula.clasificacion || "S/C"}
          </span>

          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.06em",
              color: pelicula.estado ? "#057a28" : "#777",
              background: pelicula.estado ? "#e8f8ee" : "#eeeeee",
              border: pelicula.estado ? "1px solid #a7e5b8" : "1px solid #dddddd",
              padding: "3px 9px",
              borderRadius: 20,
            }}
          >
            {pelicula.estado ? "ACTIVA" : "INACTIVA"}
          </span>
        </div>
      </div>

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