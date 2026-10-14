"use client";

import { useState } from "react";
import FormModal from "@/components/FormModal";
import { hoyISO } from "@/lib/dates";
import { MONEDAS, formatearMonto, parsearMonto } from "@/lib/dinero";
import type { DatosGasto } from "@/lib/data/gastos";
import type { Categoria, Gasto, Viaje, Viajero } from "@/lib/types";

interface GastoModalProps {
  gasto: Gasto | null; // null = gasto nuevo
  viajes: Viaje[];
  categorias: Categoria[];
  viajeros: Viajero[];
  viajeInicial?: string; // viaje preseleccionado (por el filtro de la página)
  monedaInicial?: string;
  onSave: (datos: DatosGasto) => Promise<string | null>;
  onClose: () => void;
}

export default function GastoModal({
  gasto,
  viajes,
  categorias,
  viajeros,
  viajeInicial,
  monedaInicial,
  onSave,
  onClose,
}: GastoModalProps) {
  const inicial = {
    viajeId: gasto?.viaje_id ?? viajeInicial ?? viajes[0]?.id ?? "",
    descripcion: gasto?.descripcion ?? "",
    monto: gasto ? String(gasto.monto).replace(".", ",") : "",
    moneda: gasto?.moneda ?? monedaInicial ?? MONEDAS[0],
    fecha: gasto?.fecha ?? hoyISO(),
    categoriaId: gasto?.categoria_id ?? "",
    pagadoPor: gasto?.pagado_por ?? "",
  };

  const [viajeId, setViajeId] = useState(inicial.viajeId);
  const [descripcion, setDescripcion] = useState(inicial.descripcion);
  const [monto, setMonto] = useState(inicial.monto);
  const [moneda, setMoneda] = useState(inicial.moneda);
  const [fecha, setFecha] = useState(inicial.fecha);
  const [categoriaId, setCategoriaId] = useState(inicial.categoriaId);
  const [pagadoPor, setPagadoPor] = useState(inicial.pagadoPor);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty =
    viajeId !== inicial.viajeId ||
    descripcion !== inicial.descripcion ||
    monto !== inicial.monto ||
    moneda !== inicial.moneda ||
    fecha !== inicial.fecha ||
    categoriaId !== inicial.categoriaId ||
    pagadoPor !== inicial.pagadoPor;

  const montoNumero = parsearMonto(monto);
  // por si el gasto viene con una moneda que no está en la lista
  const monedas = MONEDAS.includes(moneda) ? MONEDAS : [...MONEDAS, moneda];

  async function guardar() {
    if (!viajeId) {
      setError("Elegí a qué viaje pertenece el gasto.");
      return;
    }
    if (!descripcion.trim()) {
      setError("Ponele una descripción al gasto.");
      return;
    }
    if (montoNumero === null || montoNumero <= 0) {
      setError("Ingresá un monto mayor a 0.");
      return;
    }
    if (!fecha) {
      setError("Elegí la fecha del gasto.");
      return;
    }
    setSaving(true);
    setError(null);
    const fallo = await onSave({
      viaje_id: viajeId,
      descripcion: descripcion.trim(),
      monto: Math.round(montoNumero * 100) / 100,
      moneda,
      fecha,
      categoria_id: categoriaId || null,
      pagado_por: pagadoPor || null,
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
      title={gasto ? "Editar gasto" : "Nuevo gasto"}
      dirty={dirty}
      saving={saving}
      error={error}
      onClose={onClose}
      onSubmit={guardar}
    >
      <label>Viaje</label>
      <select value={viajeId} onChange={(e) => setViajeId(e.target.value)}>
        {viajes.map((v) => (
          <option key={v.id} value={v.id}>
            {v.nombre} ({v.fecha_inicio})
          </option>
        ))}
      </select>

      <label>Descripción</label>
      <input
        type="text"
        autoFocus
        placeholder="Ej: Entradas al Coliseo"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />

      <div className="form-row">
        <div>
          <label>Monto</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="0,00"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
          />
        </div>
        <div>
          <label>Moneda</label>
          <select value={moneda} onChange={(e) => setMoneda(e.target.value)}>
            {monedas.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>
      {montoNumero !== null && montoNumero > 0 && (
        <p className="monto-vista">= {formatearMonto(montoNumero, moneda)}</p>
      )}

      <div className="form-row">
        <div>
          <label>Fecha</label>
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </div>
        <div>
          <label>Categoría (opcional)</label>
          <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
            <option value="">Sin categoría</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label>¿Quién pagó? (opcional)</label>
      <select value={pagadoPor} onChange={(e) => setPagadoPor(e.target.value)}>
        <option value="">Sin especificar</option>
        {viajeros.map((v) => (
          <option key={v.id} value={v.id}>
            {v.nombre}
          </option>
        ))}
      </select>
    </FormModal>
  );
}
