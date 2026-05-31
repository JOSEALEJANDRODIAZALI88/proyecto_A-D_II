import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/panel.css";

/* ────────────────────────────────────────────── */
/* Dummy Data */
/* ────────────────────────────────────────────── */

const DUMMY_USUARIOS = [
  {
    id: 1,
    username: "admin",
    tipo: "Administrador",
    cargo: "Administrador General",
    estado: true,
  },
  {
    id: 2,
    username: "juanperez",
    tipo: "Cliente",
    telefono: "77712345",
    direccion: "Av. América",
    estado: true,
  },
  {
    id: 3,
    username: "maria",
    tipo: "Cliente",
    telefono: "76543210",
    direccion: "Zona Norte",
    estado: true,
  },
];

/* ────────────────────────────────────────────── */
/* Icons */
/* ────────────────────────────────────────────── */

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

/* ────────────────────────────────────────────── */
/* Delete Modal */
/* ────────────────────────────────────────────── */

function DeleteModal({ usuario, onConfirm, onCancel }) {
  return (
    <>
      <div
        onClick={onCancel}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.4)",
          zIndex: 300,
        }}
      />

      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 301,
        }}
      >
        <div
          className="panel-card"
          style={{
            width: "100%",
            maxWidth: 420,
            padding: 30,
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              marginBottom: 10,
            }}
          >
            Eliminar Usuario
          </h2>

          <p style={{ color: "var(--ink-muted)" }}>
            ¿Deseas eliminar al usuario?
          </p>

          <p
            style={{
              marginTop: 10,
              marginBottom: 25,
              fontWeight: 700,
            }}
          >
            {usuario.username}
          </p>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="panel-btn panel-btn-outline"
              onClick={onCancel}
              style={{ flex: 1 }}
            >
              Cancelar
            </button>

            <button
              className="panel-btn panel-btn-danger"
              onClick={() => onConfirm(usuario.id)}
              style={{ flex: 1 }}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ────────────────────────────────────────────── */
/* Main */
/* ────────────────────────────────────────────── */

export default function UsuariosList() {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState(DUMMY_USUARIOS);
  const [toDelete, setToDelete] = useState(null);

  const activos = usuarios.filter((u) => u.estado);

  const handleDelete = (id) => {
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, estado: false }
          : u
      )
    );

    setToDelete(null);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 28,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h1 className="panel-page-title">
            Lista de Usuarios
          </h1>

          <p className="panel-page-subtitle">
            {activos.length} usuario
            {activos.length !== 1 ? "s" : ""}
            {" "}activo
            {activos.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div style={{ display: "flex", gap: 10,alignItems: "flex-start", }}>
          <button
            className="panel-btn panel-btn-outline"
          >
            <RefreshIcon />
            Refrescar
          </button>

          <button
            className="panel-btn panel-btn-primary"
            onClick={() =>
              navigate("/control-panel/usuarios/nuevo")
            }
          >
            <PlusIcon />
            Añadir usuario
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {activos.map((usuario, idx) => (
          <UsuarioRow
            key={usuario.id}
            usuario={usuario}
            idx={idx}
            onEdit={() =>
              navigate(
                `/control-panel/usuarios/editar/${usuario.id}`
              )
            }
            onDelete={() => setToDelete(usuario)}
          />
        ))}
      </div>

      {toDelete && (
        <DeleteModal
          usuario={toDelete}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </>
  );
}

/* ────────────────────────────────────────────── */
/* Row */
/* ────────────────────────────────────────────── */

function UsuarioRow({
  usuario,
  idx,
  onEdit,
  onDelete,
}) {
  const color =
    usuario.tipo === "Administrador"
      ? "#00571a"
      : "#006699";

  return (
    <div
      className="panel-card"
      style={{
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: 4,
          alignSelf: "stretch",
          background: color,
        }}
      />

      <span
        style={{
          padding: "0 18px",
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 22,
          color: "var(--border)",
          minWidth: 52,
          textAlign: "center",
        }}
      >
        {String(idx + 1).padStart(2, "0")}
      </span>

      <div
        style={{
          flex: 1,
          padding: "18px 0",
        }}
      >
        <p
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 20,
            marginBottom: 6,
          }}
        >
          {usuario.username}
        </p>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <span
            style={{
              background: color,
              color: "white",
              padding: "4px 10px",
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {usuario.tipo}
          </span>

          {usuario.tipo === "Cliente" && (
            <>
              <span style={{ color: "var(--ink-muted)" }}>
                📞 {usuario.telefono}
              </span>

              <span style={{ color: "var(--ink-muted)" }}>
                📍 {usuario.direccion}
              </span>
            </>
          )}

          {usuario.tipo === "Administrador" && (
            <span style={{ color: "var(--ink-muted)" }}>
              {usuario.cargo}
            </span>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "0 20px",
        }}
      >
        <button
          className="panel-btn panel-btn-outline"
          onClick={onEdit}
        >
          <EditIcon />
          Editar
        </button>

        <button
          className="panel-btn panel-btn-danger"
          onClick={onDelete}
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}