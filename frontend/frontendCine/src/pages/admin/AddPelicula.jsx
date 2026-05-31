import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPelicula } from "../../services/peliculaService.js";

function MovieSection({ id, number, title, description, isOpen, onToggle, children }) {
  return (
    <article className={`movie-section ${isOpen ? "movie-section-open" : ""}`}>
      <button
        type="button"
        className="movie-section-header"
        onClick={() => onToggle(id)}
      >
        <div className="movie-section-left">
          <span className="movie-section-number">{number}</span>

          <div>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        </div>

        <span className="movie-section-arrow">
          {isOpen ? "-" : "+"}
        </span>
      </button>

      {isOpen && (
        <div className="movie-section-body">
          {children}
        </div>
      )}
    </article>
  );
}

export default function AddPelicula() {
  const navigate = useNavigate();

  const generoOptions = [
    "Accion",
    "Aventura",
    "Comedia",
    "Drama",
    "Terror",
    "Suspenso",
    "Romance",
    "Animacion",
    "Fantasia",
    "Ciencia ficcion",
  ];

  const clasificacionOptions = [
    "Todo publico",
    "Mayores de 13",
    "Mayores de 16",
    "Mayores de 18",
    "ATP",
    "PG",
    "PG-13",
    "R",
    "NC-17",
    "+12",
    "+15",
    "+18",
  ];

  const idiomaOptions = [
    "Doblada",
    "Subtitulada",
    "Original",
    "Espanol",
    "Ingles",
    "Frances",
  ];

  const formatoOptions = [
    "2D",
    "3D",
    "IMAX",
  ];

  const progressItems = [
    { id: "datos", number: "01", title: "Datos" },
    { id: "poster", number: "02", title: "Poster" },
    { id: "opciones", number: "03", title: "Cartelera" },
    { id: "sinopsis", number: "04", title: "Sinopsis" },
    { id: "resumen", number: "05", title: "Resumen" },
  ];

  const [form, setForm] = useState({
    titulo: "",
    genero: "Accion",
    sinopsis: "",
    duracion: "",
    clasificacion: "Mayores de 13",
    idioma: "Doblada",
    formato: "2D",
    fecha_estreno: "",
    estado: true,
    poster: null,
  });

  const [openSections, setOpenSections] = useState({
    datos: true,
    poster: false,
    opciones: false,
    sinopsis: false,
    resumen: false,
  });

  const [preview, setPreview] = useState("");
  const [posterName, setPosterName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const toggleSection = (section) => {
    setOpenSections((currentSections) => ({
      ...currentSections,
      [section]: !currentSections[section],
    }));
  };

  const openOnly = (section) => {
    setOpenSections({
      datos: section === "datos",
      poster: section === "poster",
      opciones: section === "opciones",
      sinopsis: section === "sinopsis",
      resumen: section === "resumen",
    });
  };

  const openNext = (section) => {
    openOnly(section);
  };

  const handleChange = (event) => {
    const { name, value, type, checked, files } = event.target;

    if (type === "file") {
      const file = files[0];

      setForm((currentForm) => ({
        ...currentForm,
        poster: file || null,
      }));

      setPosterName(file ? file.name : "");

      if (file) {
        setPreview(URL.createObjectURL(file));
      } else {
        setPreview("");
      }

      setError("");
      return;
    }

    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  };

  const setEstado = () => {
    setForm((currentForm) => ({
      ...currentForm,
      estado: !currentForm.estado,
    }));

    setError("");
  };

  const validateForm = () => {
    if (!form.titulo.trim()) {
      openOnly("datos");
      return "El titulo es obligatorio";
    }

    if (!form.genero.trim()) {
      openOnly("datos");
      return "El genero es obligatorio";
    }

    if (!form.duracion || Number(form.duracion) <= 0) {
      openOnly("datos");
      return "La duracion debe ser mayor a 0";
    }

    if (!form.fecha_estreno) {
      openOnly("datos");
      return "La fecha de estreno es obligatoria";
    }

    if (!form.sinopsis.trim()) {
      openOnly("sinopsis");
      return "La sinopsis es obligatoria";
    }

    return "";
  };

  const getErrorMessage = (errorResponse) => {
    const data = errorResponse.response?.data;

    if (data?.message) {
      return data.message;
    }

    if (data?.detail) {
      return data.detail;
    }

    if (data?.errors) {
      const firstKey = Object.keys(data.errors)[0];
      const firstError = data.errors[firstKey];

      if (Array.isArray(firstError)) {
        return firstError[0];
      }

      return String(firstError);
    }

    return "No se pudo guardar la pelicula";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      setError("");

      await createPelicula({
        titulo: form.titulo.trim(),
        genero: form.genero.trim(),
        sinopsis: form.sinopsis.trim(),
        duracion: form.duracion,
        clasificacion: form.clasificacion,
        idioma: form.idioma,
        formato: form.formato,
        fecha_estreno: form.fecha_estreno,
        estado: form.estado,
        poster: form.poster,
      });

      navigate("/control-panel/peliculas", {
        state: {
          message: `La pelicula ${form.titulo} se creo correctamente`,
        },
      });
    } catch (errorResponse) {
      setError(getErrorMessage(errorResponse));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style>{`
        .movie-create-page {
          width: 100%;
          min-height: calc(100vh - 90px);
          background:
            radial-gradient(circle at 10% 12%, rgba(0, 156, 41, 0.08), transparent 28%),
            radial-gradient(circle at 90% 88%, rgba(0, 194, 51, 0.09), transparent 30%),
            linear-gradient(135deg, #f7fcf9 0%, #eefaf2 100%);
          padding: 46px 38px 120px;
          font-family: "Segoe UI", Arial, sans-serif;
        }

        .movie-create-wrapper {
          width: 100%;
          max-width: 1220px;
          margin: 0 auto;
        }

        .movie-create-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
          margin-bottom: 28px;
        }

        .movie-create-title {
          margin: 0;
          color: #102319;
          font-size: 40px;
          line-height: 1.1;
          font-weight: 500;
          letter-spacing: 2px;
        }

        .movie-create-subtitle {
          margin: 12px 0 0;
          color: #6c8f76;
          font-size: 16px;
          font-weight: 600;
        }

        .movie-small-button {
          height: 44px;
          border-radius: 12px;
          border: 1px solid #bfe8ca;
          background: #ffffff;
          color: #009c29;
          padding: 0 18px;
          font-size: 14px;
          font-weight: 900;
          cursor: pointer;
          transition: 0.18s ease;
        }

        .movie-small-button:hover {
          background: #effaf2;
        }

        .movie-alert {
          margin-bottom: 20px;
          padding: 14px 18px;
          border-radius: 16px;
          background: #fff0f0;
          border: 1px solid #ffc7c7;
          color: #c62828;
          font-size: 14px;
          font-weight: 900;
          text-align: center;
        }

        .movie-progress {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 24px;
        }

        .movie-progress-item {
          min-height: 78px;
          border-radius: 18px;
          background: #ffffff;
          border: 1px solid #dcefe4;
          box-shadow: 0 12px 30px rgba(0, 100, 38, 0.07);
          padding: 14px;
          text-align: left;
          cursor: pointer;
          transition: 0.18s ease;
        }

        .movie-progress-item:hover {
          transform: translateY(-2px);
          border-color: #bfe8ca;
          box-shadow: 0 18px 38px rgba(0, 100, 38, 0.1);
        }

        .movie-progress-item-active {
          background: #effaf2;
          border-color: #009c29;
        }

        .movie-progress-index {
          width: 28px;
          height: 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: #e5f8ea;
          color: #009c29;
          font-size: 12px;
          font-weight: 900;
          margin-bottom: 8px;
        }

        .movie-progress-item-active .movie-progress-index {
          background: #009c29;
          color: #ffffff;
        }

        .movie-progress-title {
          display: block;
          color: #365940;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 1.4px;
          text-transform: uppercase;
        }

        .movie-create-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 340px;
          gap: 24px;
          align-items: start;
        }

        .movie-accordion {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .movie-section {
          background: #ffffff;
          border: 1px solid #dcefe4;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 16px 40px rgba(0, 100, 38, 0.08);
        }

        .movie-section-open {
          border-color: #bfe8ca;
        }

        .movie-section-header {
          width: 100%;
          min-height: 92px;
          border: none;
          background: #ffffff;
          padding: 20px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          cursor: pointer;
          text-align: left;
        }

        .movie-section-header:hover {
          background: #f7fcf9;
        }

        .movie-section-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .movie-section-number {
          width: 46px;
          height: 46px;
          border-radius: 15px;
          background: #009c29;
          color: #ffffff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
          font-weight: 900;
          box-shadow: 0 12px 26px rgba(0, 156, 41, 0.22);
          flex: 0 0 auto;
        }

        .movie-section h2 {
          margin: 0;
          color: #102319;
          font-size: 22px;
          font-weight: 750;
        }

        .movie-section p {
          margin: 6px 0 0;
          color: #6c8f76;
          font-size: 14px;
          font-weight: 600;
        }

        .movie-section-arrow {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          background: #effaf2;
          color: #009c29;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          font-weight: 900;
          flex: 0 0 auto;
        }

        .movie-section-body {
          border-top: 1px solid #dcefe4;
          padding: 26px;
          background: #fcfffd;
        }

        .movie-inside-card {
          border: 1px solid #edf5f0;
          background: #ffffff;
          border-radius: 20px;
          padding: 22px;
        }

        .movie-inside-title {
          margin: 0 0 6px;
          color: #102319;
          font-size: 19px;
          font-weight: 850;
        }

        .movie-inside-text {
          margin: 0 0 18px;
          color: #6c8f76;
          font-size: 14px;
          line-height: 1.5;
          font-weight: 600;
        }

        .movie-form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }

        .movie-field-full {
          grid-column: 1 / -1;
        }

        .movie-label {
          display: block;
          margin-bottom: 9px;
          color: #234b2c;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .movie-input,
        .movie-select,
        .movie-textarea {
          width: 100%;
          border: 1.5px solid #d4e8d9;
          border-radius: 18px;
          background: #f1f8f4;
          color: #102319;
          font-size: 16px;
          font-weight: 650;
          outline: none;
          font-family: "Segoe UI", Arial, sans-serif;
          transition: 0.18s ease;
        }

        .movie-input,
        .movie-select {
          height: 58px;
          padding: 0 18px;
        }

        .movie-select {
          cursor: pointer;
          appearance: auto;
        }

        .movie-textarea {
          min-height: 190px;
          padding: 17px 18px;
          resize: vertical;
          line-height: 1.5;
        }

        .movie-input::placeholder,
        .movie-textarea::placeholder {
          color: #8da99a;
          font-weight: 600;
        }

        .movie-input:focus,
        .movie-select:focus,
        .movie-textarea:focus {
          border-color: #009c29;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(0, 156, 41, 0.12);
        }

        .movie-poster-layout {
          display: grid;
          grid-template-columns: 280px minmax(0, 1fr);
          gap: 24px;
          align-items: stretch;
        }

        .movie-poster-preview {
          width: 100%;
          height: 390px;
          border: 1.8px dashed #bfe8ca;
          border-radius: 22px;
          background: linear-gradient(135deg, #f6fcf8 0%, #eef9f2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          color: #6c8f76;
          font-size: 18px;
          font-weight: 900;
          text-align: center;
        }

        .movie-poster-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .movie-file-hidden {
          display: none;
        }

        .movie-file-card {
          border-radius: 22px;
          border: 1px solid #dcefe4;
          background: #ffffff;
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .movie-file-title {
          margin: 0 0 8px;
          color: #102319;
          font-size: 24px;
          font-weight: 800;
        }

        .movie-file-text {
          margin: 0 0 20px;
          color: #6c8f76;
          font-size: 15px;
          line-height: 1.6;
          font-weight: 600;
        }

        .movie-file-button {
          width: 100%;
          height: 56px;
          border-radius: 16px;
          border: none;
          background: #009c29;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          font-weight: 900;
          cursor: pointer;
          transition: 0.18s ease;
          box-shadow: 0 14px 28px rgba(0, 156, 41, 0.22);
        }

        .movie-file-button:hover {
          background: #008425;
        }

        .movie-file-name {
          margin-top: 14px;
          padding: 12px 14px;
          border-radius: 14px;
          background: #effaf2;
          color: #365940;
          font-size: 14px;
          font-weight: 800;
          word-break: break-word;
        }

        .movie-state-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 20px;
          border-radius: 20px;
          border: 1px solid #dcefe4;
          background: #ffffff;
        }

        .movie-state-card h3 {
          margin: 0;
          color: #102319;
          font-size: 18px;
          font-weight: 850;
        }

        .movie-state-card p {
          margin: 6px 0 0;
          color: #6c8f76;
          font-size: 14px;
          font-weight: 600;
        }

        .movie-switch {
          width: 68px;
          height: 38px;
          border-radius: 999px;
          border: none;
          background: #b8c7bd;
          position: relative;
          cursor: pointer;
          transition: 0.18s ease;
          flex: 0 0 auto;
        }

        .movie-switch-on {
          background: #009c29;
        }

        .movie-switch::after {
          content: "";
          position: absolute;
          top: 4px;
          left: 4px;
          width: 30px;
          height: 30px;
          border-radius: 999px;
          background: #ffffff;
          box-shadow: 0 4px 10px rgba(0,0,0,0.18);
          transition: 0.18s ease;
        }

        .movie-switch-on::after {
          left: 34px;
        }

        .movie-summary-card {
          position: sticky;
          top: 24px;
          background: #ffffff;
          border: 1px solid #dcefe4;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 18px 48px rgba(0, 100, 38, 0.1);
        }

        .movie-summary-head {
          padding: 22px;
          background: linear-gradient(135deg, #009c29 0%, #006b1d 100%);
          color: #ffffff;
        }

        .movie-summary-head h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 850;
        }

        .movie-summary-head p {
          margin: 8px 0 0;
          color: #e8fff0;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.4;
        }

        .movie-summary-body {
          padding: 22px;
        }

        .movie-summary-poster {
          width: 100%;
          height: 250px;
          border-radius: 18px;
          background: #f1f8f4;
          border: 1px solid #dcefe4;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          color: #6c8f76;
          font-weight: 900;
          margin-bottom: 18px;
        }

        .movie-summary-poster img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .movie-summary-title {
          margin: 0 0 14px;
          color: #102319;
          font-size: 22px;
          font-weight: 850;
        }

        .movie-summary-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 18px;
        }

        .movie-tag {
          display: inline-flex;
          align-items: center;
          min-height: 30px;
          padding: 0 12px;
          border-radius: 999px;
          background: #e5f8ea;
          color: #008425;
          border: 1px solid #bfe8ca;
          font-size: 12px;
          font-weight: 900;
        }

        .movie-tag-dark {
          background: #005c18;
          color: #ffffff;
          border-color: #005c18;
        }

        .movie-summary-line {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 0;
          border-top: 1px solid #edf5f0;
          color: #365940;
          font-size: 14px;
          font-weight: 750;
        }

        .movie-summary-line span:last-child {
          color: #102319;
          text-align: right;
        }

        .movie-submit,
        .movie-cancel {
          width: 100%;
          height: 54px;
          border-radius: 16px;
          font-size: 15px;
          font-weight: 900;
          cursor: pointer;
          transition: 0.18s ease;
        }

        .movie-submit {
          border: none;
          background: #009c29;
          color: #ffffff;
          box-shadow: 0 14px 28px rgba(0, 156, 41, 0.22);
          margin-top: 18px;
        }

        .movie-submit:hover {
          background: #008425;
          transform: translateY(-1px);
        }

        .movie-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
        }

        .movie-cancel {
          border: 1.5px solid #bfe8ca;
          background: #ffffff;
          color: #009c29;
          margin-top: 10px;
        }

        .movie-cancel:hover {
          background: #effaf2;
        }

        .movie-next-button {
          height: 46px;
          border-radius: 14px;
          border: 1px solid #bfe8ca;
          background: #ffffff;
          color: #009c29;
          padding: 0 18px;
          font-size: 14px;
          font-weight: 900;
          cursor: pointer;
          margin-top: 18px;
          transition: 0.18s ease;
        }

        .movie-next-button:hover {
          background: #effaf2;
        }

        @media (max-width: 1120px) {
          .movie-create-grid {
            grid-template-columns: 1fr;
          }

          .movie-summary-card {
            position: static;
          }

          .movie-progress {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 820px) {
          .movie-create-page {
            padding: 28px 18px 100px;
          }

          .movie-create-top {
            flex-direction: column;
          }

          .movie-progress {
            grid-template-columns: 1fr;
          }

          .movie-form-grid,
          .movie-poster-layout {
            grid-template-columns: 1fr;
          }

          .movie-poster-preview {
            height: 320px;
          }
        }
      `}</style>

      <section className="movie-create-page">
        <div className="movie-create-wrapper">
          <div className="movie-create-top">
            <div>
              <h1 className="movie-create-title">Anadir pelicula</h1>
              <p className="movie-create-subtitle">
                Completa la informacion por secciones para registrar una nueva pelicula.
              </p>
            </div>

            <button
              type="button"
              className="movie-small-button"
              onClick={() => navigate("/control-panel/peliculas")}
            >
              Volver al listado
            </button>
          </div>

          {error && <div className="movie-alert">{error}</div>}

          <div className="movie-progress">
            {progressItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`movie-progress-item ${openSections[item.id] ? "movie-progress-item-active" : ""}`}
                onClick={() => openOnly(item.id)}
              >
                <span className="movie-progress-index">{item.number}</span>
                <span className="movie-progress-title">{item.title}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="movie-create-grid">
              <div className="movie-accordion">
                <MovieSection
                  id="datos"
                  number="01"
                  title="Datos principales"
                  description="Titulo, genero, duracion y fecha de estreno."
                  isOpen={openSections.datos}
                  onToggle={toggleSection}
                >
                  <div className="movie-inside-card">
                    <h3 className="movie-inside-title">Informacion base</h3>
                    <p className="movie-inside-text">
                      Estos datos identifican la pelicula dentro del catalogo.
                    </p>

                    <div className="movie-form-grid">
                      <div className="movie-field-full">
                        <label className="movie-label">Titulo</label>
                        <input
                          className="movie-input"
                          name="titulo"
                          value={form.titulo}
                          onChange={handleChange}
                          placeholder="Ej. Avatar"
                        />
                      </div>

                      <div>
                        <label className="movie-label">Genero</label>
                        <select
                          className="movie-select"
                          name="genero"
                          value={form.genero}
                          onChange={handleChange}
                        >
                          {generoOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="movie-label">Duracion</label>
                        <input
                          className="movie-input"
                          name="duracion"
                          type="number"
                          min="1"
                          value={form.duracion}
                          onChange={handleChange}
                          placeholder="120"
                        />
                      </div>

                      <div className="movie-field-full">
                        <label className="movie-label">Fecha estreno</label>
                        <input
                          className="movie-input"
                          name="fecha_estreno"
                          type="date"
                          value={form.fecha_estreno}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="movie-next-button"
                    onClick={() => openNext("poster")}
                  >
                    Continuar con poster
                  </button>
                </MovieSection>

                <MovieSection
                  id="poster"
                  number="02"
                  title="Poster de la pelicula"
                  description="Agrega una imagen para mostrarla en el catalogo."
                  isOpen={openSections.poster}
                  onToggle={toggleSection}
                >
                  <div className="movie-poster-layout">
                    <div className="movie-poster-preview">
                      {preview ? <img src={preview} alt="Poster" /> : <span>Sin poster</span>}
                    </div>

                    <div className="movie-file-card">
                      <h3 className="movie-file-title">Imagen principal</h3>
                      <p className="movie-file-text">
                        Selecciona una imagen vertical. Se usara como poster de la pelicula dentro del sistema.
                      </p>

                      <label className="movie-file-button" htmlFor="poster">
                        Seleccionar poster
                      </label>

                      <input
                        id="poster"
                        className="movie-file-hidden"
                        type="file"
                        name="poster"
                        accept="image/*"
                        onChange={handleChange}
                      />

                      <div className="movie-file-name">
                        {posterName || "Ningun archivo seleccionado"}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="movie-next-button"
                    onClick={() => openNext("opciones")}
                  >
                    Continuar con opciones
                  </button>
                </MovieSection>

                <MovieSection
                  id="opciones"
                  number="03"
                  title="Opciones de cartelera"
                  description="Clasificacion, idioma, formato y estado."
                  isOpen={openSections.opciones}
                  onToggle={toggleSection}
                >
                  <div className="movie-inside-card">
                    <h3 className="movie-inside-title">Datos de presentacion</h3>
                    <p className="movie-inside-text">
                      Estas opciones controlan como se muestra la pelicula al usuario.
                    </p>

                    <div className="movie-form-grid">
                      <div>
                        <label className="movie-label">Clasificacion</label>
                        <select
                          className="movie-select"
                          name="clasificacion"
                          value={form.clasificacion}
                          onChange={handleChange}
                        >
                          {clasificacionOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="movie-label">Idioma</label>
                        <select
                          className="movie-select"
                          name="idioma"
                          value={form.idioma}
                          onChange={handleChange}
                        >
                          {idiomaOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="movie-field-full">
                        <label className="movie-label">Formato</label>
                        <select
                          className="movie-select"
                          name="formato"
                          value={form.formato}
                          onChange={handleChange}
                        >
                          {formatoOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="movie-field-full">
                        <div className="movie-state-card">
                          <div>
                            <h3>Estado de la pelicula</h3>
                            <p>
                              Si esta activa, aparecera disponible en el sistema.
                            </p>
                          </div>

                          <button
                            type="button"
                            className={`movie-switch ${form.estado ? "movie-switch-on" : ""}`}
                            onClick={setEstado}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="movie-next-button"
                    onClick={() => openNext("sinopsis")}
                  >
                    Continuar con sinopsis
                  </button>
                </MovieSection>

                <MovieSection
                  id="sinopsis"
                  number="04"
                  title="Sinopsis"
                  description="Describe brevemente el contenido de la pelicula."
                  isOpen={openSections.sinopsis}
                  onToggle={toggleSection}
                >
                  <div className="movie-inside-card">
                    <h3 className="movie-inside-title">Descripcion para el catalogo</h3>
                    <p className="movie-inside-text">
                      Escribe una sinopsis clara para que el usuario entienda de que trata la pelicula.
                    </p>

                    <label className="movie-label">Sinopsis</label>
                    <textarea
                      className="movie-textarea"
                      name="sinopsis"
                      value={form.sinopsis}
                      onChange={handleChange}
                      placeholder="Escribe una breve sinopsis de la pelicula"
                    />
                  </div>

                  <button
                    type="button"
                    className="movie-next-button"
                    onClick={() => openNext("resumen")}
                  >
                    Revisar resumen
                  </button>
                </MovieSection>

                <MovieSection
                  id="resumen"
                  number="05"
                  title="Revision final"
                  description="Confirma los datos antes de guardar."
                  isOpen={openSections.resumen}
                  onToggle={toggleSection}
                >
                  <div className="movie-inside-card">
                    <h3 className="movie-inside-title">Confirmacion de datos</h3>
                    <p className="movie-inside-text">
                      Revisa que todo este correcto antes de guardar la pelicula en la base de datos.
                    </p>

                    <div className="movie-form-grid">
                      <div>
                        <label className="movie-label">Titulo</label>
                        <input
                          className="movie-input"
                          value={form.titulo || "Sin titulo"}
                          readOnly
                        />
                      </div>

                      <div>
                        <label className="movie-label">Genero</label>
                        <input
                          className="movie-input"
                          value={form.genero}
                          readOnly
                        />
                      </div>

                      <div>
                        <label className="movie-label">Duracion</label>
                        <input
                          className="movie-input"
                          value={form.duracion ? `${form.duracion} min` : "Sin duracion"}
                          readOnly
                        />
                      </div>

                      <div>
                        <label className="movie-label">Estado</label>
                        <input
                          className="movie-input"
                          value={form.estado ? "Activa" : "Inactiva"}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </MovieSection>
              </div>

              <aside className="movie-summary-card">
                <div className="movie-summary-head">
                  <h2>Vista previa</h2>
                  <p>
                    Asi se vera la informacion principal antes de guardar.
                  </p>
                </div>

                <div className="movie-summary-body">
                  <div className="movie-summary-poster">
                    {preview ? <img src={preview} alt="Poster" /> : <span>Sin poster</span>}
                  </div>

                  <h3 className="movie-summary-title">
                    {form.titulo || "Titulo de la pelicula"}
                  </h3>

                  <div className="movie-summary-tags">
                    <span className="movie-tag movie-tag-dark">{form.genero}</span>
                    <span className="movie-tag">{form.clasificacion}</span>
                    <span className="movie-tag">{form.idioma}</span>
                    <span className="movie-tag">{form.formato}</span>
                    <span className="movie-tag">{form.estado ? "Activa" : "Inactiva"}</span>
                  </div>

                  <div className="movie-summary-line">
                    <span>Duracion</span>
                    <span>{form.duracion ? `${form.duracion} min` : "-"}</span>
                  </div>

                  <div className="movie-summary-line">
                    <span>Fecha estreno</span>
                    <span>{form.fecha_estreno || "-"}</span>
                  </div>

                  <div className="movie-summary-line">
                    <span>Poster</span>
                    <span>{posterName ? "Cargado" : "Sin poster"}</span>
                  </div>

                  <button type="submit" className="movie-submit" disabled={saving}>
                    {saving ? "Guardando..." : "Guardar pelicula"}
                  </button>

                  <button
                    type="button"
                    className="movie-cancel"
                    onClick={() => navigate("/control-panel/peliculas")}
                  >
                    Cancelar
                  </button>
                </div>
              </aside>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}