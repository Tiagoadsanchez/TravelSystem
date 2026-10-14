"use client";

import { useEffect, useState } from "react";
import {
  listarCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "@/lib/data/categorias";
import { useConfirm } from "@/components/ConfirmProvider";
import type { Categoria } from "@/lib/types";

const COLOR_POR_DEFECTO = "#0e8c8c";

export default function CategoriasPage() {
  const confirmar = useConfirm();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [nombre, setNombre] = useState("");
  const [color, setColor] = useState(COLOR_POR_DEFECTO);

  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editNombre, setEditNombre] = useState("");
  const [editColor, setEditColor] = useState(COLOR_POR_DEFECTO);

  async function cargarCategorias() {
    setLoading(true);
    const { data, error } = await listarCategorias();
    if (error) setError(error.message);
    else setCategorias(data);
    setLoading(false);
  }

  useEffect(() => {
    cargarCategorias();
  }, []);

  async function crear(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!nombre.trim()) {
      setError("Ponele un nombre a la categoría.");
      return;
    }
    const { error } = await crearCategoria({ nombre: nombre.trim(), color });
    if (error) {
      setError(error.message);
      return;
    }
    setNombre("");
    setColor(COLOR_POR_DEFECTO);
    cargarCategorias();
  }

  function empezarEdicion(cat: Categoria) {
    setEditandoId(cat.id);
    setEditNombre(cat.nombre);
    setEditColor(cat.color || COLOR_POR_DEFECTO);
  }

  async function guardarEdicion(id: string) {
    setError(null);
    const { error } = await actualizarCategoria(id, {
      nombre: editNombre.trim(),
      color: editColor,
    });
    if (error) {
      setError(error.message);
      return;
    }
    setEditandoId(null);
    cargarCategorias();
  }

  async function eliminar(id: string, nombreCat: string) {
    const ok = await confirmar({
      title: "Eliminar categoría",
      message: `¿Eliminar "${nombreCat}"? Las actividades que la usan quedarán sin categoría.`,
      confirmLabel: "Eliminar",
      danger: true,
    });
    if (!ok) return;
    const { error } = await eliminarCategoria(id);
    if (error) {
      setError(error.message);
      return;
    }
    cargarCategorias();
  }

  return (
    <div>
      <h1>Categorías</h1>
      <p className="card-sub">
        Administrá las categorías que podés asignarle a cada actividad.
      </p>

      <h2>Categorías existentes</h2>
      {loading && <p className="empty">Cargando...</p>}
      {!loading && categorias.length === 0 && (
        <p className="empty">Todavía no creaste ninguna categoría.</p>
      )}
      {categorias.map((cat) => (
        <div className="card" key={cat.id}>
          {editandoId === cat.id ? (
            <div className="edit-block">
              <label>Nombre</label>
              <input
                type="text"
                value={editNombre}
                onChange={(e) => setEditNombre(e.target.value)}
              />
              <label>Color</label>
              <input
                type="color"
                value={editColor}
                onChange={(e) => setEditColor(e.target.value)}
              />
              <div className="btn-row">
                <button onClick={() => guardarEdicion(cat.id)}>Guardar</button>
                <button
                  className="btn-secundario"
                  onClick={() => setEditandoId(null)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="card-row">
              <div className="evento" style={{ flex: 1 }}>
                <div
                  className="evento-color"
                  style={{ backgroundColor: cat.color || "#ccc" }}
                />
                <div className="card-title">{cat.nombre}</div>
              </div>
              <div className="btn-row">
                <button className="btn-small" onClick={() => empezarEdicion(cat)}>
                  Editar
                </button>
                <button
                  className="btn-small btn-danger"
                  onClick={() => eliminar(cat.id, cat.nombre)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      <h2>Crear nueva categoría</h2>
      <form onSubmit={crear}>
        <label>Nombre</label>
        <input
          type="text"
          placeholder="Ej: Comida"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <label>Color</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Crear categoría</button>
      </form>
    </div>
  );
}
