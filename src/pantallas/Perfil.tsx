import { BENEFICIARIOS, CANALES, PRODUCTOS, PROPOSITOS } from '../data/catalogo'
import type { ProductoId } from '../data/catalogo'
import type { Plan } from '../utils/plan'
import { completado, progreso, totalAhorrado, totalGenerado, totalObjetivo } from '../utils/plan'
import { CLIENTE } from '../data/demo'
import { pesos, pesosCorto, porcentaje } from '../utils/formato'
import BarraApp from '../components/layout/BarraApp'
import Tarjeta, { Dato, Nota } from '../components/ui/Tarjeta'
import Boton from '../components/ui/Boton'
import Icono from '../components/ui/Icono'

export interface PerfilProps {
  planes: Plan[]
  onAbrirPlan: (id: string) => void
  onNuevaMeta: () => void
  onSobreElProyecto: () => void
}

/**
 * Perfil: todas las metas del cliente a la vez y qué piezas del ecosistema
 * Popular ya están enganchadas a ellas. Es la vista que muestra que un
 * cliente con varias metas activas es un cliente vinculado.
 */
function Perfil({ planes, onAbrirPlan, onNuevaMeta, onSobreElProyecto }: PerfilProps) {
  const total = totalAhorrado(planes)
  const objetivo = totalObjetivo(planes)
  const generado = totalGenerado(planes)

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
            <Dato etiqueta="Generado" valor={pesosCorto(generado)} tono="crece" />
            <Dato
              etiqueta="Avance total"
              valor={porcentaje(objetivo > 0 ? total / objetivo : 0)}
            />
          </div>
        </Tarjeta>

        <Tarjeta
          titulo="Mis metas"
          subtitulo="Varias metas pueden correr a la vez, cada una con su ruta."
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

        <Tarjeta
          titulo="Tu ecosistema Popular"
          subtitulo="Las piezas del grupo que ya trabajan dentro de tus planes."
        >
          <ul className="grid gap-2">
            {[...enlazados].map((id) => (
              <li
                key={id}
                className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 dark:border-slate-700"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                  <Icono nombre={PRODUCTOS[id].icono} tam={17} grosor={1.8} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[12.5px] font-semibold text-slate-800 dark:text-slate-100">
                    {PRODUCTOS[id].nombre}
                  </span>
                  <span className="block text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                    {PRODUCTOS[id].rol}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Tarjeta>

        <Tarjeta>
          <button
            type="button"
            onClick={onSobreElProyecto}
            className="flex w-full items-center gap-3 text-left"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300">
              <Icono nombre="info" tam={18} grosor={1.9} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-semibold text-slate-800 dark:text-slate-100">
                Sobre este prototipo
              </span>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                Qué resuelve Popular Plan y con qué supuestos se simula
              </span>
            </span>
            <span className="text-slate-300 dark:text-slate-600">
              <Icono nombre="chevron" tam={16} grosor={2.2} />
            </span>
          </button>
        </Tarjeta>

        <Nota icono="escudo" tono="aviso">
          Prototipo con fines de demostración para el Challenge de Estudiantes del Banco
          Popular. Datos y cliente ficticios; {pesos(generado)} de rendimiento son una
          estimación de la simulación, no una tasa ofrecida.
        </Nota>
      </main>
    </>
  )
}

export default Perfil
