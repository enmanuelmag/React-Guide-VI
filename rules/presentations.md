# Reglas para presentaciones conceptuales

## Propósito

Cada guía de clase debe contener un guion que permita crear después una presentación breve sin reconstruir la intención pedagógica desde cero. El guion conserva qué explicar, en qué orden, con qué contraste y cómo conectar la explicación con el trabajo en el editor.

El guion no es el texto definitivo de las diapositivas. Tampoco es una lista superficial de títulos. Debe dejar mapeadas las decisiones necesarias para profundizar durante la producción.

## Secuencia de la clase

```text
presentación conceptual
→ demostración docente
→ construcción interactiva con el grupo
→ actividad estudiantil
→ comprobación del checkpoint
→ cierre oral sobre el resultado construido
```

- En la clase 01, la apertura presenta el producto, los conocimientos previos y el modelo mental inicial.
- Desde la clase 02, la presentación recupera primero el checkpoint anterior y la limitación que motiva el tema nuevo.
- El cierre comprueba conceptos oralmente sobre el código y el resultado construido; no requiere volver al deck.

La presentación no ocupa toda la clase. Prepara el lenguaje y el problema que el docente mostrará después en el editor.

### Presentación continua antes del coding

Decisión final aprobada el 9 de septiembre de 2026: presentación continua → coding guiado → práctica → comprobación y cierre oral. Sustituye la propuesta anterior de alternar slides y editor. Aplica a las futuras iteraciones coordinadas de `teacher-guide.md`, proyecto progresivo y presentaciones.

La presentación admite preguntas, predicciones, diagramas y snippets breves sin abrir el editor. Prepara el problema y el vocabulario; no explica cada línea de la implementación futura. Después de la transición al entorno de desarrollo, el docente permanece allí: construye, pregunta, introduce distinciones ligadas al código visible y comprueba el resultado sin regresar a las slides.

La guía identifica el final del recorrido conceptual y conserva las preguntas de cierre para formularlas oralmente. Las slides de cierre, taller o descanso existentes pueden permanecer como material de consulta; no obligan a proyectarlas ni a revelar respuestas antes de la práctica. Esta decisión no exige regenerar los decks aprobados.

No fijar una cuota de slides ni universalizar el ejemplo de 22 minutos de presentación: cada sesión debe presupuestar explicación, construcción, práctica y verificación dentro de su duración. Si aumenta la teoría, indicar qué trabajo mecánico se entrega preparado o qué se condensa; no restar silenciosamente tiempo al aprendizaje o a la comprobación. Validar el ritmo mediante ensayo, sin presentar una suma documental como evidencia de tiempo real.

En presenciales, presentación y coding guiado ocupan los 75 minutos anteriores al descanso. Después se mantienen 30 minutos de descanso, 60 de taller y 15 de revisión y cierre; no se introduce contenido nuevo después del descanso.

## Contenido obligatorio del guion

La sección `Guion de presentación` de cada clase debe indicar:

- Propósito del bloque y duración estimada.
- Orden y título provisional de las diapositivas.
- Concepto o decisión que debe conservar cada diapositiva.
- Explicación mínima necesaria para que el futuro autor no tenga que inferirla.
- Relación con un conocimiento previo o con el proyecto.
- Contraste o distinción que evite una interpretación incorrecta.
- Recurso recomendado: diagrama, mockup, comparación, snippet o pregunta.
- Nota docente cuando exista una simplificación, un error frecuente o una pregunta para el grupo.
- Conceptos que solo se nombran y se desarrollarán en otra clase.

No escribas “explicar componentes” como único detalle. Nombra qué es un componente, qué responsabilidad cumple en el ejemplo, cómo se compone con otros y qué idea todavía queda fuera de alcance.

Si durante una revisión aparece una distinción, un contraejemplo, una conexión con una clase previa o una advertencia que ayude a enseñar el concepto, regístrala en el guion aunque todavía no tenga una diapositiva propia. No dependas de recordarla cuando empiece la producción visual.

## Plantilla recomendada

Usa una tabla cuando ayude a leer la secuencia:

| Momento | Título provisional | Contenido que debe conservarse | Recurso o nota docente |
| --- | --- | --- | --- |
| Apertura | Pregunta o contexto | Problema y conexión con el checkpoint | Mockup, pregunta o diagrama |
| Concepto | Nombre concreto | Explicación, distinción y alcance | Visual o snippet breve |
| Puente | Trabajo de la clase | Estado inicial y objetivo | Antes/después sin resolver la práctica |
| Cierre | Comprobación | Preguntas y relación con el checkpoint | Exit ticket |

