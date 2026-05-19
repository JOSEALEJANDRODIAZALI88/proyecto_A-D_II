import { useNavigate } from "react-router-dom";
import "../styles/home.css";

const DUMMY_MOVIES = [
  { id: 1, title: "Phantom Circuit", genre: "Sci-Fi",   duration: "118 min", rating: "8.4", year: 2024 },
  { id: 2, title: "Salt & Ember",    genre: "Drama",    duration: "104 min", rating: "7.9", year: 2024 },
  { id: 3, title: "Iron Carnival",   genre: "Action",   duration: "132 min", rating: "8.1", year: 2025 },
  { id: 4, title: "The Last Bloom",  genre: "Romance",  duration: "97 min",  rating: "7.5", year: 2025 },
  { id: 5, title: "Vortex Run",      genre: "Thriller", duration: "111 min", rating: "8.7", year: 2025 },
  { id: 6, title: "Celestia",        genre: "Fantasy",  duration: "142 min", rating: "9.0", year: 2025 },
];

// Poster placeholder color per genre
const GENRE_COLORS = {
  "Sci-Fi":   ["#003366", "#006699"],
  "Drama":    ["#2d0040", "#5a0080"],
  "Action":   ["#3d0000", "#7a0000"],
  "Romance":  ["#3d001a", "#7a0033"],
  "Thriller": ["#001a33", "#003366"],
  "Fantasy":  ["#001a0d", "#004d26"],
};

function FilmIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/>
      <line x1="9" y1="4" x2="9" y2="20" strokeDasharray="2 2"/>
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

export default function Home() {
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

        <span className="navbar-role-badge">Cliente</span>

        <button className="navbar-btn navbar-btn-ghost" onClick={handleLogout}>
          <LogoutIcon />
          Salir
        </button>
      </nav>

      {/* ── Main ── */}
      <main className="main">

        {/* Hero */}
        <div className="hero">
          <p className="hero-eyebrow">Cartelera · {new Date().getFullYear()}</p>
          <h1 className="hero-title">
            Tu próxima<br /><em>película favorita</em><br />te espera.
          </h1>
          <p className="hero-sub">
            Explora nuestra cartelera, elige tu función y reserva tus entradas
            en segundos. Sin filas, sin esperas.
          </p>
        </div>

        {/* Section header */}
        <div className="section-header">
          <h2 className="section-title">En Cartelera</h2>
          <span className="section-count">{DUMMY_MOVIES.length} películas</span>
          <div className="section-line" />
        </div>

        {/* Movie grid */}
        <div className="movie-grid">
          {DUMMY_MOVIES.map((movie) => {
            const [gradFrom, gradTo] = GENRE_COLORS[movie.genre] ?? ["#001a0d", "#004d26"];
            return (
              <div className="movie-card" key={movie.id}>

                <div className="movie-poster">
                  {/* Dummy poster */}
                  <div
                    className="movie-poster-dummy"
                    style={{ background: `linear-gradient(160deg, ${gradFrom} 0%, ${gradTo} 100%)` }}
                  >
                    <FilmIcon />
                    POSTER
                  </div>

                  <span className="movie-genre-tag">{movie.genre}</span>

                  <div className="movie-poster-overlay">
                    <button className="movie-overlay-btn">
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        <TicketIcon />
                        Comprar entrada
                      </span>
                    </button>
                  </div>
                </div>

                <div className="movie-body">
                  <div className="movie-title">{movie.title}</div>
                  <div className="movie-meta">
                    <span>{movie.year}</span>
                    <span className="movie-meta-dot" />
                    <span>{movie.duration}</span>
                  </div>
                  <div className="movie-rating">
                    <StarIcon />
                    {movie.rating}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </main>

      {/* ── Footer ── */}
      <footer className="footer">
        <span className="footer-brand">Cine<span>Verde</span></span>
        <span>© {new Date().getFullYear()} · Todos los derechos reservados</span>
      </footer>

    </div>
  );
}