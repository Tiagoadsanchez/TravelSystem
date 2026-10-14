"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import GastoModal from "@/components/gastos/GastoModal";
import GastoRow from "@/components/gastos/GastoRow";
import { useConfirm } from "@/components/ConfirmProvider";
import { formatearMonto, totalesPorMoneda } from "@/lib/dinero";
import {
  listarGastos,
  crearGasto,
  actualizarGasto,
  eliminarGasto,
  type DatosGasto,
} from "@/lib/data/gastos";
import { listarViajes } from "@/lib/data/viajes";
import { listarCategorias } from "@/lib/data/categorias";
import { listarViajeros } from "@/lib/data/viajeros";
import type { Categoria, Gasto, Viaje, Viajero } from "@/lib/types";

const TODOS = "todos";

export default function GastosPage() {
  const confirmar = useConfirm();
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [viajeros, setViajeros] = useState<Viajero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroViaje, setFiltroViaje] = useState<string>(TODOS);
  // undefined = modal cerrado, null = gasto nuevo, Gasto = editando
  const [editando, setEditando] = useState<Gasto | null | undefined>(undefined);

  async function cargar() {
    const [g, v, c, vj] = await Promise.all([
      listarGastos(),
      listarViajes(),
      listarCategorias(),
      listarViajeros(),
    ]);
    if (g.error) setError(g.error.message);
    else if (v.error) setError(v.error.message);
    else {
      setError(null);
      setGastos(g.data);
      setViajes(v.data ?? []);
      setCategorias(c.data);
      setViajeros(vj.error ? [] : vj.data);
    }
    setLoading(false);
  }

  useEffect(() => {
    cargar();
  }, []);

  const viajePorId = useMemo(() => new Map(viajes.map((v) => [v.id, v])), [viajes]);
  const categoriaPorId = useMemo(() => new Map(categorias.map((c) => [c.id, c])), [categorias]);
  const viajeroPorId = useMemo(() => new Map(viajeros.map((v) => [v.id, v])), [viajeros]);

  const visibles = useMemo(
    () => (filtroViaje === TODOS ? gastos : gastos.filter((g) => g.viaje_id === filtroViaje)),
    [gastos, filtroViaje]
  );
  const totales = useMemo(() => totalesPorMoneda(visibles), [visibles]);

  async function guardar(datos: DatosGasto): Promise<string | null> {
    const res = editando ? await actualizarGasto(editando.id, datos) : await crearGasto(datos);
    if (res.error) return res.error.message;
    await cargar();
    return null;
  }

  async function borrar(gasto: Gasto) {
    const ok = await confirmar({
      title: "Eliminar gasto",
      message: `¿Eliminar "${gasto.descripcion}" (${formatearMonto(gasto.monto, gasto.moneda)})? No se puede deshacer.`,
      confirmLabel: "Eliminar",
      danger: true,
    });
    if (!ok) return;
    const { error } = await eliminarGasto(gasto.id);
    if (error) {
      setError(error.message);
      return;
    }
    await cargar();
  }

  const hayViajes = viajes.length > 0;

  return (
    <div>
      <div className="trip-header">
        <div>
          <h1>Gastos</h1>
          <p className="card-sub">Lo que gastás en cada viaje, con totales por moneda.</p>
        </div>
        {hayViajes && (
          <button type="button" onClick={() => setEditando(null)}>
            <span className="btn-icon">
              <Plus size={16} aria-hidden="true" />
              Nuevo gasto
            </span>
          </button>
        )}
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p className="empty">Cargando...</p>}

      {!loading && !error && !hayViajes && (
        <p className="empty">
          Para cargar gastos primero necesitás un viaje.{" "}
          <Link href="/viajes" className="btn-link">
            Ir a Mis viajes
          </Link>
        </p>
      )}

      {!loading && !error && hayViajes && (
        <>
          <div className="filtros">
            <label htmlFor="filtro-viaje">Viaje</label>
            <select id="filtro-viaje" value={filtroViaje} onChange={(e) => setFiltroViaje(e.target.value)}>
              <option value={TODOS}>Todos los viajes</option>
              {viajes.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.nombre} ({v.fecha_inicio})
                </option>
              ))}
            </select>
          </div>

          {totales.length > 0 && (
            <div className="metric-grid">
              {totales.map((t) => (
                <div className="metric" key={t.moneda}>
                  <div className="metric-value">{formatearMonto(t.total, t.moneda)}</div>
                  <div className="metric-label">Total en {t.moneda}</div>
                </div>
              ))}
            </div>
          )}

          <div className="panel" style={{ marginTop: 16 }}>
            <h2 className="panel-title">
              {visibles.length} {visibles.length === 1 ? "gasto" : "gastos"}
            </h2>
            {visibles.length === 0 && <p className="empty">Todavía no cargaste gastos acá.</p>}
            {visibles.map((g) => (
              <GastoRow
                key={g.id}
                gasto={g}
                viajeNombre={filtroViaje === TODOS ? viajePorId.get(g.viaje_id)?.nombre ?? null : null}
                categoria={g.categoria_id ? categoriaPorId.get(g.categoria_id) ?? null : null}
                pagador={g.pagado_por ? viajeroPorId.get(g.pagado_por)?.nombre ?? null : null}
                onEditar={() => setEditando(g)}
                onEliminar={() => borrar(g)}
              />
            ))}
          </div>
        </>
      )}

      {editando !== undefined && (
        <GastoModal
          gasto={editando}
          viajes={viajes}
          categorias={categorias}
          viajeros={viajeros}
          viajeInicial={filtroViaje === TODOS ? undefined : filtroViaje}
          monedaInicial={gastos[0]?.moneda}
          onSave={guardar}
          onClose={() => setEditando(undefined)}
        />
      )}
    </div>
  );
}
