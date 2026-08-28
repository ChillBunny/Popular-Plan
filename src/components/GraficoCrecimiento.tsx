import { useId } from 'react'
import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { TooltipContentProps } from 'recharts'
import type { Plan } from '../utils/plan'
import { etiquetaMes } from '../utils/plan'
import { pesos, pesosCorto } from '../utils/formato'
import { useTema } from '../theme/tema'
import { PALETAS } from '../theme/paletaGrafico'
import type { PaletaGrafico } from '../theme/paletaGrafico'

export interface GraficoCrecimientoProps {
  plan: Plan
}

interface Punto {
  mes: number
  aportado: number
  generado: number
  saldo: number
}

/** Recharts invoca `content` como función, no como componente: por eso el
 *  globo no usa hooks y recibe la paleta ya resuelta por props. */
function Globo({
  active,
  payload,
  paleta,
}: Pick<TooltipContentProps<number, string>, 'active' | 'payload'> & {
  paleta: PaletaGrafico
}) {
  const punto = payload?.[0]?.payload as Punto | undefined
  if (!active || !punto) return null

  return (
    <div
      className="rounded-lg border px-2.5 py-2 text-[11px] shadow-lg"
      style={{
        background: paleta.tooltipFondo,
        borderColor: paleta.tooltipBorde,
        color: paleta.tooltipTexto,
      }}
    >
      <p className="font-semibold capitalize">{etiquetaMes(punto.mes)}</p>
      <p className="mt-1 tabular-nums">
        <span style={{ color: paleta.aportado }}>■</span> Aportado {pesos(punto.aportado)}
      </p>
      <p className="tabular-nums">
        <span style={{ color: paleta.generado }}>■</span> Generado {pesos(punto.generado)}
      </p>
    </div>
  )
}

/**
 * Cuánto pusiste tú y cuánto puso el dinero. Dos áreas apiladas: la franja
 * verde de arriba es todo lo que no habrías tenido guardando el mismo monto
 * quieto. Sin ejes de jerga ni nombres de instrumentos.
 */
function GraficoCrecimiento({ plan }: GraficoCrecimientoProps) {
  const { tema } = useTema()
  const paleta = PALETAS[tema]
  const id = useId().replace(/:/g, '')

  const datos: Punto[] = plan.ruta.map((punto) => ({
    mes: punto.mes,
    aportado: punto.aportado,
    generado: punto.rendimiento,
    saldo: punto.saldo,
  }))

  return (
    <div className="h-[168px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={datos} margin={{ top: 8, right: 4, bottom: 0, left: -14 }}>
          <defs>
            <linearGradient id={`aportado-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={paleta.aportado} stopOpacity={0.55} />
              <stop offset="100%" stopColor={paleta.aportado} stopOpacity={0.12} />
            </linearGradient>
            <linearGradient id={`generado-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={paleta.generado} stopOpacity={0.9} />
              <stop offset="100%" stopColor={paleta.generado} stopOpacity={0.45} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="mes"
            tickFormatter={etiquetaMes}
            tick={{ fontSize: 10, fill: paleta.eje }}
            tickLine={false}
            axisLine={false}
            minTickGap={28}
          />
          <YAxis
            tickFormatter={(v: number) => pesosCorto(v).replace('RD$ ', '')}
            tick={{ fontSize: 10, fill: paleta.eje }}
            tickLine={false}
            axisLine={false}
            width={44}
          />
          <Tooltip
            content={(props) => <Globo {...props} paleta={paleta} />}
            cursor={{ stroke: paleta.eje, strokeWidth: 1 }}
          />

          <ReferenceLine
            y={plan.objetivo}
            stroke={paleta.meta}
            strokeDasharray="4 4"
            strokeWidth={1}
          />

          <Area
            type="monotone"
            dataKey="aportado"
            stackId="saldo"
            stroke={paleta.aportado}
            strokeWidth={1.6}
            fill={`url(#aportado-${id})`}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="generado"
            stackId="saldo"
            stroke={paleta.generado}
            strokeWidth={1.6}
            fill={`url(#generado-${id})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default GraficoCrecimiento
