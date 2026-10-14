"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import CalendarView from "./CalendarView";
import { useConfirm } from "@/components/ConfirmProvider";
import NotaModal from "@/components/NotaModal";
import DayStrip from "@/components/viaje/DayStrip";
import AgendaDia from "@/components/viaje/AgendaDia";
import NotaCard from "@/components/viaje/NotaCard";
import ChecklistCard from "@/components/viaje/ChecklistCard";
import ViajerosCard from "@/components/viaje/ViajerosCard";
import ViajerosViajeModal from "@/components/viaje/ViajerosViajeModal";
import ViajeroModal from "@/components/viajeros/ViajeroModal";
import ResumenViaje from "@/components/viaje/ResumenViaje";
import EventoModal from "@/components/viaje/EventoModal";
import DiaModal from "@/components/viaje/DiaModal";
import { fechaCorta, fechaLarga, hoyISO, rangoFechas } from "@/lib/dates";
import { obtenerViaje, actualizarNotasViaje } from "@/lib/data/viajes";
import { listarCategorias } from "@/lib/data/categorias";
import {
  listarDiasConEventos,
  crearDia,
  actualizarDia,
  actualizarNotasDia,
  eliminarDia,
} from "@/lib/data/dias";
import {
  crearEvento,
  actualizarEvento,
  actualizarNotasEvento,
  eliminarEvento,
  type DatosEvento,
} from "@/lib/data/eventos";
import {
  listarChecklist,
  agregarItemChecklist,
  actualizarItemChecklist,
  eliminarItemChecklist,
} from "@/lib/data/checklist";
import {
  listarViajeros,
  listarIdsViajerosDeViaje,
  asignarViajeros,
  actualizarViajero,
  type DatosViajero,
} from "@/lib/data/viajeros";
import type { Viaje, Dia, Categoria, ChecklistItem, Evento, Viajero } from "@/lib/types";

type Vista = "agenda" | "mes" | "resumen";

type ModalState =
  | { tipo: "nota-viaje" }
  | { tipo: "nota-dia"; diaId: string }
  | { tipo: "nota-evento"; eventoId: string }
  | { tipo: "dia-editar"; diaId: string }
  | { tipo: "evento-nuevo"; diaId: string }
  | { tipo: "evento-editar"; eventoId: string }
  | { tipo: "viajeros-viaje" }
  | { tipo: "viajero-ver"; viajeroId: string };

const VISTAS: { valor: Vista; etiqueta: string }[] = [
  { valor: "agenda", etiqueta: "Agenda" },
  { valor: "mes", etiqueta: "Mes" },
  { valor: "resumen", etiqueta: "Resumen" },
];

