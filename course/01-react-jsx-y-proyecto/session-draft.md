# Sesión 01 · React, Vite y JSX

> Estado: paquete textual y presentación aprobados. El proyecto progresivo de sesión 01 está materializado en `../MediaLog-Bootcamp` respecto a la raíz del repositorio curricular. La guía docente conserva la ruta por bloques y la evidencia de implementación se registra en la memoria de esta iteración.

- **Fecha:** lunes 21 de septiembre de 2026
- **Semana:** 1
- **Modalidad:** virtual
- **Duración:** 90 minutos
- **Lectura previa:** [pre-class-reading.md](pre-class-reading.md)
- **Guía docente:** [teacher-guide.md](teacher-guide.md)
- **Guía estudiantil:** [student-guide.md](student-guide.md)

## Punto de entrada

Cada estudiante comienza en una carpeta de trabajo sin proyecto React. La preparación de cohorte ya resolvió la instalación del editor, React DevTools, Node.js y pnpm. La apertura comprueba:

```bash
node --version
pnpm --version
```

El curso exige Node.js `>=22.22.0` y pnpm `11.17.0`. Este mínimo de Node cubre el stack que aparecerá después; la sesión no instala ni explica esas dependencias futuras.

## Checkpoint de salida

Al terminar:

- Vite creó `MediaLog-Bootcamp` con el template React y TypeScript.
- `package.json` fija `packageManager` como `pnpm@11.17.0`.
- React y React DOM usan la versión exacta `19.2.8`.
- Existe `pnpm-lock.yaml` y no existe un lockfile de otro gestor.
- `App` compone `AppHeader` y una `MediaCard` con datos fijos.
- React DevTools muestra `App`, `AppHeader` y `MediaCard`.
- `pnpm build` termina con código 0.
- El estudiante explica `index.html → main.tsx → App.tsx` y distingue la declaración de un componente de su uso como elemento JSX.

El build comprueba TypeScript y la producción de archivos estáticos. No demuestra por sí solo que la composición se vea correctamente en el navegador; esa evidencia requiere `pnpm dev`, React DevTools y una comprobación visual.

## Resultado de aprendizaje

El estudiante podrá crear y ejecutar un proyecto React con Vite y pnpm, seguir su punto de entrada hasta `App` y extraer dos componentes estáticos con responsabilidades reconocibles, sin introducir props, estado o navegación.

## Concepto principal

Una interfaz React se construye al declarar componentes y componerlos dentro de otros componentes. La sesión usa un solo árbol pequeño para practicar esa idea:

```text
App
├── AppHeader
└── main
    └── MediaCard
```

La creación del proyecto, JSX, imports y exports sostienen esa transformación. No compiten como dificultades independientes.

## Vocabulario

- **React:** biblioteca de JavaScript para describir interfaces mediante componentes.
- **Componente:** función con nombre en `PascalCase` que devuelve una descripción de interfaz.
- **Elemento JSX:** descripción escrita con una etiqueta como `<MediaCard />`.
- **JSX:** extensión de sintaxis que permite escribir marcado dentro de JavaScript o TypeScript.
- **Composición:** construcción de una interfaz al anidar componentes.
- **Responsabilidad:** parte de la interfaz que un componente representa y permite reconocer.
- **Árbol de componentes:** relación entre componentes padres e hijos.
- **Render:** ejecución en la que React calcula la interfaz descrita por los componentes.
- **Gestor de paquetes:** herramienta que instala dependencias y ejecuta scripts.
- **Lockfile:** archivo que registra las versiones resueltas durante la instalación.
- **Servidor de desarrollo:** proceso local que sirve la aplicación mientras se trabaja.
- **`StrictMode`:** componente que activa comprobaciones adicionales durante desarrollo sin agregar contenido visible.

## Herramientas y responsabilidades

| Herramienta | Responsabilidad en esta sesión |
| --- | --- |
| React | Describe la interfaz y compone componentes. |
| Vite | Crea la estructura, inicia el servidor de desarrollo y ejecuta el build. |
| pnpm | Resuelve dependencias y ejecuta scripts del proyecto. |
| TypeScript | Comprueba tipos durante el desarrollo y el build. |

La sesión no presenta estas herramientas como partes intercambiables. Tampoco explica configuración avanzada de Vite, oxlint o el funcionamiento interno del compilador.

## Estado inicial, transformación y estado final

### Estado inicial · Template de Vite

El grupo crea el proyecto con una versión reproducible del generador:

