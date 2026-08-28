import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import Icono from './Icono'

export interface HojaProps {
  abierta: boolean
  onCerrar: () => void
  titulo: string
  /** Línea de apoyo bajo el título */
  descripcion?: string
  children: ReactNode
}

/**
 * Hoja inferior. Vive dentro del marco del teléfono (absolute, no fixed):
 * en escritorio el prototipo se ve como una app, no como un modal del sitio.
 */
function Hoja({ abierta, onCerrar, titulo, descripcion, children }: HojaProps) {
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!abierta) return
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCerrar()
    }
    window.addEventListener('keydown', alTeclear)
    // El foco entra a la hoja para que el teclado no siga en la pantalla
    // de atrás mientras está abierta.
    panel.current?.focus()
    return () => window.removeEventListener('keydown', alTeclear)
  }, [abierta, onCerrar])

  if (!abierta) return null

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onCerrar}
        className="animar-fundido absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"
      />
      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        className="animar-hoja relative max-h-[85%] overflow-y-auto rounded-t-3xl border-t border-slate-200 bg-white pb-6 outline-none dark:border-slate-700 dark:bg-slate-900"
      >
        <div className="sticky top-0 z-10 rounded-t-3xl bg-white/95 px-5 pb-3 pt-3 backdrop-blur dark:bg-slate-900/95">
          <span
            aria-hidden="true"
            className="mx-auto mb-3 block h-1 w-10 rounded-full bg-slate-300 dark:bg-slate-600"
          />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {titulo}
              </h2>
              {descripcion ? (
                <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {descripcion}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onCerrar}
              aria-label="Cerrar"
              className="-mr-1 -mt-1 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <Icono nombre="cerrar" tam={18} grosor={2} />
            </button>
          </div>
        </div>
        <div className="px-5">{children}</div>
      </div>
    </div>
  )
}

export default Hoja
