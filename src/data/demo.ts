import type { Plan } from '../utils/plan'
import {
  avanzarMeses,
  crearPlan,
  hitosAlcanzados,
  marcarHitoVisto,
  mesAbsoluto,
} from '../utils/plan'
import type { EntradaPlan } from '../utils/plan'

/**
 * Estado inicial del prototipo. Son tres planes en momentos distintos del
 * recorrido para que la demo muestre la ruta completa sin esperar:
 *
 *  · Vivienda   — pasado el primer hito, camino al 60%.
 *  · Educación  — a un paso del 100%: un aporte y se celebra la meta.
 *  · Negocio    — recién arrancado, antes del primer hito.
 */

export const CLIENTE = {
  nombre: 'Andrés',
  nombreCompleto: 'Andrés Cabrera',
  iniciales: 'AC',
  desde: 2019,
  sucursal: 'Sucursal Naco',
}

interface Semilla extends Omit<EntradaPlan, 'mesInicio'> {
  /** Meses ya transcurridos al abrir el prototipo */
  antiguedad: number
}

const SEMILLAS: Semilla[] = [
  {
    id: 'plan-vivienda',
    proposito: 'vivienda',
    nombre: 'Inicial del apartamento',
    objetivo: 1_500_000,
    plazoMeses: 60,
    aporteMensual: 22_000,
    aporteInicial: 150_000,
    canal: 'cuenta',
    beneficiario: 'pareja',
    antiguedad: 18,
  },
  {
    id: 'plan-educacion',
    proposito: 'educacion',
    nombre: 'Universidad de Camila',
    objetivo: 600_000,
    plazoMeses: 48,
    aporteMensual: 12_000,
    // Aportado desde el exterior: el mismo cliente, otro canal de entrada.
    aporteInicial: 60_000,
    canal: 'yava',
    beneficiario: 'hijo',
    antiguedad: 36,
  },
  {
    id: 'plan-negocio',
    proposito: 'negocio',
    nombre: 'Capital del taller',
    objetivo: 900_000,
    plazoMeses: 42,
    aporteMensual: 15_000,
    aporteInicial: 50_000,
    canal: 'toke',
    beneficiario: 'socios',
    antiguedad: 6,
  },
]

/**
 * Construye los planes corriendo la simulación hacia atrás: se crean con la
 * fecha de arranque real y se avanzan sus meses, así el historial y el
 * rendimiento salen del mismo motor que usa la app en vivo.
 */
export function planesIniciales(hoy = new Date()): Plan[] {
  const mesHoy = mesAbsoluto(hoy)
  return SEMILLAS.map(({ antiguedad, ...entrada }) => {
    const plan = avanzarMeses(
      crearPlan({ ...entrada, mesInicio: mesHoy - antiguedad }),
      antiguedad,
    )
    // Los hitos ya alcanzados antes de abrir la app no se vuelven a celebrar.
    return hitosAlcanzados(plan).reduce(marcarHitoVisto, plan)
  })
}
