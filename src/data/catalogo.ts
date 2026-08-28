/**
 * Catálogo del prototipo: propósitos de ahorro, canales de aporte, activos
 * del Grupo Popular y qué se sugiere en cada hito de la Ruta Inteligente.
 *
 * Todo el contenido de negocio vive aquí para que el equipo pueda ajustar
 * textos sin tocar pantallas. Las cifras de alianzas son las verificadas en
 * la investigación del proyecto; no se inventan rendimientos ni promesas de
 * aprobación (ver NOTAS al final).
 */

export type PropositoId = 'vivienda' | 'educacion' | 'vehiculo' | 'negocio' | 'otro'

export type ProductoId =
  | 'afi'
  | 'inversiones'
  | 'tuCasa'
  | 'excelencia'
  | 'biz'
  | 'gnial'
  | 'yava'
  | 'toke'

export type CanalId = 'cuenta' | 'nomina' | 'toke' | 'yava'

export type BeneficiarioId = 'yo' | 'pareja' | 'hijo' | 'socios'

export type IconoId =
  | 'casa'
  | 'birrete'
  | 'auto'
  | 'maletin'
  | 'estrella'
  | 'crecer'
  | 'banco'
  | 'globo'
  | 'tarjeta'
  | 'ninos'
  | 'bolsa'
  | 'edificio'

/* ------------------------------------------------------------------ */
/* Activos del Grupo Popular                                           */
/* ------------------------------------------------------------------ */

export interface Producto {
  id: ProductoId
  nombre: string
  /** Qué es dentro del grupo, en una línea */
  rol: string
  icono: IconoId
}

export const PRODUCTOS: Record<ProductoId, Producto> = {
  afi: {
    id: 'afi',
    nombre: 'AFI Popular',
    rol: 'Administradora de fondos de inversión del Grupo Popular',
    icono: 'crecer',
  },
  inversiones: {
    id: 'inversiones',
    nombre: 'Inversiones Popular',
    rol: 'Puesto de bolsa del Grupo Popular',
    icono: 'bolsa',
  },
  tuCasa: {
    id: 'tuCasa',
    nombre: 'Tu Casa Popular',
    rol: 'Programa que conecta el ahorro con proyectos de vivienda',
    icono: 'casa',
  },
  excelencia: {
    id: 'excelencia',
    nombre: 'Excelencia Popular',
    rol: 'Programa educativo con universidades aliadas',
    icono: 'birrete',
  },
  biz: {
    id: 'biz',
    nombre: 'Popular Biz',
    rol: 'Soluciones para negocios y emprendedores',
    icono: 'maletin',
  },
  gnial: {
    id: 'gnial',
    nombre: 'Gnial',
    rol: 'Ecosistema financiero infantil y juvenil',
    icono: 'ninos',
  },
  yava: {
    id: 'yava',
    nombre: 'YAVA',
    rol: 'Remesas del Grupo Popular',
    icono: 'globo',
  },
  toke: {
    id: 'toke',
    nombre: 'TOKE',
    rol: 'Pasarela de pagos del Grupo Popular',
    icono: 'tarjeta',
  },
}

/* ------------------------------------------------------------------ */
/* Hitos de la Ruta Inteligente                                        */
/* ------------------------------------------------------------------ */

export const HITOS = [25, 60, 100] as const
export type Hito = (typeof HITOS)[number]

export interface SugerenciaHito {
  /** Titular de la pantalla de hito */
  titulo: string
  /** Por qué este producto y por qué ahora */
  mensaje: string
  producto: ProductoId
  /** Texto del botón principal */
  accion: string
}

/* ------------------------------------------------------------------ */
/* Propósitos                                                          */
/* ------------------------------------------------------------------ */

export interface DestinoFinal {
  /** Título de la pantalla de meta completada */
  titulo: string
  /** Producto del grupo que abre la puerta */
  producto: ProductoId
  /** Respaldo real de la alianza (sin promesas de aprobación) */
  respaldo: string
  /** Opciones concretas que se le abren al cliente */
  opciones: { titulo: string; detalle: string }[]
}

export interface Proposito {
  id: PropositoId
  /** Nombre corto para chips y filtros */
  nombre: string
  /** Cómo lo dice el cliente ("Comprar mi vivienda") */
  titular: string
  descripcion: string
  icono: IconoId
  /** Categoría piloto del MVP */
  piloto?: boolean
  /** Valores razonables al crear la meta (RD$ y meses) */
  montoSugerido: number
  plazoSugerido: number
  /** Ejemplos de nombre de meta para el campo libre */
  ejemplos: string[]
  hitos: Record<Hito, SugerenciaHito>
  destino: DestinoFinal
}

