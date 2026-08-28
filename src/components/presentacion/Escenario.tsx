import { useState } from 'react'
import type { ReactNode } from 'react'
import { IDENTIDAD, RECORRIDO } from '../../data/presentacion'
import type { NotaPantalla } from '../../data/presentacion'
import { PRODUCTOS } from '../../data/catalogo'
import { useTema } from '../../theme/tema'
import Icono from '../ui/Icono'

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
      <p className="font-display text-[14px] font-bold leading-snug text-slate-900 dark:text-slate-50">
        {nota.titulo}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
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

/* ------------------------------------------------------------------ */
/* Drawer lateral: panel deslizante con backdrop                       */
/* ------------------------------------------------------------------ */

type DrawerLado = 'izquierdo' | 'derecho'

function Drawer({
  abierto,
  lado,
  onCerrar,
  titulo,
  children,
}: {
  abierto: boolean
  lado: DrawerLado
  onCerrar: () => void
  titulo: string
  children: ReactNode
}) {
  if (!abierto) return null

  const esIzquierdo = lado === 'izquierdo'
  const posicion = esIzquierdo ? 'left-0' : 'right-0'
  const slide = esIzquierdo ? 'animar-drawer-izq' : 'animar-drawer-der'

  return (
    <div className="animar-fundido fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <button
        type="button"
        onClick={onCerrar}
        aria-label="Cerrar panel"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
      />
      {/* Panel */}
      <div
        className={`${slide} ${posicion} absolute top-0 bottom-0 flex w-[360px] max-w-[85vw] flex-col border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 ${
          esIzquierdo ? 'border-r' : 'border-l'
        }`}
      >
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
          <h2 className="font-display text-[15px] font-extrabold text-slate-900 dark:text-slate-50">
            {titulo}
          </h2>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
          >
            <Icono nombre="cerrar" tam={18} grosor={2} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-5">
          {children}
        </div>
      </div>
    </div>
  )
}

/**
 * Marco de presentación. En todas las pantallas, el teléfono está centrado
 * y los paneles de contexto (argumento del proyecto + narración/recorrido)
 * se abren bajo demanda desde botones discretos en la barra superior.
 *
 * En móvil la barra se simplifica; en escritorio los botones se mantienen
 * compactos para no competir con la app.
 */
function Escenario({ nota, paso, onPaso, onReiniciar, children }: EscenarioProps) {
  const [panelDer, setPanelDer] = useState(false)

  const botonClase =
    'flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-popular-300 hover:text-popular-700 dark:border-slate-700 dark:text-slate-400 dark:hover:border-popular-500 dark:hover:text-popular-200'

  return (
    <div className="fondo-escenario min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Barra superior: marca + 2 botones */}
      <div className="flex h-11 items-center justify-between gap-2 border-b border-slate-200/80 bg-white/80 px-3 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80">
        <Marca />
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setPanelDer(true)}
            aria-label="Recorrido guiado"
            title="Recorrido guiado"
            className={botonClase}
          >
            <Icono nombre="crecer" tam={15} grosor={2} />
          </button>
          <BotonTema />
        </div>
      </div>

      {/* Contenido centrado: solo el teléfono */}
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center justify-center sm:py-6 lg:py-7">
        <div className="h-[calc(100dvh-2.75rem)] shrink-0 sm:h-auto">{children}</div>
      </div>

      {/* Drawer derecho: Narración + Recorrido guiado + Reiniciar */}
      <Drawer
        abierto={panelDer}
        lado="derecho"
        onCerrar={() => setPanelDer(false)}
        titulo="Demostración"
      >
        <div className="space-y-4">
          <NotaDePantalla nota={nota} />
          <Recorrido paso={paso} onPaso={(i) => { onPaso(i); setPanelDer(false) }} />
          <button
            type="button"
            onClick={() => { onReiniciar(); setPanelDer(false) }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-[12px] font-semibold text-slate-600 transition-colors hover:border-popular-300 hover:bg-popular-50 hover:text-popular-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-popular-500 dark:hover:bg-popular-950/40"
          >
            <Icono nombre="reiniciar" tam={14} grosor={2} />
            Reiniciar demostración
          </button>
        </div>
      </Drawer>
    </div>
  )
}

export default Escenario
