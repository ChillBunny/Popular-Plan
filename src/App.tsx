import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CanalId, Hito } from './data/catalogo'
import { NOTAS, RECORRIDO } from './data/presentacion'
import type { ClaveNota } from './data/presentacion'
import { planesIniciales } from './data/demo'
import type { EntradaPlan, Plan } from './utils/plan'
import {
  aportar,
  avanzarMes,
  avanzarMeses,
  crearPlan,
  hitosCruzados,
  marcarHitoVisto,
  mesAbsoluto,
} from './utils/plan'
import Escenario from './components/presentacion/Escenario'
import MarcoTelefono from './components/layout/MarcoTelefono'
import BarraPestanas from './components/layout/BarraPestanas'
import type { PestanaId } from './components/layout/BarraPestanas'
import Inicio from './pantallas/Inicio'
import NuevaMeta from './pantallas/NuevaMeta'
import DetallePlan from './pantallas/DetallePlan'
import HitoAlcanzado from './pantallas/HitoAlcanzado'
import MetaCompletada from './pantallas/MetaCompletada'
import Invertir from './pantallas/Invertir'
import Perfil from './pantallas/Perfil'

type Vista =
  | { tipo: 'inicio' }
  | { tipo: 'nueva' }
  | { tipo: 'plan'; id: string }
  | { tipo: 'completada'; id: string }
  | { tipo: 'invertir' }
  | { tipo: 'perfil' }

interface Celebracion {
  planId: string
  hito: Hito
}

/** Techo de la búsqueda del siguiente hito en el recorrido guiado. */
const TECHO_AVANCE = 240

