# Popular Plan — notas para agentes

Prototipo navegable para el Challenge de Estudiantes del Banco Popular. React 19 + Vite +
Tailwind v4 + Recharts, todo en cliente y sin backend.

## Antes de tocar código

- Lee `README.md`: explica las pantallas, la estructura y de dónde sale cada texto.
- El contenido de negocio vive en `src/data/catalogo.ts` (propósitos, canales, productos,
  sugerencias por hito) y `src/data/presentacion.ts` (argumento, narración, recorrido).
  Cambiar un texto de la app casi nunca implica tocar una pantalla.
- La lógica está en `src/utils/plan.ts` y tiene tests en `plan.test.ts`. Cualquier cambio
  al motor debe pasar `npm run test`.

## Reglas de contenido (no negociables)

Están escritas también al final de `src/data/catalogo.ts`:

1. No se promete ningún rendimiento. La simulación usa el supuesto referencial de
   `SUPUESTOS` y la interfaz siempre lo rotula como estimado.
2. Ninguna pantalla dice "aprobación instantánea" ni sugiere que la alianza se resuelve
   sola: siempre hay un asesor de por medio.
3. La diáspora no es un segmento aparte: YAVA es un canal de aporte más.
4. Nunca se compara al banco con la competencia; la oportunidad se dice en positivo.

## Reglas de diseño

- Los colores se consumen por token (`popular-*`, `crece-*`, `logro-*`) definidos en el
  bloque `@theme` de `src/index.css`. No escribas hex sueltos en las pantallas; la única
  excepción es `src/theme/paletaGrafico.ts`, porque Recharts pinta atributos SVG que no
  resuelven `var()`.
- Animar solo `opacity`, `transform` y `clip-path`. Nada de animar `width`/`height`.
- Todo texto de cara al usuario va en español.

## Antes de dar algo por terminado

```bash
npm run lint && npm run test && npm run build
```
