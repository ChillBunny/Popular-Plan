import type { ProductoId } from './catalogo'

/**
 * Contenido del marco de presentación: lo que rodea al teléfono en
 * escritorio y lo que aparece en la hoja "Sobre este prototipo" en móvil.
 *
 * La app de adentro se mantiene limpia (es una app de banca, no un pitch);
 * el argumento del proyecto vive aquí afuera, junto al equipo.
 */

export const IDENTIDAD = {
  nombre: 'Popular Plan',
  contexto: 'Grupo Popular · Challenge de Estudiantes',
  unaLinea:
    'Ahorro por metas donde el dinero no solo crece: llega conectado al destino real que motivó el ahorro.',
  fraseEje: 'No perdemos por falta de producto: perdemos por falta de puente.',
  problema:
    'Guardar con disciplina ya está resuelto: hay cuentas programadas, automáticas y a plazo fijo. Lo que no está resuelto es que ese dinero crezca y llegue a su destino. Hoy se ahorra para un apartamento y al final se tiene un balance, no una llave.',
}

/** El flujo del producto, tal como se cuenta al jurado. */
export const FLUJO: { titulo: string; detalle: string }[] = [
  {
    titulo: 'Definir el propósito',
    detalle: 'Vivienda, educación, vehículo, negocio u otro. Monto y fecha límite.',
  },
  {
    titulo: 'Ruta Inteligente',
    detalle: 'El camino se parte en tres hitos visuales: 25%, 60% y 100%.',
  },
  {
    titulo: 'El dinero no se queda quieto',
    detalle:
      'Mientras se acumula se coloca a corto plazo y los retornos se autodepositan en el mismo plan.',
  },
  {
    titulo: 'El producto correcto en el momento correcto',
    detalle:
      'En cada hito aparece el activo del grupo que corresponde a ese avance, no publicidad genérica.',
  },
  {
    titulo: 'El puente',
    detalle:
      'Al completar la meta se abren las alianzas del Grupo Popular para resolver la compra dentro del ecosistema.',
  },
]

export const METRICAS: { valor: string; detalle: string }[] = [
  {
    valor: '35%',
    detalle: 'de los ahorradores principiantes se vuelven ahorradores frecuentes',
  },
  { valor: '−25%', detalle: 'en la tasa de retiros prematuros de los planes' },
  { valor: '↓ tiempo', detalle: 'promedio para alcanzar una meta frente a ahorrar sin propósito' },
]

export const RESPALDOS: string[] = [
  'Más de 1,100 alianzas activas con desarrolladores inmobiliarios.',
  'Tu Casa Popular ya conecta el ahorro con proyectos de vivienda específicos.',
  'Excelencia Popular articula una red de más de 20 universidades aliadas.',
]

/* ------------------------------------------------------------------ */
/* Narración por pantalla                                              */
/* ------------------------------------------------------------------ */

export type ClaveNota =
  | 'inicio'
  | 'nueva'
  | 'plan'
  | 'hito'
  | 'completada'
  | 'invertir'
  | 'perfil'

export interface NotaPantalla {
  titulo: string
  texto: string
  /** Activos del grupo que intervienen en esta pantalla */
  activos: ProductoId[]
}

