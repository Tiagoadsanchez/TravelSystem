"use client";

import { useState } from "react";
import Link from "next/link";
import FormModal from "@/components/FormModal";
import type { Viajero } from "@/lib/types";

interface ViajerosViajeModalProps {
  todos: Viajero[];
  seleccionados: string[];
  onSave: (ids: string[]) => Promise<string | null>;
  onClose: () => void;
}

export default function ViajerosViajeModal({
  todos,
  seleccionados,
  onSave,
  onClose,
}: ViajerosViajeModalProps) {
  const [ids, setIds] = useState<string[]>(seleccionados);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty =
    ids.length !== seleccionados.length || ids.some((id) => !seleccionados.includes(id));

  function alternar(id: string) {
    setIds((actuales) =>
      actuales.includes(id) ? actuales.filter((x) => x !== id) : [...actuales, id]
    );
  }

  async function guardar() {
    setSaving(true);
    setError(null);
    const fallo = await onSave(ids);
    setSaving(false);
    if (fallo) {
      setError(fallo);
      return;
    }
    onClose();
  }

  return (
    <FormModal
      title="¿Quién viaja?"
      subtitle="Elegí los viajeros que van en este viaje."
      dirty={dirty}
      saving={saving}
      error={error}
      onClose={onClose}
      onSubmit={guardar}
    >
      {todos.length === 0 ? (
        <p className="empty">
          Todavía no cargaste viajeros. <Link href="/viajeros" className="btn-link">Crear el primero</Link>
        </p>
      ) : (
        <div className="check-list">
          {todos.map((v) => (
            <label className="checklist-label" key={v.id}>
              <input type="checkbox" checked={ids.includes(v.id)} onChange={() => alternar(v.id)} />
              <span>{v.nombre}</span>
            </label>
          ))}
        </div>
      )}
    </FormModal>
  );
}
