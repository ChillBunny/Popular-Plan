import { describe, expect, it } from 'vitest'
import {
  aportar,
  aporteMensualTotal,
  aporteNecesario,
  avanzarMes,
  avanzarMeses,
  completado,
  crearPlan,
  etiquetaMes,
  faltaParaHito,
  hitosCruzados,
  marcarHitoVisto,
  mesAbsoluto,
  progreso,
  proximoHito,
  proyectar,
  saldo,
  ultimoAporte,
} from './plan'
import type { EntradaPlan } from './plan'
import { pesos, pesosCorto, plazoLargo } from './formato'

const BASE: EntradaPlan = {
  proposito: 'vivienda',
  nombre: 'Inicial del apartamento',
  objetivo: 1_200_000,
  plazoMeses: 48,
  aporteMensual: 20_000,
  aporteInicial: 100_000,
  canal: 'cuenta',
  beneficiario: 'yo',
  mesInicio: mesAbsoluto(new Date(2026, 0, 1)),
  id: 'prueba',
}

describe('crearPlan', () => {
  it('arranca con el aporte inicial ya dentro del saldo', () => {
    const plan = crearPlan(BASE)
    expect(saldo(plan)).toBe(100_000)
    expect(plan.rendimiento).toBe(0)
    expect(plan.ruta).toHaveLength(1)
    expect(plan.aportes[0].tipo).toBe('inicial')
  })

  it('sin aporte inicial no registra movimiento', () => {
    const plan = crearPlan({ ...BASE, aporteInicial: 0 })
    expect(plan.aportes).toHaveLength(0)
    expect(saldo(plan)).toBe(0)
  })
})

describe('avanzarMes', () => {
  it('suma el aporte del mes y el rendimiento del saldo previo', () => {
    const plan = avanzarMes(crearPlan(BASE))
    expect(plan.aportado).toBe(120_000)
    // 100.000 al 6,5% anual ≈ 542 al mes
    expect(plan.rendimiento).toBeGreaterThan(500)
    expect(plan.rendimiento).toBeLessThan(600)
    expect(plan.meses).toBe(1)
  })

  it('nunca sobrepasa el objetivo', () => {
    const plan = avanzarMeses(crearPlan(BASE), 200)
    expect(saldo(plan)).toBeLessThanOrEqual(BASE.objetivo)
    expect(completado(plan)).toBe(true)
  })

  it('un plan completado ya no avanza', () => {
    const listo = avanzarMeses(crearPlan(BASE), 200)
    expect(avanzarMes(listo)).toBe(listo)
  })

  it('el rendimiento acelera la llegada frente al aporte puro', () => {
    const plan = avanzarMeses(crearPlan(BASE), 200)
    // Con solo aportes harían falta (1.200.000 - 100.000) / 20.000 = 55 meses
    expect(plan.meses).toBeLessThan(55)
    expect(plan.rendimiento).toBeGreaterThan(0)
  })
})

describe('aportar', () => {
  it('el aporte extra entra en el mes en curso sin crear un mes nuevo', () => {
    const plan = avanzarMeses(crearPlan(BASE), 3)
    const conExtra = aportar(plan, 50_000, 'yava')
    expect(conExtra.meses).toBe(plan.meses)
    expect(conExtra.ruta).toHaveLength(plan.ruta.length)
    expect(saldo(conExtra)).toBe(saldo(plan) + 50_000)
    expect(conExtra.aportes.at(-1)).toMatchObject({ canal: 'yava', tipo: 'extra' })
  })

  it('recorta el aporte al faltante', () => {
    const plan = crearPlan(BASE)
    const conExtra = aportar(plan, 5_000_000)
    expect(saldo(conExtra)).toBe(BASE.objetivo)
    expect(completado(conExtra)).toBe(true)
  })

  it('ignora montos no positivos', () => {
    const plan = crearPlan(BASE)
    expect(aportar(plan, 0)).toBe(plan)
    expect(aportar(plan, -100)).toBe(plan)
  })
})