export const NOTAS: Record<ClaveNota, NotaPantalla> = {
  inicio: {
    titulo: 'Una cartera de destinos, no de balances',
    texto:
      'Cada fila es una meta con nombre propio y su avance sobre la ruta. La cifra verde —lo que generó el propio dinero— es lo que una cuenta programada no puede mostrar.',
    activos: ['afi'],
  },
  nueva: {
    titulo: 'Primero el propósito, después el número',
    texto:
      'El cliente elige a dónde quiere llegar y para cuándo; el sistema calcula el esfuerzo mensual. El propósito no es una etiqueta: define qué alianza se abre al final.',
    activos: ['afi', 'toke', 'yava'],
  },
  plan: {
    titulo: 'Ruta Inteligente y dinero en movimiento',
    texto:
      'Los tres hitos a escala real y, debajo, la franja verde: cuánto de lo acumulado lo puso el propio dinero mientras esperaba. El cliente no ve instrumentos, ve progreso.',
    activos: ['afi', 'inversiones'],
  },
  hito: {
    titulo: 'El producto correcto, en el momento exacto',
    texto:
      'La recomendación no interrumpe: llega como consecuencia de un logro. Ese es el cambio de contexto que convierte una sugerencia en algo pertinente.',
    activos: ['afi', 'tuCasa', 'excelencia', 'biz'],
  },
  completada: {
    titulo: 'Aquí está el puente',
    texto:
      'El resto del mercado termina en el balance. Popular Plan sigue: la meta completada abre las alianzas que el Grupo Popular ya tiene, con un asesor de por medio. Nada es automático ni aprobado de antemano.',
    activos: ['tuCasa', 'excelencia', 'biz'],
  },
  invertir: {
    titulo: 'La alternativa, dentro de la misma app',
    texto:
      'Para quien ya sabe qué instrumento quiere y prefiere el control. Sirve de contraste: unos quieren que el sistema les arme la ruta, otros quieren manejarlo por su cuenta.',
    activos: ['inversiones', 'afi'],
  },
  perfil: {
    titulo: 'Vinculación, no solo ahorro',
    texto:
      'Varias metas activas a la vez y las piezas del grupo ya enganchadas a ellas: YAVA como canal de entrada, Gnial para la meta de un hijo, Biz para el capital de un negocio.',
    activos: ['yava', 'gnial', 'biz', 'toke'],
  },
}

/* ------------------------------------------------------------------ */
/* Recorrido guiado                                                    */
/* ------------------------------------------------------------------ */

export type AccionPaso =
  | { tipo: 'ir'; destino: 'inicio' | 'invertir' | 'perfil' | 'nueva' }
  | { tipo: 'abrirPlan'; planId: string; ancla?: string }
  | { tipo: 'avanzarHastaHito'; planId: string }

export interface PasoRecorrido {
  titulo: string
  resumen: string
  accion: AccionPaso
}

export const RECORRIDO: PasoRecorrido[] = [
  {
    titulo: 'El cliente y sus metas',
    resumen: 'Tres planes activos en momentos distintos del camino.',
    accion: { tipo: 'ir', destino: 'inicio' },
  },
  {
    titulo: 'Definir el propósito',
    resumen: 'Qué, cuánto y para cuándo. El sistema calcula el aporte.',
    accion: { tipo: 'ir', destino: 'nueva' },
  },
  {
    titulo: 'La Ruta Inteligente',
    resumen: 'El objetivo partido en 25%, 60% y 100%.',
    accion: { tipo: 'abrirPlan', planId: 'plan-taller' },
  },
  {
    titulo: 'El dinero no se queda quieto',
    resumen: 'Lo que puso el cliente y lo que puso su dinero.',
    accion: { tipo: 'abrirPlan', planId: 'plan-taller', ancla: 'crecimiento' },
  },
  {
    titulo: 'Hito alcanzado',
    resumen: 'Se avanza el tiempo hasta cruzar el siguiente hito.',
    accion: { tipo: 'avanzarHastaHito', planId: 'plan-taller' },
  },
  {
    titulo: 'Meta completada y alianzas',
    resumen: 'El plan de educación llega al 100% y se abre el puente.',
    accion: { tipo: 'avanzarHastaHito', planId: 'plan-educacion' },
  },
  {
    titulo: 'Varias metas, un cliente vinculado',
    resumen: 'Qué piezas del grupo quedaron enganchadas.',
    accion: { tipo: 'ir', destino: 'perfil' },
  },
  {
    titulo: 'La alternativa directa',
    resumen: 'Acceso al mercado para quien prefiere el control.',
    accion: { tipo: 'ir', destino: 'invertir' },
  },
]
