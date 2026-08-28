/** Formateo de cifras y plazos en español dominicano. */

const PESOS = new Intl.NumberFormat('es-DO', {
  style: 'currency',
  currency: 'DOP',
  maximumFractionDigits: 0,
})

const PESOS_CENTAVOS = new Intl.NumberFormat('es-DO', {
  style: 'currency',
  currency: 'DOP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const NUMERO = new Intl.NumberFormat('es-DO', { maximumFractionDigits: 0 })

/**
 * "RD$ 1,500,000". Intl devuelve "RD$1,500,000" pegado según entorno; se
 * normaliza el espacio para que la cifra respire igual en todos lados.
 */
export function pesos(monto: number): string {
  return PESOS.format(Math.round(monto)).replace(/^(RD\$)\s?/, '$1 ')
}

export function pesosConCentavos(monto: number): string {
  return PESOS_CENTAVOS.format(monto).replace(/^(RD\$)\s?/, '$1 ')
}

/** Versión corta para cifras grandes en espacios estrechos: "RD$ 1.5 MM". */
export function pesosCorto(monto: number): string {
  const abs = Math.abs(monto)
  if (abs >= 1_000_000) {
    const valor = monto / 1_000_000
    return `RD$ ${valor.toFixed(valor >= 10 ? 0 : 1).replace(/\.0$/, '')} MM`
  }
  if (abs >= 10_000) return `RD$ ${NUMERO.format(Math.round(monto / 1000))}K`
  return pesos(monto)
}

export function numero(valor: number): string {
  return NUMERO.format(valor)
}

/** 0.38 → "38%" */
export function porcentaje(fraccion: number, decimales = 0): string {
  return `${(fraccion * 100).toFixed(decimales)}%`
}

/** 14 → "1 año y 2 meses" */
export function plazoLargo(meses: number): string {
  if (meses <= 0) return 'este mes'
  const anios = Math.floor(meses / 12)
  const resto = meses % 12
  const partes: string[] = []
  if (anios > 0) partes.push(`${anios} ${anios === 1 ? 'año' : 'años'}`)
  if (resto > 0) partes.push(`${resto} ${resto === 1 ? 'mes' : 'meses'}`)
  return partes.join(' y ')
}

/** 14 → "1 a 2 m" para espacios muy estrechos */
export function plazoCorto(meses: number): string {
  if (meses <= 0) return 'ya'
  const anios = Math.floor(meses / 12)
  const resto = meses % 12
  if (anios === 0) return `${resto} m`
  if (resto === 0) return `${anios} a`
  return `${anios} a ${resto} m`
}
