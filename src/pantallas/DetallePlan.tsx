import { Suspense, lazy, useState } from 'react'
import { BENEFICIARIOS, CANALES, ORDEN_CANALES, PRODUCTOS, PROPOSITOS } from '../data/catalogo'
import type { CanalId } from '../data/catalogo'
import type { Plan } from '../utils/plan'
import {
  SUPUESTOS,
  etiquetaMesLarga,
  faltaParaHito,
  faltante,
  mesMetaPrometido,
  progreso,
  proximoHito,
  proyectar,
  saldo,
} from '../utils/plan'
import { pesos, pesosCorto, porcentaje } from '../utils/formato'
import BarraApp from '../components/layout/BarraApp'
import AnilloProgreso from '../components/ui/AnilloProgreso'
import RutaInteligente from '../components/ui/RutaInteligente'
import Tarjeta, { Dato, Nota } from '../components/ui/Tarjeta'
import Boton from '../components/ui/Boton'
import Icono from '../components/ui/Icono'
import Hoja from '../components/ui/Hoja'
import Opcion from '../components/ui/Opcion'
import Deslizador from '../components/ui/Deslizador'

/** El gráfico arrastra Recharts (~430 kB): se carga solo al abrir un plan,
 *  no en el arranque de la app. */
const GraficoCrecimiento = lazy(() => import('../components/GraficoCrecimiento'))

export interface DetallePlanProps {
  plan: Plan
  onVolver: () => void
  onAportar: (monto: number, canal: CanalId) => void
  onAvanzar: (meses: number) => void
}

/** Fila de dato en la ficha del plan. */
function Fila({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-2">
      <span className="text-[12px] text-slate-500 dark:text-slate-400">{etiqueta}</span>
      <span className="text-right text-[12.5px] font-semibold text-slate-800 dark:text-slate-100">
        {valor}
      </span>
    </div>
  )
}

/**
 * Detalle del plan: dónde vas, qué falta para el próximo hito y —lo que
 * ninguna cuenta programada muestra— cuánto de lo que tienes lo puso el
 * propio dinero mientras esperaba.
 */
