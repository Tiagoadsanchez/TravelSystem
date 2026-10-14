"use client";

import { NotebookPen } from "lucide-react";

interface NotaCardProps {
  titulo: string;
  texto: string | null;
  vacio: string;
  onEditar: () => void;
}

export default function NotaCard({ titulo, texto, vacio, onEditar }: NotaCardProps) {
  return (
    <div className="nota-card">
      <div className="panel-header">
        <h2 className="panel-title">{titulo}</h2>
        <button
          type="button"
          className="icon-btn"
          onClick={onEditar}
          aria-label={`Editar ${titulo.toLowerCase()}`}
          title="Editar"
        >
          <NotebookPen size={16} />
        </button>
      </div>
      {texto ? <p className="nota-texto">{texto}</p> : <p className="nota-vacia">{vacio}</p>}
    </div>
  );
}
