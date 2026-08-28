import { PROPOSITOS } from '../data/catalogo'
import type { Plan } from '../utils/plan'
import { faltaParaHito, progreso, proximoHito, saldo } from '../utils/plan'
import { pesos, pesosCorto, porcentaje } from '../utils/formato'
import Icono from './ui/Icono'
import RutaInteligente from './ui/RutaInteligente'

export interface TarjetaMetaProps {
  plan: Plan
  onAbrir: () => void
}

/** Fila de meta en el listado: propósito, avance sobre la ruta y qué sigue. */
function TarjetaMeta({ plan, onAbrir }: TarjetaMetaProps) {
  const proposito = PROPOSITOS[plan.proposito]
  const avance = progreso(plan)
  const siguiente = proximoHito(plan)

  return (
    <button
      type="button"
      onClick={onAbrir}
      className="w-full rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-[0_1px_2px_rgba(8,40,75,0.05)] transition-colors hover:border-popular-300 dark:border-slate-700/70 dark:bg-slate-800/60 dark:hover:border-popular-500"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-popular-50 text-popular-700 dark:bg-popular-900/50 dark:text-popular-200">
          <Icono nombre={proposito.icono} tam={20} grosor={1.8} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[14.5px] font-bold text-slate-900 dark:text-slate-100">
            {plan.nombre}
          </p>
          <p className="mt-0.5 truncate text-[11.5px] text-slate-500 dark:text-slate-400">
            {proposito.nombre} · meta de {pesosCorto(plan.objetivo)}
          </p>
        </div>

        <span className="flex shrink-0 items-center gap-1 text-slate-300 dark:text-slate-600">
          <span className="font-display text-base font-extrabold tabular-nums text-popular-700 dark:text-popular-200">
            {porcentaje(avance)}
          </span>
          <Icono nombre="chevron" tam={15} grosor={2.2} />
        </span>
      </div>

      <div className="mt-3.5">
        <RutaInteligente valor={avance} objetivo={plan.objetivo} compacta />
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-[12px] font-semibold tabular-nums text-slate-700 dark:text-slate-200">
          {pesos(saldo(plan))}
          <span className="font-normal text-slate-400 dark:text-slate-500">
            {' '}
            de {pesos(plan.objetivo)}
          </span>
        </p>
        {/* Dos líneas fijas, con meta pendiente o cumplida: así todas las
            tarjetas del listado miden exactamente lo mismo. */}
        <p className="flex w-[116px] shrink-0 flex-col items-end justify-end text-right text-[11px] leading-tight text-slate-500 dark:text-slate-400">
          {siguiente ? (
            <>
              <span className="font-semibold tabular-nums text-slate-700 dark:text-slate-200">
                Faltan {pesosCorto(faltaParaHito(plan, siguiente))}
              </span>
              <span className="mt-0.5">para el hito {siguiente}%</span>
            </>
          ) : (
            <>
              <span className="font-semibold text-crece-600 dark:text-crece-400">
                Meta completada
              </span>
              <span className="mt-0.5">Ver el destino</span>
            </>
          )}
        </p>
      </div>
    </button>
  )
}

export default TarjetaMeta