function DetallePlan({ plan, onVolver, onAportar, onAvanzar }: DetallePlanProps) {
  const [hojaAporte, setHojaAporte] = useState(false)
  const [montoAporte, setMontoAporte] = useState(plan.aporteMensual)
  const [canalAporte, setCanalAporte] = useState<CanalId>(plan.canal)

  const proposito = PROPOSITOS[plan.proposito]
  const avance = progreso(plan)
  const siguiente = proximoHito(plan)
  const proyeccion = proyectar(plan)
  const completo = siguiente === null
  const topeAporte = Math.max(5_000, Math.min(500_000, Math.round(faltante(plan))))

  function confirmarAporte() {
    onAportar(montoAporte, canalAporte)
    setHojaAporte(false)
  }

  return (
    <>
      <div className="shrink-0 bg-gradient-to-b from-popular-700 to-popular-600 pb-6 text-white dark:from-popular-900 dark:to-popular-800">
        <BarraApp titulo={plan.nombre} onVolver={onVolver} invertida />

        <div className="flex flex-col items-center px-5 pt-1">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium">
            <Icono nombre={proposito.icono} tam={13} grosor={2} />
            {proposito.titular}
          </span>

          <AnilloProgreso valor={avance} tam={182}>
            <span className="font-display text-[34px] font-extrabold leading-none tabular-nums">
              {porcentaje(avance)}
            </span>
            <span className="mt-1.5 text-[13px] font-semibold tabular-nums text-popular-100">
              {pesos(saldo(plan))}
            </span>
            <span className="text-[11px] text-popular-200">
              de {pesos(plan.objetivo)}
            </span>
          </AnilloProgreso>

          {/* Dos líneas reservadas: el texto cambia al cruzar un hito y no
              debe empujar el contenido de la pantalla. */}
          <p className="mt-4 min-h-[40px] text-center text-[12.5px] leading-relaxed text-popular-100">
            {completo ? (
              <>Meta completada. Te toca decidir el destino.</>
            ) : (
              <>
                Faltan{' '}
                <strong className="text-white">
                  {pesos(faltaParaHito(plan, siguiente))}
                </strong>{' '}
                para el hito de {siguiente}%
              </>
            )}
          </p>
        </div>
      </div>

      <main className="animar-vista min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-6 pt-4">
        <Tarjeta titulo="Ruta Inteligente">
          <RutaInteligente valor={avance} objetivo={plan.objetivo} />
        </Tarjeta>

        <Tarjeta id="crecimiento" titulo="Tu dinero crece">
          <Suspense
            fallback={
              <div className="h-[168px] w-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-700/40" />
            }
          >
            <GraficoCrecimiento plan={plan} />
          </Suspense>

          <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 dark:border-slate-700/60">
            <Dato
              etiqueta="Lo pusiste tú"
              valor={pesos(plan.aportado)}
              tono="popular"
              detalle={`${plan.aportes.length} aportes`}
            />
            <Dato
              etiqueta="Lo puso tu dinero"
              valor={pesos(plan.rendimiento)}
              tono="crece"
              detalle="Estimado"
            />
          </div>

          <div className="mt-3">
            <Nota icono="crecer" tono="crece">
              {PRODUCTOS.afi.nombre} · estimado, no garantizado.
            </Nota>
          </div>
        </Tarjeta>

        <Tarjeta
          titulo={`${pesos(plan.aporteMensual)} / mes`}
          accion={
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-popular-50 text-popular-700 dark:bg-popular-900/50 dark:text-popular-200">
              <Icono nombre={CANALES[plan.canal].icono} tam={18} grosor={1.8} />
            </span>
          }
        >
          <Boton
            ancho
            icono="mas"
            disabled={completo}
            onClick={() => {
              setMontoAporte(Math.min(plan.aporteMensual, topeAporte))
              setCanalAporte(plan.canal)
              setHojaAporte(true)
            }}
          >
            {completo ? 'Meta completada' : 'Aportar ahora'}
          </Boton>

        </Tarjeta>

        <Tarjeta titulo="Plan">
          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            <Fila
              etiqueta="Llegada estimada"
              valor={
                proyeccion.mesLlegada === null
                  ? 'Sin ritmo suficiente'
                  : etiquetaMesLarga(proyeccion.mesLlegada)
              }
            />
            <Fila etiqueta="Fecha que te pusiste" valor={etiquetaMesLarga(mesMetaPrometido(plan))} />
            <Fila etiqueta="Titularidad" valor={BENEFICIARIOS[plan.beneficiario].nombre} />
            <Fila
              etiqueta="Disponibilidad"
              valor={`Al vencer la colocación (${SUPUESTOS.ventanaDias} días)`}
            />
          </div>
        </Tarjeta>

        {/* Controles del prototipo: en la app real el tiempo pasa solo. */}
        <Tarjeta titulo="Avanzar demo">
          <div className="flex gap-2">
            <Boton tono="secundario" ancho disabled={completo} onClick={() => onAvanzar(1)}>
              +1 mes
            </Boton>
            <Boton tono="secundario" ancho disabled={completo} onClick={() => onAvanzar(6)}>
              +6 meses
            </Boton>
            <Boton tono="secundario" ancho disabled={completo} onClick={() => onAvanzar(12)}>
              +1 año
            </Boton>
          </div>
        </Tarjeta>
      </main>

      <Hoja
        abierta={hojaAporte}
        onCerrar={() => setHojaAporte(false)}
        titulo="Aportar a esta meta"
        descripcion={`Te faltan ${pesos(faltante(plan))} para completarla.`}
      >
        <div className="space-y-4 pt-3">
          <Deslizador
            etiqueta="Monto del aporte"
            valorTexto={pesos(montoAporte)}
            valor={Math.min(montoAporte, topeAporte)}
            min={Math.min(1_000, topeAporte)}
            max={topeAporte}
            paso={1_000}
            extremos={['RD$ 1,000', pesosCorto(topeAporte)]}
            onChange={setMontoAporte}
          />

          <div>
            <p className="mb-2 text-[11.5px] font-semibold text-slate-600 dark:text-slate-300">
              ¿Desde dónde?
            </p>
            <div className="grid gap-2">
              {ORDEN_CANALES.map((id) => (
                <Opcion
                  key={id}
                  titulo={CANALES[id].nombre}
                  detalle={CANALES[id].detalle}
                  icono={CANALES[id].icono}
                  seleccionada={canalAporte === id}
                  onSelect={() => setCanalAporte(id)}
                />
              ))}
            </div>
          </div>

          <Boton tam="lg" ancho icono="cheque" onClick={confirmarAporte}>
            Aportar {pesos(Math.min(montoAporte, topeAporte))}
          </Boton>
        </div>
      </Hoja>
    </>
  )
}

export default DetallePlan
