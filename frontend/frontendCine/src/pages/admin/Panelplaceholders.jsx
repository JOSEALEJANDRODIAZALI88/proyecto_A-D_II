/*
  Placeholder pages for panel child routes.
  Replace each export with the real page once ready.

  Routing setup example (in your router file):

  import PanelNav          from "./components/PanelNav";
  import { Usuarios, Funciones, Peliculas } from "./pages/PanelPlaceholders";

  {
    path: "/panel",
    element: <PanelNav />,
    children: [
      { path: "usuarios",  element: <Usuarios /> },
      { path: "funciones", element: <Funciones /> },
      { path: "peliculas", element: <Peliculas /> },
    ],
  }
*/

import "../../styles/panel.css";

/* ── Shared icon builder ────────────────────────────────────── */
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

function Placeholder({ title, sub, Icon }) {
  return (
    <div>
      <h1 className="panel-page-title">{title}</h1>
      <p className="panel-page-subtitle">{sub}</p>

      <div className="panel-card">
        <div className="panel-placeholder">
          <div className="panel-placeholder-icon">
            <Icon />
          </div>
          <p className="panel-placeholder-title">Próximamente</p>
          <p className="panel-placeholder-sub">
            Este módulo está en desarrollo. Aquí irá la tabla con datos
            de la base de datos y sus respectivos formularios.
          </p>
        </div>
      </div>
    </div>
  );
}

export function Usuarios() {
  return (
    <Placeholder
      title="Usuarios"
      sub="Gestiona los usuarios registrados en el sistema."
      Icon={UsersIcon}
    />
  );
}

export function Funciones() {
  return (
    <Placeholder
      title="Funciones"
      sub="Administra las funciones y horarios de cada película."
      Icon={CalendarIcon}
    />
  );
}

export function Peliculas() {
  return (
    <Placeholder
      title="Películas"
      sub="Gestiona el catálogo de películas en cartelera."
      Icon={ClapperboardIcon}
    />
  );
}