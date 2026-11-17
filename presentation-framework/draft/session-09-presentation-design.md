# Diseño aprobado para revisión · Presentación sesión 09

## Estado

- Sesión: 09 · React Router declarativo.
- Modalidad: virtual, 90 minutos.
- Estado del documento: diseño narrativo y visual aprobado en conversación; pendiente de revisión del archivo antes de implementar.
- Artefacto futuro: presentación Reveal.js de 24 diapositivas con 24 notas docentes.

## Propósito

La presentación acompaña a estudiantes que conocen una búsqueda remota, pero todavía no han usado Router. Sigue una tarjeta concreta de Dune desde una identidad disponible dentro de React hasta una URL y una página provisional. El grupo debe poder explicar qué dato viaja, quién lo recibe, cuándo deja de ser confiable y qué responsabilidad conserva cada herramienta.

## Punto de partida y límite

El checkpoint 08 ya entrega resultados con `mediaType + externalId`. Las tarjetas todavía no declaran un destino.

La presentación termina cuando `/media/movie/123` produce un `GetMediaDetailInput` válido y `MediaDetailPage` muestra esa identidad. No introduce `useMediaDetail()`, fetching de detalle, adaptación de `MediaDetailDto`, estados remotos de detalle ni `document.title`; esos conceptos pertenecen a la sesión 10.

## Hilo narrativo

El deck sigue un solo recorrido:

```text
tarjeta de Dune sin destino
→ Link construye /media/movie/123
→ React Router compara la URL con una Route
→ MediaDetailPage llama useParams()
→ params contiene strings externos
→ toMediaDetailInput() valida esos strings
→ la página provisional muestra GetMediaDetailInput
```

La identidad `movie + 123` permanece visible durante el recorrido para que el estudiante no tenga que reconstruir qué valor está siguiendo.

## Sistema visual de la identidad

- Azul: identidad conocida dentro de la aplicación, como `item.mediaType` y `item.externalId`.
- Ámbar: valores externos obtenidos desde la URL y todavía no validados.
- Verde: `GetMediaDetailInput` validado y aceptado por el dominio.
- Rojo suave: valor rechazado, siempre acompañado por una explicación textual.

El color funciona como refuerzo. Cada estado también conserva nombre, forma y texto suficiente para comprenderse sin color.

## Secuencia de 24 diapositivas

| N.º | Título de trabajo | Idea principal | Recurso |
| --- | --- | --- | --- |
| 01 | React Router declarativo | Una identidad pública necesita una URL | Portada con logo oficial de React Router |
| 02 | La ruta de la sesión | La misma identidad avanzará desde la tarjeta hasta una página | Recorrido general con cuatro estaciones |
| 03 | El checkpoint de búsqueda remota | La tarjeta ya conserva `movie + 123` | Tarjeta de Dune y modelo visible |
| 04 | Una tarjeta sin destino | No existe todavía una URL que otra persona pueda abrir | Contraste antes/después sin revelar implementación |
| 05 | ¿Qué URL compartiríamos? | La identidad existe, pero aún no está representada en la ubicación | Pregunta con contexto y respuesta revelada |
| 06 | Router relaciona URL y página | Router observa la ubicación y selecciona un elemento | Flujo corto con definición visible de Router y SPA |
| 07 | Router y Query conservan responsabilidades distintas | Router decide la página; Query administra datos remotos | Comparación con logos oficiales |
| 08 | Tres modos de React Router | El curso elige Declarative Mode porque la capa de datos ya existe | Comparación Declarative, Data y Framework |
| 09 | BrowserRouter habilita la navegación | Los consumidores de Router deben vivir dentro del provider | Árbol de providers con ruta de archivo |
| 10 | Patrón de ruta y URL real | `:mediaType` y `:externalId` son nombres; `movie` y `123` son valores | Comparación alineada entre patrón y pathname |
| 11 | Segmentos fijos y dinámicos | Los segmentos dinámicos capturan texto de la URL | Anatomía coloreada con vocabulario visible |
| 12 | El árbol público de rutas | El árbol define raíz, búsqueda, detalle y wildcard | Árbol jerárquico con rutas y páginas explícitas |
| 13 | Una layout route comparte estructura | La ruta padre aporta `AppHeader` y `<main>` sin añadir un segmento | Árbol de componentes y rutas coordinado |
| 14 | Sin Outlet, la página hija no aparece | El layout coincide, pero no ofrece una región para la hija | Estado de fallo controlado con explicación |
| 15 | Outlet recibe la hija coincidente | El árbol decide qué página aparece dentro del layout | Antes/después en archivos separados |
| 16 | Link convierte la identidad en un destino | La tarjeta declara una URL navegable | Snippet de `MediaSearchResults` y ficha azul viajera |
| 17 | Link y Navigate inician recorridos distintos | La persona activa `Link`; el árbol renderiza `Navigate` para redirigir | Dos recorridos con verbos y destinos |
| 18 | La URL coincide con MediaDetailPage | `/media/movie/123` activa la ruta dinámica | Ruta resaltada dentro del árbol completo |
| 19 | useParams devuelve valores de la URL | `const params = useParams()` produce strings posiblemente ausentes | Resultado explícito de la invocación y ficha ámbar |
| 20 | Los route params todavía no son datos del dominio | La coincidencia sintáctica también acepta `/media/anime/123` | Contraste de URL coincidente frente a valor válido |
| 21 | El adapter valida antes de construir el input | La matriz determina cuándo devolver objeto o `null` | Tabla de casos concretos y flujo de decisión sin implementación completa |
| 22 | Una assertion no valida durante la ejecución | `as MediaType` puede ocultar un string incompatible | Comparación correcta/incorrecta con rojo suave |
| 23 | La página provisional conserva una identidad válida | El resultado verde muestra tipo e identificador sin solicitar detalle | Mockup de `MediaDetailPage` y evidencia del navegador |
| 24 | URL válida hoy, detalle remoto después | La sesión 09 termina en input válido; la 10 añadirá query y contenido | Checkpoint, preguntas de cierre y puente explícito |

