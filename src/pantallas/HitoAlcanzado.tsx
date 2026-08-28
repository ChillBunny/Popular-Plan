import { PRODUCTOS, PROPOSITOS } from '../data/catalogo'
import type { Hito } from '../data/catalogo'
import type { Plan } from '../utils/plan'
import { progreso, saldo } from '../utils/plan'
import { pesos } from '../utils/formato'
import Boton from '../components/ui/Boton'
import Confeti from '../components/ui/Confeti'
import Icono from '../components/ui/Icono'

export interface HitoAlcanzadoProps {
  plan: Plan
  hito: Hito
  onCerrar: () => void
}

/**
 * Celebración de hito intermedio. Aparece encima de la pantalla en curso y
 * hace dos cosas a la vez: reconoce la disciplina y presenta —en el momento
 * exacto en que tiene sentido— el producto del grupo que corresponde.
 */
function HitoAlcanzado({ plan, hito, onCerrar }: HitoAlcanzadoProps) {
  const proposito = PROPOSITOS[plan.proposito]
  const sugerencia = proposito.hitos[hito]
  const producto = PRODUCTOS[sugerencia.producto]

  return (
    <div className="animar-fundido absolute inset-0 z-40 flex flex-col overflow-y-auto bg-gradient-to-b from-popular-700 via-popular-600 to-popular-700 text-white dark:from-popular-950 dark:via-popular-900 dark:to-popular-950">
      <Confeti piezas={20} />

      <div className="relative flex min-h-full flex-col justify-between px-6 py-8">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="animar-sello relative flex h-28 w-28 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-white/10" />
            <span className="absolute inset-2 rounded-full border-2 border-white/30" />
            <span className="font-display text-[34px] font-extrabold tabular-nums">
              {hito}%
            </span>
          </div>

          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-popular-200">
            Hito alcanzado
          </p>
          <h2 className="mt-1.5 text-[25px] font-extrabold leading-tight">
            {sugerencia.titulo}
          </h2>
          <p className="mt-5 rounded-full bg-white/12 px-3.5 py-1.5 text-[12px] font-semibold tabular-nums">
            {pesos(saldo(plan))} · {Math.round(progreso(plan) * 100)}%
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-left backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                <Icono nombre={producto.icono} tam={19} grosor={1.9} />
              </span>
              <div className="min-w-0">
                <p className="text-[13.5px] font-bold">{producto.nombre}</p>
                <p className="mt-0.5 text-[11.5px] leading-relaxed text-popular-100">Tu siguiente paso</p>
              </div>
            </div>
          </div>

          <Boton tono="logro" tam="lg" ancho icono="adelante" iconoDerecha onClick={onCerrar}>
            {sugerencia.accion}
          </Boton>
          <button
            type="button"
            onClick={onCerrar}
            className="w-full rounded-xl py-2 text-[12.5px] font-semibold text-popular-100 transition-colors hover:text-white"
          >
            Seguir ahorrando
          </button>
        </div>
      </div>
    </div>
  )
}

export default HitoAlcanzado