La cantidad de diapositivas depende de la duración y dificultad. No agregues una diapositiva para completar una cuota.

### Contenido directo y portada

Decisión aprobada el 26 de octubre de 2026. Aplica a nuevas presentaciones y futuras revisiones solicitadas:

- Conserva una portada o introducción breve que presente la sesión y su tema.
- Evita diapositivas dedicadas únicamente a anunciar una transición, repetir la agenda o decir que ahora abriremos el editor. Comunica ese paso oralmente cuando no añada contenido.
- Reúne explicación, ejemplo y resultado en una misma diapositiva cuando desarrollen una sola idea y puedan leerse con comodidad. El docente puede explicarlos pausadamente sin cambiar de slide.
- Mantén separadas las ideas que requieran contextos distintos. No conviertas esta preferencia en diapositivas cargadas.
- Conserva tipografía, espacio y código completo visible. Si reunir contenido obliga a reducir la letra o produce recortes, simplifica o separa.
- Un mapa, una pregunta o una analogía puede tener su propia diapositiva cuando aporte una explicación concreta; no debe funcionar solo como tránsito.
- No fijes un número universal de diapositivas ni reabras presentaciones aprobadas sin una petición u observación de aula.

Ejemplo: muestra los estados de una mutación junto al botón que depende de ellos, en vez de separar una slide que anuncia los estados y otra que muestra su uso.

## Recapitulación

La recapitulación debe recuperar una evidencia observable de la clase anterior. Puede pedir al estudiante que:

- Reconstruya un árbol o flujo.
- Prediga qué archivo cambiaría.
- Explique una diferencia con sus propias palabras.
- Identifique una limitación del checkpoint.

Evita resumir toda la clase anterior. Recupera lo necesario para comprender el tema nuevo.

## Código y recursos visuales

- Cada snippet demuestra una sola idea y debe leerse sin desplazamiento ni recorte. Las líneas largas se dividen con intención pedagógica antes de reducir el tamaño tipográfico.
- Usa fragmentos breves; muestra el archivo completo en el editor cuando la estructura lo requiera.
- Resalta el cambio que interesa, por ejemplo, un bloque `<header>` antes y `<AppHeader />` después.
- Distingue el código conceptual del código que los estudiantes escribirán.
- Puedes mostrar el resultado visual, pero no debes revelar la solución completa de una actividad estudiantil.
- Usa diagramas para relaciones, árboles, flujo de datos y transformaciones que el texto no comunique con la misma claridad.
- La auditoría de una presentación debe activar cada diapositiva y fallar si el ancho o alto real de cualquier `pre code` supera su caja visible, aunque el contenedor exterior permanezca dentro del lienzo.

### Colores de sintaxis en animaciones docentes

Decisión aprobada el 3 de octubre de 2026. En nuevas animaciones y futuras revisiones de sus paneles de código, usa la paleta aplicada en la animación 08. Diferenciar variables, funciones y JSX facilita seguir el ejemplo sin cambiar su contenido.

| Elemento | Color | Valor |
| --- | --- | --- |
| Variables y parámetros | Azul claro | `#99d0ff` |
| Funciones, hooks y setters | Amarillo suave | `#f4d58b` |
| Etiquetas JSX y sus delimitadores | Coral | `#ffa99c` |
| Atributos JSX y propiedades de objetos | Turquesa | `#8bdad4` |
| Cadenas y valores de atributos de texto | Verde claro | `#ade0c1` |
| Palabras clave, booleanos y operadores | Violeta | `#c4adff` |
| Números | Durazno | `#ffc697` |
| Comentarios | Gris azulado | `#acbbd6` |
| Puntuación de JavaScript | Gris claro | `#d9e3f5` |
| Texto restante | Blanco suave | `#edf1fc` |

Usa fondo de código `#121b33` y fondo de línea del paso `#223b8f`. Los colores de sintaxis permanecen al resaltar una línea; el fondo indica el paso, no el tipo de símbolo. Por ejemplo, `draftQuery` es azul, `setDraftQuery` amarillo, `<input>` coral y `onChange` turquesa.

