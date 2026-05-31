import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { deletePelicula, getPeliculas } from "../../services/peliculaService.js";

export default function PeliculasList() {
  const navigate = useNavigate();
  const location = useLocation();

  const [peliculas, setPeliculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState(location.state?.message || "");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const totalPages = Math.ceil(peliculas.length / itemsPerPage);

  const peliculasPaginadas = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return peliculas.slice(startIndex, endIndex);
  }, [peliculas, currentPage]);

  const peliculasActivas = peliculas.filter((pelicula) => pelicula.estado).length;

  const loadPeliculas = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPeliculas();
      setPeliculas(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (errorResponse) {
      setError("No se pudieron cargar las peliculas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPeliculas();
  }, []);

  useEffect(() => {
    if (!message) {
      return;
    }

    window.history.replaceState({}, document.title);

    const timer = setTimeout(() => {
      setMessage("");
    }, 3500);

    return () => clearTimeout(timer);
  }, [message]);

  const getPosterUrl = (poster) => {
    if (!poster) {
      return "";
    }

    if (poster.startsWith("http")) {
      return poster;
    }

    if (poster.startsWith("/media")) {
      return `http://127.0.0.1:8000${poster}`;
    }

    return `http://127.0.0.1:8000/media/${poster}`;
  };

  const getEstadoTexto = (estado) => {
    return estado ? "ACTIVA" : "INACTIVA";
  };

  const handleDelete = async (pelicula) => {
    const confirmDelete = window.confirm(`Deseas eliminar ${pelicula.titulo}?`);

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(pelicula.id);
      setError("");

      await deletePelicula(pelicula.id);
      setMessage("Pelicula eliminada correctamente");

      const data = await getPeliculas();
      const newPeliculas = Array.isArray(data) ? data : [];

      setPeliculas(newPeliculas);

      const newTotalPages = Math.ceil(newPeliculas.length / itemsPerPage);

      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (errorResponse) {
      const data = errorResponse.response?.data;
      setError(data?.message || "No se pudo eliminar la pelicula");
    } finally {
      setDeletingId(null);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    for (let page = startPage; page <= endPage; page += 1) {
      pages.push(page);
    }

    return pages;
  };

  const startItem = peliculas.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, peliculas.length);

  return (
    <>
      <style>{`
        .peliculas-page {
          width: 100%;
          min-height: calc(100vh - 90px);
          background: #f3fbf6;
          padding: 48px 38px 120px;
          font-family: "Segoe UI", Arial, sans-serif;
        }

        .peliculas-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
          margin-bottom: 42px;
        }

        .peliculas-title {
          margin: 0;
          font-size: 38px;
          font-weight: 500;
          color: #102319;
          letter-spacing: 2px;
        }

        .peliculas-subtitle {
          margin: 14px 0 0;
          color: #6c8f76;
          font-size: 15px;
          font-weight: 500;
        }

        .peliculas-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .peliculas-btn {
          height: 44px;
          border-radius: 12px;
          padding: 0 20px;
          border: 1px solid #bfe8ca;
          background: #ffffff;
          color: #009c29;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          transition: 0.18s ease;
        }

        .peliculas-btn:hover {
          background: #effaf2;
        }

        .peliculas-btn-primary {
          border: none;
          background: #009c29;
          color: #ffffff;
          box-shadow: 0 12px 26px rgba(0, 156, 41, 0.22);
        }

        .peliculas-btn-primary:hover {
          background: #008425;
        }

        .peliculas-alert {
          padding: 14px 18px;
          border-radius: 14px;
          margin-bottom: 18px;
          font-size: 14px;
          font-weight: 700;
        }

        .peliculas-alert-ok {
          background: #effaf2;
          border: 1px solid #bfe8ca;
          color: #087b28;
        }

        .peliculas-alert-error {
          background: #fff0f0;
          border: 1px solid #ffc7c7;
          color: #c62828;
        }

        .peliculas-summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 18px;
          padding: 14px 18px;
          background: #ffffff;
          border: 1px solid #dcefe4;
          border-radius: 16px;
          color: #6c8f76;
          font-size: 14px;
          font-weight: 700;
        }

        .peliculas-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .pelicula-card {
          display: grid;
          grid-template-columns: 52px 76px 1fr auto;
          align-items: center;
          gap: 18px;
          min-height: 106px;
          background: #ffffff;
          border: 1px solid #dcefe4;
          border-left: 6px solid #009c29;
          border-radius: 16px;
          padding: 18px 22px;
          box-shadow: 0 14px 34px rgba(0, 100, 38, 0.08);
        }

        .pelicula-card-inactive {
          border-left-color: #9b0000;
        }

        .pelicula-index {
          color: #a9eec0;
          font-size: 25px;
          font-weight: 400;
        }

        .pelicula-poster {
          width: 70px;
          height: 92px;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #cfe6d5;
          background: #f1f8f4;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6c8f76;
          font-size: 12px;
          font-weight: 600;
          text-align: center;
        }

        .pelicula-poster img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .pelicula-title {
          margin: 0 0 9px;
          font-size: 23px;
          font-weight: 500;
          color: #102319;
        }

        .pelicula-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          color: #6c8f76;
          font-size: 15px;
          font-weight: 600;
        }

        .pelicula-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 5px 12px;
          border-radius: 999px;
          background: #005c18;
          color: #ffffff;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .pelicula-badge-soft {
          background: #e5f8ea;
          color: #008425;
          border: 1px solid #bfe8ca;
        }

        .pelicula-badge-danger {
          background: #9b0000;
          color: #ffffff;
        }

        .pelicula-actions {
          display: flex;
          gap: 10px;
        }

        .pelicula-action-btn {
          height: 42px;
          min-width: 76px;
          border-radius: 10px;
          border: 1px solid #bfe8ca;
          background: #ffffff;
          color: #009c29;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          transition: 0.18s ease;
        }

        .pelicula-delete-btn {
          min-width: 50px;
          border-color: #ffc7c7;
          color: #d93025;
        }

        .pelicula-action-btn:hover {
          background: #effaf2;
        }

        .pelicula-delete-btn:hover {
          background: #fff0f0;
        }

        .peliculas-empty {
          background: #ffffff;
          border: 1px solid #dcefe4;
          border-radius: 16px;
          padding: 30px;
          color: #6c8f76;
          font-weight: 700;
        }

        .peliculas-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          margin-top: 34px;
          flex-wrap: wrap;
        }

        .pagination-btn {
          height: 42px;
          min-width: 42px;
          padding: 0 14px;
          border-radius: 12px;
          border: 1px solid #bfe8ca;
          background: #ffffff;
          color: #009c29;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          transition: 0.18s ease;
        }

        .pagination-btn:hover {
          background: #effaf2;
        }

        .pagination-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          background: #ffffff;
        }

        .pagination-btn-active {
          background: #009c29;
          color: #ffffff;
          border-color: #009c29;
          box-shadow: 0 10px 22px rgba(0, 156, 41, 0.22);
        }

        .pagination-btn-active:hover {
          background: #008425;
        }

        .pagination-info {
          width: 100%;
          text-align: center;
          margin-top: 14px;
          color: #6c8f76;
          font-size: 14px;
          font-weight: 700;
        }

        @media (max-width: 900px) {
          .peliculas-page {
            padding: 28px 18px 100px;
          }

          .peliculas-header {
            flex-direction: column;
          }

          .peliculas-actions {
            width: 100%;
            flex-direction: column;
          }

          .peliculas-btn {
            width: 100%;
          }

          .peliculas-summary {
            flex-direction: column;
            align-items: flex-start;
          }

          .pelicula-card {
            grid-template-columns: 1fr;
          }

          .pelicula-actions {
            justify-content: flex-start;
          }
        }
      `}</style>

      <section className="peliculas-page">
        <div className="peliculas-header">
          <div>
            <h1 className="peliculas-title">Lista de Peliculas</h1>
            <p className="peliculas-subtitle">{peliculasActivas} peliculas activas</p>
          </div>

          <div className="peliculas-actions">
            <button type="button" className="peliculas-btn" onClick={loadPeliculas}>
              Refrescar
            </button>

            <button
              type="button"
              className="peliculas-btn peliculas-btn-primary"
              onClick={() => navigate("/control-panel/peliculas/nuevo")}
            >
              + Anadir pelicula
            </button>
          </div>
        </div>

        {message && (
          <div className="peliculas-alert peliculas-alert-ok">
            {message}
          </div>
        )}

        {error && (
          <div className="peliculas-alert peliculas-alert-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="peliculas-empty">Cargando peliculas...</div>
        ) : peliculas.length === 0 ? (
          <div className="peliculas-empty">No hay peliculas registradas.</div>
        ) : (
          <>
            <div className="peliculas-summary">
              <span>
                Mostrando {startItem} - {endItem} de {peliculas.length} peliculas
              </span>
              <span>
                Pagina {currentPage} de {totalPages}
              </span>
            </div>

            <div className="peliculas-list">
              {peliculasPaginadas.map((pelicula, index) => {
                const posterUrl = getPosterUrl(pelicula.poster);

                return (
                  <article
                    key={pelicula.id}
                    className={`pelicula-card ${
                      pelicula.estado ? "" : "pelicula-card-inactive"
                    }`}
                  >
                    <div className="pelicula-index">
                      {String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, "0")}
                    </div>

                    <div className="pelicula-poster">
                      {posterUrl ? (
                        <img src={posterUrl} alt={pelicula.titulo} />
                      ) : (
                        <span>Sin poster</span>
                      )}
                    </div>

                    <div>
                      <h2 className="pelicula-title">{pelicula.titulo}</h2>

                      <div className="pelicula-meta">
                        {pelicula.genero && (
                          <span className="pelicula-badge">
                            {pelicula.genero}
                          </span>
                        )}

                        {pelicula.duracion && <span>{pelicula.duracion} min</span>}

                        {pelicula.clasificacion && (
                          <span className="pelicula-badge pelicula-badge-soft">
                            {pelicula.clasificacion}
                          </span>
                        )}

                        {pelicula.formato && (
                          <span className="pelicula-badge pelicula-badge-soft">
                            {pelicula.formato}
                          </span>
                        )}

                        <span
                          className={`pelicula-badge ${
                            pelicula.estado ? "pelicula-badge-soft" : "pelicula-badge-danger"
                          }`}
                        >
                          {getEstadoTexto(pelicula.estado)}
                        </span>
                      </div>
                    </div>

                    <div className="pelicula-actions">
                      <button
                        type="button"
                        className="pelicula-action-btn"
                        onClick={() => navigate(`/control-panel/peliculas/editar/${pelicula.id}`)}
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className="pelicula-action-btn pelicula-delete-btn"
                        disabled={deletingId === pelicula.id}
                        onClick={() => handleDelete(pelicula)}
                      >
                        {deletingId === pelicula.id ? "..." : "Eliminar"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="peliculas-pagination">
                <button
                  type="button"
                  className="pagination-btn"
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                >
                  Primero
                </button>

                <button
                  type="button"
                  className="pagination-btn"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>

                {getPageNumbers().map((page) => (
                  <button
                    type="button"
                    key={page}
                    className={`pagination-btn ${
                      currentPage === page ? "pagination-btn-active" : ""
                    }`}
                    onClick={() => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  className="pagination-btn"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </button>

                <button
                  type="button"
                  className="pagination-btn"
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                >
                  Ultimo
                </button>

                <div className="pagination-info">
                  {itemsPerPage} peliculas por pagina
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}