"use client";

import { useCallback } from "react";
import { useConfirm } from "@/components/ConfirmProvider";

// Devuelve una función "cerrar" que pregunta antes de perder cambios sin guardar.
export function useDiscardGuard(dirty: boolean, onClose: () => void) {
  const confirmar = useConfirm();

  return useCallback(async () => {
    if (!dirty) {
      onClose();
      return;
    }
    const descartar = await confirmar({
      title: "¿Descartar cambios?",
      message: "Tenés cambios sin guardar. Si cerrás, se pierden.",
      confirmLabel: "Descartar",
      cancelLabel: "Seguir editando",
      danger: true,
    });
    if (descartar) onClose();
  }, [dirty, onClose, confirmar]);
}
