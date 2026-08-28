import type { ReactNode } from 'react'
import Icono from './Icono'
import type { NombreIcono } from './Icono'

export interface TarjetaProps {
  titulo?: ReactNode
  /** Línea de apoyo bajo el título */
  subtitulo?: ReactNode
  /** Contenido alineado a la derecha del encabezado */
  accion?: ReactNode
  children: ReactNode
  className?: string
  /** Ancla para que el recorrido guiado pueda desplazarse hasta la tarjeta */
  id?: string
}

/** Superficie estándar de la app: un solo borde, un solo radio, una sombra. */
function Tarjeta({ titulo, subtitulo, accion, children, className = '', id }: TarjetaProps) {
  const conEncabezado = titulo || subtitulo || accion
  return (
    <section
      id={id}
      className={`min-w-0 scroll-mt-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(8,40,75,0.05)] dark:border-slate-700/70 dark:bg-slate-800/60 ${className}`}
    >
      {conEncabezado ? (
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {titulo ? (
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {titulo}
              </h3>
            ) : null}
            {subtitulo ? (
              <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {subtitulo}
              </p>
            ) : null}
          </div>
          {accion}
        </div>
      ) : null}
      {children}
    </section>
  )
}

export interface NotaProps {
  icono?: NombreIcono
  children: ReactNode
  /** 'neutra' informa, 'crece' habla de rendimiento, 'aviso' de condiciones */
  tono?: 'neutra' | 'crece' | 'aviso'
  className?: string
}

const TONOS_NOTA = {
  neutra:
    'border-popular-100 bg-popular-50/70 text-popular-800 dark:border-popular-900 dark:bg-popular-950/50 dark:text-popular-100',
  crece:
    'border-crece-400/30 bg-crece-50 text-crece-700 dark:border-crece-500/30 dark:bg-crece-700/15 dark:text-crece-400',
  aviso:
    'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400',
}

/** Bloque de contexto breve: explica una condición sin robar protagonismo. */
export function Nota({ icono = 'info', children, tono = 'neutra', className = '' }: NotaProps) {
  return (
    <p
      className={`flex items-start gap-2 rounded-xl border px-3 py-2.5 text-[11.5px] leading-relaxed ${TONOS_NOTA[tono]} ${className}`}
    >
      <span className="mt-px opacity-80">
        <Icono nombre={icono} tam={14} grosor={1.9} />
      </span>
      <span className="min-w-0">{children}</span>
    </p>
  )
}

export interface DatoProps {
  etiqueta: string
  valor: string
  detalle?: string
  /** Resalta la cifra: azul para saldo, verde para lo generado */
  tono?: 'neutro' | 'popular' | 'crece'
}

const TONOS_DATO = {
  neutro: 'text-slate-900 dark:text-slate-100',
  popular: 'text-popular-700 dark:text-popular-200',
  crece: 'text-crece-600 dark:text-crece-400',
}

/** Cifra con su etiqueta. Se usa en rejillas de 2 o 3 columnas. */
export function Dato({ etiqueta, valor, detalle, tono = 'neutro' }: DatoProps) {
  return (
    <div className="min-w-0">
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
        {etiqueta}
      </p>
      <p
        className={`mt-1 font-display text-[15px] font-bold tabular-nums ${TONOS_DATO[tono]}`}
      >
        {valor}
      </p>
      {detalle ? (
        <p className="mt-0.5 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
          {detalle}
        </p>
      ) : null}
    </div>
  )
}

export default Tarjeta
