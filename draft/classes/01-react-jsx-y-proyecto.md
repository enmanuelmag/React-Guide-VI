# Clase 01 · React, JSX y estructura del proyecto

- **Semana:** 1
- **Modalidad:** virtual
- **Duración:** 120 minutos
- **Punto de entrada:** carpeta de trabajo sin proyecto React
- **Checkpoint de salida:** aplicación creada con pnpm; `App` compone un encabezado y una tarjeta estática

## Resultado de aprendizaje

Al terminar, el estudiante podrá crear y ejecutar un proyecto React con Vite y pnpm, seguir el punto de entrada hasta `App` y extraer dos componentes estáticos sin introducir props, estado o navegación.

## Requisitos previos

- Node.js 22.22 o una versión superior compatible con las herramientas fijadas para la cohorte.
- pnpm instalado en la versión definida por el docente.
- Visual Studio Code o un editor equivalente.
- React DevTools recomendado.
- Una terminal abierta en la carpeta donde se creará el proyecto.

El docente comprobará estos requisitos antes de empezar a escribir componentes. La instalación de Node.js y del editor pertenece a la preparación de la cohorte; la clase sí verifica sus versiones.

La base técnica se verificó el 26 de agosto de 2026 contra las dependencias que aparecerán después: React Router `8.3.0` exige Node.js `>=22.22.0` y React/React DOM `>=19.2.7`. El template oficial `react-ts` de Vite usaba React `19.2.8` en esa fecha. La cohorte fija React y React DOM `19.2.8`; antes de iniciar, el docente volverá a comprobar compatibilidad y actualizará la matriz solo de forma coordinada.

## Creación del proyecto

```bash
node --version
pnpm --version

pnpm create vite medialog-app --template react-ts
cd medialog-app
pnpm install
pnpm add react@19.2.8 react-dom@19.2.8
pnpm dev
```

El docente explica el papel de cada herramienta:

- React describe y actualiza la interfaz.
- Vite crea la estructura, inicia el servidor de desarrollo y prepara el build.
- pnpm instala dependencias y ejecuta scripts.
- TypeScript comprueba los tipos durante el desarrollo.

La clase identifica `package.json`, los scripts `dev` y `build`, y el archivo `pnpm-lock.yaml`. El curso conserva ese lockfile y no mezcla gestores de paquetes.

Después de crear el proyecto, el docente confirma en `package.json` que `react` y `react-dom` quedaron en `19.2.8`. Esta comprobación evita descubrir una incompatibilidad recién cuando se instalen Mantine y React Router.

## Conceptos

- React como biblioteca para construir interfaces mediante componentes.
- Relación y límites entre React, Vite, pnpm y TypeScript.
- Aplicación React y árbol de componentes.
- Descomposición visual, composición, responsabilidad y reutilización.
- `package.json`, scripts y lockfile.
- JSX como sintaxis para describir interfaz.
- Componentes función.
- Importaciones y exportaciones.
- Diferencia entre componente y elemento JSX.
- Renderizado mediante `createRoot`.
- Propósito introductorio de `StrictMode` en el template de Vite.

## Guion de presentación

### Propósito y duración

La apertura conceptual ocupa 20 minutos. Presenta un modelo de React suficiente para comprender la práctica sin introducir props, estado o reconciliación. La clase vuelve al deck durante los últimos 7 minutos para cerrar el checkpoint.

### Apertura conceptual