export default function DetalleViaje() {
  const { id } = useParams<{ id: string }>();
  const confirmar = useConfirm();

  const [viaje, setViaje] = useState<Viaje | null>(null);
  const [dias, setDias] = useState<Dia[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [viajeros, setViajeros] = useState<Viajero[]>([]);
  const [viajeroIds, setViajeroIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vista, setVista] = useState<Vista>("agenda");
  const [fechaSel, setFechaSel] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState | null>(null);

  const hoy = hoyISO();

  const cargarTodo = useCallback(async () => {
    const [v, c, d, ch, vj, vjIds] = await Promise.all([
      obtenerViaje(id),
      listarCategorias(),
      listarDiasConEventos(id),
      listarChecklist(id),
      listarViajeros(),
      listarIdsViajerosDeViaje(id),
    ]);

    if (v.error) {
      setError(v.error.message);
      setLoading(false);
      return;
    }
    if (d.error) {
      setError(d.error.message);
      setLoading(false);
      return;
    }

    setError(null);
    setViaje(v.data);
    setCategorias(c.data);
    setDias(d.data ?? []);
    setChecklist(ch.data);
    // Si todavía no corriste supabase_viajeros.sql, estas listas llegan vacías y el resto sigue andando.
    setViajeros(vj.error ? [] : vj.data);
    setViajeroIds(vjIds.error ? [] : vjIds.data);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (id) cargarTodo();
  }, [id, cargarTodo]);

  // Al abrir el viaje se selecciona hoy (si cae dentro del viaje) o el primer día.
  useEffect(() => {
    if (!viaje || fechaSel !== null) return;
    const hoyEnViaje = hoy >= viaje.fecha_inicio && hoy <= viaje.fecha_fin;
    setFechaSel(hoyEnViaje ? hoy : viaje.fecha_inicio);
  }, [viaje, fechaSel, hoy]);

  // La tira muestra todas las fechas del viaje, y también las de días cargados fuera de ese rango.
  const fechas = useMemo(() => {
    if (!viaje) return [];
    const todas = new Set([...rangoFechas(viaje.fecha_inicio, viaje.fecha_fin), ...dias.map((d) => d.fecha)]);
    return Array.from(todas).sort();
  }, [viaje, dias]);

  const diasPorFecha = useMemo(() => new Map(dias.map((d) => [d.fecha, d])), [dias]);
  const diaSel = fechaSel ? diasPorFecha.get(fechaSel) ?? null : null;
  const eventos = useMemo(() => dias.flatMap((d) => d.eventos), [dias]);
  const diasConPlan = fechas.filter((f) => (diasPorFecha.get(f)?.eventos.length ?? 0) > 0).length;
  const checklistHechos = checklist.filter((i) => i.completado).length;

  function cerrarModal() {
    setModal(null);
  }

  // Cada guardado devuelve un mensaje de error, o null si salió bien (el modal lo muestra).
  async function aplicar(resultado: { error: { message: string } | null }): Promise<string | null> {
    if (resultado.error) return resultado.error.message;
    await cargarTodo();
    return null;
  }

  async function reportar(resultado: { error: { message: string } | null }) {
    if (resultado.error) {
      setError(resultado.error.message);
      return;
    }
    await cargarTodo();
  }

  // ---------- NOTAS ----------

  const guardarNotaViaje = async (texto: string) =>
    aplicar(await actualizarNotasViaje(id, texto.trim() || null));

  const guardarNotaDia = async (diaId: string, texto: string) =>
    aplicar(await actualizarNotasDia(diaId, texto.trim() || null));

  const guardarNotaEvento = async (eventoId: string, texto: string) =>
    aplicar(await actualizarNotasEvento(eventoId, texto.trim() || null));

  // ---------- DÍAS ----------

  // Un día "existe" en la base recién cuando empezás a planearlo.
  async function empezarDia(fecha: string) {
    const res = await crearDia(id, fecha, null);
    if (res.error) {
      setError(res.error.message);
      return;
    }
    await cargarTodo();
  }

  const guardarTituloDia = async (diaId: string, titulo: string | null) =>
    aplicar(await actualizarDia(diaId, titulo));

  async function borrarDia(dia: Dia) {
    const ok = await confirmar({
      title: "Eliminar día",
      message: `¿Eliminar el ${fechaLarga(dia.fecha).toLowerCase()}? Se borran también sus ${dia.eventos.length} actividades.`,
      confirmLabel: "Eliminar",
      danger: true,
    });
    if (!ok) return;
    await reportar(await eliminarDia(dia.id));
  }

  // ---------- ACTIVIDADES ----------

  async function guardarEvento(
    diaId: string,
    editando: Evento | null,
    datos: DatosEvento
  ): Promise<string | null> {
    if (editando) return aplicar(await actualizarEvento(editando.id, datos));
    return aplicar(await crearEvento(diaId, datos));
  }

  async function borrarEvento(evento: Evento) {
    const ok = await confirmar({
      title: "Eliminar actividad",
      message: `¿Eliminar "${evento.titulo}"? No se puede deshacer.`,
      confirmLabel: "Eliminar",
      danger: true,
    });
    if (!ok) return;
    await reportar(await eliminarEvento(evento.id));
  }

  // ---------- VIAJEROS ----------

  const guardarViajerosViaje = async (ids: string[]) =>
    aplicar(await asignarViajeros(id, ids, viajeroIds));

  const guardarViajero = async (viajeroId: string, datos: DatosViajero) =>
    aplicar(await actualizarViajero(viajeroId, datos));

  // ---------- CHECKLIST ----------

  async function agregarItem(descripcion: string) {
    await reportar(await agregarItemChecklist(id, descripcion));
  }

  async function alternarItem(item: ChecklistItem) {
    await reportar(await actualizarItemChecklist(item.id, !item.completado));
  }

  async function borrarItem(item: ChecklistItem) {
    await reportar(await eliminarItemChecklist(item.id));
  }

  // ---------- RENDER ----------

  if (loading) return <p className="empty">Cargando viaje...</p>;
  if (error && !viaje) return <p className="error">{error}</p>;
  if (!viaje) return <p className="empty">Viaje no encontrado.</p>;

  const diaDeModal = (diaId: string) => dias.find((d) => d.id === diaId) ?? null;
  const eventoDeModal = (eventoId: string) => eventos.find((e) => e.id === eventoId) ?? null;

  return (
    <div>
      <div className="trip-header">
        <div>
          <h1>{viaje.nombre}</h1>
          <p className="card-sub">
            {fechaCorta(viaje.fecha_inicio, true)} → {fechaCorta(viaje.fecha_fin, true)}
          </p>
        </div>
        <div className="pill-tabs" role="tablist" aria-label="Vistas del viaje">
          {VISTAS.map((v) => (
            <button
              key={v.valor}
              type="button"
              role="tab"
              aria-selected={vista === v.valor}
              className={"pill" + (vista === v.valor ? " active" : "")}
              onClick={() => setVista(v.valor)}
            >
              {v.etiqueta}
            </button>
          ))}
        </div>
      </div>

      <div className="chip-row">
        <span className="chip">
          <strong>{eventos.length}</strong> actividades
        </span>
        <span className="chip">
          <strong>{diasConPlan}</strong> de {fechas.length} días con plan
        </span>
        <span className="chip">
          checklist <strong>{checklistHechos}</strong> de {checklist.length}
        </span>
      </div>

      {error && <p className="error">{error}</p>}

      {vista === "agenda" && (
        <>
          <DayStrip
            fechas={fechas}
            diasPorFecha={diasPorFecha}
            selected={fechaSel}
            hoy={hoy}
            onSelect={setFechaSel}
          />

          <div className="agenda-grid">
            {diaSel ? (
              <AgendaDia
                dia={diaSel}
                onAddEvento={() => setModal({ tipo: "evento-nuevo", diaId: diaSel.id })}
                onEditEvento={(e) => setModal({ tipo: "evento-editar", eventoId: e.id })}
                onDeleteEvento={borrarEvento}
                onNotaEvento={(e) => setModal({ tipo: "nota-evento", eventoId: e.id })}
                onEditDia={() => setModal({ tipo: "dia-editar", diaId: diaSel.id })}
                onDeleteDia={() => borrarDia(diaSel)}
              />
            ) : (
              fechaSel && (
                <div className="panel">
                  <div className="panel-header">
                    <h2 className="panel-title">{fechaLarga(fechaSel)}</h2>
                  </div>
                  <p className="empty">Todavía no planeaste este día.</p>
                  <button type="button" onClick={() => empezarDia(fechaSel)}>
                    Empezar a planear este día
                  </button>
                </div>
              )
            )}
            <div className="side-col">
              {diaSel && (
                <NotaCard
                  titulo="Notas del día"
                  texto={diaSel.notas}
                  vacio="Sin notas para este día. Tocá el lápiz para anotar algo."
                  onEditar={() => setModal({ tipo: "nota-dia", diaId: diaSel.id })}
                />
              )}
              <NotaCard
                titulo="Notas del viaje"
                texto={viaje.notas}
                vacio="Sin notas generales. Ideal para datos que valen para todo el viaje."
                onEditar={() => setModal({ tipo: "nota-viaje" })}
              />
              <ViajerosCard
                viajeros={viajeros.filter((v) => viajeroIds.includes(v.id))}
                onGestionar={() => setModal({ tipo: "viajeros-viaje" })}
                onVer={(v) => setModal({ tipo: "viajero-ver", viajeroId: v.id })}
              />
              <ChecklistCard
                items={checklist}
                onToggle={alternarItem}
                onDelete={borrarItem}
                onAdd={agregarItem}
              />
            </div>
          </div>
        </>
      )}

      {vista === "mes" && <CalendarView dias={dias} />}

      {vista === "resumen" && (
        <ResumenViaje fechas={fechas} dias={dias} categorias={categorias} checklist={checklist} />
      )}

      {/* ---------- Modales (se montan solo cuando están abiertos) ---------- */}

      {modal?.tipo === "nota-viaje" && (
        <NotaModal
          title="Notas del viaje"
          subtitle={viaje.nombre}
          initial={viaje.notas ?? null}
          onSave={guardarNotaViaje}
          onClose={cerrarModal}
        />
      )}

      {modal?.tipo === "nota-dia" &&
        (() => {
          const dia = diaDeModal(modal.diaId);
          return dia ? (
            <NotaModal
              title="Notas del día"
              subtitle={fechaLarga(dia.fecha)}
              initial={dia.notas ?? null}
              onSave={(texto) => guardarNotaDia(dia.id, texto)}
              onClose={cerrarModal}
            />
          ) : null;
        })()}

      {modal?.tipo === "nota-evento" &&
        (() => {
          const evento = eventoDeModal(modal.eventoId);
          return evento ? (
            <NotaModal
              title={`Nota · ${evento.titulo}`}
              initial={evento.notas ?? null}
              onSave={(texto) => guardarNotaEvento(evento.id, texto)}
              onClose={cerrarModal}
            />
          ) : null;
        })()}

      {modal?.tipo === "dia-editar" &&
        (() => {
          const dia = diaDeModal(modal.diaId);
          return dia ? (
            <DiaModal
              dia={dia}
              onSave={(titulo) => guardarTituloDia(dia.id, titulo)}
              onClose={cerrarModal}
            />
          ) : null;
        })()}

      {modal?.tipo === "evento-nuevo" &&
        (() => {
          const dia = diaDeModal(modal.diaId);
          return dia ? (
            <EventoModal
              evento={null}
              categorias={categorias}
              subtitle={fechaLarga(dia.fecha)}
              onSave={(datos) => guardarEvento(dia.id, null, datos)}
              onClose={cerrarModal}
            />
          ) : null;
        })()}

      {modal?.tipo === "viajeros-viaje" && (
        <ViajerosViajeModal
          todos={viajeros}
          seleccionados={viajeroIds}
          onSave={guardarViajerosViaje}
          onClose={cerrarModal}
        />
      )}

      {modal?.tipo === "viajero-ver" &&
        (() => {
          const viajero = viajeros.find((v) => v.id === modal.viajeroId);
          return viajero ? (
            <ViajeroModal
              viajero={viajero}
              onSave={(datos) => guardarViajero(viajero.id, datos)}
              onClose={cerrarModal}
            />
          ) : null;
        })()}

      {modal?.tipo === "evento-editar" &&
        (() => {
          const evento = eventoDeModal(modal.eventoId);
          return evento ? (
            <EventoModal
              evento={evento}
              categorias={categorias}
              onSave={(datos) => guardarEvento(evento.dia_id, evento, datos)}
              onClose={cerrarModal}
            />
          ) : null;
        })()}
    </div>
  );
}
