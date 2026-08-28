import Icono from '../ui/Icono'
import type { NombreIcono } from '../ui/Icono'

export type PestanaId = 'inicio' | 'invertir' | 'perfil'

const PESTANAS: { id: PestanaId; etiqueta: string; icono: NombreIcono }[] = [
  { id: 'inicio', etiqueta: 'Mis metas', icono: 'bandera' },
  { id: 'invertir', etiqueta: 'Invertir', icono: 'bolsa' },
  { id: 'perfil', etiqueta: 'Perfil', icono: 'usuario' },
]

export interface BarraPestanasProps {
  activa: PestanaId
  onCambiar: (id: PestanaId) => void
}

function BarraPestanas({ activa, onCambiar }: BarraPestanasProps) {
  return (
    <nav
      aria-label="Secciones"
      className="flex shrink-0 items-stretch border-t border-slate-200 bg-white/95 px-2 pb-1 pt-1.5 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95"
    >
      {PESTANAS.map((pestana) => {
        const seleccionada = pestana.id === activa
        return (
          <button
            key={pestana.id}
            type="button"
            onClick={() => onCambiar(pestana.id)}
            aria-current={seleccionada ? 'page' : undefined}
            className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[10.5px] font-semibold transition-colors ${
              seleccionada
                ? 'text-popular-700 dark:text-popular-200'
                : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
            }`}
          >
            <Icono nombre={pestana.icono} tam={21} grosor={seleccionada ? 2.1 : 1.7} />
            {pestana.etiqueta}
          </button>
        )
      })}
    </nav>
  )
}

export default BarraPestanas
