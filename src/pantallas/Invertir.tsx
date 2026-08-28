import { INSTRUMENTOS_DIRECTOS } from '../data/catalogo'
import BarraApp from '../components/layout/BarraApp'
import Boton from '../components/ui/Boton'
import Icono from '../components/ui/Icono'
import Tarjeta, { Nota } from '../components/ui/Tarjeta'

export interface InvertirProps {
  onNuevaMeta: () => void
}

/**
 * La alternativa considerada del proyecto: acceso directo al mercado de
 * valores para quien ya sabe qué quiere y prefiere manejarlo por su cuenta.
 * Vive dentro de la misma app como contraste del flujo guiado — unos quieren
 * que el sistema les arme la ruta, otros quieren el control.
 *
 * No se muestran rendimientos: solo tipo de instrumento, emisor y plazo.
 */
function Invertir({ onNuevaMeta }: InvertirProps) {
  return (
    <>
      <BarraApp titulo="Invertir" />

      <main className="animar-vista min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-6">
        <h2 className="px-1 text-[19px] font-bold text-slate-900 dark:text-slate-100">
          Invierte a tu manera
        </h2>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onNuevaMeta}
            className="rounded-2xl border border-popular-200 bg-popular-50/70 p-3.5 text-left transition-colors hover:border-popular-400 dark:border-popular-900 dark:bg-popular-950/50"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-popular-600 text-white">
              <Icono nombre="bandera" tam={17} grosor={2} />
            </span>
            <span className="mt-2.5 block text-[13px] font-bold text-slate-900 dark:text-slate-100">
              Con ruta
            </span>
            <span className="mt-0.5 block text-[11px] leading-snug text-slate-600 dark:text-slate-400">Con meta y hitos.</span>
          </button>

          <div className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-700 dark:bg-slate-800/60">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-white dark:bg-slate-600">
              <Icono nombre="bolsa" tam={17} grosor={2} />
            </span>
            <span className="mt-2.5 block text-[13px] font-bold text-slate-900 dark:text-slate-100">
              Por mi cuenta
            </span>
            <span className="mt-0.5 block text-[11px] leading-snug text-slate-600 dark:text-slate-400">Tú eliges el instrumento.</span>
          </div>
        </div>

        <Tarjeta titulo="Instrumentos">
          <ul className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {INSTRUMENTOS_DIRECTOS.map((instrumento) => (
              <li key={instrumento.nombre}>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 py-3 text-left transition-colors hover:text-popular-700 dark:hover:text-popular-200"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-semibold text-slate-800 dark:text-slate-100">
                      {instrumento.nombre}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-slate-500 dark:text-slate-400">
                      {instrumento.emisor}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10.5px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                    {instrumento.plazo}
                  </span>
                  <span className="text-slate-300 dark:text-slate-600">
                    <Icono nombre="chevron" tam={15} grosor={2.2} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Tarjeta>

        <Nota icono="escudo" tono="aviso">
          Toda inversión conlleva riesgo.
        </Nota>

        <Boton tono="secundario" tam="lg" ancho icono="bandera" onClick={onNuevaMeta}>
          Crear una meta
        </Boton>
      </main>
    </>
  )
}

export default Invertir
