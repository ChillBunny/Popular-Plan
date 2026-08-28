/**
 * Set de íconos de la app. Todos son SVG de trazo con la misma rejilla de
 * 24 y el mismo grosor: nada de iconografía que necesite explicación, que es
 * justamente lo que pide el tono de marca.
 */

export type NombreIcono =
  // Propósitos y activos del grupo
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
  // Interfaz
  | 'mas'
  | 'atras'
  | 'adelante'
  | 'cheque'
  | 'reloj'
  | 'calendario'
  | 'cerrar'
  | 'info'
  | 'usuario'
  | 'escudo'
  | 'rayo'
  | 'sol'
  | 'luna'
  | 'reiniciar'
  | 'bandera'
  | 'candado'
  | 'chevron'

const TRAZOS: Record<NombreIcono, React.ReactNode> = {
  casa: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V21h13V9.5" />
      <path d="M9.75 21v-6h4.5v6" />
    </>
  ),
  birrete: (
    <>
      <path d="M12 4 2.5 8.5 12 13l9.5-4.5L12 4Z" />
      <path d="M6.5 10.8V16c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-5.2" />
      <path d="M21.5 8.5v5" />
    </>
  ),
  auto: (
    <>
      <path d="M4 16.5v2.25h3V16.5" />
      <path d="M17 16.5v2.25h3V16.5" />
      <path d="M3 16.5v-4l2-5h14l2 5v4H3Z" />
      <path d="M5.5 12.5h13" />
      <path d="M6.5 14.6h.01M17.5 14.6h.01" />
    </>
  ),
  maletin: (
    <>
      <rect x="2.75" y="7.5" width="18.5" height="12.75" rx="2.25" />
      <path d="M8.5 7.5V5.75A1.75 1.75 0 0 1 10.25 4h3.5a1.75 1.75 0 0 1 1.75 1.75V7.5" />
      <path d="M2.75 12.5h18.5" />
    </>
  ),
  estrella: (
    <path d="m12 3.75 2.6 5.27 5.82.85-4.21 4.1.99 5.79L12 17.03l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L12 3.75Z" />
  ),
  crecer: (
    <>
      <path d="M3 17.5 9 11l4 4 8-8.5" />
      <path d="M15.5 6.5H21v5.5" />
    </>
  ),
  banco: (
    <>
      <path d="M3 9.75 12 4l9 5.75" />
      <path d="M5.5 10v8M10 10v8M14 10v8M18.5 10v8" />
      <path d="M3 20.5h18" />
    </>
  ),
  globo: (
    <>
      <circle cx="12" cy="12" r="8.75" />
      <path d="M3.5 12h17" />
      <path d="M12 3.25c2.2 2.4 3.4 5.5 3.4 8.75s-1.2 6.35-3.4 8.75c-2.2-2.4-3.4-5.5-3.4-8.75S9.8 5.65 12 3.25Z" />
    </>
  ),
  tarjeta: (
    <>
      <rect x="2.75" y="5.5" width="18.5" height="13" rx="2.5" />
      <path d="M2.75 10h18.5" />
      <path d="M6.5 14.5h3.5" />
    </>
  ),
  ninos: (
    <>
      <circle cx="9" cy="8" r="3.25" />
      <path d="M3.5 19.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
      <circle cx="17.5" cy="10.5" r="2.25" />
      <path d="M15 19.5c0-2.2 1.2-3.75 3-3.75s3 1.55 3 3.75" />
    </>
  ),
  bolsa: (
    <>
      <path d="M4 20V9.5M9.5 20V5M15 20v-7.5M20.5 20V8" />
      <path d="M2.5 20h19" />
    </>
  ),
  edificio: (
    <>
      <rect x="4" y="3.5" width="12.5" height="17" rx="1.5" />
      <path d="M16.5 9.5H20v11" />
      <path d="M7.5 7.5h1.5M11.5 7.5H13M7.5 11.5h1.5M11.5 11.5H13M7.5 15.5h1.5M11.5 15.5H13" />
      <path d="M2.5 20.5h19" />
    </>
  ),
  mas: <path d="M12 5.5v13M5.5 12h13" />,
  atras: (
    <>
      <path d="M19 12H5.5" />
      <path d="m11 5.5-5.5 6.5 5.5 6.5" />
    </>
  ),
  adelante: (
    <>
      <path d="M5 12h13.5" />
      <path d="m13 5.5 5.5 6.5-5.5 6.5" />
    </>
  ),
  cheque: <path d="m5 12.5 4.5 4.5L19 7" />,
  reloj: (
    <>
      <circle cx="12" cy="12" r="8.75" />
      <path d="M12 7v5.25l3.25 2" />
    </>
  ),
  calendario: (
    <>
      <rect x="3.25" y="5" width="17.5" height="15.5" rx="2.25" />
      <path d="M3.25 10h17.5" />
      <path d="M8 3.25V6.5M16 3.25V6.5" />
    </>
  ),
  cerrar: <path d="m6 6 12 12M18 6 6 18" />,
  info: (
    <>
      <circle cx="12" cy="12" r="8.75" />
      <path d="M12 11v5.25" />
      <path d="M12 7.75h.01" />
    </>
  ),
  usuario: (
    <>
      <circle cx="12" cy="8.25" r="3.75" />
      <path d="M4.5 20c0-3.6 3.4-6 7.5-6s7.5 2.4 7.5 6" />
    </>
  ),
  escudo: (
    <>
      <path d="M12 3.25 5 6v6c0 4 2.9 7.15 7 8.75 4.1-1.6 7-4.75 7-8.75V6l-7-2.75Z" />
      <path d="m9.25 12 2 2 3.5-3.75" />
    </>
  ),
  rayo: <path d="M13.5 3 5.5 13.5h5L10 21l8.5-10.5h-5L13.5 3Z" />,
  sol: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </>
  ),
  luna: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />,
  reiniciar: (
    <>
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <path d="M21 3v6h-6" />
    </>
  ),
  bandera: (
    <>
      <path d="M5.5 21V4" />
      <path d="M5.5 5h11l-2 3.5 2 3.5h-11" />
    </>
  ),
  candado: (
    <>
      <rect x="4.75" y="10.5" width="14.5" height="9.75" rx="2.25" />
      <path d="M8 10.5V7.75a4 4 0 0 1 8 0v2.75" />
    </>
  ),
  chevron: <path d="m9 5.5 6.5 6.5L9 18.5" />,
}

export interface IconoProps {
  nombre: NombreIcono
  /** Tamaño en px (cuadrado) */
  tam?: number
  className?: string
  /** Grosor del trazo; los íconos grandes se ven mejor más finos */
  grosor?: number
  /** Rellena en vez de trazar (estrella, rayo) */
  relleno?: boolean
}

function Icono({ nombre, tam = 20, className = '', grosor = 1.7, relleno }: IconoProps) {
  return (
    <svg
      width={tam}
      height={tam}
      viewBox="0 0 24 24"
      fill={relleno ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={relleno ? 0 : grosor}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      {TRAZOS[nombre]}
    </svg>
  )
}

export default Icono
