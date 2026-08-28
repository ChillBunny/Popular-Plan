import type { BeneficiarioId, CanalId, Hito, PropositoId } from '../data/catalogo'
import { HITOS } from '../data/catalogo'

/**
 * Motor del plan de ahorro. Una sola idea: el saldo es aportes + lo que ese
 * dinero genera mientras espera, y la Ruta Inteligente marca tres hitos sobre
 * ese saldo.
 *
 * Todo es puro y sin fechas del sistema dentro de los cálculos: el tiempo
 * viaja como índice de mes absoluto (año * 12 + mes), así la simulación es
 * determinista y comprobable.
 */

/* ------------------------------------------------------------------ */
/* Supuestos declarados de la simulación                               */
/* ------------------------------------------------------------------ */

export const SUPUESTOS = {
  /**
   * Rendimiento anual REFERENCIAL del prototipo. No es una tasa ofrecida,
   * garantizada ni vigente: es el supuesto con el que se dibuja la
   * proyección, y la interfaz lo rotula siempre como estimado.
   */
  rendimientoAnual: 0.065,
  /** El saldo se coloca a 30 días: de ahí la ventana de disponibilidad. */
  ventanaDias: 30,
} as const

export const TASA_MENSUAL = SUPUESTOS.rendimientoAnual / 12

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */

export type TipoAporte = 'inicial' | 'mensual' | 'extra'

export interface Aporte {
  /** Mes absoluto en que ocurrió */
  mes: number
  monto: number
  canal: CanalId
  tipo: TipoAporte
}

/** Un punto de la ruta: sirve para el gráfico y para el detalle mensual. */
export interface PuntoRuta {
  mes: number
  /** Acumulado aportado por el cliente hasta ese mes */
  aportado: number
  /** Acumulado generado por la colocación hasta ese mes */
  rendimiento: number
  /** aportado + rendimiento */
  saldo: number
}

export interface Plan {
  id: string
  proposito: PropositoId
  /** Nombre que le puso el cliente ("Inicial del apartamento") */
  nombre: string
  objetivo: number
  aporteMensual: number
  canal: CanalId
  beneficiario: BeneficiarioId
  /** Mes absoluto en que arrancó */
  mesInicio: number
  /** Meses transcurridos desde el arranque */
  meses: number
  aportado: number
  rendimiento: number
  /** Plazo que el cliente se puso al crear la meta, en meses */
  plazoMeses: number
  /** Hitos que el cliente ya vio celebrados (no se repite la pantalla) */
  hitosVistos: Hito[]
  ruta: PuntoRuta[]
  aportes: Aporte[]
}

export interface EntradaPlan {
  proposito: PropositoId
  nombre: string
  objetivo: number
  plazoMeses: number
  aporteMensual: number
  aporteInicial: number
  canal: CanalId
  beneficiario: BeneficiarioId
  /** Mes absoluto de arranque */
  mesInicio: number
  id?: string
}

/* ------------------------------------------------------------------ */
/* Tiempo                                                              */
/* ------------------------------------------------------------------ */

const MESES_CORTOS = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
]

/** Fecha → índice de mes absoluto. */
export function mesAbsoluto(fecha: Date): number {
  return fecha.getFullYear() * 12 + fecha.getMonth()
}

/** Índice de mes absoluto → "mar 2028". */
export function etiquetaMes(mes: number): string {
  const anio = Math.floor(mes / 12)
  return `${MESES_CORTOS[((mes % 12) + 12) % 12]} ${anio}`
}

/** Índice de mes absoluto → "marzo de 2028". */
export function etiquetaMesLarga(mes: number): string {
  const largos = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
  ]
  const anio = Math.floor(mes / 12)
  return `${largos[((mes % 12) + 12) % 12]} de ${anio}`
}

/* ------------------------------------------------------------------ */
/* Lecturas derivadas                                                  */
/* ------------------------------------------------------------------ */

export function saldo(plan: Plan): number {
  return plan.aportado + plan.rendimiento
}

/** Progreso 0–1, tope en 1 (el motor nunca sobrepasa el objetivo). */
export function progreso(plan: Plan): number {
  if (plan.objetivo <= 0) return 0
  return Math.min(1, saldo(plan) / plan.objetivo)
}

export function faltante(plan: Plan): number {
  return Math.max(0, plan.objetivo - saldo(plan))
}

export function completado(plan: Plan): boolean {
  return saldo(plan) >= plan.objetivo - 0.5
}

/** Mes absoluto en que el cliente se propuso llegar. */
export function mesMetaPrometido(plan: Plan): number {
  return plan.mesInicio + plan.plazoMeses
}

/** Próximo hito sin alcanzar; null si ya está todo cumplido. */
export function proximoHito(plan: Plan): Hito | null {
  const pct = progreso(plan) * 100
  return HITOS.find((h) => pct < h) ?? null
}

