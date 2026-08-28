import { useState } from 'react'
import type { ReactNode } from 'react'
import { IDENTIDAD, RECORRIDO } from '../../data/presentacion'
import type { NotaPantalla } from '../../data/presentacion'
import { PRODUCTOS } from '../../data/catalogo'
import { useTema } from '../../theme/tema'
import Icono from '../ui/Icono'
import SobreElProyecto from './SobreElProyecto'

export interface EscenarioProps {
  /** Nota de la pantalla que se está viendo */
  nota: NotaPantalla
  /** Paso del recorrido activo (-1 si el usuario navega libre) */
  paso: number
  onPaso: (indice: number) => void
  onReiniciar: () => void
  children: ReactNode
}

function BotonTema() {
  const { tema, alternar } = useTema()
  const oscuro = tema === 'oscuro'
  return (
    <button
      type="button"
      onClick={(e) => alternar(e.clientX, e.clientY)}
      role="switch"
      aria-checked={oscuro}
      aria-label={oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={oscuro ? 'Modo claro' : 'Modo oscuro'}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-popular-300 hover:text-popular-700 dark:border-slate-700 dark:text-slate-400 dark:hover:border-popular-500 dark:hover:text-popular-200"
    >
      <Icono nombre={oscuro ? 'sol' : 'luna'} tam={15} grosor={2} />
    </button>
  )
}

function Marca() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-popular-600 text-white">
        <Icono nombre="bandera" tam={18} grosor={2.1} />
      </span>
      <span className="min-w-0">
        <span className="block font-display text-[15px] font-extrabold leading-tight text-slate-900 dark:text-slate-50">
          {IDENTIDAD.nombre}
        </span>
        <span className="block text-[10.5px] leading-tight text-slate-500 dark:text-slate-400">
          {IDENTIDAD.contexto}
        </span>
      </span>
    </div>
  )
}

