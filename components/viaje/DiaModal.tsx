"use client";

import { useState } from "react";
import FormModal from "@/components/FormModal";
import { fechaLarga } from "@/lib/dates";
import type { Dia } from "@/lib/types";

interface DiaModalProps {
  dia: Dia;
  onSave: (titulo: string | null) => Promise<string | null>;
  onClose: () => void;
}

export default function DiaModal({ dia, onSave, onClose }: DiaModalProps) {
  const original = dia.titulo ?? "";
  const [titulo, setTitulo] = useState(original);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function guardar() {
    setSaving(true);
    setError(null);
    const fallo = await onSave(titulo.trim() || null);
    setSaving(false);
    if (fallo) {
      setError(fallo);
      return;
    }
    onClose();
  }

  return (
    <FormModal
      title="Editar día"
      subtitle={fechaLarga(dia.fecha)}
      dirty={titulo !== original}
      saving={saving}
      error={error}
      onClose={onClose}
      onSubmit={guardar}
    >
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