Tokeniza el archivo completo con una gramática JSX y conserva cada línea, espacio y texto al distribuir el resultado en filas. No clasifiques JSX multilínea como texto ordinario ni uses un resaltado que modifique el ejemplo. Verifica legibilidad sobre ambos fondos y ausencia de recortes. El color acompaña nombres y estructura; no es la única señal pedagógica.

La referencia ejecutable es [el resaltador de la animación 08](../course/08-tanstack-query-y-busqueda-remota/01-animacion-busqueda-cache/src/highlight.js). Esta regla no exige regenerar los decks aprobados. Para un panel con otro fondo, adapta los valores para mantener contraste y documenta la excepción conservando la distinción entre categorías.

### Contratos de props en snippets

Cuando una diapositiva define un componente con props, muestra el contrato de forma explícita y en este orden:

```tsx
type MediaCardProps = {
  title: string
}

function MediaCard(props: MediaCardProps) {
  const { title } = props
  return <article>{title}</article>
}
```

- Usa un `type` con nombre terminado en `Props` y decláralo antes del componente. El curso evita abrir una comparación con `interface` cuando esa diferencia no es el objetivo de la sesión.
- Tipa el parámetro como `props: NombreProps` y realiza el destructuring dentro del cuerpo. Esta forma hace visibles por separado el objeto recibido, su contrato y las variables locales.
- No declares el tipo inline en la firma ni combines el destructuring con la anotación del parámetro en ejemplos didácticos.
- La regla aplica cuando el snippet enseña o vuelve a mostrar la definición del componente. Un fragmento centrado únicamente en el JSX interno o en el uso `<MediaCard />` puede omitir la firma completa.

### Código entre archivos y roles

- Cuando una diapositiva muestra la definición de un componente y su uso desde otro archivo, sepáralos en bloques distintos. No coloques ambos fragmentos dentro de una sola caja sin frontera.
- Identifica cada bloque con su ruta encima del código, por ejemplo `src/components/media-card.tsx` y `src/App.tsx`.
- En el archivo consumidor, muestra el import cuando sea necesario para entender cómo se conecta con el componente usado.
- Usa etiquetas de rol además de las rutas: `Padre`, `Hijo`, `Provider`, `Consumidor` u otra relación que la clase ya haya presentado.
- Mantén un color semántico consistente para cada rol dentro del deck. Usa un fondo suave y una línea lateral del mismo matiz tanto en el snippet como en su leyenda.
- El color acompaña la relación, pero no la comunica por sí solo: la ruta, el nombre del rol y el flujo deben seguir siendo comprensibles sin color.
- Cuando un fixture o colección participa en el ejemplo, muestra al menos un objeto concreto antes de abreviar los demás. Representa la omisión como una línea comentada, por ejemplo `// { ... } más objetos`, para que no parezca código copiable ni un objeto válido del contrato.

### Primera exposición y contexto

- Diseña cada explicación como si el estudiante viera el concepto por primera vez, salvo que el checkpoint anterior demuestre que ya lo usó y explicó.
- Antes de pedir una inferencia, deja visibles las piezas mínimas: dónde ocurre, qué entrada recibe, qué decisión toma y qué resultado produce.
- Un diagrama no sustituye la frase que explica su propósito. Si las etiquetas aisladas no permiten reconstruir la relación, añade contexto o cambia la representación.
- En transformaciones, presenta pares explícitos `entrada → salida` antes de resumir varios casos bajo una abstracción común.
- Evita depender de conocimiento implícito del autor o del docente. La diapositiva debe conservar suficiente contexto para que un estudiante nuevo pueda seguir la explicación oral.

### Origen de campos devueltos por hooks

- Cuando una diapositiva use campos devueltos por un hook o una librería, muestra primero la invocación que produce ese objeto, por ejemplo `const query = useMediaSearch(input)`.
- Explica visiblemente qué representa la variable receptora y qué hook origina el resultado. Si un hook propio envuelve otro, indica ambos niveles: `useMediaSearch()` devuelve el objeto producido por `useQuery()`.
- Usa el acceso completo al presentar cada campo por primera vez: `query.data`, `query.error`, `query.status`, `query.fetchStatus`, `query.isLoading` o `query.isFetching`. No muestres esos nombres como variables aisladas si el estudiante todavía no conoce su origen.
- Distingue los campos del resultado de las opciones de entrada. Por ejemplo, `enabled` y `staleTime` configuran `useQuery`; `data` y `isFetching` forman parte del objeto que devuelve.
- En tablas, diagramas y estados visuales, conserva el mismo prefijo o añade una leyenda inmediata que permita reconstruir de dónde sale cada valor.

