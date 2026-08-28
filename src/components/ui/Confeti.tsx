import { useMemo } from 'react'

const COLORES = [
  'var(--color-popular-500)',
  'var(--color-popular-300)',
  'var(--color-crece-500)',
  'var(--color-logro-400)',
]

export interface ConfetiProps {
  /** Cantidad de piezas; la celebración mayor usa más */
  piezas?: number
}

/**
 * Confeti de celebración: piezas absolutas que caen una sola vez. Sin
 * librería ni canvas — son 24 divs con una animación de transform, y
 * `prefers-reduced-motion` las deja quietas (ver index.css).
 */
function Confeti({ piezas = 24 }: ConfetiProps) {
  // Semilla fija por montaje: el confeti no debe re-barajarse en cada render.
  const trozos = useMemo(
    () =>
      Array.from({ length: piezas }, (_, i) => ({
        izquierda: (i * 37) % 100,
        retraso: (i % 8) * 140,
        duracion: 2200 + ((i * 173) % 1400),
        color: COLORES[i % COLORES.length],
        ancho: i % 3 === 0 ? 5 : 7,
        alto: i % 4 === 0 ? 12 : 8,
      })),
    [piezas],
  )

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {trozos.map((trozo, i) => (
        <span
          key={i}
          className="absolute top-0 block rounded-[2px]"
          style={{
            left: `${trozo.izquierda}%`,
            width: trozo.ancho,
            height: trozo.alto,
            background: trozo.color,
            animation: `caer-confeti ${trozo.duracion}ms cubic-bezier(0.3, 0.6, 0.5, 1) ${trozo.retraso}ms forwards`,
          }}
        />
      ))}
    </div>
  )
}

export default Confeti