describe('hitos', () => {
  it('el próximo hito avanza 25 → 60 → 100 y luego se agota', () => {
    const plan = crearPlan(BASE)
    expect(proximoHito(plan)).toBe(25)
    expect(proximoHito(aportar(plan, 300_000))).toBe(60)
    expect(proximoHito(aportar(plan, 800_000))).toBe(100)
    expect(proximoHito(aportar(plan, 1_100_000))).toBeNull()
  })

  it('faltaParaHito mide contra el porcentaje del objetivo', () => {
    const plan = crearPlan(BASE)
    expect(faltaParaHito(plan, 25)).toBe(200_000)
  })

  it('hitosCruzados solo reporta los nuevos y no vistos', () => {
    const plan = crearPlan(BASE)
    const cruzado = aportar(plan, 650_000) // 62,5% → cruza 25 y 60
    expect(hitosCruzados(plan, cruzado)).toEqual([25, 60])

    const yaVisto = marcarHitoVisto(cruzado, 25)
    expect(hitosCruzados(plan, yaVisto)).toEqual([60])
  })

  it('marcarHitoVisto es idempotente', () => {
    const plan = marcarHitoVisto(crearPlan(BASE), 25)
    expect(marcarHitoVisto(plan, 25)).toBe(plan)
  })

  it('el progreso se topa en 1', () => {
    const plan = aportar(crearPlan(BASE), 5_000_000)
    expect(progreso(plan)).toBe(1)
  })
})

describe('proyectar', () => {
  it('estima llegada y la compara con el plazo prometido', () => {
    const proyeccion = proyectar(crearPlan(BASE))
    expect(proyeccion.mesesRestantes).not.toBeNull()
    expect(proyeccion.mesLlegada).not.toBeNull()
    // 48 meses de plazo y ~51 de ritmo real → llega tarde
    expect(proyeccion.diferenciaConPlazo).not.toBeNull()
    expect(proyeccion.futuro.length).toBe(proyeccion.mesesRestantes)
  })

  it('sin aporte mensual ni saldo la meta no se alcanza', () => {
    const plan = crearPlan({ ...BASE, aporteMensual: 0, aporteInicial: 0 })
    const proyeccion = proyectar(plan)
    expect(proyeccion.mesesRestantes).toBeNull()
    expect(proyeccion.mesLlegada).toBeNull()
  })

  it('un plan ya completado proyecta cero meses restantes', () => {
    const plan = aportar(crearPlan(BASE), 5_000_000)
    expect(proyectar(plan).mesesRestantes).toBe(0)
  })
})

describe('aporteNecesario', () => {
  it('el aporte calculado llega al objetivo dentro del plazo', () => {
    const mensual = aporteNecesario(1_200_000, 48, 100_000)
    const plan = avanzarMeses(
      crearPlan({ ...BASE, aporteMensual: mensual }),
      48,
    )
    expect(completado(plan)).toBe(true)
  })

  it('cae a cero cuando el inicial ya cubre el objetivo', () => {
    expect(aporteNecesario(100_000, 24, 500_000)).toBe(0)
  })
})

describe('resumen de aportes', () => {
  it('solo suma el ritmo de las metas activas', () => {
    const activa = crearPlan({ ...BASE, aporteMensual: 3_000 })
    const cumplida = aportar(crearPlan({ ...BASE, aporteMensual: 9_000 }), 5_000_000)
    expect(aporteMensualTotal([activa, cumplida])).toBe(3_000)
  })

  it('devuelve el aporte más reciente y descarta el de arranque', () => {
    const primerPlan = avanzarMeses(crearPlan({ ...BASE, aporteMensual: 2_000 }), 2)
    const segundoPlan = avanzarMeses(
      crearPlan({ ...BASE, id: 'segundo', aporteMensual: 3_000 }),
      4,
    )
    expect(ultimoAporte([primerPlan, segundoPlan])).toMatchObject({
      monto: 3_000,
      tipo: 'mensual',
    })
  })
})

describe('formato', () => {
  it('pesos separa el símbolo de la cifra', () => {
    expect(pesos(1_500_000)).toBe('RD$ 1,500,000')
  })

  it('pesosCorto abrevia millones y miles', () => {
    expect(pesosCorto(1_500_000)).toBe('RD$ 1.5 MM')
    expect(pesosCorto(250_000)).toBe('RD$ 250K')
    expect(pesosCorto(4_800)).toBe('RD$ 4,800')
  })

  it('plazoLargo escribe años y meses en español', () => {
    expect(plazoLargo(14)).toBe('1 año y 2 meses')
    expect(plazoLargo(24)).toBe('2 años')
    expect(plazoLargo(1)).toBe('1 mes')
  })

  it('etiquetaMes convierte el índice absoluto', () => {
    expect(etiquetaMes(mesAbsoluto(new Date(2028, 2, 1)))).toBe('mar 2028')
  })
})