/** Hitos ya alcanzados por el saldo actual. */
export function hitosAlcanzados(plan: Plan): Hito[] {
  const pct = progreso(plan) * 100
  return HITOS.filter((h) => pct >= h)
}

/** Cuánto falta en RD$ para tocar el próximo hito. */
export function faltaParaHito(plan: Plan, hito: Hito): number {
  return Math.max(0, (plan.objetivo * hito) / 100 - saldo(plan))
}

/* ------------------------------------------------------------------ */
/* Creación                                                            */
/* ------------------------------------------------------------------ */

let secuencia = 0

function nuevoId(): string {
  secuencia += 1
  return `plan-${secuencia}`
}

export function crearPlan(entrada: EntradaPlan): Plan {
  const inicial = Math.max(0, Math.round(entrada.aporteInicial))
  const plan: Plan = {
    id: entrada.id ?? nuevoId(),
    proposito: entrada.proposito,
    nombre: entrada.nombre.trim() || 'Mi meta',
    objetivo: Math.max(1, Math.round(entrada.objetivo)),
    aporteMensual: Math.max(0, Math.round(entrada.aporteMensual)),
    canal: entrada.canal,
    beneficiario: entrada.beneficiario,
    mesInicio: entrada.mesInicio,
    meses: 0,
    aportado: inicial,
    rendimiento: 0,
    plazoMeses: Math.max(1, Math.round(entrada.plazoMeses)),
    hitosVistos: [],
    ruta: [],
    aportes: [],
  }
  if (inicial > 0) {
    plan.aportes.push({
      mes: entrada.mesInicio,
      monto: inicial,
      canal: entrada.canal,
      tipo: 'inicial',
    })
  }
  plan.ruta = [
    { mes: entrada.mesInicio, aportado: inicial, rendimiento: 0, saldo: inicial },
  ]
  return plan
}

/* ------------------------------------------------------------------ */
/* Avance del tiempo                                                   */
/* ------------------------------------------------------------------ */

/**
 * Un mes de plan: primero la colocación rinde sobre el saldo existente,
 * después entra el aporte del mes. El aporte se recorta para que el plan
 * aterrice exactamente en el objetivo en lugar de pasarse — la meta es un
 * destino, no una cuenta que sigue creciendo sola.
 */
export function avanzarMes(plan: Plan): Plan {
  if (completado(plan)) return plan

  const actual = saldo(plan)
  // El propio rendimiento también se recorta: la meta es un destino, no una
  // cuenta que sigue creciendo sola por encima de lo que el cliente pidió.
  const rendimientoMes = Math.min(
    Math.round(actual * TASA_MENSUAL),
    Math.max(0, plan.objetivo - actual),
  )
  const tras = actual + rendimientoMes
  const aporteMes = Math.max(0, Math.min(plan.aporteMensual, plan.objetivo - tras))

  const mes = plan.mesInicio + plan.meses + 1
  const aportado = plan.aportado + aporteMes
  const rendimiento = plan.rendimiento + rendimientoMes

  const aportes = aporteMes > 0
    ? [...plan.aportes, { mes, monto: aporteMes, canal: plan.canal, tipo: 'mensual' as const }]
    : plan.aportes

  return {
    ...plan,
    meses: plan.meses + 1,
    aportado,
    rendimiento,
    aportes,
    ruta: [...plan.ruta, { mes, aportado, rendimiento, saldo: aportado + rendimiento }],
  }
}

export function avanzarMeses(plan: Plan, cantidad: number): Plan {
  let actual = plan
  for (let i = 0; i < cantidad; i += 1) {
    const siguiente = avanzarMes(actual)
    if (siguiente === actual) break
    actual = siguiente
  }
  return actual
}

/**
 * Aporte extra fuera del calendario (el "adelanto" que el cliente hace
 * cuando le entra un dinero). Cae en el mes en curso y se recorta al
 * faltante para no pasarse del objetivo.
 */
export function aportar(plan: Plan, monto: number, canal: CanalId = plan.canal): Plan {
  const aplicado = Math.max(0, Math.min(Math.round(monto), faltante(plan)))
  if (aplicado === 0) return plan

  const mes = plan.mesInicio + plan.meses
  const aportado = plan.aportado + aplicado
  const ruta = [...plan.ruta]
  const ultimo = ruta[ruta.length - 1]
  const punto: PuntoRuta = {
    mes,
    aportado,
    rendimiento: plan.rendimiento,
    saldo: aportado + plan.rendimiento,
  }
  // El aporte extra no crea un mes nuevo: corrige el punto del mes en curso.
  if (ultimo && ultimo.mes === mes) ruta[ruta.length - 1] = punto
  else ruta.push(punto)

  return {
    ...plan,
    aportado,
    ruta,
    aportes: [...plan.aportes, { mes, monto: aplicado, canal, tipo: 'extra' }],
  }
}