/** Sugerencia del primer hito: es la misma para todos los propósitos porque
 *  el mecanismo (el dinero colocado a corto plazo) tampoco cambia. */
function primerHito(objeto: string): SugerenciaHito {
  return {
    titulo: 'Tu dinero ya está trabajando',
    mensaje: `Llegaste al primer cuarto de ${objeto}. Desde aquí tu saldo se coloca en un instrumento de corto plazo administrado por AFI Popular y lo que genera se deposita en tu mismo plan.`,
    producto: 'afi',
    accion: 'Ver cómo crece',
  }
}

export const PROPOSITOS: Record<PropositoId, Proposito> = {
  vivienda: {
    id: 'vivienda',
    nombre: 'Vivienda',
    titular: 'Comprar mi vivienda',
    descripcion: 'El inicial de tu apartamento o casa',
    icono: 'casa',
    piloto: true,
    montoSugerido: 1_500_000,
    plazoSugerido: 48,
    ejemplos: ['Inicial del apartamento', 'Mi primera casa', 'Casa en Santiago'],
    hitos: {
      25: primerHito('tu vivienda'),
      60: {
        titulo: 'Ya es momento de mirar proyectos',
        mensaje:
          'Pasaste el 60%. Con este avance puedes empezar a conversar tu financiamiento y a ver proyectos habitacionales aliados, sin comprometerte todavía.',
        producto: 'tuCasa',
        accion: 'Explorar proyectos',
      },
      100: {
        titulo: 'Llegaste. Vamos por la llave',
        mensaje:
          'Completaste el inicial. Tu asesor puede conectarte con los proyectos aliados y dar seguimiento al financiamiento del resto.',
        producto: 'tuCasa',
        accion: 'Ver mis opciones',
      },
    },
    destino: {
      titulo: 'Tu inicial está listo',
      producto: 'tuCasa',
      respaldo:
        'El Grupo Popular mantiene más de 1,100 alianzas activas con desarrolladores inmobiliarios.',
      opciones: [
        {
          titulo: 'Proyectos habitacionales aliados',
          detalle: 'Filtra por zona, precio y fecha de entrega dentro de la red del banco.',
        },
        {
          titulo: 'Evaluación de tu hipoteca',
          detalle: 'Un asesor revisa tu caso con el ahorro ya constituido como inicial.',
        },
        {
          titulo: 'Acompañamiento del cierre',
          detalle: 'Tasación, seguro y firma coordinados desde el mismo lugar.',
        },
      ],
    },
  },

  educacion: {
    id: 'educacion',
    nombre: 'Educación',
    titular: 'Pagar la universidad',
    descripcion: 'La carrera tuya o la de un hijo',
    icono: 'birrete',
    montoSugerido: 600_000,
    plazoSugerido: 36,
    ejemplos: ['Universidad de Camila', 'Mi maestría', 'Carrera de mi hijo'],
    hitos: {
      25: primerHito('la carrera'),
      60: {
        titulo: 'Ya alcanza para asegurar el cupo',
        mensaje:
          'Con más del 60% ahorrado puedes acercarte a las universidades aliadas del programa Excelencia Popular y ordenar el calendario de pagos por semestre.',
        producto: 'excelencia',
        accion: 'Ver universidades aliadas',
      },
      100: {
        titulo: 'La carrera está cubierta',
        mensaje:
          'Completaste la meta. Desde aquí puedes canalizar el pago hacia las universidades aliadas sin sacar el dinero del ecosistema.',
        producto: 'excelencia',
        accion: 'Ver mis opciones',
      },
    },
    destino: {
      titulo: 'La matrícula está resuelta',
      producto: 'excelencia',
      respaldo:
        'Excelencia Popular articula una red de más de 20 universidades aliadas.',
      opciones: [
        {
          titulo: 'Universidades aliadas',
          detalle: 'Conoce los convenios vigentes y qué cubre cada uno.',
        },
        {
          titulo: 'Calendario de pagos',
          detalle: 'Distribuye lo ahorrado por semestre en lugar de un solo desembolso.',
        },
        {
          titulo: 'Cuenta Gnial para el estudiante',
          detalle: 'Si la meta es para un hijo, su cuenta puede quedar enlazada al plan.',
        },
      ],
    },
  },

  vehiculo: {
    id: 'vehiculo',
    nombre: 'Vehículo',
    titular: 'Comprar mi vehículo',
    descripcion: 'El inicial o el vehículo completo',
    icono: 'auto',
    montoSugerido: 700_000,
    plazoSugerido: 30,
    ejemplos: ['Mi primer carro', 'Inicial de la camioneta'],
    hitos: {
      25: primerHito('tu vehículo'),
      60: {
        titulo: 'Buen momento para cotizar',
        mensaje:
          'Con el 60% del inicial puedes pedir una evaluación de financiamiento y comparar opciones sin perder el ritmo del plan.',
        producto: 'inversiones',
        accion: 'Ver mi avance',
      },
      100: {
        titulo: 'Tienes el monto completo',
        mensaje:
          'Meta cumplida. Tu asesor puede conectarte con concesionarios aliados y con el financiamiento del saldo si decides no pagarlo todo de contado.',
        producto: 'tuCasa',
        accion: 'Ver mis opciones',
      },
    },
    destino: {
      titulo: 'El vehículo está a un paso',
      producto: 'biz',
      respaldo:
        'La compra se coordina con la red de concesionarios y el financiamiento de vehículos del banco.',
      opciones: [
        {
          titulo: 'Concesionarios aliados',
          detalle: 'Cotiza dentro de la red comercial del grupo.',
        },
        {
          titulo: 'Financiamiento del saldo',
          detalle: 'Si prefieres no usar todo el ahorro, se evalúa el préstamo del resto.',
        },
        {
          titulo: 'Seguro del vehículo',
          detalle: 'Póliza cotizada en el mismo trámite.',
        },
      ],
    },
  },

  negocio: {
    id: 'negocio',
    nombre: 'Negocio',
    titular: 'Levantar mi negocio',
    descripcion: 'Capital de arranque o de reserva',
    icono: 'maletin',
    montoSugerido: 900_000,
    plazoSugerido: 24,
    ejemplos: ['Capital del taller', 'Reserva de la sociedad', 'Abrir el local'],
    hitos: {
      25: primerHito('tu capital'),
      60: {
        titulo: 'El capital ya toma forma',
        mensaje:
          'Con el 60% reunido conviene separar formalmente el capital del negocio de tus finanzas personales y ordenar el cobro.',
        producto: 'biz',
        accion: 'Conocer Popular Biz',
      },
      100: {
        titulo: 'El capital está completo',
        mensaje:
          'Meta cumplida. Desde aquí puedes abrir lo que el negocio necesita —cuenta, cobro, capital de trabajo— con el historial de disciplina que acabas de construir.',
        producto: 'biz',
        accion: 'Ver mis opciones',
      },
    },
    destino: {
      titulo: 'Tu capital de arranque está listo',
      producto: 'biz',
      respaldo:
        'Popular Biz reúne cuenta, cobro y financiamiento para negocios en el mismo ecosistema.',
      opciones: [
        {
          titulo: 'Cuenta y cobro del negocio',
          detalle: 'Separa el capital de tus finanzas personales y cobra con TOKE.',
        },
        {
          titulo: 'Capital de trabajo',
          detalle: 'Evaluación de línea con tu historial de ahorro como respaldo.',
        },
        {
          titulo: 'Acompañamiento del arranque',
          detalle: 'Asesoría del segmento de negocios en tu sucursal.',
        },
      ],
    },
  },

  otro: {
    id: 'otro',
    nombre: 'Otra meta',
    titular: 'Otra meta importante',
    descripcion: 'Una boda, un viaje, un fondo de respaldo',
    icono: 'estrella',
    montoSugerido: 350_000,
    plazoSugerido: 18,
    ejemplos: ['La boda', 'Fondo de respaldo', 'Viaje de graduación'],
    hitos: {
      25: primerHito('tu meta'),
      60: {
        titulo: 'Vas por encima de la mitad',
        mensaje:
          'Con este volumen puedes considerar un plazo mayor para la parte del ahorro que no vas a necesitar pronto.',
        producto: 'inversiones',
        accion: 'Ver opciones',
      },
      100: {
        titulo: 'Meta cumplida',
        mensaje:
          'Completaste lo que te propusiste. Tu asesor puede ayudarte a definir el mejor destino para ese monto.',
        producto: 'inversiones',
        accion: 'Ver mis opciones',
      },
    },
    destino: {
      titulo: 'Lo lograste',
      producto: 'inversiones',
      respaldo:
        'Tu asesor del Popular te acompaña a decidir el destino del monto reunido.',
      opciones: [
        {
          titulo: 'Retirar en tu ventana de disponibilidad',
          detalle: 'El monto queda disponible al vencer la colocación en curso.',
        },
        {
          titulo: 'Abrir una meta nueva',
          detalle: 'Reinvertir lo logrado en el siguiente objetivo.',
        },
        {
          titulo: 'Hablar con un asesor',
          detalle: 'Revisar alternativas de inversión con Inversiones Popular.',
        },
      ],
    },
  },
}

