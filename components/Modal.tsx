"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

// Usa el <dialog> nativo: maneja foco, Esc y el fondo oscuro sin librerías.
export default function Modal({ open, title, onClose, children, footer }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  // Si el mouse se aprieta adentro (ej: seleccionando texto de un campo) y se suelta afuera,
  // el navegador dispara un "click" sobre el fondo. Solo cerramos si el clic empezó en el fondo.
  const apretoEnElFondo = useRef(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="modal"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onMouseDown={(e) => {
        apretoEnElFondo.current = e.target === ref.current;
      }}
      onClick={(e) => {
        const cierraPorFondo = apretoEnElFondo.current && e.target === ref.current;
        apretoEnElFondo.current = false;
        if (cierraPorFondo) onClose();
      }}
    >
      {open && (
        <div className="modal-body">
          <div className="modal-header">
            <h3>{title}</h3>
            <button className="icon-btn" onClick={onClose} aria-label="Cerrar" type="button">
              <X size={18} />
            </button>
          </div>
          <div className="modal-content">{children}</div>
          {footer && <div className="modal-footer">{footer}</div>}
        </div>
      )}
    </dialog>
  );
}