export function marcarHitoVisto(plan: Plan, hito: Hito): Plan {
  if (plan.hitosVistos.includes(hito)) return plan
  return { ...plan, hitosVistos: [...plan.hitosVistos, hito] }
}

/** Hitos que se cruzaron entre dos estados del mismo plan y aún no se vieron. */
export function hitosCruzados(antes: Plan, despues: Plan): Hito[] {
  const previos = hitosAlcanzados(antes)
  return hitosAlcanzados(despues).filter(
    (h) => !previos.includes(h) && !despues.hitosVistos.includes(h),
  )
}

/* ------------------------------------------------------------------ */
/* Proyección                                                          */
/* ------------------------------------------------------------------ */

export interface Proyeccion {
  /** Meses que faltan al ritmo actual; null si el aporte no alcanza nunca */
  mesesRestantes: number | null
  /** Mes absoluto estimado de llegada; null si no llega */
  mesLlegada: number | null
  /** Puntos futuros para dibujar la ruta completa */
  futuro: PuntoRuta[]
  /** Cuánto habrá generado la colocación al llegar */
  rendimientoProyectado: number
  /** Meses de adelanto (positivo) o retraso (negativo) frente al plazo */
  diferenciaConPlazo: number | null
}

const TECHO_PROYECCION = 600

/** Proyecta hacia adelante sin tocar el plan. */
export function proyectar(plan: Plan): Proyeccion {
  if (completado(plan)) {
    return {
      mesesRestantes: 0,
      mesLlegada: plan.mesInicio + plan.meses,
      futuro: [],
      rendimientoProyectado: plan.rendimiento,
      diferenciaConPlazo: mesMetaPrometido(plan) - (plan.mesInicio + plan.meses),
    }
  }

  const futuro: PuntoRuta[] = []
  let simulado = plan
  let pasos = 0
  while (!completado(simulado) && pasos < TECHO_PROYECCION) {
    const siguiente = avanzarMes(simulado)
    if (siguiente === simulado) break
    // Sin avance real (aporte cero y rendimiento despreciable): no llega.
    if (saldo(siguiente) - saldo(simulado) < 1) break
    simulado = siguiente
    futuro.push(simulado.ruta[simulado.ruta.length - 1])
    pasos += 1
  }

  if (!completado(simulado)) {
    return {
      mesesRestantes: null,
      mesLlegada: null,
      futuro,
      rendimientoProyectado: simulado.rendimiento,
      diferenciaConPlazo: null,
    }
  }

  const mesLlegada = simulado.mesInicio + simulado.meses
  return {
    mesesRestantes: simulado.meses - plan.meses,
    mesLlegada,
    futuro,
    rendimientoProyectado: simulado.rendimiento,
    diferenciaConPlazo: mesMetaPrometido(plan) - mesLlegada,
  }
}

/**
 * Aporte mensual necesario para llegar al objetivo en el plazo, contando el
 * rendimiento de la colocación (valor futuro de una anualidad). Es el número
 * que el onboarding propone: el cliente pone destino y fecha, el sistema
 * calcula el esfuerzo.
 */
export function aporteNecesario(
  objetivo: number,
  plazoMeses: number,
  aporteInicial = 0,
): number {
  const n = Math.max(1, Math.round(plazoMeses))
  const i = TASA_MENSUAL
  const futuroInicial = aporteInicial * (1 + i) ** n
  const restante = Math.max(0, objetivo - futuroInicial)
  const factor = ((1 + i) ** n - 1) / i
  // Se redondea HACIA ARRIBA a la centena: un aporte sugerido nunca debe
  // quedarse corto del plazo por céntimos, y "RD$ 19,600" se lee mejor que
  // "RD$ 19,587" en la pantalla de creación.
  return Math.max(0, Math.ceil(restante / factor / 100) * 100)
}

/**
 * Comparación honesta del beneficio: cuánto tendría el cliente guardando lo
 * mismo debajo del colchón. Alimenta la pantalla de rendimiento sin hablar de
 * instrumentos.
 */
export function sinRendimiento(plan: Plan): number {
  return plan.aportado
}

/* ------------------------------------------------------------------ */
/* Utilidades de la cartera                                            */
/* ------------------------------------------------------------------ */

export function totalAhorrado(planes: Plan[]): number {
  return planes.reduce((suma, plan) => suma + saldo(plan), 0)
}

export function totalGenerado(planes: Plan[]): number {
  return planes.reduce((suma, plan) => suma + plan.rendimiento, 0)
}

export function totalObjetivo(planes: Plan[]): number {
  return planes.reduce((suma, plan) => suma + plan.objetivo, 0)
}
