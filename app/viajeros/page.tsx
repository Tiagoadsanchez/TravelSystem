"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import Avatar from "@/components/viajeros/Avatar";
import ViajeroModal from "@/components/viajeros/ViajeroModal";
import { useConfirm } from "@/components/ConfirmProvider";
import { edad } from "@/lib/dates";
import {
  listarViajeros,
  crearViajero,
  actualizarViajero,
  eliminarViajero,
  type DatosViajero,
} from "@/lib/data/viajeros";
import type { Viajero } from "@/lib/types";

function etiquetaDocumento(v: Viajero): string | null {
  return v.documento_numero ? `${v.documento_tipo ?? "Documento"} ${v.documento_numero}` : null;
}

export default function ViajerosPage() {
  const confirmar = useConfirm();
  const [viajeros, setViajeros] = useState<Viajero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // undefined = modal cerrado, null = viajero nuevo, Viajero = editando
  const [editando, setEditando] = useState<Viajero | null | undefined>(undefined);

  async function cargar() {
    const { data, error } = await listarViajeros();
    if (error) setError(error.message);
    else {
      setError(null);
      setViajeros(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    cargar();
  }, []);

  async function guardar(datos: DatosViajero): Promise<string | null> {
    const res = editando ? await actualizarViajero(editando.id, datos) : await crearViajero(datos);
    if (res.error) return res.error.message;
    await cargar();
    return null;
  }

  async function borrar(viajero: Viajero) {
    const ok = await confirmar({
      title: "Eliminar viajero",
      message: `¿Eliminar a "${viajero.nombre}"? Se quita de todos los viajes donde estaba. No se puede deshacer.`,
      confirmLabel: "Eliminar",
      danger: true,
    });
    if (!ok) return;
    const { error } = await eliminarViajero(viajero.id);
    if (error) {
      setError(error.message);
      return;
    }
    await cargar();
  }

  return (
    <div>
      <div className="trip-header">
        <div>
          <h1>Viajeros</h1>
          <p className="card-sub">Las personas que viajan con vos: datos, documentos y contactos.</p>
        </div>
        <button type="button" onClick={() => setEditando(null)}>
          <span className="btn-icon">
            <Plus size={16} aria-hidden="true" />
            Nuevo viajero
          </span>
        </button>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p className="empty">Cargando...</p>}
      {!loading && !error && viajeros.length === 0 && (
        <p className="empty">Todavía no cargaste ningún viajero.</p>
      )}

      <div style={{ marginTop: 16 }}>
        {viajeros.map((v) => {
          const detalles = [
            v.fecha_nacimiento ? `${edad(v.fecha_nacimiento)} años` : null,
            v.email,
            v.telefono,
            etiquetaDocumento(v),
          ].filter(Boolean);
          return (
            <div className="card" key={v.id}>
              <div className="card-row">
                <div className="persona-row static">
                  <Avatar nombre={v.nombre} />
                  <span className="persona-info">
                    <span className="persona-nombre">{v.nombre}</span>
                    {detalles.length > 0 && <span className="persona-sub">{detalles.join(" · ")}</span>}
                    {v.contacto_emergencia && (
                      <span className="persona-sub">Emergencia: {v.contacto_emergencia}</span>
                    )}
                    {v.notas && <span className="persona-sub">{v.notas}</span>}
                  </span>
                </div>
                <div className="row-actions">
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => setEditando(v)}
                    aria-label={`Editar ${v.nombre}`}
                    title="Editar"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => borrar(v)}
                    aria-label={`Eliminar ${v.nombre}`}
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {editando !== undefined && (
        <ViajeroModal viajero={editando} onSave={guardar} onClose={() => setEditando(undefined)} />
      )}
    </div>
  );
}
