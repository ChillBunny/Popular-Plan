import { useId } from 'react'
import type { ReactNode } from 'react'
import { HITOS } from '../../data/catalogo'

export interface AnilloProgresoProps {
  /** Avance 0–1 */
  valor: number
  /** Diámetro en px */
  tam?: number
  /** Contenido centrado (cifra grande + apoyo) */
  children?: ReactNode
  /** Marca los hitos 25/60 sobre el aro */
  conHitos?: boolean
}

const R = 86
const CIRC = 2 * Math.PI * R

/** Punto sobre la circunferencia para un avance dado (0–1), desde arriba. */
function puntoEnAro(fraccion: number) {
  const angulo = fraccion * 2 * Math.PI - Math.PI / 2
  return { x: 100 + R * Math.cos(angulo), y: 100 + R * Math.sin(angulo) }
}

/**
 * Anillo de avance de la meta. El degradado va del azul institucional al
 * verde de crecimiento: el mismo aro cuenta las dos mitades de la historia
 * —lo que aportas y lo que el dinero genera— sin necesidad de leyenda.
 */
function AnilloProgreso({ valor, tam = 200, children, conHitos = true }: AnilloProgresoProps) {
  const avance = Math.max(0, Math.min(1, valor))
  const id = useId()
  const gradiente = `aro-${id}`

  return (
    <div className="relative" style={{ width: tam, height: tam }}>
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
        <defs>
          {/* Los colores van por `style` y no por atributo: var() no se
              resuelve en atributos de presentación SVG. */}
          <linearGradient id={gradiente} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" style={{ stopColor: 'var(--color-popular-500)' }} />
            <stop offset="70%" style={{ stopColor: 'var(--color-popular-400)' }} />
            <stop offset="100%" style={{ stopColor: 'var(--color-crece-500)' }} />
          </linearGradient>
        </defs>

        <circle
          cx="100"
          cy="100"
          r={R}
          fill="none"
          strokeWidth="13"
          className="stroke-slate-200/90 dark:stroke-slate-700/70"
        />

        <circle
          cx="100"
          cy="100"
          r={R}
          fill="none"
          stroke={`url(#${gradiente})`}
          strokeWidth="13"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC * (1 - avance)}
          style={{ transition: 'stroke-dashoffset 700ms cubic-bezier(0.22, 1, 0.36, 1)' }}
        />

        {conHitos
          ? HITOS.filter((h) => h < 100).map((hito) => {
              const punto = puntoEnAro(hito / 100)
              const alcanzado = avance * 100 >= hito
              return (
                <circle
                  key={hito}
                  cx={punto.x}
                  cy={punto.y}
                  r="4.5"
                  className={
                    alcanzado
                      ? 'fill-white dark:fill-slate-900'
                      : 'fill-slate-300 dark:fill-slate-600'
                  }
                />
              )
            })
          : null}
      </svg>

      {children ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 text-center">
          {children}
        </div>
      ) : null}
    </div>
  )
}

export default AnilloProgreso
