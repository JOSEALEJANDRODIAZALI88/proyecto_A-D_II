import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUsuarioById, updateUsuario } from "../../services/usuarioService.js";

export default function EditUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    direccion: "",
    rol: "Cliente",
    password: "",
    estado: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const normalizeRol = (rol) => {
    const value = String(rol || "").toLowerCase();

    if (value === "admin" || value === "administrador") {
      return "Administrador";
    }

    return "Cliente";
  };

  const loadUsuario = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getUsuarioById(id);

      setForm({
        nombre: data.nombre || "",
        correo: data.correo || "",
        telefono: data.telefono || "",
        direccion: data.direccion || "",
        rol: normalizeRol(data.rol),
        password: "",
        estado: Boolean(data.estado),
      });
    } catch (errorResponse) {
      setError("No se pudo cargar el usuario");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsuario();
  }, [id]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  };

  const validateForm = () => {
    if (!form.nombre.trim()) {
      return "El nombre es obligatorio";
    }

    if (!form.correo.trim()) {
      return "El correo es obligatorio";
    }

    if (!form.correo.includes("@") || !form.correo.includes(".")) {
      return "El correo no tiene formato valido";
    }

    if (!form.telefono.trim()) {
      return "El telefono es obligatorio";
    }

    if (form.password.trim() && form.password.trim().length < 6) {
      return "La contrasena debe tener al menos 6 caracteres";
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

    return "No se pudo actualizar el usuario";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      nombre: form.nombre.trim(),
      correo: form.correo.trim(),
      telefono: form.telefono.trim(),
      direccion: form.direccion.trim(),
      rol: form.rol,
      estado: form.estado,
    };

    if (form.password.trim()) {
      payload.password = form.password.trim();
    }

    try {
      setSaving(true);
      setError("");

      await updateUsuario(id, payload);

      navigate("/control-panel/usuarios");
    } catch (errorResponse) {
      setError(getErrorMessage(errorResponse));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style>{`
        .usuario-form-page {
          min-height: calc(100vh - 92px);
          background:
            radial-gradient(circle at 0% 0%, rgba(0, 156, 41, 0.07), transparent 28%),
            radial-gradient(circle at 100% 100%, rgba(0, 156, 41, 0.08), transparent 32%),
            #f3fbf6;
          padding: 46px 28px 110px;
          font-family: "Segoe UI", Arial, sans-serif;
        }

        .usuario-form-card {
          max-width: 820px;
          margin: 0 auto;
          background: #ffffff;
          border: 1px solid #dcefe4;
          border-radius: 24px;
          padding: 36px;
          box-shadow: 0 18px 48px rgba(0, 100, 38, 0.1);
        }

        .usuario-title {
          margin: 0;
          color: #102319;
          font-size: 34px;
          font-weight: 600;
          letter-spacing: 1.5px;
        }

        .usuario-subtitle {
          margin: 12px 0 28px;
          color: #5f8a68;
          font-size: 16px;
          font-weight: 600;
        }

        .usuario-alert {
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

        .usuario-loading {
          color: #5f8a68;
          font-weight: 800;
          padding: 20px 0;
        }

        .usuario-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }

        .usuario-field-full {
          grid-column: 1 / -1;
        }

        .usuario-label {
          display: block;
          margin-bottom: 9px;
          color: #234b2c;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .usuario-input,
        .usuario-select {
          width: 100%;
          height: 58px;
          border: 1.5px solid #d4e8d9;
          border-radius: 18px;
          background: #f1f8f4;
          color: #102319;
          font-size: 16px;
          font-weight: 650;
          outline: none;
          font-family: "Segoe UI", Arial, sans-serif;
          padding: 0 18px;
          transition: 0.18s ease;
        }

        .usuario-input:focus,
        .usuario-select:focus {
          border-color: #009c29;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(0, 156, 41, 0.12);
        }

        .usuario-check {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 20px;
          color: #234b2c;
          font-size: 15px;
          font-weight: 900;
        }

        .usuario-check input {
          width: 17px;
          height: 17px;
          accent-color: #009c29;
        }

        .usuario-actions {
          display: flex;
          gap: 14px;
          margin-top: 30px;
        }

        .usuario-save,
        .usuario-cancel {
          height: 56px;
          border-radius: 16px;
          padding: 0 28px;
          font-size: 15px;
          font-weight: 900;
          cursor: pointer;
          transition: 0.18s ease;
        }

        .usuario-save {
          border: none;
          background: #009c29;
          color: #ffffff;
          box-shadow: 0 14px 28px rgba(0, 156, 41, 0.22);
        }

        .usuario-save:hover {
          background: #008425;
        }

        .usuario-save:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .usuario-cancel {
          border: 1.5px solid #bfe8ca;
          background: #ffffff;
          color: #009c29;
        }

        .usuario-cancel:hover {
          background: #effaf2;
        }

        @media (max-width: 720px) {
          .usuario-form-page {
            padding: 28px 18px 100px;
          }

          .usuario-form-card {
            padding: 24px;
          }

          .usuario-grid {
            grid-template-columns: 1fr;
          }

          .usuario-actions {
            flex-direction: column;
          }

          .usuario-save,
          .usuario-cancel {
            width: 100%;
          }
        }
      `}</style>

      <section className="usuario-form-page">
        <div className="usuario-form-card">
          <h1 className="usuario-title">Editar usuario</h1>
          <p className="usuario-subtitle">
            Actualiza los datos del usuario seleccionado.
          </p>

          {error && <div className="usuario-alert">{error}</div>}

          {loading ? (
            <div className="usuario-loading">Cargando usuario...</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="usuario-grid">
                <div className="usuario-field-full">
                  <label className="usuario-label">Nombre completo</label>
                  <input
                    className="usuario-input"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="usuario-label">Correo electronico</label>
                  <input
                    className="usuario-input"
                    name="correo"
                    value={form.correo}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="usuario-label">Telefono</label>
                  <input
                    className="usuario-input"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="usuario-label">Rol</label>
                  <select
                    className="usuario-select"
                    name="rol"
                    value={form.rol}
                    onChange={handleChange}
                  >
                    <option value="Cliente">Cliente</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                </div>

                <div>
                  <label className="usuario-label">Nueva contrasena</label>
                  <input
                    className="usuario-input"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Opcional"
                  />
                </div>

                <div className="usuario-field-full">
                  <label className="usuario-label">Direccion</label>
                  <input
                    className="usuario-input"
                    name="direccion"
                    value={form.direccion}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <label className="usuario-check">
                <input
                  type="checkbox"
                  name="estado"
                  checked={form.estado}
                  onChange={handleChange}
                />
                Usuario activo
              </label>

              <div className="usuario-actions">
                <button type="submit" className="usuario-save" disabled={saving}>
                  {saving ? "Actualizando..." : "Actualizar usuario"}
                </button>

                <button
                  type="button"
                  className="usuario-cancel"
                  onClick={() => navigate("/control-panel/usuarios")}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
}