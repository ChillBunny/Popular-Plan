import { BENEFICIARIOS, CANALES, PRODUCTOS, PROPOSITOS } from '../data/catalogo'
import type { ProductoId } from '../data/catalogo'
import type { Plan } from '../utils/plan'
import { aporteMensualTotal, completado, progreso, totalAhorrado, ultimoAporte } from '../utils/plan'
import { CLIENTE } from '../data/demo'
import { pesosCorto, porcentaje } from '../utils/formato'
import BarraApp from '../components/layout/BarraApp'
import Tarjeta, { Dato } from '../components/ui/Tarjeta'
import Boton from '../components/ui/Boton'
import Icono from '../components/ui/Icono'

export interface PerfilProps {
  planes: Plan[]
  onAbrirPlan: (id: string) => void
  onNuevaMeta: () => void
}

/**
 * Perfil: todas las metas del cliente a la vez y qué piezas del ecosistema
 * Popular ya están enganchadas a ellas. Es la vista que muestra que un
 * cliente con varias metas activas es un cliente vinculado.
 */
function Perfil({ planes, onAbrirPlan, onNuevaMeta }: PerfilProps) {
  const total = totalAhorrado(planes)
  const mensual = aporteMensualTotal(planes)
  const ultimo = ultimoAporte(planes)

  /** Activos del grupo enganchados por los planes vigentes, sin repetir. */
  const enlazados = new Set<ProductoId>(['afi'])
  for (const plan of planes) {
    const canal = CANALES[plan.canal]
    if (canal.producto) enlazados.add(canal.producto)
    const beneficiario = BENEFICIARIOS[plan.beneficiario]
    if (beneficiario.producto) enlazados.add(beneficiario.producto)
    enlazados.add(PROPOSITOS[plan.proposito].destino.producto)
  }

  return (
    <>
      <BarraApp titulo="Perfil" />

      <main className="animar-vista min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-6">
        <div className="flex items-center gap-3.5 px-1">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-popular-600 text-lg font-bold text-white">
            {CLIENTE.iniciales}
          </span>
          <div className="min-w-0">
            <p className="text-[16px] font-bold text-slate-900 dark:text-slate-100">
              {CLIENTE.nombreCompleto}
            </p>
            <p className="text-[11.5px] text-slate-500 dark:text-slate-400">
              Cliente desde {CLIENTE.desde} · {CLIENTE.sucursal}
            </p>
          </div>
        </div>

        <Tarjeta>
          <div className="grid grid-cols-3 gap-3">
            <Dato etiqueta="Ahorrado" valor={pesosCorto(total)} tono="popular" />
            <Dato etiqueta="Al mes" valor={pesosCorto(mensual)} tono="crece" />
            <Dato etiqueta="Último" valor={ultimo ? pesosCorto(ultimo.monto) : '—'} />
          </div>
        </Tarjeta>

        <Tarjeta
          titulo="Mis metas"
        >
          <ul className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {planes.map((plan) => (
              <li key={plan.id}>
                <button
                  type="button"
                  onClick={() => onAbrirPlan(plan.id)}
                  className="flex w-full items-center gap-3 py-3 text-left"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-popular-50 text-popular-700 dark:bg-popular-900/50 dark:text-popular-200">
                    <Icono nombre={PROPOSITOS[plan.proposito].icono} tam={18} grosor={1.8} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold text-slate-800 dark:text-slate-100">
                      {plan.nombre}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-slate-500 dark:text-slate-400">
                      {BENEFICIARIOS[plan.beneficiario].nombre} ·{' '}
                      {CANALES[plan.canal].nombre}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span
                      className={`block text-[13px] font-bold tabular-nums ${
                        completado(plan)
                          ? 'text-crece-600 dark:text-crece-400'
                          : 'text-popular-700 dark:text-popular-200'
                      }`}
                    >
                      {porcentaje(progreso(plan))}
                    </span>
                    <span className="block text-[10.5px] tabular-nums text-slate-400 dark:text-slate-500">
                      de {pesosCorto(plan.objetivo)}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-3">
            <Boton tono="secundario" ancho icono="mas" onClick={onNuevaMeta}>
              Crear una meta nueva
            </Boton>
          </div>
        </Tarjeta>

        <Tarjeta titulo="Conectado a">
          <ul className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {[...enlazados].map((id) => (
              <li
                key={id}
                className="flex items-center gap-3 py-3"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                  <Icono nombre={PRODUCTOS[id].icono} tam={17} grosor={1.8} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[12.5px] font-semibold text-slate-800 dark:text-slate-100">
                    {PRODUCTOS[id].nombre}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                    {PRODUCTOS[id].rol}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Tarjeta>
      </main>
    </>
  )
}

export default Perfil
