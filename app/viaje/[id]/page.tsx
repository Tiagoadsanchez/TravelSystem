"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CalendarView from "./CalendarView";
import { obtenerViaje } from "@/lib/data/viajes";
import { listarCategorias } from "@/lib/data/categorias";
import {
  listarDiasConEventos,
  crearDia as crearDiaRemoto,
  actualizarDia as actualizarDiaRemoto,
  eliminarDia as eliminarDiaRemoto,
} from "@/lib/data/dias";
import {
  crearEvento as crearEventoRemoto,
  actualizarEvento as actualizarEventoRemoto,
  eliminarEvento as eliminarEventoRemoto,
} from "@/lib/data/eventos";
import {
  listarChecklist,
  agregarItemChecklist as agregarItemChecklistRemoto,
  actualizarItemChecklist as actualizarItemChecklistRemoto,
  eliminarItemChecklist as eliminarItemChecklistRemoto,
} from "@/lib/data/checklist";
import type { Viaje, Dia, Categoria, ChecklistItem, Evento } from "@/lib/types";

export default function DetalleViaje() {
  const { id } = useParams<{ id: string }>();

  const [viaje, setViaje] = useState<Viaje | null>(null);
  const [dias, setDias] = useState<Dia[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vista, setVista] = useState<"lista" | "calendario">("lista");

  // formulario nuevo día
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [nuevoTitulo, setNuevoTitulo] = useState("");

  // edición de día
  const [diaEditando, setDiaEditando] = useState<string | null>(null);
  const [diaEditTitulo, setDiaEditTitulo] = useState("");

  // formulario nuevo evento (uno por día, controlado por diaFormAbierto)
  const [diaFormAbierto, setDiaFormAbierto] = useState<string | null>(null);
  const [evTitulo, setEvTitulo] = useState("");
  const [evUbicacion, setEvUbicacion] = useState("");
  const [evHoraInicio, setEvHoraInicio] = useState("");
  const [evHoraFin, setEvHoraFin] = useState("");
  const [evCategoria, setEvCategoria] = useState("");

  // edición de evento
  const [eventoEditando, setEventoEditando] = useState<string | null>(null);
  const [evEditTitulo, setEvEditTitulo] = useState("");
  const [evEditUbicacion, setEvEditUbicacion] = useState("");
  const [evEditHoraInicio, setEvEditHoraInicio] = useState("");
  const [evEditHoraFin, setEvEditHoraFin] = useState("");
  const [evEditCategoria, setEvEditCategoria] = useState("");

  // checklist
  const [nuevoItem, setNuevoItem] = useState("");

  async function cargarTodo() {
    setLoading(true);

    const { data: viajeData, error: errViaje } = await obtenerViaje(id);

    if (errViaje) {
      setError(errViaje.message);
      setLoading(false);
      return;
    }
    setViaje(viajeData);

    const { data: catsData } = await listarCategorias();
    setCategorias(catsData);

    const { data: diasData, error: errDias } = await listarDiasConEventos(id);

    if (errDias) {
      setError(errDias.message);
      setLoading(false);
      return;
    }
    setDias(diasData || []);

    const { data: checklistData } = await listarChecklist(id);
    setChecklist(checklistData);

    setLoading(false);
  }

  useEffect(() => {
    if (id) cargarTodo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ---------- DÍAS ----------

  async function agregarDia(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!nuevaFecha) {
      setError("Elegí una fecha para el nuevo día.");
      return;
    }
    const { error } = await crearDiaRemoto(id, nuevaFecha, nuevoTitulo || null);
    if (error) {
      setError(error.message);
      return;
    }
    setNuevaFecha("");
    setNuevoTitulo("");
    cargarTodo();
  }

  function empezarEdicionDia(dia: Dia) {
    setDiaEditando(dia.id);
    setDiaEditTitulo(dia.titulo || "");
  }

  async function guardarEdicionDia(diaId: string) {
    const { error } = await actualizarDiaRemoto(diaId, diaEditTitulo || null);
    if (error) {
      setError(error.message);
      return;
    }
    setDiaEditando(null);
    cargarTodo();
  }

  async function eliminarDia(diaId: string, fecha: string) {
    const confirmar = window.confirm(
      `¿Eliminar el día ${fecha}? Esto borra también sus actividades cargadas.`
    );
    if (!confirmar) return;
    const { error } = await eliminarDiaRemoto(diaId);
    if (error) {
      setError(error.message);
      return;
    }
    cargarTodo();
  }

  // ---------- EVENTOS ----------

  function abrirFormEvento(diaId: string) {
    setDiaFormAbierto(diaFormAbierto === diaId ? null : diaId);
    setEvTitulo("");
    setEvUbicacion("");
    setEvHoraInicio("");
    setEvHoraFin("");
    setEvCategoria("");
  }

  async function crearEvento(e: React.FormEvent, diaId: string) {
    e.preventDefault();
    setError(null);
    if (!evTitulo) {
      setError("El evento necesita al menos un título.");
      return;
    }
    const { error } = await crearEventoRemoto(diaId, {
      titulo: evTitulo,
      ubicacion: evUbicacion || null,
      hora_inicio: evHoraInicio || null,
      hora_fin: evHoraFin || null,
      categoria_id: evCategoria || null,
    });
    if (error) {
      setError(error.message);
      return;
    }
    setDiaFormAbierto(null);
    cargarTodo();
  }

  function empezarEdicionEvento(evento: Evento) {
    setEventoEditando(evento.id);
    setEvEditTitulo(evento.titulo);
    setEvEditUbicacion(evento.ubicacion || "");
    setEvEditHoraInicio(evento.hora_inicio || "");
    setEvEditHoraFin(evento.hora_fin || "");
    setEvEditCategoria(evento.categoria_id || "");
  }

  async function guardarEdicionEvento(eventoId: string) {
    const { error } = await actualizarEventoRemoto(eventoId, {
      titulo: evEditTitulo,
      ubicacion: evEditUbicacion || null,
      hora_inicio: evEditHoraInicio || null,
      hora_fin: evEditHoraFin || null,
      categoria_id: evEditCategoria || null,
    });
    if (error) {
      setError(error.message);
      return;
    }
    setEventoEditando(null);
    cargarTodo();
  }

  async function eliminarEvento(eventoId: string) {
    const confirmar = window.confirm("¿Eliminar esta actividad?");
    if (!confirmar) return;
    const { error } = await eliminarEventoRemoto(eventoId);
    if (error) {
      setError(error.message);
      return;
    }
    cargarTodo();
  }

  // ---------- CHECKLIST ----------

  async function agregarItemChecklist(e: React.FormEvent) {
    e.preventDefault();
    if (!nuevoItem.trim()) return;
    const { error } = await agregarItemChecklistRemoto(id, nuevoItem.trim());
    if (error) {
      setError(error.message);
      return;
    }
    setNuevoItem("");
    cargarTodo();
  }

  async function toggleItemChecklist(item: ChecklistItem) {
    const { error } = await actualizarItemChecklistRemoto(item.id, !item.completado);
    if (error) {
      setError(error.message);
      return;
    }
    cargarTodo();
  }

  async function eliminarItemChecklist(itemId: string) {
    const { error } = await eliminarItemChecklistRemoto(itemId);
    if (error) {
      setError(error.message);
      return;
    }
    cargarTodo();
  }

  if (loading) return <p className="empty">Cargando viaje...</p>;
  if (error && !viaje) return <p className="error">{error}</p>;
  if (!viaje) return <p className="empty">Viaje no encontrado.</p>;

  return (
    <div>
      <h1>{viaje.nombre}</h1>
      <p className="card-sub">
        {viaje.fecha_inicio} → {viaje.fecha_fin}
      </p>

      {error && <p className="error">{error}</p>}

      <div className="btn-row" style={{ margin: "20px 0" }}>
        <button
          className={vista === "lista" ? "" : "btn-secundario"}
          onClick={() => setVista("lista")}
        >
          Vista lista
        </button>
        <button
          className={vista === "calendario" ? "" : "btn-secundario"}
          onClick={() => setVista("calendario")}
        >
          Vista calendario
        </button>
      </div>

      {vista === "calendario" && <CalendarView dias={dias} />}

      {vista === "lista" && (
        <>
          <h2>Cronograma</h2>
          {dias.length === 0 && (
            <p className="empty">Este viaje todavía no tiene días cargados.</p>
          )}

          {dias.map((dia) => (
            <div className="dia-block" key={dia.id}>
              {diaEditando === dia.id ? (
                <div className="edit-block">
                  <label>Título del día</label>
                  <input
                    type="text"
                    value={diaEditTitulo}
                    onChange={(e) => setDiaEditTitulo(e.target.value)}
                  />
                  <div className="btn-row">
                    <button onClick={() => guardarEdicionDia(dia.id)}>
                      Guardar
                    </button>
                    <button
                      className="btn-secundario"
                      onClick={() => setDiaEditando(null)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="dia-header">
                  <div className="dia-fecha">
                    {dia.fecha} {dia.titulo ? `— ${dia.titulo}` : ""}
                  </div>
                  <div className="btn-row">
                    <button
                      className="btn-small"
                      onClick={() => abrirFormEvento(dia.id)}
                    >
                      + Actividad
                    </button>
                    <button
                      className="btn-small"
                      onClick={() => empezarEdicionDia(dia)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-small btn-danger"
                      onClick={() => eliminarDia(dia.id, dia.fecha)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )}

              {diaFormAbierto === dia.id && (
                <form
                  className="form-inline"
                  onSubmit={(e) => crearEvento(e, dia.id)}
                >
                  <label>Título</label>
                  <input
                    type="text"
                    placeholder="Ej: Visita al Coliseo"
                    value={evTitulo}
                    onChange={(e) => setEvTitulo(e.target.value)}
                  />
                  <label>Ubicación (opcional)</label>
                  <input
                    type="text"
                    value={evUbicacion}
                    onChange={(e) => setEvUbicacion(e.target.value)}
                  />
                  <div className="form-row">
                    <div>
                      <label>Hora inicio</label>
                      <input
                        type="time"
                        value={evHoraInicio}
                        onChange={(e) => setEvHoraInicio(e.target.value)}
                      />
                    </div>
                    <div>
                      <label>Hora fin</label>
                      <input
                        type="time"
                        value={evHoraFin}
                        onChange={(e) => setEvHoraFin(e.target.value)}
                      />
                    </div>
                  </div>
                  <label>Categoría</label>
                  <select
                    value={evCategoria}
                    onChange={(e) => setEvCategoria(e.target.value)}
                  >
                    <option value="">Sin categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                  <button type="submit">Guardar actividad</button>
                </form>
              )}

              {dia.eventos.length === 0 && (
                <p className="empty">Sin actividades cargadas para este día.</p>
              )}

              {dia.eventos.map((evento) =>
                eventoEditando === evento.id ? (
                  <div className="edit-block" key={evento.id}>
                    <label>Título</label>
                    <input
                      type="text"
                      value={evEditTitulo}
                      onChange={(e) => setEvEditTitulo(e.target.value)}
                    />
                    <label>Ubicación</label>
                    <input
                      type="text"
                      value={evEditUbicacion}
                      onChange={(e) => setEvEditUbicacion(e.target.value)}
                    />
                    <div className="form-row">
                      <div>
                        <label>Hora inicio</label>
                        <input
                          type="time"
                          value={evEditHoraInicio}
                          onChange={(e) => setEvEditHoraInicio(e.target.value)}
                        />
                      </div>
                      <div>
                        <label>Hora fin</label>
                        <input
                          type="time"
                          value={evEditHoraFin}
                          onChange={(e) => setEvEditHoraFin(e.target.value)}
                        />
                      </div>
                    </div>
                    <label>Categoría</label>
                    <select
                      value={evEditCategoria}
                      onChange={(e) => setEvEditCategoria(e.target.value)}
                    >
                      <option value="">Sin categoría</option>
                      {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nombre}
                        </option>
                      ))}
                    </select>
                    <div className="btn-row">
                      <button onClick={() => guardarEdicionEvento(evento.id)}>
                        Guardar
                      </button>
                      <button
                        className="btn-secundario"
                        onClick={() => setEventoEditando(null)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="evento" key={evento.id}>
                    <div
                      className="evento-color"
                      style={{
                        backgroundColor: evento.categorias?.color || "#ccc",
                      }}
                    />
                    <div className="evento-hora">
                      {evento.hora_inicio || "--:--"}
                      {evento.hora_fin ? ` - ${evento.hora_fin}` : ""}
                    </div>
                    <div className="evento-info">
                      <div className="titulo">{evento.titulo}</div>
                      {evento.ubicacion && (
                        <div className="ubicacion">{evento.ubicacion}</div>
                      )}
                    </div>
                    <div className="btn-row">
                      <button
                        className="btn-small"
                        onClick={() => empezarEdicionEvento(evento)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-small btn-danger"
                        onClick={() => eliminarEvento(evento.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          ))}

          <h2>Agregar día</h2>
          <form onSubmit={agregarDia}>
            <label>Fecha</label>
            <input
              type="date"
              value={nuevaFecha}
              onChange={(e) => setNuevaFecha(e.target.value)}
            />
            <label>Título (opcional)</label>
            <input
              type="text"
              placeholder="Ej: Llegada a Roma"
              value={nuevoTitulo}
              onChange={(e) => setNuevoTitulo(e.target.value)}
            />
            <button type="submit">Agregar día</button>
          </form>
        </>
      )}

      <h2>Checklist del viaje</h2>
      {checklist.length === 0 && (
        <p className="empty">Todavía no agregaste nada a la lista.</p>
      )}
      {checklist.map((item) => (
        <div className="checklist-item" key={item.id}>
          <label className="checklist-label">
            <input
              type="checkbox"
              checked={item.completado}
              onChange={() => toggleItemChecklist(item)}
            />
            <span className={item.completado ? "tachado" : ""}>
              {item.descripcion}
            </span>
          </label>
          <button
            className="btn-small btn-danger"
            onClick={() => eliminarItemChecklist(item.id)}
          >
            Eliminar
          </button>
        </div>
      ))}
      <form onSubmit={agregarItemChecklist} style={{ marginTop: 12 }}>
        <label>Nuevo ítem</label>
        <input
          type="text"
          placeholder="Ej: Llevar cargador portátil"
          value={nuevoItem}
          onChange={(e) => setNuevoItem(e.target.value)}
        />
        <button type="submit">Agregar a la lista</button>
      </form>
    </div>
  );
}
