export interface DeslizadorProps {
  etiqueta: string
  /** Valor ya formateado que se muestra en grande */
  valorTexto: string
  valor: number
  min: number
  max: number
  paso: number
  onChange: (valor: number) => void
  /** Referencias bajo el riel (mínimo y máximo escritos) */
  extremos?: [string, string]
  /** Apoyo bajo el control (ej. la fecha que resulta del plazo) */
  ayuda?: string
}

/**
 * Control de monto y plazo. El riel dibuja su propio progreso vía la
 * variable --progreso (ver index.css): el nativo se ve distinto en cada
 * navegador y en Windows llega a dibujarse cuadrado.
 *
 * ANATOMÍA FIJA: encabezado, riel, extremos y ayuda ocupan siempre el mismo
 * alto, aunque la ayuda esté vacía. Sin esto, un texto que aparece al cruzar
 * un umbral (ej. "llegas después de tu fecha") empujaba todo lo de abajo
 * mientras el dedo seguía arrastrando el riel.
 */
function Deslizador({
  etiqueta,
  valorTexto,
  valor,
  min,
  max,
  paso,
  onChange,
  extremos,
  ayuda,
}: DeslizadorProps) {
  const avance = max === min ? 0 : ((valor - min) / (max - min)) * 100

  return (
    <div>
      <div className="flex min-h-[26px] items-baseline justify-between gap-3">
        <label className="text-[11.5px] font-semibold text-slate-600 dark:text-slate-300">
          {etiqueta}
        </label>
        <span className="font-display text-lg font-extrabold tabular-nums text-popular-700 dark:text-popular-200">
          {valorTexto}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={paso}
        value={valor}
        aria-label={etiqueta}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ ['--progreso' as string]: `${avance}%` }}
        className="mt-1.5"
      />

      <div className="flex h-4 items-start justify-between text-[10.5px] tabular-nums text-slate-400 dark:text-slate-500">
        <span>{extremos ? extremos[0] : ''}</span>
        <span>{extremos ? extremos[1] : ''}</span>
      </div>

      {/* Ranura de ayuda: existe siempre, con o sin texto. */}
      <p
        aria-live="polite"
        className="min-h-[32px] text-[11.5px] leading-snug text-slate-500 dark:text-slate-400"
      >
        {ayuda}
      </p>
    </div>
  )
}

export default Deslizador
