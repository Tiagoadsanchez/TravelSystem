"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  listarViajes,
  crearViaje as crearViajeRemoto,
  actualizarViaje as actualizarViajeRemoto,
  eliminarViaje as eliminarViajeRemoto,
} from "@/lib/data/viajes";
import type { Viaje } from "@/lib/types";

export default function ViajesPage() {
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [nombre, setNombre] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editNombre, setEditNombre] = useState("");
  const [editInicio, setEditInicio] = useState("");
  const [editFin, setEditFin] = useState("");

  async function cargarViajes() {
    setLoading(true);
    const { data, error } = await listarViajes();

    if (error) setError(error.message);
    else setViajes(data || []);
    setLoading(false);
  }

  useEffect(() => {
    cargarViajes();
  }, []);

  async function crearViaje(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!nombre || !fechaInicio || !fechaFin) {
      setError("Completá nombre, fecha de inicio y fecha de fin.");
      return;
    }

    const { error } = await crearViajeRemoto({
      nombre,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
    });

    if (error) {
      setError(error.message);
      return;
    }

    setNombre("");
    setFechaInicio("");
    setFechaFin("");
    cargarViajes();
  }

  function empezarEdicion(viaje: Viaje) {
    setEditandoId(viaje.id);
    setEditNombre(viaje.nombre);
    setEditInicio(viaje.fecha_inicio);
    setEditFin(viaje.fecha_fin);
  }

  function cancelarEdicion() {
    setEditandoId(null);
  }

  async function guardarEdicion(id: string) {
    setError(null);
    const { error } = await actualizarViajeRemoto(id, {
      nombre: editNombre,
      fecha_inicio: editInicio,
      fecha_fin: editFin,
    });

    if (error) {
      setError(error.message);
      return;
    }
    setEditandoId(null);
    cargarViajes();
  }

  async function eliminarViaje(id: string, nombreViaje: string) {
    const confirmar = window.confirm(
      `¿Eliminar el viaje "${nombreViaje}"? Esto borra también todos sus días y actividades. Esta acción no se puede deshacer.`
    );
    if (!confirmar) return;

    const { error } = await eliminarViajeRemoto(id);
    if (error) {
      setError(error.message);
      return;
    }
    cargarViajes();
  }

  return (
    <div>
      <h1>Mis Viajes</h1>
      <p className="card-sub">Elegí un viaje para ver su cronograma día a día.</p>

      <h2>Viajes existentes</h2>
      {loading && <p className="empty">Cargando...</p>}
      {!loading && viajes.length === 0 && (
        <p className="empty">Todavía no creaste ningún viaje.</p>
      )}
      {viajes.map((viaje) => (
        <div className="card" key={viaje.id}>
          {editandoId === viaje.id ? (
            <div className="edit-block">
              <label>Nombre</label>
              <input
                type="text"
                value={editNombre}
                onChange={(e) => setEditNombre(e.target.value)}
              />
              <label>Fecha de inicio</label>
              <input
                type="date"
                value={editInicio}
                onChange={(e) => setEditInicio(e.target.value)}
              />
              <label>Fecha de fin</label>
              <input
                type="date"
                value={editFin}
                onChange={(e) => setEditFin(e.target.value)}
              />
              <div className="btn-row">
                <button onClick={() => guardarEdicion(viaje.id)}>Guardar</button>
                <button className="btn-secundario" onClick={cancelarEdicion}>
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="card-row">
              <Link href={`/viaje/${viaje.id}`} className="card-link">
                <div className="card-title">{viaje.nombre}</div>
                <div className="card-sub">
                  {viaje.fecha_inicio} → {viaje.fecha_fin}
                </div>
              </Link>
              <div className="btn-row">
                <button
                  className="btn-small"
                  onClick={() => empezarEdicion(viaje)}
                >
                  Editar
                </button>
                <button
                  className="btn-small btn-danger"
                  onClick={() => eliminarViaje(viaje.id, viaje.nombre)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      <h2>Crear nuevo viaje</h2>
      <form onSubmit={crearViaje}>
        <label>Nombre del viaje</label>
        <input
          type="text"
          placeholder="Ej: Europa 2027"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <label>Fecha de inicio</label>
        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
        />

        <label>Fecha de fin</label>
        <input
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
        />

        {error && <p className="error">{error}</p>}
        <button type="submit">Crear viaje</button>
      </form>
    </div>
  );
}