## Tratamiento de código

- Cada bloque identifica su archivo y su rol.
- Cuando colaboren dos archivos, se presentan en cajas separadas con rutas visibles.
- La primera aparición de un valor devuelto por un hook muestra su invocación. Para params: `const params = useParams()` seguido de `params.mediaType` y `params.externalId`.
- Toda definición de componente con props usa `type NombreProps`, `props: NombreProps` y destructuring dentro del cuerpo.
- Los snippets se limitan a una decisión. El archivo completo queda para el editor.
- La presentación no incluye la solución completa de la actividad estudiantil. La matriz de validación sí aparece porque define el comportamiento que el grupo debe implementar.

## Vocabulario visible

La primera aparición define de forma breve `SPA`, `Router`, `ruta`, `segmento`, `segmento dinámico`, `layout route`, `Outlet`, `route params`, `Link`, `Navigate`, `wildcard` y `deep link`. Si un término no aporta precisión, se reemplaza por una frase directa.

## Preguntas y respuestas

Cada pregunta recuerda las piezas involucradas y la situación actual. Las respuestas nombran el componente, dato o resultado completo. Ejemplo:

> La URL coincide con `/search` y aparece `AppHeader`, pero `SearchPage` no se muestra. ¿Qué falta dentro de `PublicLayout` para que React Router pueda colocar la página hija?

Respuesta: falta `<Outlet />`, la región donde React Router renderiza el elemento de la ruta hija coincidente.

## Movimiento

- Reveal usa la transición `fade` aprobada.
- Los fragments revelan un solo paso del recorrido cuando el orden ayuda a comprenderlo.
- La ficha viajera cambia de posición entre slides relacionadas, pero nunca depende de una animación para comunicar el valor.
- El PDF conserva todos los nodos y conectores necesarios para reconstruir el recorrido.
- Se respeta `prefers-reduced-motion`.

## Assets

- Integrar el logo oficial de React Router como PNG local con transparencia y proporción conservada.
- Reutilizar el logo local de TanStack Query únicamente en la comparación de responsabilidades.
- No usar logos como decoración ni depender de URLs remotas durante la presentación.
- La tarjeta de Dune usa el mismo tratamiento visual del deck anterior para mantener continuidad, sin requerir una imagen decorativa nueva si el dato textual basta.

## Notas docentes

Cada slide contiene una nota privada que cubre al menos uno de estos objetivos: explicación oral, pregunta al grupo, error frecuente, simplificación o frontera de evidencia. Las notas recalcan que:

- `useParams()` devuelve datos externos a través de la URL;
- una assertion no realiza validación en runtime;
- `Outlet` no es wildcard ni portal;
- `Link` no reemplaza TanStack Query;
- la comprobación local del historial no demuestra fallback de SPA en producción.

## Verificación prevista

Antes de solicitar aprobación final:

1. ejecutar build y auditoría del deck;
2. confirmar 24 slides y 24 notas;
3. comprobar assets locales y ausencia de URLs remotas;
4. inspeccionar todas las capturas FHD, con atención especial a código, tablas, árbol y conectores;
5. verificar que no haya overflow ni contenido oculto dentro de `pre code`;
6. exportar y revisar el PDF de 24 páginas sin notas privadas;
7. confirmar que ningún ejemplo adelante la query de detalle de la sesión 10.

## Evidencia documental consultada

- Guion y guía docente aprobados de la sesión 09.
- Checkpoint de la sesión 08 y punto de entrada de la sesión 10.
- Reglas y dirección visual aprobadas del framework.
- Documentación de React Router consultada mediante Context7 para modos, `BrowserRouter`, rutas declarativas, rutas anidadas, `Outlet`, navegación y segmentos dinámicos.
- Manifiesto npm verificado para `react-router@8.3.1`: Node `>=22.22.0`, React y React DOM `>=19.2.7`.
