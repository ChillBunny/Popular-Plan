import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface EstadoBarrera {
  error: Error | null
}

/**
 * Barrera de errores global: en una app 100% cliente un error de render no
 * puede dejar la pantalla en blanco frente a un jurado. Muestra un panel
 * legible con el detalle técnico plegado y la opción de recargar.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, EstadoBarrera> {
  state: EstadoBarrera = { error: null }

  static getDerivedStateFromError(error: Error): EstadoBarrera {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Popular Plan — error de render no controlado:', error, info)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Algo salió mal
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">
            Ocurrió un error inesperado al dibujar la aplicación. Recarga la página para
            continuar; la demostración vuelve a su estado inicial.
          </p>
          <details className="mt-3 rounded-lg bg-slate-50 p-2.5 text-left text-[11.5px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <summary className="cursor-pointer font-semibold">Detalle técnico</summary>
            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words">
              {this.state.error.message}
            </pre>
          </details>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 w-full rounded-xl bg-popular-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-popular-700"
          >
            Recargar la aplicación
          </button>
        </div>
      </div>
    )
  }
}
