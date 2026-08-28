import type { ButtonHTMLAttributes, ReactNode } from 'react'
import Icono from './Icono'
import type { NombreIcono } from './Icono'

export type TonoBoton = 'primario' | 'secundario' | 'suave' | 'texto' | 'logro'
export type TamBoton = 'md' | 'lg'

export interface BotonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tono?: TonoBoton
  tam?: TamBoton
  /** Ocupa todo el ancho: el patrón por defecto dentro del teléfono */
  ancho?: boolean
  icono?: NombreIcono
  /** El ícono va a la derecha (acciones de avance) */
  iconoDerecha?: boolean
  children: ReactNode
}

const TONOS: Record<TonoBoton, string> = {
  primario:
    'bg-popular-600 text-white shadow-sm shadow-popular-900/20 hover:bg-popular-700 active:bg-popular-800 disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none dark:disabled:bg-slate-700 dark:disabled:text-slate-500',
  secundario:
    'border border-popular-200 bg-white text-popular-700 hover:border-popular-400 hover:bg-popular-50 dark:border-slate-600 dark:bg-slate-800 dark:text-popular-200 dark:hover:border-popular-400 dark:hover:bg-slate-700',
  suave:
    'bg-popular-50 text-popular-700 hover:bg-popular-100 dark:bg-popular-900/40 dark:text-popular-200 dark:hover:bg-popular-900/70',
  texto:
    'text-popular-700 hover:bg-popular-50 dark:text-popular-200 dark:hover:bg-slate-800',
  logro:
    'bg-logro-500 text-white shadow-sm shadow-logro-600/25 hover:bg-logro-600 active:bg-logro-600',
}

const TAMS: Record<TamBoton, string> = {
  md: 'h-10 px-4 text-[13px]',
  lg: 'h-12 px-5 text-sm',
}

/** Botón único de la app: el tono comunica jerarquía, el tamaño el contexto. */
function Boton({
  tono = 'primario',
  tam = 'md',
  ancho,
  icono,
  iconoDerecha,
  children,
  className = '',
  ...resto
}: BotonProps) {
  return (
    <button
      type="button"
      {...resto}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors disabled:cursor-not-allowed ${
        TONOS[tono]
      } ${TAMS[tam]} ${ancho ? 'w-full' : ''} ${className}`}
    >
      {icono && !iconoDerecha ? <Icono nombre={icono} tam={16} grosor={2} /> : null}
      <span className="truncate">{children}</span>
      {icono && iconoDerecha ? <Icono nombre={icono} tam={16} grosor={2} /> : null}
    </button>
  )
}

export default Boton
