import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardData } from "../../services/dashboardService.js";
import { deletePelicula } from "../../services/peliculaService.js";
import "../../styles/home.css";

function FilmIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
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
    </svg>
  );
}

export default function HomeAdmin() {
  const navigate = useNavigate();

  const [stats, setStats] = useState([
    { label: "Peliculas activas", value: "...", sub: "en cartelera" },
    { label: "Tickets vendidos", value: "...", sub: "registrados" },
    { label: "Usuarios registrados", value: "...", sub: "en total" },
    { label: "Funciones hoy", value: "...", sub: "programadas" },
  ]);

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const formatNumber = (value) => {
    return Number(value || 0).toLocaleString("en-US");
  };

  const getEstadoTexto = (estado) => {
    return estado ? "Activa" : "Inactiva";
  };

  const getFecha = (fecha) => {
    if (!fecha) {
      return "-";
    }

    return fecha;
  };

  const buildStats = (estadisticas) => {
    return [
      {
        label: "Peliculas activas",
        value: formatNumber(estadisticas?.peliculas_activas),
        sub: "en cartelera",
      },
      {
        label: "Tickets vendidos",
        value: formatNumber(estadisticas?.tickets_vendidos),
        sub: "registrados",
      },
      {
        label: "Usuarios registrados",
        value: formatNumber(estadisticas?.usuarios_registrados),
        sub: "en total",
      },
      {
        label: "Funciones hoy",
        value: formatNumber(estadisticas?.funciones_hoy),
        sub: "programadas",
      },
    ];
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDashboardData();

      setStats(buildStats(data.estadisticas || {}));
      setMovies(Array.isArray(data.peliculas) ? data.peliculas : []);
    } catch (errorResponse) {
      setError("No se pudieron cargar los datos del panel");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("usuario");
    navigate("/");
  };

  const handleDelete = async (movie) => {
    const confirmDelete = window.confirm(`Deseas eliminar ${movie.titulo}?`);

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(movie.id);
      setError("");

      await deletePelicula(movie.id);
      await loadDashboard();
    } catch (errorResponse) {
      const data = errorResponse.response?.data;
      setError(data?.message || "No se pudo eliminar la pelicula");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="page">
      <nav className="navbar">
        <a className="navbar-brand" href="#">
          <div className="navbar-logo">
            <FilmIcon />
          </div>
          <span className="navbar-title">
            Cine<span>Verde</span>
          </span>
        </a>

        <div className="navbar-spacer" />

        <button className="navbar-btn navbar-btn-ghost" onClick={() => navigate("/control-panel")}>
          <span className="navbar-user">Entrar al panel</span>
        </button>

        <span className="navbar-role-badge">Administrador</span>

        <button className="navbar-btn navbar-btn-ghost" onClick={handleLogout}>
          <LogoutIcon />
          Salir
        </button>
      </nav>

      <main className="main">
        <div className="hero hero--admin">
          <p className="hero-eyebrow">Panel de administracion · {new Date().getFullYear()}</p>
          <h1 className="hero-title">
            Gestion de<br />
            <em>cartelera</em>
            <br />& funciones.
          </h1>
          <p className="hero-sub">
            Administra peliculas, funciones y tickets desde un solo lugar.
            Los cambios se reflejan en tiempo real para los usuarios.
          </p>
        </div>

        {error && (
          <div style={{
            background: "#fff0f0",
            border: "1px solid #ffc7c7",
            color: "#c62828",
            padding: "14px 18px",
            borderRadius: 14,
            marginBottom: 22,
            fontWeight: 700,
          }}>
            {error}
          </div>
        )}

        <div className="stats-row">
          {stats.map((item) => (
            <div className="stat-card" key={item.label}>
              <span className="stat-label">{item.label}</span>
              <span className="stat-value">{loading ? "..." : item.value}</span>
              <span className="stat-sub">{item.sub}</span>
            </div>
          ))}
        </div>

        <div className="section-header">
          <h2 className="section-title">Peliculas</h2>
          <span className="section-count">{movies.length} registros recientes</span>
          <div className="section-line" />
        </div>

        <div className="table-wrap">
          <div className="table-header">
            <span className="table-header-title">Catalogo actual</span>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate("/control-panel/peliculas/nuevo")}
            >
              <PlusIcon />
              Agregar pelicula
            </button>
          </div>

          {loading ? (
            <div style={{ padding: 24, color: "var(--ink-muted)", fontWeight: 600 }}>
              Cargando datos...
            </div>
          ) : movies.length === 0 ? (
            <div style={{ padding: 24, color: "var(--ink-muted)", fontWeight: 600 }}>
              No hay peliculas registradas.
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Titulo</th>
                  <th>Genero</th>
                  <th>Estado</th>
                  <th>Tickets vendidos</th>
                  <th>Fecha estreno</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {movies.map((movie, index) => (
                  <tr key={movie.id}>
                    <td style={{ color: "var(--ink-muted)", fontWeight: 500 }}>
                      {index + 1}
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {movie.titulo}
                    </td>
                    <td>
                      {movie.genero || "-"}
                    </td>
                    <td>
                      <span className={`pill ${movie.estado ? "pill-green" : "pill-gray"}`}>
                        {getEstadoTexto(movie.estado)}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500 }}>
                      {formatNumber(movie.tickets_vendidos)}
                    </td>
                    <td style={{ color: "var(--ink-muted)" }}>
                      {getFecha(movie.fecha_estreno)}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          className="btn btn-outline btn-sm"
                          title="Editar"
                          onClick={() => navigate(`/control-panel/peliculas/editar/${movie.id}`)}
                        >
                          <EditIcon />
                          Editar
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          title="Eliminar"
                          disabled={deletingId === movie.id}
                          onClick={() => handleDelete(movie)}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      <footer className="footer">
        <span className="footer-brand">
          Cine<span>Verde</span>
        </span>
        <span>Panel administrativo · © {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}