export const ORDEN_PROPOSITOS: PropositoId[] = [
  'vivienda',
  'educacion',
  'vehiculo',
  'negocio',
  'otro',
]

/* ------------------------------------------------------------------ */
/* Canales de aporte                                                   */
/* ------------------------------------------------------------------ */

export interface Canal {
  id: CanalId
  nombre: string
  detalle: string
  icono: IconoId
  producto?: ProductoId
}

/** El canal es solo la puerta de entrada del dinero. YAVA aparece aquí —y no
 *  como un segmento aparte— porque quien ahorra desde el exterior es el mismo
 *  cliente con otro canal. */
export const CANALES: Record<CanalId, Canal> = {
  cuenta: {
    id: 'cuenta',
    nombre: 'Cuenta Popular',
    detalle: 'Débito automático el día que elijas',
    icono: 'banco',
  },
  nomina: {
    id: 'nomina',
    nombre: 'Descuento de nómina',
    detalle: 'Se aparta antes de que llegue a tu cuenta',
    icono: 'tarjeta',
  },
  toke: {
    id: 'toke',
    nombre: 'TOKE',
    detalle: 'Aportes sueltos desde cualquier tarjeta',
    icono: 'tarjeta',
    producto: 'toke',
  },
  yava: {
    id: 'yava',
    nombre: 'YAVA',
    detalle: 'Aportes desde el exterior con tu remesa',
    icono: 'globo',
    producto: 'yava',
  },
}