```bash
pnpm create vite@9.2.0 MediaLog-Bootcamp --template react-ts --no-interactive
cd MediaLog-Bootcamp
pnpm pkg set name=medialog-bootcamp packageManager=pnpm@11.17.0
pnpm pkg set devDependencies.typescript=6.0.3 devDependencies.vite=8.2.2
pnpm pkg set 'engines.node=>=22.22.0'
pnpm pkg set dependencies.react=19.2.8 'dependencies["react-dom"]'=19.2.8
pnpm install
pnpm dev
```

El docente recorre el template antes de cambiarlo. La cadena mínima es:

```text
index.html
└── src/main.tsx
    └── src/App.tsx
```

El template vigente contiene un contador con `useState`. El docente lo identifica como contenido demostrativo generado y lo retira sin explicar el hook. Los eventos y el estado local pertenecen a la sesión 04.

### Transformación guiada · De un bloque a responsabilidades

Primero, el docente reemplaza la demostración por una pantalla estática dentro de `App`:

```text
App
├── header con identidad de la aplicación
└── main
    ├── título de sección
    └── article con una película fija
```

Después realiza una extracción completa del encabezado hacia `AppHeader`. El grupo decide qué líneas forman la tarjeta y extrae `MediaCard` mediante práctica guiada.

Cada extracción responde estas preguntas:

1. ¿Qué parte visible representa?
2. ¿Qué nombre comunica esa responsabilidad?
3. ¿Qué JSX se mueve?
4. ¿Qué export necesita el archivo nuevo?
5. ¿Qué import y qué elemento reemplazan el bloque original?

### Estado final · Primer árbol de componentes

```text
src/
├── components/
│   ├── app-header.tsx
│   └── media-card.tsx
├── App.tsx
├── index.css
└── main.tsx
```

`App` conserva el contenedor principal y compone las dos responsabilidades:

```tsx
import { AppHeader } from './components/app-header'
import { MediaCard } from './components/media-card'

function App() {
  return (
    <>
      <AppHeader />

      <main className="page-container">
        <h2>Catálogo destacado</h2>
        <MediaCard />
      </main>
    </>
  )
}

export default App
```

`MediaCard` conserva título, descripción, tipo y año dentro de su archivo. Esa limitación abre la sesión 02.

## Secuencia completa

| Tiempo | Responsable | Actividad | Comprobación |
| --- | --- | --- | --- |
| 0–8 min | Docente y estudiantes | Presentar Medialog reducido, revisar las preguntas con más errores y comprobar Node/pnpm. | Cada terminal muestra versiones compatibles. |
| 8–20 min | Docente | Presentar React, componentes, composición, JSX y responsabilidades de las herramientas. | El grupo distingue componente, elemento JSX y etiqueta HTML. |
| 20–35 min | Docente y estudiantes | Crear el proyecto, fijar pnpm y React, instalar dependencias e iniciar Vite. | El navegador muestra el template y existe `pnpm-lock.yaml`. |
| 35–45 min | Docente | Recorrer `package.json`, `index.html`, `main.tsx` y `App.tsx`; identificar `createRoot` y `StrictMode`. | Un estudiante reconstruye la cadena de entrada. |
| 45–57 min | Docente | Retirar la demostración generada y escribir la pantalla estática dentro de `App`. | Encabezado y tarjeta aparecen sin imports o estado sin uso. |
| 57–67 min | Docente | Extraer `AppHeader` y explicar declaración, export, import y uso. | React DevTools muestra `AppHeader`. |
| 67–78 min | Grupo | Proponer y ejecutar la extracción de `MediaCard`. | `App` renderiza `<MediaCard />` dentro de `main`. |
| 78–85 min | Estudiantes | Cambiar contenido, provocar y corregir un error JSX, inspeccionar el árbol. | Cada estudiante corrige el error y dibuja el árbol final. |
| 85–90 min | Docente y estudiantes | Ejecutar el checkpoint, responder preguntas de cierre y nombrar la limitación de los datos fijos. | `pnpm build` termina con código 0 y el navegador conserva el resultado. |
| **Total** |  |  | **90 minutos** |

## Actividades del docente

