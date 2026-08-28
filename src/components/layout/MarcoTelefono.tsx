import type { ReactNode } from 'react'

export interface MarcoTelefonoProps {
  children: ReactNode
}

/**
 * Marco del dispositivo. En escritorio dibuja el teléfono (bisel, isla,
 * barra de estado) para que se lea como una app; en móvil desaparece y la
 * app ocupa la pantalla real. La app de adentro no sabe en cuál de los dos
 * está: es la misma pila de pantallas.
 */
function MarcoTelefono({ children }: MarcoTelefonoProps) {
  return (
    <div className="relative mx-auto h-full w-full sm:h-auto sm:w-[392px]">
      {/* Resplandor detrás del equipo, solo en escritorio */}
      <div
        aria-hidden="true"
        className="anillo-pulso absolute -inset-6 hidden rounded-[3.5rem] bg-popular-500/10 blur-2xl sm:block dark:bg-popular-400/10"
      />

      {/* El alto descuenta el cromo real de la página —barra superior de
          44px más el relleno vertical del contenedor— para que el documento
          no acabe con scroll propio: 5.75rem en sm (py-6) y 6.25rem en lg
          (py-7). */}
      <div className="pantalla-dispositivo relative flex h-full w-full flex-col overflow-hidden bg-white sm:h-[min(844px,calc(100vh-5.75rem))] sm:rounded-[2.9rem] sm:border-[11px] sm:border-slate-900 sm:shadow-[0_30px_70px_-20px_rgba(8,40,75,0.45)] lg:h-[min(844px,calc(100vh-6.25rem))] dark:bg-slate-950 dark:sm:border-slate-800">
        {/* Barra de estado simulada (solo con marco) */}
        <div className="relative hidden shrink-0 items-center justify-between px-7 pb-1 pt-3 text-[12px] font-semibold text-slate-900 sm:flex dark:text-slate-100">
          <span className="tabular-nums">9:41</span>
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-2 h-6 w-[86px] -translate-x-1/2 rounded-full bg-slate-900 dark:bg-slate-800"
          />
          <span className="flex items-center gap-1.5" aria-hidden="true">
            {/* Señal */}
            <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
              <rect x="0" y="7.5" width="3" height="3.5" rx="1" />
              <rect x="4.6" y="5" width="3" height="6" rx="1" />
              <rect x="9.2" y="2.5" width="3" height="8.5" rx="1" />
              <rect x="13.8" y="0" width="3" height="11" rx="1" />
            </svg>
            {/* Batería */}
            <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
              <rect
                x="0.6"
                y="0.6"
                width="21"
                height="10.8"
                rx="3"
                stroke="currentColor"
                strokeOpacity="0.4"
                strokeWidth="1.1"
              />
              <rect x="2.2" y="2.2" width="15" height="7.6" rx="1.8" fill="currentColor" />
              <path
                d="M23.2 4.2v3.6a2 2 0 0 0 0-3.6Z"
                fill="currentColor"
                fillOpacity="0.4"
              />
            </svg>
          </span>
        </div>

        {/* Lienzo de la app: aquí viven pantallas, hojas y celebraciones */}
        <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>

        {/* Indicador de inicio */}
        <div className="hidden shrink-0 justify-center pb-2 pt-1 sm:flex" aria-hidden="true">
          <span className="h-1 w-32 rounded-full bg-slate-900/25 dark:bg-slate-100/25" />
        </div>
      </div>
    </div>
  )
}

export default MarcoTelefono
