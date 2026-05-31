import { useNavigate } from "react-router-dom";
import "../../styles/home.css";

/* ── Dummy data ─────────────────────────────────────────────── */
const DUMMY_STATS = [
  { label: "Películas activas",  value: "12",    sub: "en cartelera" },
  { label: "Tickets vendidos",   value: "1,240", sub: "este mes" },
  { label: "Usuarios registrados", value: "348", sub: "en total" },
  { label: "Funciones hoy",      value: "8",     sub: "programadas" },
];

const DUMMY_MOVIES = [
  { id: 1, title: "Phantom Circuit", genre: "Sci-Fi",   status: "active",   tickets: 204, date: "2025-06-01" },
  { id: 2, title: "Salt & Ember",    genre: "Drama",    status: "active",   tickets: 98,  date: "2025-06-01" },
  { id: 3, title: "Iron Carnival",   genre: "Action",   status: "active",   tickets: 317, date: "2025-06-02" },
  { id: 4, title: "The Last Bloom",  genre: "Romance",  status: "inactive", tickets: 55,  date: "2025-05-28" },
  { id: 5, title: "Vortex Run",      genre: "Thriller", status: "active",   tickets: 412, date: "2025-06-03" },
  { id: 6, title: "Celestia",        genre: "Fantasy",  status: "inactive", tickets: 154, date: "2025-05-25" },
];


/* ── Icons ──────────────────────────────────────────────────── */
function FilmIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
    </svg>
  );
}

export default function HomeAdmin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    navigate("/");
  };

  return (
    <div className="page">

      {/* ── Navbar ── */}
      <nav className="navbar">
        <a className="navbar-brand" href="#">
          <div className="navbar-logo">
            <FilmIcon />
          </div>
          <span className="navbar-title">Cine<span>Verde</span></span>
        </a>

        <div className="navbar-spacer" />

        <button className="navbar-btn navbar-btn-ghost" onClick={() => navigate("/control-panel")}>
            <span className="navbar-user">Entrar al panel</span>
        </button>

        <span className="navbar-role-badge"> Administrador </span>

        <button className="navbar-btn navbar-btn-ghost" onClick={handleLogout}>
          <LogoutIcon />
          Salir
        </button>
      </nav>

      {/* ── Main ── */}
      <main className="main">

        {/* Hero */}
        <div className="hero hero--admin">
          <p className="hero-eyebrow">Panel de administración · {new Date().getFullYear()}</p>
          <h1 className="hero-title">
            Gestión de<br /><em>cartelera</em><br />& funciones.
          </h1>
          <p className="hero-sub">
            Administra películas, funciones y tickets desde un solo lugar.
            Los cambios se reflejan en tiempo real para los usuarios.
          </p>
        </div>

        {/* Stats */}
        <div className="stats-row">
          {DUMMY_STATS.map((s) => (
            <div className="stat-card" key={s.label}>
              <span className="stat-label">{s.label}</span>
              <span className="stat-value">{s.value}</span>
              <span className="stat-sub">{s.sub}</span>
            </div>
          ))}
        </div>

        {/* Section header */}
        <div className="section-header">
          <h2 className="section-title">Películas</h2>
          <span className="section-count">{DUMMY_MOVIES.length} registros</span>
          <div className="section-line" />
        </div>

        {/* Table */}
        <div className="table-wrap">
          <div className="table-header">
            <span className="table-header-title">Catálogo actual</span>
            <button className="btn btn-primary btn-sm">
              <PlusIcon />
              Agregar película
            </button>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Título</th>
                <th>Género</th>
                <th>Estado</th>
                <th>Tickets vendidos</th>
                <th>Fecha estreno</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {DUMMY_MOVIES.map((movie) => (
                <tr key={movie.id}>
                  <td style={{ color: "var(--ink-muted)", fontWeight: 500 }}>{movie.id}</td>
                  <td style={{ fontWeight: 600 }}>{movie.title}</td>
                  <td>{movie.genre}</td>
                  <td>
                    <span className={`pill ${movie.status === "active" ? "pill-green" : "pill-gray"}`}>
                      {movie.status === "active" ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>{movie.tickets.toLocaleString()}</td>
                  <td style={{ color: "var(--ink-muted)" }}>{movie.date}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-outline btn-sm" title="Editar">
                        <EditIcon />
                        Editar
                      </button>
                      <button className="btn btn-danger btn-sm" title="Eliminar">
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>

      {/* ── Footer ── */}
      <footer className="footer">
        <span className="footer-brand">Cine<span>Verde</span></span>
        <span>Panel administrativo · © {new Date().getFullYear()}</span>
      </footer>

    </div>
  );
}