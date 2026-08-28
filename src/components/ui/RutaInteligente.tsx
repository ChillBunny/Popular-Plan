import { HITOS } from '../../data/catalogo'
import { pesosCorto } from '../../utils/formato'
import Icono from './Icono'

export interface RutaInteligenteProps {
  /** Avance 0–1 */
  valor: number
  objetivo: number
  /** Sin etiquetas: para la tarjeta de la lista de metas */
  compacta?: boolean
}

/**
 * La Ruta Inteligente: el objetivo partido en tres hitos visuales sobre una
 * misma línea a escala real. Que 60 esté más cerca de 100 que de 25 es
 * información, no decoración: el último tramo se siente más corto.
 */
function RutaInteligente({ valor, objetivo, compacta }: RutaInteligenteProps) {
  const avance = Math.max(0, Math.min(1, valor))
  const pct = avance * 100

  return (
    <div className={compacta ? '' : 'pb-9 pt-1'}>
      <div className="relative h-2">
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-slate-200 dark:bg-slate-700" />
        {/* El relleno ocupa todo el riel y se recorta con clip-path en vez de
            animar el ancho: no dispara layout y conserva el remate redondo. */}
        <div
          className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-popular-600 to-crece-500"
          style={{
            clipPath: `inset(0 ${100 - pct}% 0 0 round 9999px)`,
            transition: 'clip-path 700ms cubic-bezier(0.22,1,0.36,1)',
          }}
        />

        {HITOS.map((hito) => {
          const alcanzado = pct >= hito
          const esProximo = !alcanzado && HITOS.find((h) => pct < h) === hito
          const ultimo = hito === 100
          return (
            <div
              key={hito}
              className="absolute top-1/2"
              style={{
                left: `${hito}%`,
                transform: `translate(${ultimo ? '-100%' : '-50%'}, -50%)`,
              }}
            >
              <span
                className={`flex items-center justify-center rounded-full border-2 transition-colors ${
                  compacta ? 'h-3 w-3' : 'h-5 w-5'
                } ${
                  alcanzado
                    ? 'border-transparent bg-popular-600 text-white dark:bg-popular-400 dark:text-popular-950'
                    : esProximo
                      ? 'border-popular-500 bg-white dark:border-popular-300 dark:bg-slate-900'
                      : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900'
                }`}
              >
                {alcanzado && !compacta ? (
                  <Icono nombre="cheque" tam={11} grosor={3} />
                ) : null}
              </span>

              {!compacta ? (
                <span
                  className={`absolute top-7 flex w-20 flex-col leading-tight ${
                    ultimo ? 'right-0 items-end text-right' : 'left-1/2 -translate-x-1/2 items-center text-center'
                  }`}
                >
                  <span
                    className={`text-[11px] font-bold ${
                      alcanzado
                        ? 'text-popular-700 dark:text-popular-200'
                        : esProximo
                          ? 'text-slate-700 dark:text-slate-200'
                          : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {hito}%
                  </span>
                  <span className="text-[10.5px] tabular-nums text-slate-400 dark:text-slate-500">
                    {pesosCorto((objetivo * hito) / 100)}
                  </span>
                </span>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RutaInteligente
