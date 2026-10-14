"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import Modal from "@/components/Modal";

export interface ConfirmOptions {
  title: string;
  message?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

interface PendingConfirm {
  options: ConfirmOptions;
  resolve: (value: boolean) => void;
}

const ConfirmContext = createContext<ConfirmFn | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<PendingConfirm | null>(null);

  const confirm = useCallback<ConfirmFn>(
    (options) => new Promise<boolean>((resolve) => setPending({ options, resolve })),
    []
  );

  function responder(value: boolean) {
    pending?.resolve(value);
    setPending(null);
  }

  const opciones = pending?.options;

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal
        open={pending !== null}
        title={opciones?.title ?? ""}
        onClose={() => responder(false)}
        footer={
          opciones && (
            <>
              <button className="btn-secundario" type="button" onClick={() => responder(false)}>
                {opciones.cancelLabel ?? "Cancelar"}
              </button>
              <button
                className={opciones.danger ? "btn-danger-solid" : ""}
                type="button"
                onClick={() => responder(true)}
              >
                {opciones.confirmLabel ?? "Confirmar"}
              </button>
            </>
          )
        }
      >
        {opciones?.message && <p>{opciones.message}</p>}
      </Modal>
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm debe usarse dentro de ConfirmProvider");
  return ctx;
}
