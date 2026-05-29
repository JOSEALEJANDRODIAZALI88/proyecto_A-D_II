import { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import "../../styles/Panel.css";

/* ── Icons ──────────────────────────────────────────────────── */
function FilmIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>
    </svg>
  );
}

function MenuIcon({ open }) {
  return open ? (
    /* X icon when open */
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ) : (
    /* Hamburger */
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="3" y1="7" x2="21" y2="7"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="17" x2="21" y2="17"/>
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

function ClapperboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.6l13.5-4.6c1-.3 2.1.3 2.4 1.3L20.2 6Z"/>
      <path d="m6.2 5.3 3.1 3.9"/>
      <path d="m12.4 3.4 3.1 3.9"/>
      <path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8Z"/>
    </svg>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  );
}

/* ── Nav items config ───────────────────────────────────────── */
const NAV_ITEMS = [
  { label: "Usuarios",  path: "/control-panel/usuarios",  Icon: UsersIcon },
  { label: "Funciones", path: "/control-panel/funciones",  Icon: CalendarIcon },
  { label: "Películas", path: "/control-panel/peliculas",  Icon: ClapperboardIcon },
];

/* ── Component ──────────────────────────────────────────────── */
export default function PanelNav() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();

  const activeItem = NAV_ITEMS.find((i) => location.pathname.startsWith(i.path));
  const pageLabel  = activeItem?.label ?? "Panel";

  const closeSidebar = () => setSidebarOpen(false);

  const handleNavClick = (path) => {
    navigate(path);
    closeSidebar();   // auto-close on mobile after tap
  };

  const handleGoHome = () => {
    navigate("/admin");
  };

  return (
    <div className="panel-shell">

      {/* ── Top nav ── */}
      <header className="panel-nav">

        {/* Hamburger (mobile) */}
        <button
          className="panel-hamburger"
          onClick={() => setSidebarOpen((o) => !o)}
          aria-label="Toggle sidebar"
        >
          <MenuIcon open={sidebarOpen} />
        </button>

        {/* Brand */}
        <a className="panel-nav-brand" href="/admin">
          <div className="panel-nav-logo">
            <FilmIcon />
          </div>
          <span className="panel-nav-title">Cine<span>Verde</span></span>
        </a>

        <div className="panel-nav-divider" />

        {/* Current page label */}
        <span className="panel-nav-label">
          Panel / <strong>{pageLabel}</strong>
        </span>

        <div className="panel-nav-spacer" />

        <span className="panel-nav-badge">Admin</span>

        {/* Back to home */}
        <button className="panel-nav-back" onClick={handleGoHome}>
          <ArrowLeftIcon />
          Salir del panel
        </button>

      </header>

      {/* ── Body ── */}
      <div className="panel-body">

        {/* Mobile overlay */}
        <div
          className={`panel-overlay${sidebarOpen ? " open" : ""}`}
          onClick={closeSidebar}
        />

        {/* ── Sidebar ── */}
        <aside className={`panel-sidebar${sidebarOpen ? " open" : ""}`}>

          <span className="sidebar-section-label">Módulos</span>

          <ul className="sidebar-nav" role="navigation">
            {NAV_ITEMS.map(({ label, path, Icon }) => {
              const isActive = location.pathname.startsWith(path);
              return (
                <li className="sidebar-item" key={path}>
                  <button
                    className={`sidebar-link${isActive ? " active" : ""}`}
                    onClick={() => handleNavClick(path)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon />
                    <span className="sidebar-link-label">{label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="sidebar-bottom">
            <div className="sidebar-version">
              <span className="sidebar-version-dot" />
              Sistema en línea
            </div>
          </div>

        </aside>

        {/* ── Page content (child routes render here) ── */}
        <main className="panel-content">
          <Outlet />
        </main>

      </div>

      {/* ── Footer ── */}
      <footer className="panel-footer">
        <span className="panel-footer-brand">Cine<span>Verde</span></span>
        <span className="panel-footer-dot" />
        <span>Panel de administración</span>
        <span className="panel-footer-spacer" />
        <span>© {new Date().getFullYear()}</span>
      </footer>

    </div>
  );
}