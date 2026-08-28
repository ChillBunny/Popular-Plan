# Popular Plan

Prototipo interactivo de **Popular Plan**, propuesta para el Challenge de Estudiantes del
Banco Popular (República Dominicana).

> Ahorro por metas dentro del ecosistema del Grupo Popular, donde el dinero del cliente no
> solo crece: llega conectado al destino real que motivó el ahorro.

**No perdemos por falta de producto: perdemos por falta de puente.**

---

## Qué es esto

Una app navegable de verdad, no un mockup estático. El jurado puede crear una meta, ver la
Ruta Inteligente avanzar, cruzar un hito, completar un plan y llegar a la pantalla de
alianzas — todo con un motor de simulación real detrás.

En escritorio la app se muestra dentro de un teléfono, rodeada de un marco de presentación
con el argumento del proyecto y un **recorrido guiado de 8 pasos** que conduce la demo. En
móvil el marco desaparece y la app ocupa la pantalla completa.

### Las pantallas

| Pantalla | Qué demuestra |
| --- | --- |
| Mis metas | Varias metas activas, cada una con su avance y lo que generó el propio dinero |
| Nueva meta | Propósito → monto y fecha → ritmo. El sistema calcula el aporte necesario |
| Detalle del plan | Ruta Inteligente (25/60/100), gráfico de aportes vs. rendimiento, aportes y canal |
| Hito alcanzado | Celebración + el producto del grupo que corresponde a ese momento |
| Meta completada | El puente: las alianzas del Grupo Popular para resolver la compra |
| Invertir | La alternativa directa vía Inversiones Popular, para quien prefiere el control |
| Perfil | Metas simultáneas y qué piezas del ecosistema quedaron enganchadas |

---

## Correr el proyecto

```bash
npm install
```

```bash
npm run dev
```

Otros comandos:

```bash
npm run build
```

```bash
npm run test
```

```bash
npm run lint
```

---

## Publicar en Vercel

El repositorio ya trae `vercel.json` con la configuración (framework Vite, salida `dist`).

**Opción A — desde la web (recomendada):**

1. Sube el repositorio a GitHub (ver abajo).
2. En [vercel.com/new](https://vercel.com/new), importa el repositorio.
3. Vercel detecta Vite automáticamente. No hay variables de entorno que configurar.
4. Deploy.

**Opción B — desde la terminal:**

```bash
npx vercel --prod
```

## Subir a GitHub

El proyecto no tiene remoto configurado. Después de crear el repositorio vacío en GitHub:

```bash
git remote add origin https://github.com/USUARIO/popular-plan.git
```

```bash
git push -u origin master
```

---

## Estructura

```
src/
  data/
    catalogo.ts       Propósitos, canales, activos del grupo y sugerencias por hito
    demo.ts           Cliente y planes con los que arranca la demostración
    presentacion.ts   Argumento del proyecto, narración por pantalla y recorrido guiado
  utils/
    plan.ts           Motor: aportes, rendimiento, hitos y proyección (con tests)
    formato.ts        Formateo de pesos, porcentajes y plazos en es-DO
  pantallas/          Una pantalla de la app por archivo
  components/
    ui/               Primitivas: botón, tarjeta, anillo, ruta, hoja, confeti…
    layout/           Marco del teléfono, barra superior y de pestañas
    presentacion/     El marco de escritorio y el texto del proyecto
  theme/              Tema claro/oscuro y paleta del gráfico
```

Todo el contenido de negocio (textos de propósitos, alianzas, productos) vive en
`src/data/catalogo.ts` y `src/data/presentacion.ts`: se puede ajustar el discurso sin tocar
las pantallas.

---

## Marca

La paleta y la tipografía son una **aproximación** a la identidad del Grupo Popular y están
centralizadas como tokens en `src/index.css` (bloque `@theme`). Al recibir la guía de marca
oficial se sustituyen ahí y toda la app se actualiza: las pantallas consumen los tokens
(`bg-popular-600`, `text-crece-500`, …), nunca colores sueltos.

- Azul institucional: escala `popular-50` … `popular-950`
- Verde de crecimiento (lo que genera el dinero): `crece-*`
- Ámbar de logro (hitos y celebración): `logro-*`
- Tipografía: Plus Jakarta Sans (titulares y cifras) + Inter (cuerpo)

---

## Sobre los datos

Cliente, metas y montos son **ficticios**. La simulación proyecta con un rendimiento
**referencial** declarado en `SUPUESTOS` (`src/utils/plan.ts`) y una colocación a 30 días;
no es una tasa ofrecida, vigente ni garantizada, y la interfaz lo rotula así en cada
pantalla donde aparece una cifra de rendimiento.

Las cifras de alianzas citadas (más de 1,100 desarrolladores inmobiliarios, más de 20
universidades del programa Excelencia Popular) provienen de la investigación del proyecto.
Ninguna pantalla promete aprobación automática: todas las opciones del final terminan en
una conversación con un asesor.

---

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · Recharts · Vitest