### TypeScript y datos recibidos en runtime

- Cuando una presentación explique que TypeScript no valida datos externos, define visiblemente `compile time` como la revisión del código antes de ejecutarlo y `runtime` como el momento en que JavaScript funciona y recibe valores reales.
- Acompaña la distinción con un caso concreto `type esperado → JSON recibido`. Muestra al menos un campo cambiado, ausente o incompatible para que el riesgo no dependa de una advertencia abstracta.
- Explica en pantalla y en las notas docentes que un cast con `as` no inspecciona, valida, renombra ni agrega campos al JSON.
- No presentes un build exitoso como evidencia de que el backend conserva su contrato. El build comprueba el código y las declaraciones conocidas por el proyecto, no la respuesta futura de otro sistema.

### Dirección en diagramas

- Usa flechas con punta cuando la relación indique secuencia, flujo de datos, dependencia, transformación o causa.
- Extiende la flecha entre los nodos que conecta; evita guiones cortos que puedan leerse como decoración o separadores.
- Reserva las líneas sin punta para agrupación, límites, ejes o divisiones sin dirección.
- Acompaña la flecha con verbos o etiquetas cuando la dirección por sí sola no explique qué cambia entre origen y destino.
- Cuando una presentación desarrolla un recorrido central de varias fases, conserva una barra de orientación visible en todas las diapositivas que explican ese recorrido. Nombra todas las fases, resalta la fase actual y muestra el avance acumulado para que el estudiante no pierda el contexto entre slides.
- La barra de orientación es apoyo y no contenido principal: debe ocupar una franja estable, no tapar texto, snippets, notas visibles ni el número de diapositiva. La portada, el mapa inicial y el cierre pueden omitirla si no representan una fase concreta.

### Casos correctos e incorrectos

- Cuando una comparación incluya una forma incorrecta, no la marques solo con una línea roja: acompáñala con un fondo rojo muy suave y una explicación directa de qué ocurre y por qué no sirve.
- El color nunca sustituye la etiqueta. Usa un verbo o veredicto visible como `Ejecuta durante el render`, `Forma incorrecta` o `Evitar` según el caso.
- Mantén suficiente contraste en el texto y reserva el rojo saturado para la línea, el icono o un detalle pequeño; la superficie principal debe permanecer suave.

## Notas docentes y pies de diapositiva

La nota docente registra:

- La explicación oral que no debe llenar la diapositiva.
- Una pregunta para activar al grupo.
- Un error frecuente que el docente mostrará o anticipará.
- Una simplificación deliberada y la clase en que se ampliará.

El pie de diapositiva puede definir un término corto, citar una fuente o aclarar una convención. La información necesaria para entender la idea principal debe permanecer en el cuerpo.

### Vocabulario visible

- Define en la propia presentación todo término que un estudiante de bootcamp podría no conocer, aunque ya esté explicado en la guía docente o estudiantil.
- Presenta la definición en la primera aparición necesaria: dentro del cuerpo, junto al ejemplo o en un pie legible. Las notas del presentador no sustituyen esta definición visible.
- Usa una frase breve ligada al caso actual. Por ejemplo: `Fixture: colección de datos locales preparada para desarrollar y comprobar casos conocidos.`
- Si el tecnicismo no aporta precisión, reemplázalo por lenguaje directo; por ejemplo, `reemplazo local` en lugar de `fallback`.
- No es necesario repetir la definición en cada diapositiva posterior una vez que el término quedó presentado con claridad.

### Lenguaje cálido y directo

- Escribe para estudiantes que encuentran el concepto por primera vez. Prefiere frases completas que expliquen el resultado antes que etiquetas abstractas como `recorrido`, `rama`, `tipo` o `casos previos` aisladas en una celda.
- En tablas de comprobación, expresa qué verá el estudiante y qué puede concluir: `El catálogo sigue completo`, `La pantalla explica que no hay elementos` o `No rompimos la lista ni sus tipos`.
- Las preguntas deben recordar la acción y las piezas involucradas. Por ejemplo, usa `¿Qué debemos mover desde App hacia MediaGrid?` en lugar de preguntar por `el bloque` sin contexto visible.
- Toda respuesta visible debe poder entenderse junto a su pregunta sin reconstruir información implícita. Nombra el componente, dato, archivo o resultado al que se refiere en vez de responder solo con una palabra aislada.
- Antes de cerrar una slide, comprueba que un estudiante nuevo pueda explicar: `qué estamos observando`, `qué se pregunta`, `qué respuesta se espera` y `por qué esa respuesta importa`.
- Mantén una voz cercana y serena. La precisión técnica permanece, pero el estudiante no debe traducir primero una abreviatura conceptual para entender la idea.

