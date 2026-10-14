"use client";

import { useState } from "react";
import FormModal from "@/components/FormModal";
import { hora } from "@/lib/dates";
import type { DatosEvento } from "@/lib/data/eventos";
import type { Categoria, Evento } from "@/lib/types";

interface EventoModalProps {
  evento: Evento | null; // null = actividad nueva
  categorias: Categoria[];
  subtitle?: string;
  onSave: (datos: DatosEvento) => Promise<string | null>;
  onClose: () => void;
}

export default function EventoModal({
  evento,
  categorias,
  subtitle,
  onSave,
  onClose,
}: EventoModalProps) {
  const inicial = {
    titulo: evento?.titulo ?? "",
    ubicacion: evento?.ubicacion ?? "",
    horaInicio: hora(evento?.hora_inicio ?? null),
    horaFin: hora(evento?.hora_fin ?? null),
    categoriaId: evento?.categoria_id ?? "",
  };

  const [titulo, setTitulo] = useState(inicial.titulo);
  const [ubicacion, setUbicacion] = useState(inicial.ubicacion);
  const [horaInicio, setHoraInicio] = useState(inicial.horaInicio);
  const [horaFin, setHoraFin] = useState(inicial.horaFin);
  const [categoriaId, setCategoriaId] = useState(inicial.categoriaId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty =
    titulo !== inicial.titulo ||
    ubicacion !== inicial.ubicacion ||
    horaInicio !== inicial.horaInicio ||
    horaFin !== inicial.horaFin ||
    categoriaId !== inicial.categoriaId;

  async function guardar() {
    if (!titulo.trim()) {
      setError("Ponele un título a la actividad.");
      return;
    }
    if (horaInicio && horaFin && horaFin < horaInicio) {
      setError("La hora de fin no puede ser antes de la de inicio.");
      return;
    }
    setSaving(true);
    setError(null);
    const fallo = await onSave({
      titulo: titulo.trim(),
      ubicacion: ubicacion.trim() || null,
      hora_inicio: horaInicio || null,
      hora_fin: horaFin || null,
      categoria_id: categoriaId || null,
    });
    setSaving(false);
    if (fallo) {
      setError(fallo);
      return;
    }
    onClose();
  }

  return (
    <FormModal
      title={evento ? "Editar actividad" : "Nueva actividad"}
      subtitle={subtitle}
      dirty={dirty}
      saving={saving}
      error={error}
      onClose={onClose}
      onSubmit={guardar}
    >
      <label>Título</label>
      <input
        type="text"
        autoFocus
        placeholder="Ej: Visita al Coliseo"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />
      <label>Ubicación (opcional)</label>
      <input type="text" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} />
      <div className="form-row">
        <div>
          <label>Hora inicio</label>
          <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
        </div>
        <div>
          <label>Hora fin</label>
          <input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} />
        </div>
      </div>
      <label>Categoría</label>
      <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
        <option value="">Sin categoría</option>
        {categorias.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.nombre}
          </option>
        ))}
      </select>
    </FormModal>
  );
}
