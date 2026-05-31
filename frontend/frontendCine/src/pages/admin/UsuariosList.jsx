import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteUsuario, getUsuarios } from "../../services/usuarioService.js";

export default function UsuariosList() {
  const navigate = useNavigate();
  const location = useLocation();

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState(location.state?.message || "");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const totalPages = Math.ceil(usuarios.length / itemsPerPage);

  const usuariosPaginados = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return usuarios.slice(startIndex, endIndex);
  }, [usuarios, currentPage]);

  const usuariosActivos = usuarios.filter((usuario) => usuario.estado).length;

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getUsuarios();
      setUsuarios(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (errorResponse) {
      setError("No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
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

  const handleDelete = async (usuario) => {
    const confirmDelete = window.confirm(`Deseas eliminar a ${usuario.nombre}?`);

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(usuario.id);
      setError("");

      await deleteUsuario(usuario.id);
      setMessage("Usuario eliminado correctamente");

      const data = await getUsuarios();
      const newUsuarios = Array.isArray(data) ? data : [];
      setUsuarios(newUsuarios);

      const newTotalPages = Math.ceil(newUsuarios.length / itemsPerPage);

      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (errorResponse) {
      const data = errorResponse.response?.data;
      setError(data?.message || "No se pudo eliminar el usuario");
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

  const startItem = usuarios.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, usuarios.length);

  return (
    <>
      <style>{`
        .usuarios-page {
          width: 100%;
          min-height: calc(100vh - 90px);
          background: #f3fbf6;
          padding: 48px 38px 120px;
          font-family: "Segoe UI", Arial, sans-serif;
        }

        .usuarios-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
          margin-bottom: 42px;
        }

        .usuarios-title {
          margin: 0;
          font-size: 38px;
          font-weight: 500;
          color: #102319;
          letter-spacing: 2px;
        }

        .usuarios-subtitle {
          margin: 14px 0 0;
          color: #6c8f76;
          font-size: 15px;
          font-weight: 500;
        }

        .usuarios-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .usuarios-btn {
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

        .usuarios-btn:hover {
          background: #effaf2;
        }

        .usuarios-btn-primary {
          border: none;
          background: #009c29;
          color: #ffffff;
          box-shadow: 0 12px 26px rgba(0, 156, 41, 0.22);
        }

        .usuarios-btn-primary:hover {
          background: #008425;
        }

        .usuarios-alert {
          padding: 14px 18px;
          border-radius: 14px;
          margin-bottom: 18px;
          font-size: 14px;
          font-weight: 700;
        }

        .usuarios-alert-ok {
          background: #effaf2;
          border: 1px solid #bfe8ca;
          color: #087b28;
        }

        .usuarios-alert-error {
          background: #fff0f0;
          border: 1px solid #ffc7c7;
          color: #c62828;
        }

        .usuarios-summary {
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

        .usuarios-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .usuario-card {
          display: grid;
          grid-template-columns: 52px 1fr auto;
          align-items: center;
          gap: 18px;
          min-height: 106px;
          background: #ffffff;
          border: 1px solid #dcefe4;
          border-left: 6px solid #009c29;
          border-radius: 16px;
          padding: 22px 22px;
          box-shadow: 0 14px 34px rgba(0, 100, 38, 0.08);
        }

        .usuario-card-cliente {
          border-left-color: #0077a8;
        }

        .usuario-index {
          color: #a9eec0;
          font-size: 25px;
          font-weight: 400;
        }

        .usuario-name {
          margin: 0 0 8px;
          font-size: 22px;
          font-weight: 600;
          color: #102319;
        }

        .usuario-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          color: #6c8f76;
          font-size: 15px;
          font-weight: 500;
        }

        .usuario-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 5px 12px;
          border-radius: 999px;
          background: #005c18;
          color: #ffffff;
          font-size: 12px;
          font-weight: 800;
        }

        .usuario-badge-cliente {
          background: #006aa0;
        }

        .usuario-inactive {
          background: #999999;
        }

        .usuario-actions {
          display: flex;
          gap: 10px;
        }

        .usuario-action-btn {
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

        .usuario-delete-btn {
          min-width: 76px;
          border-color: #ffc7c7;
          color: #d93025;
        }

        .usuario-action-btn:hover {
          background: #effaf2;
        }

        .usuario-delete-btn:hover {
          background: #fff0f0;
        }

        .usuarios-empty {
          background: #ffffff;
          border: 1px solid #dcefe4;
          border-radius: 16px;
          padding: 30px;
          color: #6c8f76;
          font-weight: 700;
        }

        .usuarios-pagination {
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

        @media (max-width: 800px) {
          .usuarios-page {
            padding: 28px 18px 100px;
          }

          .usuarios-header {
            flex-direction: column;
          }

          .usuarios-actions {
            width: 100%;
            flex-direction: column;
          }

          .usuarios-btn {
            width: 100%;
          }

          .usuarios-summary {
            flex-direction: column;
            align-items: flex-start;
          }

          .usuario-card {
            grid-template-columns: 1fr;
          }

          .usuario-actions {
            justify-content: flex-start;
          }
        }
      `}</style>

      <section className="usuarios-page">
        <div className="usuarios-header">
          <div>
            <h1 className="usuarios-title">Lista de Usuarios</h1>
            <p className="usuarios-subtitle">{usuariosActivos} usuarios activos</p>
          </div>

          <div className="usuarios-actions">
            <button type="button" className="usuarios-btn" onClick={loadUsuarios}>
              Refrescar
            </button>

            <button
              type="button"
              className="usuarios-btn usuarios-btn-primary"
              onClick={() => navigate("/control-panel/usuarios/nuevo")}
            >
              + Anadir usuario
            </button>
          </div>
        </div>

        {message && (
          <div className="usuarios-alert usuarios-alert-ok">
            {message}
          </div>
        )}

        {error && (
          <div className="usuarios-alert usuarios-alert-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="usuarios-empty">Cargando usuarios...</div>
        ) : usuarios.length === 0 ? (
          <div className="usuarios-empty">No hay usuarios registrados.</div>
        ) : (
          <>
            <div className="usuarios-summary">
              <span>
                Mostrando {startItem} - {endItem} de {usuarios.length} usuarios
              </span>
              <span>
                Pagina {currentPage} de {totalPages}
              </span>
            </div>

            <div className="usuarios-list">
              {usuariosPaginados.map((usuario, index) => (
                <article
                  key={usuario.id}
                  className={`usuario-card ${
                    usuario.rol === "cliente" ? "usuario-card-cliente" : ""
                  }`}
                >
                  <div className="usuario-index">
                    {String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, "0")}
                  </div>

                  <div>
                    <h2 className="usuario-name">
                      {usuario.nombre || usuario.username}
                    </h2>

                    <div className="usuario-meta">
                      <span
                        className={`usuario-badge ${
                          usuario.rol === "cliente" ? "usuario-badge-cliente" : ""
                        } ${!usuario.estado ? "usuario-inactive" : ""}`}
                      >
                        {usuario.rol === "admin" ? "Administrador" : "Cliente"}
                      </span>

                      {usuario.correo && <span>{usuario.correo}</span>}
                      {usuario.telefono && <span>{usuario.telefono}</span>}
                      {usuario.direccion && <span>{usuario.direccion}</span>}
                      {usuario.cargo && <span>{usuario.cargo}</span>}
                      {!usuario.estado && <span>Inactivo</span>}
                    </div>
                  </div>

                  <div className="usuario-actions">
                    <button
                      type="button"
                      className="usuario-action-btn"
                      onClick={() => navigate(`/control-panel/usuarios/editar/${usuario.id}`)}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className="usuario-action-btn usuario-delete-btn"
                      disabled={deletingId === usuario.id}
                      onClick={() => handleDelete(usuario)}
                    >
                      {deletingId === usuario.id ? "..." : "Eliminar"}
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="usuarios-pagination">
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
                  {itemsPerPage} usuarios por pagina
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}