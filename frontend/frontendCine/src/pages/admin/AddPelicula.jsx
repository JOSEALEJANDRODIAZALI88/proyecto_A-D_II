import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPelicula } from "../../services/peliculaService.js";

export default function AddPelicula() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    titulo: "",
    genero: "",
    sinopsis: "",
    duracion: "",
    clasificacion: "Mayores de 13",
    idioma: "Doblada",
    formato: "2D",
    fecha_estreno: "",
    estado: true,
    poster: null,
  });

  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked, files } = event.target;

    if (type === "file") {
      const file = files[0];

      setForm((currentForm) => ({
        ...currentForm,
        poster: file || null,
      }));

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

  const validateForm = () => {
    if (!form.titulo.trim()) {
      return "El titulo es obligatorio";
    }

    if (!form.genero.trim()) {
      return "El genero es obligatorio";
    }

    if (!form.sinopsis.trim()) {
      return "La sinopsis es obligatoria";
    }

    if (!form.duracion || Number(form.duracion) <= 0) {
      return "La duracion debe ser mayor a 0";
    }

    if (!form.fecha_estreno) {
      return "La fecha de estreno es obligatoria";
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
        .pelicula-form-page {
          min-height: calc(100vh - 90px);
          background: #f3fbf6;
          padding: 44px 24px;
          font-family: "Segoe UI", Arial, sans-serif;
        }

        .pelicula-form-card {
          max-width: 900px;
          margin: 0 auto;
          background: #ffffff;
          border: 1px solid #dcefe4;
          border-radius: 24px;
          padding: 34px;
          box-shadow: 0 18px 48px rgba(0, 100, 38, 0.1);
        }

        .pelicula-form-title {
          margin: 0;
          font-size: 34px;
          color: #102319;
          font-weight: 500;
          letter-spacing: 1px;
        }

        .pelicula-form-subtitle {
          color: #6c8f76;
          margin: 10px 0 28px;
          font-weight: 500;
        }

        .pelicula-alert {
          margin-bottom: 18px;
          padding: 13px 16px;
          border-radius: 14px;
          background: #fff0f0;
          border: 1px solid #ffc7c7;
          color: #c62828;
          font-weight: 700;
          text-align: center;
        }

        .pelicula-form-grid {
          display: grid;
          grid-template-columns: 180px 1fr 1fr;
          gap: 18px;
          align-items: start;
        }

        .pelicula-poster-box {
          grid-row: span 5;
        }

        .pelicula-poster-preview {
          width: 100%;
          height: 250px;
          border: 1.5px dashed #bfe8ca;
          border-radius: 18px;
          background: #f1f8f4;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          color: #6c8f76;
          font-weight: 800;
          text-align: center;
          margin-bottom: 12px;
        }

        .pelicula-poster-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pelicula-field-full {
          grid-column: 2 / -1;
        }

        .pelicula-label {
          display: block;
          margin-bottom: 8px;
          color: #365940;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .pelicula-input,
        .pelicula-select,
        .pelicula-textarea {
          width: 100%;
          border: 1.5px solid #d4e8d9;
          border-radius: 15px;
          background: #f1f8f4;
          padding: 0 16px;
          color: #102319;
          font-size: 15px;
          font-weight: 600;
          outline: none;
          font-family: "Segoe UI", Arial, sans-serif;
        }

        .pelicula-input,
        .pelicula-select {
          height: 54px;
        }

        .pelicula-textarea {
          min-height: 132px;
          padding-top: 15px;
          resize: vertical;
        }

        .pelicula-input:focus,
        .pelicula-select:focus,
        .pelicula-textarea:focus {
          border-color: #009c29;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(0, 156, 41, 0.12);
        }

        .pelicula-file {
          width: 100%;
          color: #365940;
          font-weight: 700;
        }

        .pelicula-check {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #365940;
          font-weight: 700;
          height: 54px;
        }

        .pelicula-form-actions {
          display: flex;
          gap: 12px;
          margin-top: 30px;
        }

        .pelicula-submit,
        .pelicula-cancel {
          height: 54px;
          border-radius: 15px;
          padding: 0 24px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
        }

        .pelicula-submit {
          border: none;
          background: #009c29;
          color: #ffffff;
          box-shadow: 0 14px 28px rgba(0, 156, 41, 0.22);
        }

        .pelicula-submit:hover {
          background: #008425;
        }

        .pelicula-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .pelicula-cancel {
          border: 1px solid #bfe8ca;
          background: #ffffff;
          color: #009c29;
        }

        .pelicula-cancel:hover {
          background: #effaf2;
        }

        @media (max-width: 860px) {
          .pelicula-form-grid {
            grid-template-columns: 1fr;
          }

          .pelicula-poster-box {
            grid-row: auto;
          }

          .pelicula-field-full {
            grid-column: auto;
          }

          .pelicula-form-actions {
            flex-direction: column;
          }
        }
      `}</style>

      <section className="pelicula-form-page">
        <div className="pelicula-form-card">
          <h1 className="pelicula-form-title">Anadir pelicula</h1>
          <p className="pelicula-form-subtitle">
            Registra una nueva pelicula en la cartelera del sistema.
          </p>

          {error && <div className="pelicula-alert">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="pelicula-form-grid">
              <div className="pelicula-poster-box">
                <label className="pelicula-label">Poster</label>
                <div className="pelicula-poster-preview">
                  {preview ? <img src={preview} alt="Poster" /> : <span>Sin poster</span>}
                </div>
                <input
                  className="pelicula-file"
                  type="file"
                  name="poster"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>

              <div className="pelicula-field-full">
                <label className="pelicula-label">Titulo</label>
                <input
                  className="pelicula-input"
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                  placeholder="Ej. Avatar"
                />
              </div>

              <div>
                <label className="pelicula-label">Genero</label>
                <input
                  className="pelicula-input"
                  name="genero"
                  value={form.genero}
                  onChange={handleChange}
                  placeholder="Ej. Accion"
                />
              </div>

              <div>
                <label className="pelicula-label">Duracion</label>
                <input
                  className="pelicula-input"
                  name="duracion"
                  type="number"
                  min="1"
                  value={form.duracion}
                  onChange={handleChange}
                  placeholder="120"
                />
              </div>

              <div>
                <label className="pelicula-label">Clasificacion</label>
                <select
                  className="pelicula-select"
                  name="clasificacion"
                  value={form.clasificacion}
                  onChange={handleChange}
                >
                  <option value="Todo publico">Todo publico</option>
                  <option value="Mayores de 13">Mayores de 13</option>
                  <option value="Mayores de 16">Mayores de 16</option>
                  <option value="Mayores de 18">Mayores de 18</option>
                </select>
              </div>

              <div>
                <label className="pelicula-label">Idioma</label>
                <select
                  className="pelicula-select"
                  name="idioma"
                  value={form.idioma}
                  onChange={handleChange}
                >
                  <option value="Doblada">Doblada</option>
                  <option value="Subtitulada">Subtitulada</option>
                  <option value="Original">Original</option>
                </select>
              </div>

              <div>
                <label className="pelicula-label">Formato</label>
                <select
                  className="pelicula-select"
                  name="formato"
                  value={form.formato}
                  onChange={handleChange}
                >
                  <option value="2D">2D</option>
                  <option value="3D">3D</option>
                  <option value="IMAX">IMAX</option>
                </select>
              </div>

              <div>
                <label className="pelicula-label">Fecha estreno</label>
                <input
                  className="pelicula-input"
                  name="fecha_estreno"
                  type="date"
                  value={form.fecha_estreno}
                  onChange={handleChange}
                />
              </div>

              <label className="pelicula-check">
                <input
                  type="checkbox"
                  name="estado"
                  checked={form.estado}
                  onChange={handleChange}
                />
                Pelicula activa
              </label>

              <div className="pelicula-field-full">
                <label className="pelicula-label">Sinopsis</label>
                <textarea
                  className="pelicula-textarea"
                  name="sinopsis"
                  value={form.sinopsis}
                  onChange={handleChange}
                  placeholder="Escribe una breve sinopsis de la pelicula"
                />
              </div>
            </div>

            <div className="pelicula-form-actions">
              <button type="submit" className="pelicula-submit" disabled={saving}>
                {saving ? "Guardando..." : "Guardar pelicula"}
              </button>

              <button
                type="button"
                className="pelicula-cancel"
                onClick={() => navigate("/control-panel/peliculas")}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}