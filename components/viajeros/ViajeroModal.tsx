"use client";

import { useState } from "react";
import FormModal from "@/components/FormModal";
import type { DatosViajero } from "@/lib/data/viajeros";
import type { Viajero } from "@/lib/types";

interface ViajeroModalProps {
  viajero: Viajero | null; // null = viajero nuevo
  onSave: (datos: DatosViajero) => Promise<string | null>;
  onClose: () => void;
}

const TIPOS_DOCUMENTO = ["DNI", "Pasaporte", "Otro"];

export default function ViajeroModal({ viajero, onSave, onClose }: ViajeroModalProps) {
  const inicial = {
    nombre: viajero?.nombre ?? "",
    email: viajero?.email ?? "",
    telefono: viajero?.telefono ?? "",
    nacimiento: viajero?.fecha_nacimiento ?? "",
    docTipo: viajero?.documento_tipo ?? "",
    docNumero: viajero?.documento_numero ?? "",
    emergencia: viajero?.contacto_emergencia ?? "",
    notas: viajero?.notas ?? "",
  };

  const [nombre, setNombre] = useState(inicial.nombre);
  const [email, setEmail] = useState(inicial.email);
  const [telefono, setTelefono] = useState(inicial.telefono);
  const [nacimiento, setNacimiento] = useState(inicial.nacimiento);
  const [docTipo, setDocTipo] = useState(inicial.docTipo);
  const [docNumero, setDocNumero] = useState(inicial.docNumero);
  const [emergencia, setEmergencia] = useState(inicial.emergencia);
  const [notas, setNotas] = useState(inicial.notas);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty =
    nombre !== inicial.nombre ||
    email !== inicial.email ||
    telefono !== inicial.telefono ||
    nacimiento !== inicial.nacimiento ||
    docTipo !== inicial.docTipo ||
    docNumero !== inicial.docNumero ||
    emergencia !== inicial.emergencia ||
    notas !== inicial.notas;

  async function guardar() {
    if (!nombre.trim()) {
      setError("Ponele un nombre al viajero.");
      return;
    }
    setSaving(true);
    setError(null);
    const fallo = await onSave({
      nombre: nombre.trim(),
      email: email.trim() || null,
      telefono: telefono.trim() || null,
      fecha_nacimiento: nacimiento || null,
      documento_tipo: docTipo || null,
      documento_numero: docNumero.trim() || null,
      contacto_emergencia: emergencia.trim() || null,
      notas: notas.trim() || null,
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
      title={viajero ? "Editar viajero" : "Nuevo viajero"}
      dirty={dirty}
      saving={saving}
      error={error}
      onClose={onClose}
      onSubmit={guardar}
    >
      <label>Nombre completo</label>
      <input
        type="text"
        autoFocus
        placeholder="Ej: Ana García"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <div className="form-row">
        <div>
          <label>Email (opcional)</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Teléfono (opcional)</label>
          <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        </div>
      </div>
      <label>Fecha de nacimiento (opcional)</label>
      <input type="date" value={nacimiento} onChange={(e) => setNacimiento(e.target.value)} />
      <div className="form-row">
        <div>
          <label>Documento (opcional)</label>
          <select value={docTipo} onChange={(e) => setDocTipo(e.target.value)}>
            <option value="">Sin especificar</option>
            {TIPOS_DOCUMENTO.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Número</label>
          <input type="text" value={docNumero} onChange={(e) => setDocNumero(e.target.value)} />
        </div>
      </div>
      <label>Contacto de emergencia (opcional)</label>
      <input
        type="text"
        placeholder="Nombre y teléfono"
        value={emergencia}
        onChange={(e) => setEmergencia(e.target.value)}
      />
      <label>Notas (opcional)</label>
      <textarea
        rows={3}
        placeholder="Alergias, preferencias, vacunas..."
        value={notas}
        onChange={(e) => setNotas(e.target.value)}
      />
    </FormModal>
  );
}
