import type { ReactNode } from 'react'
import Icono from '../ui/Icono'

export interface BarraAppProps {
  titulo: string
  /** Muestra la flecha de volver */
  onVolver?: () => void
  /** Acción a la derecha (ícono, contador…) */
  accion?: ReactNode
  /** Barra azul sobre fondo de color (pantallas de detalle) */
  invertida?: boolean
}

/** Encabezado de pantalla dentro del teléfono. */
function BarraApp({ titulo, onVolver, accion, invertida }: BarraAppProps) {
  const texto = invertida ? 'text-white' : 'text-slate-900 dark:text-slate-100'
  const hover = invertida
    ? 'hover:bg-white/15'
    : 'hover:bg-slate-100 dark:hover:bg-slate-800'

  return (
    <header className={`flex shrink-0 items-center gap-1 px-3 py-2.5 ${texto}`}>
      {onVolver ? (
        <button
          type="button"
          onClick={onVolver}
          aria-label="Volver"
          className={`-ml-1 rounded-full p-2 transition-colors ${hover}`}
        >
          <Icono nombre="atras" tam={19} grosor={2} />
        </button>
      ) : (
        // Hueco de la misma geometría que el botón: el título arranca en la
        // misma x haya o no flecha de volver.
        <span aria-hidden="true" className="-ml-1 block p-2">
          <span className="block h-[19px] w-[19px]" />
        </span>
      )}
      <h1 className="min-w-0 flex-1 truncate px-1 text-[15px] font-bold">{titulo}</h1>
      {accion}
    </header>
  )
}

export default BarraApp