/** Lista de pasos del recorrido; también sirve de índice de la demo. */
function Recorrido({ paso, onPaso }: { paso: number; onPaso: (i: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
          Recorrido guiado
        </h3>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onPaso(Math.max(0, paso - 1))}
            disabled={paso <= 0}
            aria-label="Paso anterior"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-popular-300 hover:text-popular-700 disabled:opacity-35 dark:border-slate-700 dark:text-slate-400"
          >
            <Icono nombre="atras" tam={14} grosor={2.2} />
          </button>
          <button
            type="button"
            onClick={() => onPaso(Math.min(RECORRIDO.length - 1, paso + 1))}
            disabled={paso >= RECORRIDO.length - 1}
            aria-label="Paso siguiente"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-popular-300 hover:text-popular-700 disabled:opacity-35 dark:border-slate-700 dark:text-slate-400"
          >
            <Icono nombre="adelante" tam={14} grosor={2.2} />
          </button>
        </div>
      </div>

      <ol className="mt-2.5 space-y-1">
        {RECORRIDO.map((item, i) => {
          const activo = i === paso
          return (
            <li key={item.titulo}>
              <button
                type="button"
                onClick={() => onPaso(i)}
                className={`flex w-full gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors ${
                  activo
                    ? 'bg-popular-50 dark:bg-popular-950/60'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800/70'
                }`}
              >
                <span
                  className={`mt-px flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-[9.5px] font-bold ${
                    activo
                      ? 'bg-popular-600 text-white dark:bg-popular-400 dark:text-popular-950'
                      : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span
                    className={`block text-[11.5px] font-semibold leading-snug ${
                      activo
                        ? 'text-popular-800 dark:text-popular-100'
                        : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {item.titulo}
                  </span>
                  {/* El resumen se muestra siempre: si solo apareciera en el
                      paso activo, cambiar de paso reacomodaría toda la lista. */}
                  <span
                    className={`mt-0.5 block text-[11px] leading-snug ${
                      activo
                        ? 'text-slate-500 dark:text-slate-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {item.resumen}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

/** Qué se está viendo y qué activos del grupo intervienen. */
function NotaDePantalla({ nota }: { nota: NotaPantalla }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/60">
      <h3 className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
        En esta pantalla
      </h3>
      {/* Alturas reservadas para la nota más larga: al navegar entre
          pantallas el recorrido de abajo se queda donde está. */}
      <p className="mt-2 min-h-[38px] font-display text-[14px] font-bold leading-snug text-slate-900 dark:text-slate-50">
        {nota.titulo}
      </p>
      <p className="mt-1.5 min-h-[114px] text-[12px] leading-relaxed text-slate-600 dark:text-slate-300">
        {nota.texto}
      </p>
      <div className="mt-3 flex min-h-[46px] flex-wrap content-start gap-1.5">
        {nota.activos.map((id) => (
          <span
            key={id}
            className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10.5px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-200"
          >
            <Icono nombre={PRODUCTOS[id].icono} tam={11} grosor={2.2} />
            {PRODUCTOS[id].nombre}
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * Marco de presentación. En escritorio rodea al teléfono con el argumento
 * del proyecto a la izquierda y la narración de la pantalla a la derecha; en
 * móvil se reduce a una barra fina y una vista de información, para que la
 * app ocupe la pantalla completa.
 */
function Escenario({ nota, paso, onPaso, onReiniciar, children }: EscenarioProps) {
  const [info, setInfo] = useState(false)

  return (
    <div className="fondo-escenario min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Barra fina de móvil */}
      <div className="flex h-11 items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 lg:hidden dark:border-slate-800 dark:bg-slate-900">
        <Marca />
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onReiniciar}
            aria-label="Reiniciar la demostración"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:text-popular-700 dark:border-slate-700 dark:text-slate-400"
          >
            <Icono nombre="reiniciar" tam={15} grosor={2} />
          </button>
          <button
            type="button"
            onClick={() => setInfo(true)}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-[11.5px] font-semibold text-slate-600 transition-colors hover:text-popular-700 dark:border-slate-700 dark:text-slate-300"
          >
            <Icono nombre="info" tam={14} grosor={2} />
            Proyecto
          </button>
          <BotonTema />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1440px] flex-col sm:items-center sm:py-6 lg:flex-row lg:justify-center lg:gap-7 lg:px-6 lg:py-7 xl:gap-9">
        {/* Columna del argumento (solo pantallas anchas) */}
        <aside className="hidden max-h-[calc(100vh-3.5rem)] w-[310px] shrink-0 overflow-y-auto pr-1 xl:block">
          <Marca />
          <div className="mt-5">
            <SobreElProyecto />
          </div>
        </aside>

        {/* El teléfono */}
        <div className="h-[calc(100dvh-2.75rem)] shrink-0 sm:h-auto">{children}</div>

        {/* Columna de narración y controles */}
        <aside className="hidden max-h-[calc(100vh-3.5rem)] w-[336px] shrink-0 space-y-4 overflow-y-auto pr-1 lg:block">
          <div className="flex items-center justify-between gap-2">
            <span className="xl:hidden">
              <Marca />
            </span>
            <span className="hidden text-[10.5px] font-bold uppercase tracking-[0.16em] text-slate-400 xl:block dark:text-slate-500">
              Demostración
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onReiniciar}
                aria-label="Reiniciar la demostración"
                title="Reiniciar la demostración"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-popular-300 hover:text-popular-700 dark:border-slate-700 dark:text-slate-400 dark:hover:border-popular-500"
              >
                <Icono nombre="reiniciar" tam={15} grosor={2} />
              </button>
              <BotonTema />
            </div>
          </div>

          <NotaDePantalla nota={nota} />
          <Recorrido paso={paso} onPaso={onPaso} />

          <p className="pb-2 text-[10.5px] leading-relaxed text-slate-400 dark:text-slate-500">
            Prototipo de demostración. Cliente, metas y montos son ficticios; los
            rendimientos son estimaciones de la simulación y no una tasa ofrecida.
          </p>
        </aside>
      </div>

      {/* Información del proyecto en móvil */}
      {info ? (
        <div className="animar-fundido fixed inset-0 z-50 flex flex-col bg-white lg:hidden dark:bg-slate-950">
          <div className="flex h-12 shrink-0 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
            <h2 className="font-display text-[15px] font-extrabold text-slate-900 dark:text-slate-50">
              Sobre el proyecto
            </h2>
            <button
              type="button"
              onClick={() => setInfo(false)}
              aria-label="Cerrar"
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
            >
              <Icono nombre="cerrar" tam={18} grosor={2} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-5">
            <SobreElProyecto />
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Escenario