| Momento | Título provisional | Contenido que debe conservarse | Recurso o nota docente |
| --- | --- | --- | --- |
| Apertura | La aplicación que construiremos | Presentar la versión reducida de Medialog: una interfaz que crecerá desde una tarjeta estática hasta búsqueda y biblioteca personal. Mostrar el resultado del módulo solo como contexto. | Mockup sencillo. Preguntar qué partes visibles reconocen, sin pedir todavía nombres de componentes. |
| Contexto | ¿Qué es React? | Definir React como una biblioteca de JavaScript para construir interfaces web y nativas a partir de componentes. Aclarar que React no es un lenguaje y que no incluye por sí solo routing, autenticación, fetching o estilos. | Usar la definición corta y una pantalla dividida en piezas. No enumerar todavía las librerías que resolverán cada necesidad. |
| Distinción | React, Vite, pnpm y TypeScript | React describe y actualiza la interfaz; Vite crea y sirve el proyecto; pnpm administra dependencias y scripts; TypeScript comprueba tipos durante el desarrollo. Evitar presentar las cuatro herramientas como partes intercambiables. | Diagrama de cuatro responsabilidades. Recuperarlo cuando aparezcan `package.json` y `main.tsx`. |
| Concepto | Una interfaz formada por componentes | Explicar que un componente es una pieza de interfaz con una responsabilidad reconocible. Puede ser pequeño, como un botón, o abarcar una página. React permite anidar componentes para construir una pantalla completa. | Marcar sobre el mockup las regiones `AppHeader`, contenido principal y `MediaCard`. |
| Contraste | Responsabilidad no significa dividir cada etiqueta | `AppHeader` identifica la aplicación, `MediaCard` representa un medio y `App` compone la pantalla. No todo `<div>`, `<header>` o `<h2>` necesita archivo propio. Se extrae cuando la pieza tiene significado, reutilización real o mejora la lectura del padre. | Mostrar una división útil y una fragmentación excesiva. Recordar por qué no se crea `SectionTitle`. |
| Concepto | Composición, reutilización y árbol | Mostrar la relación padre-hijo `App → AppHeader / main → MediaCard`. Explicar que la composición permite combinar piezas y que la reutilización será visible cuando una tarjeta reciba datos diferentes en la clase 02. Distinguir el árbol de componentes del DOM: ambos representan relaciones, pero no contienen necesariamente los mismos nodos. | Diagrama de árbol. No introducir props; nombrarlas solo como el mecanismo que se estudiará después. |
| Código | Componente función y elemento JSX | Contrastar la declaración `function AppHeader()` con el uso `<AppHeader />`. La función define el componente; la etiqueta JSX crea un elemento que React puede renderizar. El nombre empieza en mayúscula para que React lo distinga de una etiqueta del navegador. | Snippet de 6 a 8 líneas. Preguntar cuál parte declara y cuál usa el componente. |
| Concepto | JSX se parece a HTML, pero no es HTML | JSX permite escribir marcado dentro de JavaScript o TypeScript. En esta clase se practican un único contenedor raíz, etiquetas cerradas y `className`. Los errores del compilador forman parte de la demostración posterior. | Comparación breve entre un fragmento inválido y uno corregido. No explicar expresiones complejas entre llaves. |
| Flujo | De los archivos al navegador | Seguir `index.html → main.tsx → createRoot → App → componentes`. `StrictMode` envuelve la aplicación en el template y activa comprobaciones adicionales solo durante desarrollo; no produce una sección visible ni añade esas comprobaciones al comportamiento de producción. React calcula la interfaz descrita por los componentes y actualiza el DOM del navegador. | Diagrama de flujo. Evitar Virtual DOM, reconciliación y ciclo de renderizado interno. La diferencia entre evento y render se recupera en la clase 04. |
| Puente | Del bloque único al árbol final | Anticipar la transformación práctica: primero encabezado y tarjeta viven en `App`; después el docente extrae `AppHeader`; por último, el grupo extrae `MediaCard`. Mostrar los estados, pero reservar los imports y exports completos para el editor. | Antes/después estructural. Preguntar cuál bloque tiene una responsabilidad que pueden nombrar. |

### Indicaciones que deben sobrevivir a la producción de slides

