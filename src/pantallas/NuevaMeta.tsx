import { useMemo, useState } from 'react'
import {
  BENEFICIARIOS,
  CANALES,
  ORDEN_BENEFICIARIOS,
  ORDEN_CANALES,
  ORDEN_PROPOSITOS,
  PRODUCTOS,
  PROPOSITOS,
} from '../data/catalogo'
import type { BeneficiarioId, CanalId, PropositoId } from '../data/catalogo'
import type { EntradaPlan } from '../utils/plan'
import { aporteNecesario, crearPlan, etiquetaMesLarga, proyectar } from '../utils/plan'
import { pesos, plazoLargo } from '../utils/formato'
import BarraApp from '../components/layout/BarraApp'
import Boton from '../components/ui/Boton'
import Deslizador from '../components/ui/Deslizador'
import Opcion from '../components/ui/Opcion'
import Icono from '../components/ui/Icono'
import { Nota } from '../components/ui/Tarjeta'

export interface NuevaMetaProps {
  /** Mes absoluto en que arranca el plan */
  mesHoy: number
  onCancelar: () => void
  onCrear: (entrada: EntradaPlan) => void
}

const PASOS = ['Propósito', 'Destino', 'Ritmo']

/**
 * Alta de una meta en tres pasos: primero el propósito (para qué), después
 * el destino (cuánto y para cuándo) y al final el ritmo (cómo lo vas a
 * aportar). El sistema calcula el esfuerzo; el cliente decide el destino.
 */