## Cierre conceptual

El cierre debe incluir entre dos y cuatro preguntas ligadas al resultado de aprendizaje. Al menos una debe exigir explicación, predicción o justificación; no todas deben resolverse con sí o no.

El docente conecta las respuestas con el checkpoint y nombra la limitación que abrirá la clase siguiente. El cierre no introduce una herramienta nueva.

## Línea base aprobada y experiencia de aula

- Una presentación aprobada queda como línea base estable para impartir la clase; no se reabre por ajustes hipotéticos.
- Los cambios de ritmo, densidad o detalle descubiertos al impartir la clase se registran como una nueva iteración sustentada en observaciones concretas del aula.
- Esa iteración conserva la versión aprobada como referencia y documenta qué experiencia motivó cada ajuste antes de modificarla.

## Framework aprobado

La especificación [Catálogo aprobado de diapositivas y stack](../presentation-framework/approved/slide-catalog-and-stack.md) forma parte de estas reglas. Antes de diseñar, crear o modificar una presentación, consulta ese documento y cualquier otra decisión aplicable dentro de `presentation-framework/approved/`.

Las decisiones aprobadas son:

- HTML, CSS y JavaScript serán la fuente editable.
- Cada diapositiva usará un lienzo 16:9.
- El stack usa Reveal.js, Vite y Tailwind CSS compilado localmente con pnpm; no usa Tailwind Play CDN en artefactos aprobados.
- El catálogo distingue 18 geometrías reutilizables y 59 casos semánticos. Una variación de contenido no justifica por sí sola otro layout.
- Reveal.js administra navegación, escalado, notas docentes, fragments y soporte de exportación.
- Reveal Highlight / highlight.js cubre inicialmente el resaltado de código.
- Los diagramas se construyen con HTML y SVG reutilizables; Mermaid, GSAP, charts u otra dependencia requieren un caso no resuelto por el piloto y aprobación explícita.
- Los assets necesarios para presentar y exportar se conservan localmente.
- Contenido, estructura visual y exportación permanecerán separados.
- Los PNG por diapositiva servirán para revisión visual y reutilización como imagen.
- Chromium y Reveal.js producirán el PDF por la ruta principal para conservar texto seleccionable cuando sea posible.
- La composición de PNG dentro de un PDF queda como fallback a comparar durante el piloto, no como ruta principal.
- Las notas docentes permanecen fuera del PDF estudiantil.
- Las slides verticales anidadas quedan fuera del curso base.
- Los fragments solo se usan cuando el revelado aporta a la explicación y deben conservar una salida PDF comprensible.

### Autoría híbrida

- Parametriza los campos repetibles: ID, geometría, casos semánticos, título, contenido, assets, captions y notas docentes.
- La parametrización debe producir HTML semántico legible y no convertir todas las geometrías en un esquema universal rígido.
- El autor puede editar manualmente HTML o CSS cuando una composición particular o una revisión visual lo exija.
- Una corrección manual reutilizable se eleva al componente, layout o token compartido; una excepción propia de una slide permanece local.
- Durante una iteración se pueden generar PNG de slides seleccionadas o el PDF completo cuando ayuden a comprobar composición, contraste, recortes o impresión.
- No es obligatorio regenerar todos los artefactos después de cada cambio. El deck sí debe completar `deck:generate` antes de su cierre definitivo.

La especificación [Dirección visual aprobada · Laboratorio claro](../presentation-framework/approved/visual-direction.md) define personalidad, marca, paleta, tipografía, escala FHD, grilla, densidad, superficies, tratamiento de recursos, movimiento y accesibilidad. Cada presentación debe aplicar esa especificación junto con el catálogo semántico.

El [plan de implementación](../presentation-framework/draft/implementation-plan.md), el runtime, la galería y el piloto de la sesión 01 están aprobados. Las presentaciones definitivas consumen el runtime compartido de `presentation-framework/approved/`. La generación completa de build, auditoría, PNG y PDF se ejecuta bajo demanda con `pnpm deck:generate -- --deck <ruta>` desde esa carpeta.