export const ORDEN_CANALES: CanalId[] = ['cuenta', 'nomina', 'toke', 'yava']

/* ------------------------------------------------------------------ */
/* Para quién es la meta                                               */
/* ------------------------------------------------------------------ */

export interface Beneficiario {
  id: BeneficiarioId
  nombre: string
  detalle: string
  /** Producto del grupo que se enlaza naturalmente con este caso */
  producto?: ProductoId
}

export const BENEFICIARIOS: Record<BeneficiarioId, Beneficiario> = {
  yo: { id: 'yo', nombre: 'Para mí', detalle: 'Un solo titular' },
  pareja: {
    id: 'pareja',
    nombre: 'En pareja',
    detalle: 'Aportes visibles para ambos',
  },
  hijo: {
    id: 'hijo',
    nombre: 'Para un hijo',
    detalle: 'Se puede enlazar a su cuenta Gnial',
    producto: 'gnial',
  },
  socios: {
    id: 'socios',
    nombre: 'Con socios',
    detalle: 'Capital separado de tus finanzas personales',
    producto: 'biz',
  },
}

export const ORDEN_BENEFICIARIOS: BeneficiarioId[] = ['yo', 'pareja', 'hijo', 'socios']

/* ------------------------------------------------------------------ */
/* Ruta directa (alternativa considerada, sección 9 del documento)     */
/* ------------------------------------------------------------------ */

export interface InstrumentoDirecto {
  nombre: string
  emisor: string
  plazo: string
  /** Se describe el tipo de instrumento, nunca un rendimiento prometido */
  perfil: string
}

export const INSTRUMENTOS_DIRECTOS: InstrumentoDirecto[] = [
  {
    nombre: 'Fondo abierto de corto plazo',
    emisor: 'AFI Popular',
    plazo: '30 días',
    perfil: 'Conservador · liquidez alta',
  },
  {
    nombre: 'Fondo abierto de mediano plazo',
    emisor: 'AFI Popular',
    plazo: '90 días',
    perfil: 'Conservador · liquidez media',
  },
  {
    nombre: 'Renta fija corporativa',
    emisor: 'Inversiones Popular',
    plazo: '1 a 3 años',
    perfil: 'Moderado · según emisor',
  },
  {
    nombre: 'Deuda soberana en pesos',
    emisor: 'Inversiones Popular',
    plazo: '2 a 5 años',
    perfil: 'Moderado · mercado secundario',
  },
]

/* ------------------------------------------------------------------ */
/* NOTAS DE CONTENIDO                                                  */
/* ------------------------------------------------------------------ */

/**
 * Reglas que sigue todo el texto de la app y que conviene mantener al
 * editarlo:
 *
 * 1. No se promete ningún rendimiento. La simulación usa un supuesto
 *    referencial declarado (ver `SUPUESTOS` en utils/plan.ts) y la interfaz
 *    siempre lo rotula como estimado.
 * 2. Ninguna pantalla dice "aprobación instantánea" ni sugiere que la
 *    alianza se resuelve sola: siempre hay un asesor de por medio.
 * 3. La diáspora no es un segmento aparte: YAVA es un canal de aporte más.
 * 4. Nunca se compara al banco con la competencia. La oportunidad se dice en
 *    positivo: el puente que hoy no existe.
 */
