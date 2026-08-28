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
 * Estado inicial del prototipo. El cliente ahorra RD$6,000 al mes entre dos
 * planes activos; la pasola ya aparece como logro. La demo sigue mostrando
 * ruta, hito y meta completada sin inventar una capacidad de ahorro irreal.
 *
 *  · Educación — cerca del 100%, para demostrar el puente al completarla.
 *  · Taller    — recién pasado el primer hito.
 *  · Pasola    — una compra personal ya lograda.
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
    id: 'plan-educacion',
    proposito: 'educacion',
    nombre: 'Inscripción de Camila',
    objetivo: 150_000,
    plazoMeses: 48,
    aporteMensual: 3_000,
    // Aportado desde el exterior: el mismo cliente, otro canal de entrada.
    aporteInicial: 15_000,
    canal: 'yava',
    beneficiario: 'hijo',
    antiguedad: 39,
  },
  {
    id: 'plan-taller',
    proposito: 'negocio',
    nombre: 'Inicial del taller',
    objetivo: 80_000,
    plazoMeses: 27,
    aporteMensual: 3_000,
    aporteInicial: 5_000,
    canal: 'toke',
    beneficiario: 'socios',
    antiguedad: 6,
  },
  {
    id: 'plan-pasola',
    proposito: 'vehiculo',
    nombre: 'Mi pasola',
    objetivo: 60_000,
    plazoMeses: 18,
    aporteMensual: 3_000,
    aporteInicial: 6_000,
    canal: 'cuenta',
    beneficiario: 'yo',
    antiguedad: 18,
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