- Revisar los resultados del cuestionario antes de la clase y elegir una pregunta para recuperar.
- Mostrar el producto final solo como contexto, sin adelantar librerías o flujos posteriores.
- Explicar la responsabilidad de React, Vite, pnpm y TypeScript con un diagrama breve.
- Ejecutar el scaffold con las versiones aprobadas.
- Recorrer el template antes de retirar su contenido.
- Eliminar el contador generado sin enseñar `useState`.
- Construir el primer bloque estático dentro de `App`.
- Extraer `AppHeader` como demostración completa.
- Guiar la extracción de `MediaCard` sin repetirla como ejercicio individual.
- Provocar una etiqueta sin cerrar y pedir al grupo que lea el mensaje.
- Comprobar el árbol mediante React DevTools y la cadena de archivos mediante el editor.
- Separar la evidencia del build de la evidencia del navegador.

## Actividades de los estudiantes

- Responder el cuestionario previo en la plataforma institucional.
- Ejecutar el scaffold y comprobar las versiones fijadas.
- Localizar los scripts, dependencias y lockfile.
- Seguir `index.html → main.tsx → App.tsx`.
- Proponer el nombre y la frontera de `MediaCard` antes de extraerla.
- Completar imports y elementos JSX durante la construcción guiada.
- Modificar el contenido fijo sin duplicar la tarjeta.
- Provocar y corregir un error de JSX.
- Dibujar el árbol final y explicar una relación padre-hijo.
- Ejecutar `pnpm build` y comprobar el resultado en el navegador con `pnpm dev`.

## Guion de presentación

Uso operativo del HTML aprobado: slides 1–2 en apertura y 3–9 en el bloque conceptual, sin abrir el editor entre ellas. Después se permanece en el entorno de desarrollo. Las preguntas de la slide 10 se formulan oralmente al cerrar, sin regresar al deck. La [guía docente](teacher-guide.md) relaciona cada momento con `S01-B01` a `S01-B09` y con las ramas reales. La tabla siguiente conserva el guion fuente, no la numeración final del HTML.

### Apertura conceptual · 12 minutos

| Orden | Título provisional | Contenido que debe conservarse | Recurso y nota docente |
| ---: | --- | --- | --- |
| 1 | Medialog empieza con una tarjeta | Presentar búsqueda y biblioteca como dirección del módulo. Hoy se construye una pantalla estática reconocible. | Mockup del producto y recorte del checkpoint de hoy. No enumerar el stack futuro. |
| 2 | Cuatro herramientas, cuatro tareas | React describe UI; Vite crea y sirve; pnpm administra paquetes y scripts; TypeScript comprueba tipos. | Diagrama de cuatro columnas. Preguntar qué herramienta usarían para iniciar el servidor. |
| 3 | Un componente representa una pieza | Un componente es una función con una responsabilidad de interfaz. Puede usarse una vez si mejora la organización. | Marcar `AppHeader`, `main` y `MediaCard` sobre el mockup. |
| 4 | Responsabilidad no significa fragmentar todo | Extraer una región con significado. Mantener etiquetas pequeñas donde ayudan a leer al padre. | Comparar `MediaCard` con un `SectionTitle` innecesario. |
| 5 | Declarar y usar no son la misma acción | `function MediaCard()` declara el componente; `<MediaCard />` crea un elemento JSX. Las etiquetas HTML permanecen en minúscula. | Snippet corto con ambas formas resaltadas. |
| 6 | JSX tiene reglas concretas | Un contenedor raíz, etiquetas cerradas y `className`. JSX se parece a HTML, pero pertenece al código JavaScript o TypeScript. | Mostrar un error pequeño y pedir la corrección. |
| 7 | Del HTML raíz al árbol de React | `index.html` aporta `#root`; `main.tsx` llama `createRoot`; `App` compone la pantalla. `StrictMode` envuelve el árbol para comprobaciones de desarrollo. | Diagrama `index.html → main.tsx → App`. No explicar Effects ni refs. |
| 8 | Transformación que haremos | Escribir todo en `App`, extraer `AppHeader` y extraer `MediaCard`. | Árbol antes/después sin mostrar los imports completos. |

### Puente hacia el editor

El docente termina la apertura con esta pregunta:

> Si React describe la pantalla mediante componentes, ¿qué archivo del template contiene hoy la pantalla que vamos a reemplazar?

La respuesta esperada es `src/App.tsx`. El grupo abre ese archivo después de reconocer su lugar en la cadena de entrada.

### Cierre conceptual · 5 minutos

El deck recupera el árbol construido y plantea:

Estas cinco preguntas conservan la intención del guion. En el cierre oral se usan las cuatro preguntas conservadas en la slide 10; la cadena `#root → main.tsx → App` se comprueba durante el recorrido del editor, sin añadir otra ronda al cierre.

