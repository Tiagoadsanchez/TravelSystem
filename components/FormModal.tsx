"use client";

import { useId, type FormEvent, type ReactNode } from "react";
import Modal from "@/components/Modal";
import { useDiscardGuard } from "@/components/useDiscardGuard";

interface FormModalProps {
  title: string;
  subtitle?: string;
  dirty: boolean;
  saving: boolean;
  error: string | null;
  submitLabel?: string;
  onClose: () => void;
  onSubmit: () => void;
  children: ReactNode;
}

// Modal de edición: nada se guarda solo, siempre con botón "Guardar".
// Se monta solo cuando hace falta, así cada apertura arranca con el estado limpio.
export default function FormModal({
  title,
  subtitle,
  dirty,
  saving,
  error,
  submitLabel = "Guardar",
  onClose,
  onSubmit,
  children,
}: FormModalProps) {
  const formId = useId();
  const cerrar = useDiscardGuard(dirty, onClose);

  function enviar(e: FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <Modal
      open
      title={title}
      onClose={cerrar}
      footer={
        <>
          <button type="button" className="btn-secundario" onClick={cerrar}>
            Cancelar
          </button>
          <button type="submit" form={formId} disabled={saving}>
            {saving ? "Guardando..." : submitLabel}
          </button>
        </>
      }
    >
      {subtitle && <p className="modal-sub">{subtitle}</p>}
      <form id={formId} className="form-plain" onSubmit={enviar}>
        {children}
        {error && <p className="error">{error}</p>}
      </form>
    </Modal>
  );
}
