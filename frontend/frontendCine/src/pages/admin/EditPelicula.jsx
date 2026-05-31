import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPeliculaById, updatePelicula } from "../../services/peliculaService";
import "../../styles/panel.css";

const API_HOST = "http://127.0.0.1:8000";

const GENEROS = [
  "Accion",
  "Aventura",
  "Comedia",
  "Drama",
  "Romance",
  "Terror",
  "Suspenso",
  "Thriller",
  "Ciencia Ficcion",
  "Fantasia",
  "Animacion",
  "Documental",
];

const CLASIFICACIONES = [
  "ATP",
  "PG",
  "PG-13",
  "R",
  "NC-17",
  "+12",
  "+15",
  "+18",
];

const IDIOMAS = [
  "Espanol",
  "Ingles",
  "Portugues",
  "Frances",
  "Japones",
  "Coreano",
  "Subtitulado",
  "Doblado",
];

const FORMATOS = [
  "2D",
  "3D",
  "IMAX",
  "4DX",
  "VIP",
];

const INITIAL_FORM = {
  titulo: "",
  genero: "",
  duracion: "",
  clasificacion: "",
  sinopsis: "",
  idioma: "",
  formato: "",
  fecha_estreno: "",
  estado: true,
  poster: null,
};

const getPosterUrl = (poster) => {
  if (!poster) {
    return "";
  }

  if (poster.startsWith("http")) {
    return poster;
  }

  return `${API_HOST}${poster}`;
};