function NuevaMeta({ mesHoy, onCancelar, onCrear }: NuevaMetaProps) {
  const [paso, setPaso] = useState(0)
  const [proposito, setProposito] = useState<PropositoId>('vivienda')
  const [nombre, setNombre] = useState('')
  const [objetivo, setObjetivo] = useState(PROPOSITOS.vivienda.montoSugerido)
  const [plazo, setPlazo] = useState(PROPOSITOS.vivienda.plazoSugerido)
  const [inicial, setInicial] = useState(0)
  /** null = el cliente aún no ha tocado el aporte: manda el sugerido */
  const [mensualManual, setMensualManual] = useState<number | null>(null)
  const [canal, setCanal] = useState<CanalId>('cuenta')
  const [beneficiario, setBeneficiario] = useState<BeneficiarioId>('yo')

  const ficha = PROPOSITOS[proposito]
  const sugerido = useMemo(
    () => aporteNecesario(objetivo, plazo, inicial),
    [objetivo, plazo, inicial],
  )
  const mensual = mensualManual ?? sugerido
  const maxInicial = Math.max(50_000, Math.round(objetivo / 2 / 10_000) * 10_000)

  /** Llegada real con el ritmo elegido (puede diferir del plazo pedido). */
  const proyeccion = useMemo(
    () =>
      proyectar(
        crearPlan({
          id: 'borrador',
          proposito,
          nombre: nombre || ficha.titular,
          objetivo,
          plazoMeses: plazo,
          aporteMensual: mensual,
          aporteInicial: inicial,
          canal,
          beneficiario,
          mesInicio: mesHoy,
        }),
      ),
    [proposito, nombre, ficha.titular, objetivo, plazo, mensual, inicial, canal, beneficiario, mesHoy],
  )

  function elegirProposito(id: PropositoId) {
    setProposito(id)
    setObjetivo(PROPOSITOS[id].montoSugerido)
    setPlazo(PROPOSITOS[id].plazoSugerido)
    setMensualManual(null)
    setNombre('')
    if (id === 'negocio') setBeneficiario('socios')
    else if (id === 'educacion') setBeneficiario('hijo')
    else setBeneficiario('yo')
  }

  function crear() {
    onCrear({
      proposito,
      nombre: nombre.trim() || ficha.ejemplos[0],
      objetivo,
      plazoMeses: plazo,
      aporteMensual: mensual,
      aporteInicial: inicial,
      canal,
      beneficiario,
      mesInicio: mesHoy,
    })
  }

  const beneficiarioElegido = BENEFICIARIOS[beneficiario]
  const productoEnlazado = beneficiarioElegido.producto
    ? PRODUCTOS[beneficiarioElegido.producto]
    : null

  return (
    <>
      <BarraApp
        titulo="Nueva meta"
        onVolver={() => (paso === 0 ? onCancelar() : setPaso(paso - 1))}
      />

      <div className="shrink-0 px-4 pb-3">
        <div className="flex gap-1.5">
          {PASOS.map((etiqueta, i) => (
            <span key={etiqueta} className="flex-1">
              <span
                className={`block h-1 rounded-full transition-colors ${
                  i <= paso
                    ? 'bg-popular-600 dark:bg-popular-400'
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
              <span
                className={`mt-1.5 block text-[10px] font-semibold uppercase tracking-wider ${
                  i <= paso
                    ? 'text-popular-700 dark:text-popular-200'
                    : 'text-slate-400 dark:text-slate-600'
                }`}
              >
                {etiqueta}
              </span>
            </span>
          ))}
        </div>
      </div>

      {paso === 0 ? (
        <main key="paso-0" className="animar-vista min-h-0 flex-1 overflow-y-auto px-4 pb-5">
          <h2 className="text-[19px] font-bold text-slate-900 dark:text-slate-100">
            ¿Para qué estás ahorrando?
          </h2>
          <p className="mt-1 text-[12.5px] leading-relaxed text-slate-500 dark:text-slate-400">
            El propósito no es una etiqueta: define a dónde va a llegar tu dinero cuando
            completes la meta.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {ORDEN_PROPOSITOS.map((id) => (
              <Opcion
                key={id}
                destacada
                titulo={PROPOSITOS[id].titular}
                detalle={PROPOSITOS[id].descripcion}
                icono={PROPOSITOS[id].icono}
                insignia={PROPOSITOS[id].piloto ? 'Piloto' : undefined}
                seleccionada={proposito === id}
                onSelect={() => elegirProposito(id)}
              />
            ))}
          </div>

          <div className="mt-4">
            <Nota icono="bandera">
              Vivienda es la categoría piloto del arranque: es donde la red de aliados
              del Grupo Popular ya está construida.
            </Nota>
          </div>

          <div className="mt-4">
            <Boton tam="lg" ancho icono="adelante" iconoDerecha onClick={() => setPaso(1)}>
              Continuar
            </Boton>
          </div>
        </main>
      ) : null}

      {paso === 1 ? (
        <main key="paso-1" className="animar-vista min-h-0 flex-1 space-y-4 overflow-y-auto px-4 pb-5">
          <div>
            <h2 className="text-[19px] font-bold text-slate-900 dark:text-slate-100">
              ¿Cuánto y para cuándo?
            </h2>
            <p className="mt-1 text-[12.5px] leading-relaxed text-slate-500 dark:text-slate-400">
              Ponle nombre a la meta y define el número que hay que alcanzar.
            </p>
          </div>

          <div>
            <label
              htmlFor="nombre-meta"
              className="text-[11.5px] font-semibold text-slate-600 dark:text-slate-300"
            >
              Nombre de la meta
            </label>
            <input
              id="nombre-meta"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder={ficha.ejemplos[0]}
              maxLength={40}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13.5px] text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-popular-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            <div className="mt-2 flex gap-1.5 overflow-x-auto sin-scrollbar">
              {ficha.ejemplos.map((ejemplo) => (
                <button
                  key={ejemplo}
                  type="button"
                  onClick={() => setNombre(ejemplo)}
                  className="shrink-0 rounded-full border border-slate-200 px-2.5 py-1 text-[11px] text-slate-500 transition-colors hover:border-popular-300 hover:text-popular-700 dark:border-slate-700 dark:text-slate-400 dark:hover:text-popular-200"
                >
                  {ejemplo}
                </button>
              ))}
            </div>
          </div>

          <Deslizador
            etiqueta="Monto objetivo"
            valorTexto={pesos(objetivo)}
            valor={objetivo}
            min={50_000}
            max={6_000_000}
            paso={25_000}
            extremos={['RD$ 50 mil', 'RD$ 6 MM']}
            onChange={(v) => {
              setObjetivo(v)
              setInicial((actual) => Math.min(actual, Math.round(v / 2)))
            }}
          />

          <Deslizador
            etiqueta="Quiero lograrlo en"
            valorTexto={plazoLargo(plazo)}
            valor={plazo}
            min={6}
            max={84}
            paso={3}
            extremos={['6 meses', '7 años']}
            ayuda={`Fecha límite: ${etiquetaMesLarga(mesHoy + plazo)}`}
            onChange={setPlazo}
          />

          <div className="rounded-2xl border border-popular-100 bg-popular-50/70 p-4 dark:border-popular-900 dark:bg-popular-950/50">
            <p className="text-[11.5px] text-popular-800 dark:text-popular-100">
              Para llegar en esa fecha necesitas aportar
            </p>
            <p className="mt-1 font-display text-2xl font-extrabold tabular-nums text-popular-700 dark:text-popular-200">
              {pesos(sugerido)}
              <span className="text-sm font-semibold"> / mes</span>
            </p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-popular-700/80 dark:text-popular-200/70">
              Ya contando lo que tu propio dinero genera mientras espera. En el
              siguiente paso puedes ajustarlo.
            </p>
          </div>

          <Boton tam="lg" ancho icono="adelante" iconoDerecha onClick={() => setPaso(2)}>
            Continuar
          </Boton>
        </main>
      ) : null}

      {paso === 2 ? (
        <main key="paso-2" className="animar-vista min-h-0 flex-1 space-y-4 overflow-y-auto px-4 pb-5">
          <div>
            <h2 className="text-[19px] font-bold text-slate-900 dark:text-slate-100">
              ¿Cómo vas a aportar?
            </h2>
            <p className="mt-1 text-[12.5px] leading-relaxed text-slate-500 dark:text-slate-400">
              El canal es solo la puerta de entrada del dinero. Puedes cambiarlo cuando
              quieras.
            </p>
          </div>

          <Deslizador
            etiqueta="Aporte mensual"
            valorTexto={pesos(mensual)}
            valor={mensual}
            min={1_000}
            max={150_000}
            paso={1_000}
            extremos={['RD$ 1 mil', 'RD$ 150 mil']}
            onChange={setMensualManual}
            ayuda={
              mensual < sugerido
                ? `Con este ritmo llegas después de la fecha que te pusiste.`
                : undefined
            }
          />

          <Deslizador
            etiqueta="Aporte de arranque (opcional)"
            valorTexto={pesos(inicial)}
            valor={inicial}
            min={0}
            max={maxInicial}
            paso={10_000}
            extremos={['Sin arranque', pesos(maxInicial)]}
            onChange={(v) => {
              setInicial(v)
              setMensualManual(null)
            }}
          />

          <div>
            <p className="mb-2 text-[11.5px] font-semibold text-slate-600 dark:text-slate-300">
              Canal del aporte
            </p>
            <div className="grid gap-2">
              {ORDEN_CANALES.map((id) => (
                <Opcion
                  key={id}
                  titulo={CANALES[id].nombre}
                  detalle={CANALES[id].detalle}
                  icono={CANALES[id].icono}
                  seleccionada={canal === id}
                  onSelect={() => setCanal(id)}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[11.5px] font-semibold text-slate-600 dark:text-slate-300">
              ¿De quién es esta meta?
            </p>
            <div className="grid grid-cols-2 gap-2">
              {ORDEN_BENEFICIARIOS.map((id) => (
                <Opcion
                  key={id}
                  titulo={BENEFICIARIOS[id].nombre}
                  detalle={BENEFICIARIOS[id].detalle}
                  seleccionada={beneficiario === id}
                  onSelect={() => setBeneficiario(id)}
                />
              ))}
            </div>
            {/* Ranura fija: cambiar de titularidad no debe mover el bloque
                de abajo mientras el usuario compara opciones. */}
            <p className="mt-2 flex min-h-[18px] items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              {productoEnlazado ? (
                <>
                  <Icono nombre="rayo" tam={12} relleno />
                  Se puede enlazar con {productoEnlazado.nombre}.
                </>
              ) : null}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Tu ruta
            </p>
            <p className="mt-1.5 min-h-[63px] text-[13px] leading-relaxed text-slate-700 dark:text-slate-200">
              {proyeccion.mesLlegada === null ? (
                <>Con este aporte la meta no llega a completarse. Sube el ritmo mensual.</>
              ) : (
                <>
                  Llegas a <strong>{pesos(objetivo)}</strong> en{' '}
                  <strong>{etiquetaMesLarga(proyeccion.mesLlegada)}</strong>
                  {typeof proyeccion.diferenciaConPlazo === 'number' &&
                  proyeccion.diferenciaConPlazo !== 0 ? (
                    <>
                      {' '}
                      —{' '}
                      {proyeccion.diferenciaConPlazo > 0
                        ? `${plazoLargo(proyeccion.diferenciaConPlazo)} antes de tu fecha`
                        : `${plazoLargo(-proyeccion.diferenciaConPlazo)} después de tu fecha`}
                      .
                    </>
                  ) : (
                    <> justo en la fecha que te pusiste.</>
                  )}
                </>
              )}
            </p>
            <p className="mt-2 flex min-h-[34px] flex-wrap items-start gap-x-1.5 text-[11.5px] leading-snug text-crece-600 dark:text-crece-400">
              {proyeccion.mesLlegada !== null ? (
                <>
                  <span className="mt-px">
                    <Icono nombre="crecer" tam={13} grosor={2.2} />
                  </span>
                  <span className="tabular-nums">
                    {pesos(proyeccion.rendimientoProyectado)}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    los pone tu propio dinero (estimado)
                  </span>
                </>
              ) : null}
            </p>
          </div>

          <Boton
            tam="lg"
            ancho
            icono="cheque"
            onClick={crear}
            disabled={proyeccion.mesLlegada === null}
          >
            Crear mi plan
          </Boton>

          <Nota icono="info" tono="aviso">
            Prototipo con fines de demostración. Las cifras de rendimiento son
            estimaciones de la simulación, no una tasa ofrecida ni garantizada.
          </Nota>
        </main>
      ) : null}
    </>
  )
}

export default NuevaMeta