function App() {
  const mesHoy = useMemo(() => mesAbsoluto(new Date()), [])

  const [planes, setPlanes] = useState<Plan[]>(() => planesIniciales())
  const [vista, setVista] = useState<Vista>({ tipo: 'inicio' })
  const [celebracion, setCelebracion] = useState<Celebracion | null>(null)
  const [paso, setPaso] = useState(0)
  /** Ancla que el recorrido guiado dejó pendiente de mostrar. Va en un ref y
   *  no en estado: solo se consume después del render de la pantalla. */
  const anclaPendiente = useRef<string | null>(null)

  useEffect(() => {
    const id = anclaPendiente.current
    if (!id) return
    anclaPendiente.current = null
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [vista])

  const planActivo = (id: string) => planes.find((p) => p.id === id) ?? null

  /**
   * Punto único por el que pasan todos los cambios de un plan: aplica la
   * transformación, detecta los hitos recién cruzados y decide si toca
   * celebrar (25/60) o abrir la pantalla de meta completada (100).
   */
  const aplicar = useCallback(
    (id: string, transformar: (plan: Plan) => Plan) => {
      const anterior = planes.find((p) => p.id === id)
      if (!anterior) return
      const siguiente = transformar(anterior)
      if (siguiente === anterior) return

      const cruzados = hitosCruzados(anterior, siguiente)
      const marcado = cruzados.reduce(marcarHitoVisto, siguiente)
      setPlanes((prev) => prev.map((p) => (p.id === id ? marcado : p)))

      if (cruzados.length === 0) return
      const alcanzado = cruzados[cruzados.length - 1]
      if (alcanzado === 100) {
        // Completar la meta cierra cualquier celebración intermedia abierta:
        // la pantalla de meta cumplida manda sobre el hito anterior.
        setCelebracion(null)
        setVista({ tipo: 'completada', id })
      } else {
        setCelebracion({ planId: id, hito: alcanzado })
      }
    },
    [planes],
  )

  const handleAvanzar = useCallback(
    (id: string, meses: number) => aplicar(id, (plan) => avanzarMeses(plan, meses)),
    [aplicar],
  )

  const handleAportar = useCallback(
    (id: string, monto: number, canal: CanalId) =>
      aplicar(id, (plan) => aportar(plan, monto, canal)),
    [aplicar],
  )

  /** Avanza mes a mes hasta cruzar el próximo hito (motor del recorrido). */
  const avanzarHastaHito = useCallback(
    (id: string) => {
      const anterior = planes.find((p) => p.id === id)
      if (!anterior) return
      let destino = anterior
      for (let i = 0; i < TECHO_AVANCE; i += 1) {
        const siguiente = avanzarMes(destino)
        if (siguiente === destino) break
        destino = siguiente
        if (hitosCruzados(anterior, destino).length > 0) break
      }
      aplicar(id, () => destino)
    },
    [planes, aplicar],
  )

  const handleCrear = useCallback((entrada: EntradaPlan) => {
    const plan = crearPlan(entrada)
    setPlanes((prev) => [...prev, plan])
    setVista({ tipo: 'plan', id: plan.id })
  }, [])

  const handleReiniciar = useCallback(() => {
    setPlanes(planesIniciales())
    setVista({ tipo: 'inicio' })
    setCelebracion(null)
    setPaso(0)
  }, [])

  /** Ejecuta un paso del recorrido guiado. */
  const irAPaso = useCallback(
    (indice: number) => {
      const item = RECORRIDO[indice]
      if (!item) return
      setPaso(indice)
      setCelebracion(null)

      const accion = item.accion
      if (accion.tipo === 'ir') {
        setVista({ tipo: accion.destino })
        return
      }
      setVista({ tipo: 'plan', id: accion.planId })
      if (accion.tipo === 'abrirPlan') {
        anclaPendiente.current = accion.ancla ?? null
      } else {
        avanzarHastaHito(accion.planId)
      }
    },
    [avanzarHastaHito],
  )

  const handlePestana = useCallback((id: PestanaId) => {
    setCelebracion(null)
    setVista({ tipo: id })
  }, [])

  /* --- Derivados de la vista ---------------------------------------- */

  const pestanaActiva: PestanaId =
    vista.tipo === 'invertir' ? 'invertir' : vista.tipo === 'perfil' ? 'perfil' : 'inicio'

  const conPestanas = vista.tipo !== 'nueva' && vista.tipo !== 'completada'

  const claveNota: ClaveNota = celebracion
    ? 'hito'
    : vista.tipo === 'plan'
      ? 'plan'
      : vista.tipo
  const planCelebrado = celebracion ? planActivo(celebracion.planId) : null

  function pantalla() {
    switch (vista.tipo) {
      case 'nueva':
        return (
          <NuevaMeta
            mesHoy={mesHoy}
            onCancelar={() => setVista({ tipo: 'inicio' })}
            onCrear={handleCrear}
          />
        )
      case 'plan': {
        const plan = planActivo(vista.id)
        if (!plan) return null
        return (
          <DetallePlan
            plan={plan}
            onVolver={() => setVista({ tipo: 'inicio' })}
            onAportar={(monto, canal) => handleAportar(plan.id, monto, canal)}
            onAvanzar={(meses) => handleAvanzar(plan.id, meses)}
          />
        )
      }
      case 'completada': {
        const plan = planActivo(vista.id)
        if (!plan) return null
        return <MetaCompletada plan={plan} onVolver={() => setVista({ tipo: 'inicio' })} />
      }
      case 'invertir':
        return <Invertir onNuevaMeta={() => setVista({ tipo: 'nueva' })} />
      case 'perfil':
        return (
          <Perfil
            planes={planes}
            onAbrirPlan={(id) => setVista({ tipo: 'plan', id })}
            onNuevaMeta={() => setVista({ tipo: 'nueva' })}
          />
        )
      default:
        return (
          <Inicio
            planes={planes}
            onAbrirPlan={(id) => setVista({ tipo: 'plan', id })}
            onNuevaMeta={() => setVista({ tipo: 'nueva' })}
          />
        )
    }
  }

  return (
    <Escenario
      nota={NOTAS[claveNota]}
      paso={paso}
      onPaso={irAPaso}
      onReiniciar={handleReiniciar}
    >
      <MarcoTelefono>
        {/* La clave fuerza el remontaje al cambiar de pantalla: así la
            animación de entrada corre en cada navegación. */}
        <div
          key={vista.tipo === 'plan' || vista.tipo === 'completada' ? `${vista.tipo}-${vista.id}` : vista.tipo}
          className="flex min-h-0 flex-1 flex-col"
        >
          {pantalla()}
        </div>

        {conPestanas ? (
          <BarraPestanas activa={pestanaActiva} onCambiar={handlePestana} />
        ) : null}

        {celebracion && planCelebrado ? (
          <HitoAlcanzado
            plan={planCelebrado}
            hito={celebracion.hito}
            onCerrar={() => setCelebracion(null)}
          />
        ) : null}
      </MarcoTelefono>
    </Escenario>
  )
}

export default App