- React no reemplaza HTML, CSS o JavaScript. La aplicación sigue ejecutándose en el navegador y React usa JSX para describir la interfaz.
- “Reutilizable” no significa que todo componente deba aparecer varias veces. La responsabilidad visible también puede justificar una extracción.
- Un componente no equivale a un archivo de manera obligatoria. El curso los separa cuando esa decisión ayuda a leer y mantener el ejemplo.
- La clase usa componentes función. Los componentes de clase quedan fuera del recorrido del curso.
- `AppHeader` es el nombre de la función; `<AppHeader />` es el elemento escrito en JSX.
- La mención de actualización de la interfaz permanece en alto nivel. `useState` explicará en la semana 2 qué provoca cambios interactivos.

### Cierre conceptual

La última diapositiva recupera el árbol construido y plantea estas preguntas:

1. ¿Qué responsabilidad cumple `App` y cuál cumple `MediaCard`?
2. ¿Qué diferencia existe entre declarar `AppHeader` y escribir `<AppHeader />`?
3. ¿Por qué no convertimos cada etiqueta HTML en un componente?
4. ¿Qué limitación tiene una `MediaCard` con datos fijos?

La cuarta respuesta abre la clase 02: usar props para representar medios distintos sin duplicar la estructura.

## Flujo del código

### Estado 1 · Template de Vite

El proyecto comienza con la demostración generada por Vite. El docente sigue esta cadena antes de borrar contenido:

```text
index.html
└── src/main.tsx
    └── App.tsx
```

`index.html` contiene el elemento raíz. `main.tsx` crea el root de React y renderiza `App`. `App.tsx` describe la pantalla inicial.

### Estado 2 · Pantalla escrita dentro de `App`

El docente elimina el contenido de demostración y escribe la primera pantalla en un solo componente:

```tsx
function App() {
  return (
    <>
      <header>{/* nombre y descripción de la aplicación */}</header>

      <main className="page-container">
        <h2>Catálogo destacado</h2>

        <article>
          {/* poster, título, descripción, tipo y año */}
        </article>
      </main>
    </>
  )
}
```

Este estado permite señalar dos secciones visibles antes de extraer componentes.

### Estado 3 · Demostración con `AppHeader`

El docente extrae el `<header>` hacia `src/components/app-header.tsx`. La extracción tiene un motivo visible: ese bloque identifica la aplicación y puede leerse como una unidad, mientras `App` conserva la responsabilidad de componer la pantalla. Vive en `components/` porque representa una pieza de interfaz y el archivo usa `kebab-case`; la función exportada se llama `AppHeader` porque los componentes usan `PascalCase`.

Durante la extracción, el docente explica el nombre en mayúscula, export, import y elemento JSX. No afirma que todo bloque de HTML deba convertirse en componente: esta es una separación deliberada que permite leer el árbol sin introducir todavía props o `children`.

### Estado 4 · Práctica guiada con `MediaCard`

Docente y estudiantes extraen el `<article>` hacia `src/components/media-card.tsx`.

```text
src/
├── components/
│   ├── app-header.tsx
│   └── media-card.tsx
├── App.tsx
└── main.tsx
```

Al terminar, `App` conserva el `<main>` y compone dos componentes:

```tsx
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
```

`MediaCard` todavía contiene datos fijos. La clase 02 convertirá esos datos en props y construirá la lista.

## Secuencia sugerida

| Tiempo | Actividad |
| --- | --- |
| 0-5 min | Presentar el producto, el objetivo de la clase y el checkpoint esperado. |
| 5-25 min | Usar el deck para introducir React, componentes, composición, responsabilidad, JSX y el flujo de renderizado. |
| 25-45 min | Verificar el entorno, crear el proyecto, instalar dependencias e iniciar Vite. |
| 45-58 min | Recorrer `index.html`, `main.tsx`, `App.tsx`, `package.json` y `pnpm-lock.yaml`. |
| 58-73 min | Eliminar la demostración de Vite y escribir la pantalla estática dentro de `App`. |
| 73-88 min | Demostración docente: extraer `AppHeader`. |
| 88-105 min | Construcción interactiva: extraer `MediaCard` consultando al grupo sobre cada paso. |
| 105-113 min | Actividad estudiantil: modificar contenido, inspeccionar el árbol y corregir un error de JSX. |
| 113-120 min | Comprobar el checkpoint y cerrar con las preguntas del deck. |

