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
    password: "",
    rol: "cliente",
    estado: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
        password: "",
        rol: data.rol === "admin" ? "admin" : "cliente",
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

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo.trim())) {
      return "Ingrese un correo valido";
    }

    if (form.rol === "cliente" && !form.telefono.trim()) {
      return "El telefono es obligatorio";
    }

    if (form.telefono.trim() && !/^[0-9]+$/.test(form.telefono.trim())) {
      return "El telefono solo debe contener numeros";
    }

    if (form.password && form.password.length < 6) {
      return "La contrasena debe tener al menos 6 caracteres";
    }

    if (form.password && (!/[A-Za-z]/.test(form.password) || !/[0-9]/.test(form.password))) {
      return "La contrasena debe incluir letra y numero";
    }

    return "";
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

      const payload = {
        nombre: form.nombre.trim(),
        correo: form.correo.trim(),
        telefono: form.telefono.trim(),
        direccion: form.direccion.trim(),
        rol: form.rol,
        estado: form.estado,
      };

      if (form.password) {
        payload.password = form.password;
      }

      await updateUsuario(id, payload);

      navigate("/control-panel/usuarios", {
        state: {
          message: `El usuario ${form.nombre} se actualizo correctamente`,
        },
      });
    } catch (errorResponse) {
      const data = errorResponse.response?.data;

      if (data?.errors) {
        const firstKey = Object.keys(data.errors)[0];
        setError(data.errors[firstKey][0]);
      } else {
        setError(data?.message || "No se pudo actualizar el usuario");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style>{`
        .usuario-form-page {
          min-height: calc(100vh - 90px);
          background: #f3fbf6;
          padding: 44px 24px;
          font-family: "Segoe UI", Arial, sans-serif;
        }

        .usuario-form-card {
          max-width: 760px;
          margin: 0 auto;
          background: #ffffff;
          border: 1px solid #dcefe4;
          border-radius: 24px;
          padding: 34px;
          box-shadow: 0 18px 48px rgba(0, 100, 38, 0.1);
        }

        .usuario-form-title {
          margin: 0;
          font-size: 34px;
          color: #102319;
          font-weight: 500;
        }

        .usuario-form-subtitle {
          color: #6c8f76;
          margin: 10px 0 28px;
          font-weight: 500;
        }

        .usuario-form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
        }

        .usuario-field-full {
          grid-column: 1 / -1;
        }

        .usuario-label {
          display: block;
          margin-bottom: 8px;
          color: #365940;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .usuario-input,
        .usuario-select {
          width: 100%;
          height: 54px;
          border: 1.5px solid #d4e8d9;
          border-radius: 15px;
          background: #f1f8f4;
          padding: 0 16px;
          color: #102319;
          font-size: 15px;
          font-weight: 600;
          outline: none;
        }

        .usuario-input:focus,
        .usuario-select:focus {
          border-color: #009c29;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(0, 156, 41, 0.12);
        }

        .usuario-alert {
          margin-bottom: 18px;
          padding: 13px 16px;
          border-radius: 14px;
          background: #fff0f0;
          border: 1px solid #ffc7c7;
          color: #c62828;
          font-weight: 700;
          text-align: center;
        }

        .usuario-check {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #365940;
          font-weight: 700;
        }

        .usuario-form-actions {
          display: flex;
          gap: 12px;
          margin-top: 28px;
        }

        .usuario-submit,
        .usuario-cancel {
          height: 54px;
          border-radius: 15px;
          padding: 0 24px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
        }

        .usuario-submit {
          border: none;
          background: #009c29;
          color: #ffffff;
          box-shadow: 0 14px 28px rgba(0, 156, 41, 0.22);
        }

        .usuario-cancel {
          border: 1px solid #bfe8ca;
          background: #ffffff;
          color: #009c29;
        }

        .usuario-loading {
          max-width: 760px;
          margin: 0 auto;
          background: #ffffff;
          border: 1px solid #dcefe4;
          border-radius: 24px;
          padding: 34px;
          color: #6c8f76;
          font-weight: 700;
        }

        @media (max-width: 760px) {
          .usuario-form-grid {
            grid-template-columns: 1fr;
          }

          .usuario-form-actions {
            flex-direction: column;
          }
        }
      `}</style>

      <section className="usuario-form-page">
        {loading ? (
          <div className="usuario-loading">Cargando usuario...</div>
        ) : (
          <div className="usuario-form-card">
            <h1 className="usuario-form-title">Editar usuario</h1>
            <p className="usuario-form-subtitle">
              Actualiza los datos del usuario seleccionado.
            </p>

            {error && <div className="usuario-alert">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="usuario-form-grid">
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
                    type="email"
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
                    <option value="cliente">Cliente</option>
                    <option value="admin">Administrador</option>
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

                <label className="usuario-check">
                  <input
                    type="checkbox"
                    name="estado"
                    checked={form.estado}
                    onChange={handleChange}
                  />
                  Usuario activo
                </label>
              </div>

              <div className="usuario-form-actions">
                <button type="submit" className="usuario-submit" disabled={saving}>
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
          </div>
        )}
      </section>
    </>
  );
}