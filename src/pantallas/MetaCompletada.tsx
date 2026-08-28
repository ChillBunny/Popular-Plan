import { PRODUCTOS, PROPOSITOS } from '../data/catalogo'
import type { Plan } from '../utils/plan'
import { saldo } from '../utils/plan'
import { pesos, plazoLargo } from '../utils/formato'
import BarraApp from '../components/layout/BarraApp'
import Boton from '../components/ui/Boton'
import Confeti from '../components/ui/Confeti'
import Icono from '../components/ui/Icono'
import Tarjeta from '../components/ui/Tarjeta'

export interface MetaCompletadaProps {
  plan: Plan
  onVolver: () => void
}

/**
 * El momento que justifica todo el producto: la meta se completó y, en la
 * misma pantalla, se abre el puente hacia la compra que motivó el ahorro.
 * Aquí es donde Popular Plan deja de ser una cuenta con nombre bonito.
 *
 * Ninguna opción promete aprobación: todas terminan en una conversación con
 * un asesor, que es como funcionan de verdad las alianzas.
 */
function MetaCompletada({ plan, onVolver }: MetaCompletadaProps) {
  const proposito = PROPOSITOS[plan.proposito]
  const destino = proposito.destino
  const producto = PRODUCTOS[destino.producto]

  return (
    <>
      <div className="relative shrink-0 overflow-hidden bg-gradient-to-b from-popular-700 to-popular-600 pb-7 text-white dark:from-popular-950 dark:to-popular-800">
        <Confeti piezas={34} />
        <div className="relative">
          <BarraApp titulo="" onVolver={onVolver} invertida />

          <div className="flex flex-col items-center px-6 text-center">
            <span className="animar-sello flex h-20 w-20 items-center justify-center rounded-full bg-white text-popular-700">
              <Icono nombre="cheque" tam={38} grosor={2.6} />
            </span>

            <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-popular-200">
              Meta completada
            </p>
            <h1 className="mt-1.5 text-[26px] font-extrabold leading-tight">
              {destino.titulo}
            </h1>
            <p className="mt-2 text-[13px] text-popular-100">{plan.nombre}</p>

            <p className="mt-5 font-display text-[32px] font-extrabold leading-none tabular-nums">
              {pesos(saldo(plan))}
            </p>

            <div className="mt-4 flex w-full max-w-[19rem] gap-2">
              <span className="flex-1 rounded-xl bg-white/12 px-3 py-2.5 text-left">
                <span className="block text-[10px] uppercase tracking-wider text-popular-200">
                  Lo puso tu dinero
                </span>
                <span className="mt-0.5 block text-[13px] font-bold tabular-nums">
                  {pesos(plan.rendimiento)}
                </span>
              </span>
              <span className="flex-1 rounded-xl bg-white/12 px-3 py-2.5 text-left">
                <span className="block text-[10px] uppercase tracking-wider text-popular-200">
                  Te tomó
                </span>
                <span className="mt-0.5 block text-[13px] font-bold">
                  {plazoLargo(plan.meses)}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="animar-vista min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-6 pt-4">
        <h2 className="px-1 text-[15px] font-bold text-slate-900 dark:text-slate-100">Ahora eliges tu destino</h2>

        <Tarjeta>
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-popular-600 text-white dark:bg-popular-500">
              <Icono nombre={producto.icono} tam={21} grosor={1.9} />
            </span>
            <div className="min-w-0">
              <p className="text-[14px] font-bold text-slate-900 dark:text-slate-100">
                {producto.nombre}
              </p>
              <p className="mt-0.5 text-[11.5px] leading-relaxed text-slate-500 dark:text-slate-400">
                {destino.respaldo}
              </p>
            </div>
          </div>

          <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-700/60">
            {destino.opciones.map((opcion) => (
              <li key={opcion.titulo}>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 py-3 text-left transition-colors hover:text-popular-700 dark:hover:text-popular-200"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-semibold text-slate-800 dark:text-slate-100">
                      {opcion.titulo}
                    </span>
                  </span>
                  <span className="text-slate-300 dark:text-slate-600">
                    <Icono nombre="chevron" tam={16} grosor={2.2} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Tarjeta>

        <Boton tam="lg" ancho icono="adelante" iconoDerecha>
          Hablar con mi asesor
        </Boton>

        <Boton tono="texto" ancho onClick={onVolver}>
          Volver a mis metas
        </Boton>
      </main>
    </>
  )
}

export default MetaCompletada
