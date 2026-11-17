# Diseño aprobado · Presentación sesión 10

## Estado

- Diseño narrativo, visual, técnico y pedagógico aprobado por el usuario.
- La presentación HTML todavía no está implementada.
- Extensión acordada: 27 diapositivas, incluido un separador que funciona como puente al taller y un cierre posterior independiente.

## Propósito

Preparar a estudiantes que ven estos conceptos por primera vez para integrar un detalle público sin mezclar responsabilidades. La presentación debe seguir una identidad concreta desde la URL hasta el contenido remoto y, únicamente en la rama exitosa, hasta el título de la pestaña.

La presentación ocurre antes del trabajo en el editor. Después del descanso no introduce herramientas, APIs ni vocabulario nuevo.

## Hilo conductor

El ejemplo permanente será la película Dune y la URL:

```text
/media/movie/123
```

La identidad `movie + 123` debe permanecer visible mientras atraviesa este recorrido:

```text
URL
→ GetMediaDetailInput
→ query key
→ useMediaDetail
→ detailQuery
→ DTO
→ adapter
→ MediaDetailModel
→ MediaDetailContent
→ MediaDocumentTitle
→ document.title
```

Cada etapa debe responder en pantalla:

1. qué información entra;
2. quién la procesa;
3. qué decisión toma;
4. qué resultado entrega.

## Estructura narrativa

### 1. La URL permite iniciar la consulta

La apertura recupera el checkpoint de la sesión 09: React Router ya convierte la URL en `GetMediaDetailInput | null`, pero la página continúa siendo provisional.

La identidad válida forma una query key completa y permite ejecutar `useMediaDetail()`. `enabled` no inicia una acción imperativa; permite que TanStack Query ejecute la función cuando el input existe.

### 2. La respuesta decide qué muestra la página

La presentación muestra primero la invocación completa:

```tsx
const detailQuery = useMediaDetail(detailInput)
```

Debe explicar visiblemente que `useMediaDetail()` devuelve el objeto producido por `useQuery()`. Solo después aparecen `detailQuery.data`, `detailQuery.status`, `detailQuery.fetchStatus`, `detailQuery.isLoading`, `detailQuery.isError` y `detailQuery.refetch`.

La página distingue cinco ramas:

1. URL inválida: `detailInput === null`; no existe request.
2. Primera carga: existe input y el primer fetch está activo.
3. Error remoto: la petición falló.
4. Respuesta válida sin catálogo: `detailQuery.data.catalog === null`.
5. Éxito: el adapter transforma el DTO y el componente presenta el modelo.

### 3. El contenido exitoso sincroniza la pestaña

Cuando Dune ya aparece en pantalla, la presentación hace visible otro problema: al volver a búsqueda, la pestaña conserva `Dune | Medialog`.

Primero se muestra un Effect incompleto. Después se añaden, uno por uno, guardar el título anterior, escribir el título nuevo, devolver el cleanup y restaurar el valor anterior.

Strict Mode se explica mediante el ciclo de desarrollo:

```text
setup → cleanup → setup
```

El ciclo comprueba la simetría entre sincronización y restauración; no representa dos interacciones de la persona.

## Secuencia de 27 diapositivas

| Nº | Título o función | Contenido central |
| ---: | --- | --- |
| 1 | Dune tiene una dirección | Portada con React Router, TanStack Query y continuidad desde la sesión 09. |
| 2 | Recorrido de la sesión | Línea completa desde URL hasta `document.title`. |
| 3 | Checkpoint de la sesión 09 | URL validada y página provisional sin request de detalle. |
| 4 | La página todavía no consulta el detalle | Limitación visible y resultado esperado. |
| 5 | Propietarios del flujo | Router, Query, adapter, componente y Effect. |
| 6 | Consulta dependiente | Definición ligada a `GetMediaDetailInput | null`. |
| 7 | Familia de query keys | Construcción gradual desde `mediaKeys.all` hasta el detalle. |
| 8 | Identidad y caché | Cambiar tipo o id produce otra entrada de caché. |
| 9 | `enabled`: input válido e input nulo | La opción recibe `input !== null`; se muestran entrada, decisión y resultado. |
| 10 | `pending` no implica fetching | Contraste entre `status` y `fetchStatus`. |
| 11 | Orden estable de hooks | El hook ocurre antes de cualquier retorno condicional. |
| 12 | Origen de `detailQuery` | `useMediaDetail()` envuelve y devuelve el resultado de `useQuery()`. |
| 13 | DTO raíz | `catalog`, `entry` e `isLogged`; la sesión usa solo `catalog`. |
| 14 | Cinco ramas de página | Mapa completo con condición y resultado visible. |
| 15 | Dos valores nulos distintos | URL inválida frente a respuesta con `catalog: null`. |
| 16 | Dos fallos distintos | Error remoto frente a contenido ausente. |
| 17 | Objeto concreto de Dune | Fixture completo antes de abreviar otros ejemplos. |
| 18 | Adapter de detalle | Transformación explícita de DTO a modelo visual. |
| 19 | `MediaDetailContent` | Modelo recibido mediante props sin Router, Query o DTO. |
| 20 | `PageState` | Presentación reutilizable que no posee la query. |
| 21 | Título residual | Problema observable al volver desde Dune. |
| 22 | Sistema externo | `document.title` existe fuera del árbol declarativo. |
| 23 | Effect incompleto | Forma incorrecta sin cleanup, sobre fondo rojo suave. |
| 24 | Cleanup | Restauración del título anterior paso a paso. |
| 25 | Strict Mode | Ciclo adicional de desarrollo y su propósito. |
| 26 | Descanso y puente al taller | Flujo completo, checkpoint inicial del taller y trabajo que deberá construir el estudiante. |
| 27 | Cierre posterior | Preguntas, evidencias, límites y puente hacia la sesión 11. |