1. ¿Qué responsabilidad conserva `App`?
2. ¿Qué diferencia existe entre `function AppHeader()` y `<AppHeader />`?
3. ¿Por qué no convertimos el título de sección en otro componente?
4. ¿Qué archivo conecta `App` con el elemento `#root`?
5. ¿Qué limitación tiene una `MediaCard` con datos fijos?

La quinta respuesta abre la sesión 02: el componente necesitará recibir datos distintos sin duplicar su estructura.

## Evidencia y entrega

Durante la clase, el docente comprueba:

- versiones de Node y pnpm;
- árbol visible en React DevTools;
- resultado visual en `pnpm dev`;
- explicación oral de la cadena de entrada;
- código de salida 0 de `pnpm build`.

El estudiante entrega en la plataforma institucional un ZIP de `MediaLog-Bootcamp` sin `node_modules/` ni `dist/`. El ZIP incluye `package.json`, `pnpm-lock.yaml`, `src/` y los archivos de configuración generados por Vite. También entrega un texto de tres líneas con el árbol de componentes y la cadena de entrada.

## Plan de contingencia

- **Node o pnpm no cumple la versión:** el estudiante no continúa instalando con una versión incompatible. Observa la explicación, registra el error exacto y completa la preparación del entorno después de la clase.
- **El registro o la red impide instalar:** el docente comparte un ZIP privado creado antes de la clase con el scaffold exacto y su lockfile. El estudiante continúa la transformación y repite el scaffold cuando recupere conectividad.
- **React DevTools no está disponible:** el estudiante demuestra el árbol desde `App.tsx` y comprueba el DOM en el navegador. La guía registra que esa evidencia no prueba la inspección de componentes.
- **El grupo pierde tiempo limpiando el template:** el docente entrega el checkpoint inmediatamente posterior a la limpieza, todavía con toda la pantalla en `App`. No entrega los componentes ya extraídos.
- **`pnpm build` falla:** el docente lee el primer error con el grupo y corrige solo el archivo que lo origina. No elimina comprobaciones del script.

## Fuera de alcance

- Props y `children`.
- Tipos del dominio, fixtures, listas, `map` y `key`.
- Eventos, interactividad y `useState`.
- Mantine y estilos como sistema de componentes.
- Requests HTTP y backend.
- TanStack Query y estado remoto.
- React Router y navegación.
- Firebase Authentication.
- Zustand, agentes y tests.
- Configuración avanzada de Vite, TypeScript u oxlint.

## Decisiones y simplificaciones pedagógicas

- La lectura previa presenta vocabulario básico para reservar la clase al scaffold y la transformación del árbol.
- La clase conserva una tarjeta fija porque la sesión 02 necesita un problema visible para introducir props.
- `AppHeader` sirve como demostración; `MediaCard` sirve como práctica guiada. El estudiante no repite la misma extracción como actividad individual.
- `App` conserva `main` y el título de sección. No se crean `PageContainer`, `SectionTitle` ni componentes sin necesidad observable.
- `App` mantiene el export default generado por Vite. Los componentes nuevos usan exports nombrados como decisión local de esta sesión; el curso todavía no fija una regla global.
- Los estilos se copian como soporte visual y no consumen un bloque conceptual.
- El docente identifica el contador generado y lo retira. No explica `useState` antes de la sesión 04.
- La explicación de `StrictMode` se limita a su propósito de desarrollo y a que no produce interfaz.
- `pnpm build` y la comprobación visual aportan evidencias distintas.

## Fuentes verificadas el 29 de agosto de 2026

- React, [Your First Component](https://react.dev/learn/your-first-component).
- React, [Writing Markup with JSX](https://react.dev/learn/writing-markup-with-jsx).
- React, [`StrictMode`](https://react.dev/reference/react/StrictMode).
- Vite, [Getting Started](https://vite.dev/guide/).
- pnpm, [`pnpm create`](https://pnpm.io/cli/create).
- pnpm, [Installation](https://pnpm.io/installation).
- pnpm, [`package.json`](https://pnpm.io/package_json).

En la verificación histórica del 29 de agosto, Context7 MCP y el índice Mintlify no estuvieron disponibles; se usaron documentación oficial, manifests y un scaffold temporal. La producción del 9 de septiembre materializa el repositorio progresivo y consulta Context7. La [memoria de implementación](../../memories/progressive-project-session-01.md) registra las comprobaciones ejecutadas y sus límites.
