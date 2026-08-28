import { FLUJO, IDENTIDAD } from '../../data/presentacion'

/** Resumen para el jurado, separado de la experiencia del cliente. */
function SobreElProyecto() {
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

      <div>
        <h4 className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
          Cómo funciona
        </h4>
        <ol className="mt-2 space-y-2">
          {FLUJO.map((paso, i) => (
            <li key={paso.titulo} className="flex gap-2.5">
              <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-popular-100 text-[10.5px] font-bold text-popular-700 dark:bg-popular-900 dark:text-popular-200">
                {i + 1}
              </span>
              <span className="min-w-0 text-[12px] font-semibold text-slate-800 dark:text-slate-100">
                {paso.titulo}
              </span>
            </li>
          ))}
        </ol>
      </div>

    </div>
  )
}

export default SobreElProyecto
