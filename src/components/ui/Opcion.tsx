import Icono from './Icono'
import type { NombreIcono } from './Icono'

export interface OpcionProps {
  titulo: string
  detalle?: string
  icono?: NombreIcono
  seleccionada: boolean
  onSelect: () => void
  /** Distintivo en la esquina (ej. "Piloto") */
  insignia?: string
  /** Tarjeta alta con ícono grande (selección de propósito) */
  destacada?: boolean
}

/**
 * Opción seleccionable. El estado se comunica con borde y fondo, nunca solo
 * con color: también aparece la marca de verificación.
 */
function Opcion({
  titulo,
  detalle,
  icono,
  seleccionada,
  onSelect,
  insignia,
  destacada,
}: OpcionProps) {
  const base = seleccionada
    ? 'border-popular-600 bg-popular-50 dark:border-popular-400 dark:bg-popular-900/40'
    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-slate-600'

  if (destacada) {
    return (
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={seleccionada}
        className={`relative flex flex-col items-start gap-2 rounded-2xl border p-3.5 text-left transition-colors ${base}`}
      >
        {insignia ? (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-logro-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-logro-600 dark:bg-logro-500/15 dark:text-logro-400">
            {insignia}
          </span>
        ) : null}
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
            seleccionada
              ? 'bg-popular-600 text-white dark:bg-popular-400 dark:text-popular-950'
              : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300'
          }`}
        >
          {icono ? <Icono nombre={icono} tam={19} grosor={1.8} /> : null}
        </span>
        <span className="min-w-0">
          <span className="block text-[13px] font-bold text-slate-900 dark:text-slate-100">
            {titulo}
          </span>
          {detalle ? (
            <span className="mt-0.5 block text-[11px] leading-snug text-slate-500 dark:text-slate-400">
              {detalle}
            </span>
          ) : null}
        </span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={seleccionada}
      className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${base}`}
    >
      {icono ? (
        <span
          className={
            seleccionada
              ? 'text-popular-700 dark:text-popular-200'
              : 'text-slate-400 dark:text-slate-500'
          }
        >
          <Icono nombre={icono} tam={18} grosor={1.8} />
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[12.5px] font-semibold text-slate-900 dark:text-slate-100">
          {titulo}
        </span>
        {detalle ? (
          <span className="block truncate text-[11px] text-slate-500 dark:text-slate-400">
            {detalle}
          </span>
        ) : null}
      </span>
      <span
        className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border transition-colors ${
          seleccionada
            ? 'border-popular-600 bg-popular-600 text-white dark:border-popular-400 dark:bg-popular-400 dark:text-popular-950'
            : 'border-slate-300 dark:border-slate-600'
        }`}
      >
        {seleccionada ? <Icono nombre="cheque" tam={10} grosor={3.4} /> : null}
      </span>
    </button>
  )
}

export default Opcion