export default function EditPelicula() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState(INITIAL_FORM);
  const [posterPreview, setPosterPreview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const cargarPelicula = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getPeliculaById(id);

      setForm({
        titulo: data.titulo || "",
        genero: data.genero || "",
        duracion: data.duracion || "",
        clasificacion: data.clasificacion || "",
        sinopsis: data.sinopsis || "",
        idioma: data.idioma || "",
        formato: data.formato || "",
        fecha_estreno: data.fecha_estreno || "",
        estado: data.estado !== false,
        poster: null,
      });

      setPosterPreview(getPosterUrl(data.poster));
    } catch {
      setError("No se pudo cargar la pelicula");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files && files.length > 0 ? files[0] : null;

      setForm((prev) => ({
        ...prev,
        poster: file,
      }));

      setPosterPreview(file ? URL.createObjectURL(file) : posterPreview);
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validar = () => {
    if (!form.titulo.trim()) {
      return "El titulo es obligatorio";
    }

    if (!form.genero.trim()) {
      return "Seleccione un genero";
    }

    if (!form.duracion || Number(form.duracion) <= 0) {
      return "La duracion debe ser mayor a 0";
    }

    if (!form.clasificacion.trim()) {
      return "Seleccione una clasificacion";
    }

    if (!form.idioma.trim()) {
      return "Seleccione un idioma";
    }

    if (!form.formato.trim()) {
      return "Seleccione un formato";
    }

    if (!form.fecha_estreno) {
      return "La fecha de estreno es obligatoria";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validar();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);

    try {
      await updatePelicula(id, {
        ...form,
        duracion: Number(form.duracion),
      });

      navigate("/control-panel/peliculas", {
        state: {
          message: `La pelicula "${form.titulo}" se actualizo correctamente`,
        },
      });
    } catch (error) {
      const backendError = error.response?.data;

      if (backendError) {
        setError(JSON.stringify(backendError));
      } else {
        setError("No se pudo actualizar la pelicula");
      }
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    cargarPelicula();
  }, [id]);

  if (loading) {
    return (
      <div className="panel-card" style={{ padding: 28 }}>
        Cargando pelicula...
      </div>
    );
  }

  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <h1 className="panel-page-title">Editar pelicula</h1>
        <p className="panel-page-subtitle">
          Actualiza los datos de la pelicula seleccionada.
        </p>
      </div>

      <div className="panel-card" style={{ padding: 28 }}>
        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 18 }}>
          <div style={mainGridStyle}>
            <div>
              <label style={labelStyle}>Poster</label>

              <label style={posterBoxStyle}>
                {posterPreview ? (
                  <img
                    src={posterPreview}
                    alt="Poster"
                    style={posterImageStyle}
                  />
                ) : (
                  <span style={posterTextStyle}>
                    Seleccionar poster
                  </span>
                )}

                <input
                  type="file"
                  name="poster"
                  accept="image/*"
                  onChange={handleChange}
                  style={{ display: "none" }}
                />
              </label>
            </div>

            <div style={{ display: "grid", gap: 18 }}>
              <div style={twoColumnStyle}>
                <FormField
                  label="Titulo"
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                />

                <FormSelect
                  label="Genero"
                  name="genero"
                  value={form.genero}
                  onChange={handleChange}
                  options={GENEROS}
                />
              </div>

              <div style={twoColumnStyle}>
                <FormField
                  label="Duracion"
                  name="duracion"
                  type="number"
                  value={form.duracion}
                  onChange={handleChange}
                />

                <FormSelect
                  label="Clasificacion"
                  name="clasificacion"
                  value={form.clasificacion}
                  onChange={handleChange}
                  options={CLASIFICACIONES}
                />
              </div>

              <div style={twoColumnStyle}>
                <FormSelect
                  label="Idioma"
                  name="idioma"
                  value={form.idioma}
                  onChange={handleChange}
                  options={IDIOMAS}
                />

                <FormSelect
                  label="Formato"
                  name="formato"
                  value={form.formato}
                  onChange={handleChange}
                  options={FORMATOS}
                />
              </div>

              <div style={twoColumnStyle}>
                <FormField
                  label="Fecha estreno"
                  name="fecha_estreno"
                  type="date"
                  value={form.fecha_estreno}
                  onChange={handleChange}
                />

                <FormSelectEstado
                  label="Estado"
                  name="estado"
                  value={form.estado}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      estado: e.target.value === "true",
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Sinopsis</label>
            <textarea
              name="sinopsis"
              value={form.sinopsis}
              onChange={handleChange}
              rows="5"
              style={textAreaStyle}
            />
          </div>

          <div style={buttonsBoxStyle}>
            <button
              type="button"
              className="panel-btn panel-btn-outline"
              onClick={() => navigate("/control-panel/peliculas")}
              disabled={saving}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="panel-btn panel-btn-primary"
              disabled={saving}
            >
              {saving ? "Actualizando..." : "Actualizar pelicula"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

function FormField({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        style={inputStyle}
      />
    </div>
  );
}

function FormSelect({ label, name, value, onChange, options }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        style={inputStyle}
      >
        <option value="">Seleccione una opcion</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function FormSelectEstado({ label, name, value, onChange }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <select
        name={name}
        value={String(value)}
        onChange={onChange}
        style={inputStyle}
      >
        <option value="true">Activa</option>
        <option value="false">Inactiva</option>
      </select>
    </div>
  );
}

const mainGridStyle = {
  display: "grid",
  gridTemplateColumns: "220px 1fr",
  gap: 22,
  alignItems: "start",
};

const twoColumnStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 18,
};

const labelStyle = {
  display: "block",
  marginBottom: 8,
  color: "var(--ink-soft)",
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
};

const inputStyle = {
  width: "100%",
  height: 46,
  border: "1.5px solid var(--border)",
  borderRadius: 12,
  padding: "0 14px",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 14,
  outline: "none",
  background: "#ffffff",
};

const textAreaStyle = {
  width: "100%",
  border: "1.5px solid var(--border)",
  borderRadius: 12,
  padding: 14,
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 14,
  outline: "none",
  resize: "vertical",
  background: "#ffffff",
};

const posterBoxStyle = {
  width: "100%",
  height: 310,
  border: "1.5px dashed var(--border)",
  borderRadius: 18,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  cursor: "pointer",
  background: "var(--surface-2)",
};

const posterImageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const posterTextStyle = {
  color: "var(--ink-muted)",
  fontWeight: 700,
  textAlign: "center",
};

const buttonsBoxStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 12,
};

const errorStyle = {
  marginBottom: 18,
  color: "#c0392b",
  fontWeight: 700,
};