## Actividades del docente

- Mostrar la pantalla final solo para ubicar el proyecto.
- Guiar la presentación conceptual y formular las preguntas previstas antes de abrir el editor.
- Crear el proyecto mediante pnpm y explicar cada comando.
- Seguir la cadena `index.html → main.tsx → App.tsx`.
- Escribir el encabezado y la tarjeta directamente en `App`.
- Extraer `AppHeader` como demostración completa.
- Guiar la extracción de `MediaCard` sin repetirla como tarea individual.
- Señalar en React DevTools dónde aparece cada componente.
- Provocar dos errores: una etiqueta sin cerrar y un componente con nombre en minúscula.
- Verificar que cada estudiante pueda explicar qué renderiza `App`.

## Actividades de los estudiantes

- Ejecutar los comandos de creación e instalación.
- Ubicar los scripts de `package.json` y el lockfile.
- Completar la extracción guiada de `MediaCard`.
- Proponer el siguiente paso durante la construcción interactiva antes de que el docente lo ejecute.
- Cambiar el título de `AppHeader` y el contenido fijo de `MediaCard`.
- Provocar y corregir un error de JSX.
- Reubicar `MediaCard` dentro de `<main>` y observar el árbol.
- Dibujar en papel o texto el árbol de componentes construido.

## Evidencia de salida

- `pnpm dev` inicia la aplicación sin errores.
- El proyecto contiene `pnpm-lock.yaml` y no contiene otro lockfile.
- `App` compone `AppHeader` y `MediaCard`.
- Ambos componentes aparecen en React DevTools.
- El estudiante explica la cadena `index.html → main.tsx → App.tsx`.
- `MediaCard` todavía usa contenido fijo, incluida una descripción breve, y no recibe props.

## Fuera del alcance

- Props y `children`.
- Listas y `map`.
- Estado con `useState`.
- Mantine.
- Router.
- API.

La clase 02 comienza con la limitación visible de una tarjeta fija y usa esa necesidad para introducir props y listas.

## Vocabulario

- **Componente:** función que devuelve una parte de la interfaz.
- **JSX:** sintaxis que permite escribir una estructura similar a HTML dentro de JavaScript o TypeScript.
- **Render:** ejecución con la que React calcula qué interfaz debe mostrar.
- **Árbol de componentes:** relación entre componentes padres e hijos.
- **Composición:** construcción de una interfaz combinando componentes dentro de otros.
- **Responsabilidad:** parte de la interfaz o comportamiento que un componente representa y permite reconocer.
- **Biblioteca:** conjunto de funciones y APIs que un proyecto incorpora para resolver una capacidad concreta.
- **Elemento JSX:** descripción producida al escribir una etiqueta como `<MediaCard />`; React la usa para construir la interfaz.
- **`StrictMode`:** componente que activa comprobaciones adicionales durante desarrollo para revelar problemas frecuentes; no agrega contenido visual ni cambia el comportamiento de producción.
- **Gestor de paquetes:** herramienta que instala dependencias y ejecuta scripts del proyecto.
- **Lockfile:** archivo que registra las versiones resueltas de las dependencias.
- **Servidor de desarrollo:** proceso local que sirve la aplicación y actualiza los cambios durante la clase.

## Referencia docente

- [Tu primer componente](https://react.dev/learn/your-first-component)
- [Escribir marcado con JSX](https://react.dev/learn/writing-markup-with-jsx)
- [`StrictMode`](https://react.dev/reference/react/StrictMode)
- [Construir una aplicación React desde cero](https://react.dev/learn/build-a-react-app-from-scratch)
- [Crear un proyecto con Vite](https://vite.dev/guide/)
- [Aprobar scripts de instalación con pnpm](https://pnpm.io/cli/approve-builds)
