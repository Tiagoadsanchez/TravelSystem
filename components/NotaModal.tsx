"use client";

import { useState } from "react";
import FormModal from "@/components/FormModal";

interface NotaModalProps {
  title: string;
  subtitle?: string;
  initial: string | null;
  // devuelve un mensaje de error, o null si se guardó bien
  onSave: (texto: string) => Promise<string | null>;
  onClose: () => void;
}

export default function NotaModal({ title, subtitle, initial, onSave, onClose }: NotaModalProps) {
  const original = initial ?? "";
  const [texto, setTexto] = useState(original);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function guardar() {
    setSaving(true);
    setError(null);
    const fallo = await onSave(texto);
    setSaving(false);
    if (fallo) {
      setError(fallo);
      return;
    }
    onClose();
  }

  return (
    <FormModal
      title={title}
      subtitle={subtitle}
      dirty={texto !== original}
      saving={saving}
      error={error}
      onClose={onClose}
      onSubmit={guardar}
    >
      <textarea
        autoFocus
        rows={8}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escribí lo que quieras recordar..."
        aria-label={title}
      />
    </FormModal>
  );
}
