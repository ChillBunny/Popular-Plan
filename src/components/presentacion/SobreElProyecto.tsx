import { FLUJO, IDENTIDAD, METRICAS, RESPALDOS } from '../../data/presentacion'
import { SUPUESTOS } from '../../utils/plan'
import { porcentaje } from '../../utils/formato'
import Icono from '../ui/Icono'

export interface SobreElProyectoProps {
  /** Versión reducida para la hoja dentro del teléfono */
  compacto?: boolean
}

/**
 * El argumento del proyecto en texto. Se usa en el panel de escritorio, en
 * la hoja de "Sobre este prototipo" y en la vista de información en móvil,
 * para que exista una sola versión de lo que decimos.
 */
function SobreElProyecto({ compacto }: SobreElProyectoProps) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-300">
          {IDENTIDAD.unaLinea}
        </p>
        <p className="mt-3 border-l-2 border-popular-500 pl-3 text-[12.5px] font-semibold italic leading-relaxed text-popular-800 dark:border-popular-400 dark:text-popular-100">
          «{IDENTIDAD.fraseEje}»
        </p>
      </div>

      {!compacto ? (
        <div>
          <h4 className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
            El problema
          </h4>
          <p className="mt-1.5 text-[12px] leading-relaxed text-slate-600 dark:text-slate-300">
            {IDENTIDAD.problema}
          </p>
        </div>
      ) : null}

      <div>
        <h4 className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
          Cómo funciona
        </h4>
        <ol className="mt-2 space-y-2.5">
          {FLUJO.map((paso, i) => (
            <li key={paso.titulo} className="flex gap-2.5">
              <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-popular-100 text-[10.5px] font-bold text-popular-700 dark:bg-popular-900 dark:text-popular-200">
                {i + 1}
              </span>
              <span className="min-w-0">
                <span className="block text-[12px] font-semibold text-slate-800 dark:text-slate-100">
                  {paso.titulo}
                </span>
                <span className="mt-0.5 block text-[11.5px] leading-relaxed text-slate-500 dark:text-slate-400">
                  {paso.detalle}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <h4 className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
          Sobre qué se apoya
        </h4>
        <ul className="mt-2 space-y-1.5">
          {RESPALDOS.map((respaldo) => (
            <li
              key={respaldo}
              className="flex gap-2 text-[11.5px] leading-relaxed text-slate-600 dark:text-slate-300"
            >
              <span className="mt-0.5 text-crece-500">
                <Icono nombre="cheque" tam={12} grosor={3} />
              </span>
              {respaldo}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
          Qué mediríamos
        </h4>
        <ul className="mt-2 space-y-2">
          {METRICAS.map((metrica) => (
            <li key={metrica.valor} className="flex items-baseline gap-2.5">
              <span className="w-16 shrink-0 font-display text-[15px] font-extrabold text-popular-700 dark:text-popular-200">
                {metrica.valor}
              </span>
              <span className="text-[11.5px] leading-snug text-slate-600 dark:text-slate-300">
                {metrica.detalle}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60">
        <h4 className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
          Supuestos de la simulación
        </h4>
        <p className="mt-1.5 text-[11.5px] leading-relaxed text-slate-600 dark:text-slate-300">
          El prototipo proyecta con un rendimiento referencial de{' '}
          <strong>{porcentaje(SUPUESTOS.rendimientoAnual, 1)} anual</strong> y una
          colocación a <strong>{SUPUESTOS.ventanaDias} días</strong>. No es una tasa
          ofrecida, vigente ni garantizada: es el parámetro con el que se dibuja la
          ruta. Cliente, metas y montos son ficticios.
        </p>
      </div>

      <p className="text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
        La paleta y la tipografía son una aproximación a la identidad del Grupo Popular
        y están centralizadas en tokens: al recibir la guía de marca oficial se
        sustituyen en un solo archivo.
      </p>
    </div>
  )
}

export default SobreElProyecto
