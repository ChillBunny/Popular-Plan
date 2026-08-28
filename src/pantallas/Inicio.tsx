import type { Plan } from '../utils/plan'
import { aporteMensualTotal, SUPUESTOS, totalAhorrado, totalGenerado, ultimoAporte } from '../utils/plan'
import { pesos } from '../utils/formato'
import { CLIENTE } from '../data/demo'
import Icono from '../components/ui/Icono'
import Boton from '../components/ui/Boton'
import TarjetaMeta from '../components/TarjetaMeta'
import { Nota } from '../components/ui/Tarjeta'

export interface InicioProps {
  planes: Plan[]
  onAbrirPlan: (id: string) => void
  onNuevaMeta: () => void
}

/**
 * Pantalla principal: cuánto llevas ahorrado en total, cuánto de eso lo
 * generó el propio dinero, y cada meta con su avance sobre la ruta.
 */
function Inicio({ planes, onAbrirPlan, onNuevaMeta }: InicioProps) {
  const total = totalAhorrado(planes)
  const generado = totalGenerado(planes)
  const mensual = aporteMensualTotal(planes)
  const ultimo = ultimoAporte(planes)

  return (
    <>
      <header className="shrink-0 bg-gradient-to-b from-popular-700 to-popular-600 px-5 pb-6 pt-4 text-white dark:from-popular-900 dark:to-popular-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-popular-200">Popular Plan</p>
            <h1 className="mt-0.5 text-lg font-bold">Hola, {CLIENTE.nombre}</h1>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-sm font-bold">
            {CLIENTE.iniciales}
          </span>
        </div>

        <div className="mt-5">
          <p className="mt-1 font-display text-[34px] font-extrabold leading-none tabular-nums">
            {pesos(total)}
          </p>
          <p className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-white/12 py-1 pl-2 pr-3 text-[11.5px] font-medium text-white">
            <Icono nombre="crecer" tam={13} grosor={2.2} />
            <span className="tabular-nums">{pesos(generado)}</span> generado
          </p>

          <div className="mt-4 grid max-w-[18rem] grid-cols-2 gap-2">
            <span className="rounded-xl bg-white/10 px-3 py-2">
              <span className="block text-[10px] text-popular-200">Cada mes</span>
              <span className="mt-0.5 block text-[13px] font-bold tabular-nums">{pesos(mensual)}</span>
            </span>
            <span className="rounded-xl bg-white/10 px-3 py-2">
              <span className="block text-[10px] text-popular-200">Último aporte</span>
              <span className="mt-0.5 block text-[13px] font-bold tabular-nums">
                {ultimo ? pesos(ultimo.monto) : '—'}
              </span>
            </span>
          </div>
        </div>
      </header>

      <main className="animar-vista min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-6 pt-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[13px] font-bold text-slate-900 dark:text-slate-100">
            Mis metas
          </h2>
          <span className="text-[11.5px] text-slate-500 dark:text-slate-400">
            {planes.length} {planes.length === 1 ? 'plan activo' : 'planes activos'}
          </span>
        </div>

        {planes.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 px-6 py-10 text-center dark:border-slate-700">
            <span className="text-slate-300 dark:text-slate-600">
              <Icono nombre="bandera" tam={28} grosor={1.6} />
            </span>
            <p className="text-[13px] font-semibold text-slate-600 dark:text-slate-300">
              Todavía no tienes una meta
            </p>
          </div>
        ) : (
          planes.map((plan) => (
            <TarjetaMeta key={plan.id} plan={plan} onAbrir={() => onAbrirPlan(plan.id)} />
          ))
        )}

        <Boton tono="secundario" tam="lg" ancho icono="mas" onClick={onNuevaMeta}>
          Crear una meta nueva
        </Boton>

        <Nota icono="candado" tono="aviso">
          Disponible al vencer cada período de {SUPUESTOS.ventanaDias} días.
        </Nota>
      </main>
    </>
  )
}

export default Inicio
