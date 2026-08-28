import type { Tema } from './tema'

/**
 * Colores del gráfico. Recharts pinta SVG con valores literales —los
 * atributos de presentación no resuelven var()—, así que la paleta vive
 * aquí duplicando los tokens de index.css.
 */
export interface PaletaGrafico {
  /** Lo que aporta el cliente */
  aportado: string
  /** Lo que genera el propio dinero */
  generado: string
  rejilla: string
  eje: string
  /** Línea de la meta */
  meta: string
  tooltipFondo: string
  tooltipBorde: string
  tooltipTexto: string
}

export const PALETAS: Record<Tema, PaletaGrafico> = {
  claro: {
    aportado: '#0d55a4',
    generado: '#12a594',
    rejilla: '#e8edf3',
    eje: '#94a3b8',
    meta: '#94a3b8',
    tooltipFondo: '#ffffff',
    tooltipBorde: '#e2e8f0',
    tooltipTexto: '#0f172a',
  },
  oscuro: {
    aportado: '#4a8ed6',
    generado: '#34c3ac',
    rejilla: '#1e293b',
    eje: '#64748b',
    meta: '#64748b',
    tooltipFondo: '#0b1220',
    tooltipBorde: '#334155',
    tooltipTexto: '#e2e8f0',
  },
}
