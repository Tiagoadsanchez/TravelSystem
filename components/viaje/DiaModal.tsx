"use client";

import { useState } from "react";
import FormModal from "@/components/FormModal";
import { fechaLarga } from "@/lib/dates";
import type { Dia } from "@/lib/types";

interface DiaModalProps {
  dia: Dia | null; // null = día nuevo
  fechaSugerida: string;
  onSave: (valores: { fecha: string; titulo: string | null }) => Promise<string | null>;
  onClose: () => void;
}

export default function DiaModal({ dia, fechaSugerida, onSave, onClose }: DiaModalProps) {
  const fechaInicial = dia?.fecha ?? fechaSugerida;
  const tituloInicial = dia?.titulo ?? "";

  const [fecha, setFecha] = useState(fechaInicial);
  const [titulo, setTitulo] = useState(tituloInicial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty = fecha !== fechaInicial || titulo !== tituloInicial;

  async function guardar() {
    if (!fecha) {
      setError("Elegí una fecha para el día.");
      return;
    }
    setSaving(true);
    setError(null);
    const fallo = await onSave({ fecha, titulo: titulo.trim() || null });
    setSaving(false);
    if (fallo) {
      setError(fallo);
      return;
    }
    onClose();
  }

  return (
    <FormModal
      title={dia ? "Editar día" : "Agregar día"}
      subtitle={dia ? fechaLarga(dia.fecha) : undefined}
      dirty={dirty}
      saving={saving}
      error={error}
      onClose={onClose}
      onSubmit={guardar}
    >
      {!dia && (
        <>
          <label>Fecha</label>
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </>
      )}
      <label>Título (opcional)</label>
      <input
        type="text"
        autoFocus
        placeholder="Ej: Llegada a Roma"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />
    </FormModal>
  );
}
