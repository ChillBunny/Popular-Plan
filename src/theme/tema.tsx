import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { flushSync } from 'react-dom'

export type Tema = 'claro' | 'oscuro'

export const CLAVE_TEMA = 'popular-plan-tema'

interface ValorTema {
  tema: Tema
  /**
   * Cambia el tema. Con las coordenadas del click (px de viewport) el cambio
   * se anima como un barrido circular desde ese punto con la View
   * Transitions API; sin soporte cae a cross-fade.
   */
  alternar: (x?: number, y?: number) => void
}

const ContextoTema = createContext<ValorTema | null>(null)

function temaGuardado(): Tema {
  try {
    return localStorage.getItem(CLAVE_TEMA) === 'oscuro' ? 'oscuro' : 'claro'
  } catch {
    return 'claro'
  }
}

/** Acceso tipado a la View Transitions API (aún no está en lib.dom). */
type DocumentoConVT = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> }
}

export function ProveedorTema({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>(temaGuardado)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', tema === 'oscuro')
    try {
      localStorage.setItem(CLAVE_TEMA, tema)
    } catch {
      // Sin almacenamiento (modo privado estricto): el tema no persiste.
    }
  }, [tema])

  const alternar = useCallback((x?: number, y?: number) => {
    const doc = document as DocumentoConVT
    const cambiar = () => setTema((t) => (t === 'oscuro' ? 'claro' : 'oscuro'))

    if (!doc.startViewTransition) {
      const html = document.documentElement
      html.classList.add('transicion-tema')
      window.setTimeout(() => html.classList.remove('transicion-tema'), 400)
      cambiar()
      return
    }

    const cx = x ?? window.innerWidth - 40
    const cy = y ?? 40
    const radio = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy),
    )

    const transicion = doc.startViewTransition(() => {
      // El snapshot "new" debe capturar el DOM ya re-renderizado.
      flushSync(cambiar)
    })
    transicion.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${cx}px ${cy}px)`,
              `circle(${radio}px at ${cx}px ${cy}px)`,
            ],
          },
          {
            duration: 520,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)',
          },
        )
      })
      // `ready` rechaza si la transición se aborta (dos cambios seguidos, o
      // la pestaña oculta). El tema ya cambió: solo se pierde el barrido.
      .catch(() => {})
  }, [])

  return <ContextoTema.Provider value={{ tema, alternar }}>{children}</ContextoTema.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- patrón estándar contexto+hook; solo afecta al HMR en desarrollo
export function useTema(): ValorTema {
  const ctx = useContext(ContextoTema)
  if (!ctx) throw new Error('useTema debe usarse dentro de <ProveedorTema>')
  return ctx
}