## Sistema visual

La composición conserva la dirección Laboratorio claro, el lienzo FHD 16:9, la grilla y la tipografía aprobadas.

Una línea de recorrido persistente muestra:

```text
URL → input → query → DTO → modelo → interfaz → document.title
```

La etapa activa usa color y las demás permanecen atenuadas. Cada flecha tiene una punta y un verbo concreto: `valida`, `forma la key`, `solicita`, `responde`, `transforma`, `presenta` o `sincroniza`.

### Colores semánticos

- Ámbar: valores externos provenientes de la URL.
- Verde: identidad validada.
- Azul: TanStack Query, caché y estados remotos.
- Gris azulado: DTO recibido.
- Verde azulado: modelo preparado para la interfaz.
- Rojo suave: URL inválida, error o forma incorrecta.
- Violeta moderado: sincronización con `document.title`.

El color acompaña la explicación; las etiquetas, rutas, verbos y resultados mantienen el flujo comprensible sin depender del color.

## Código y recursos

- Cada snippet identifica la ruta del archivo.
- Los componentes con props usan un `type` terminado en `Props`, parámetro `props` tipado y destructuring dentro del cuerpo.
- Cuando definición y consumo pertenecen a archivos distintos, se muestran en bloques separados con roles y rutas.
- La query key se construye gradualmente:

```text
["media"]
["media", "detail"]
["media", "detail", { mediaType: "movie", externalId: "123" }]
```

- El DTO de Dune aparece completo antes de usar `// { ... } más objetos`.
- La forma incorrecta usa fondo rojo suave, etiqueta visible y explicación directa.
- El Effect correcto se presenta en cuatro pasos y no como un bloque completo entregado de una vez.
- Los fragments ayudan a seguir el viaje de la información en navegador. El estado final impreso debe entenderse sin animación.
- React, TanStack Query y Vitest se acompañan con logos PNG oficiales o assets locales ya verificados cuando su primera aparición lo requiera.

## Precisiones técnicas verificadas

- Una query deshabilitada y sin caché puede presentar `status: "pending"` y `fetchStatus: "idle"` sin ejecutar la función.
- `isLoading` representa la primera carga activa porque combina estado pendiente con fetching.
- Toda variable usada por `queryFn` que cambie la respuesta forma parte de la query key.
- El cleanup de un Effect se ejecuta antes de repetirlo con dependencias distintas y cuando el componente se desmonta.
- Strict Mode añade en desarrollo un ciclo extra de setup y cleanup para revelar sincronizaciones incompletas.

La versión fijada por el curso es TanStack Query `5.102.8`; React permanece en la versión aprobada por la arquitectura del curso.

## Estados y mensajes

Cada rama debe incluir condición, significado, efecto de red y resultado visible. Ejemplo:

```text
detailInput === null
→ La URL no contiene una identidad válida
→ getMediaDetail() no se ejecuta
→ PageState muestra “Dirección no válida”
```

La presentación no usa una etiqueta aislada como respuesta. Debe nombrar el componente, el dato o la acción correspondiente.

## Taller y frontera de solución

Antes del descanso quedan explicados todos los conceptos. Después, el deck solo guía la integración:

- estado inicial: query con identidad fija, adapter y componentes aislados;
- trabajo estudiantil: conectar `detailInput`, ordenar cinco ramas y retirar datos temporales;
- la presentación no muestra el archivo final completo de `MediaDetailPage`;
- las preguntas permiten reconstruir qué dato existe, qué rama corresponde y qué componente debe recibirlo.

La sesión no introduce Zustand, formularios, Zod, autenticación, mutaciones, loaders ni fetching dentro de un Effect.

## Evidencia y límites

| Evidencia | Demuestra | No demuestra |
| --- | --- | --- |
| Vitest | Transformación del adapter para los fixtures cubiertos. | Router, Query, DOM o Effect. |
| Build | Tipado y empaquetado del árbol incluido. | Comportamiento del navegador o backend real. |
| Devtools | Key, caché y estados observados. | Corrección completa de la interfaz. |
| Matriz manual | Comportamiento observado en ese navegador. | Regresión automática futura. |
| Preview local | Ejecución local del build. | Deploy, disponibilidad del backend o deep links de producción. |

Las notas docentes conservan respuestas esperadas, errores frecuentes, límites de cada evidencia y el recordatorio de limpiar consola y recargar antes de interpretar Strict Mode.

## Validación visual requerida

- 27 diapositivas y 27 notas docentes.
- Revisión a resolución FHD.
- Snippets sin recorte, desbordamiento o desplazamiento.
- Flechas alineadas con los nodos que conectan.
- Logos locales con proporción preservada.
- Estado final de fragments comprensible en PDF.
- PDF completo sin notas privadas.
- Revisión manual de todas las rasterizaciones antes de solicitar aprobación.

## Puente hacia la sesión 11

La sesión termina con búsqueda y detalle como páginas públicas estables. La sesión 11 podrá abrir una única creación global desde ambas páginas sin mover la query de detalle a Zustand.
