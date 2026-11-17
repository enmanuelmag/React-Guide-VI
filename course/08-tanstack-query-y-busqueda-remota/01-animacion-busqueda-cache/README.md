# Animación 01 · Búsqueda y caché

Material de apoyo de la sesión 08 de MediaLog. Cuatro capítulos, 20 hitos y tres recorridos: resultados, respuesta vacía, error con recuperación.

## Abrir

Desde esta carpeta:

```sh
pnpm install --frozen-lockfile
pnpm dev --port 5188
```

Abre http://127.0.0.1:5188/. Flechas izquierda y derecha para retroceder y avanzar; Home para reiniciar; End para el cierre; Espacio para reproducir o pausar. También puedes pulsar los hitos y capítulos, ajustar ritmo, elegir escenario y ampliar a pantalla completa. Command/Ctrl + conserva el zoom del navegador; si excede la ventana, la página permite desplazarse.

Código completo con scroll a la izquierda. Las líneas conservan su numeración y el paso lleva la primera línea resaltada a la vista; también puedes desplazarte manualmente. Query Client y sus entradas arriba a la derecha; debajo, navegador e inspector acoplado. Los datos ilustrativos de Dune no son resultados verificados del backend.

## Qué ejecuta realmente

Es un **simulador determinista**. No ejecuta el componente React ni TanStack Query, no hace fetch y no prueba el servicio real. El código visible es un ejemplo JSX conceptual completo: reúne en SearchDemo el formulario y la query para seguir el flujo sin cambiar de archivo. En el proyecto progresivo esas responsabilidades viven en los archivos TypeScript de la guía: media-keys.ts, use-media.ts, App.tsx y componentes Mantine.

Los imports de searchMedia y toMediaSearchCardModel se corresponden con funciones de la app. No se crean copias de esos módulos aquí. El ejemplo presupone el QueryClientProvider del proyecto, un QueryClient único, retry: false y staleTime: cinco minutos. Su configuración e implementación completa siguen en teacher-guide.md. No pegues SearchDemo sobre el checkpoint como una nueva tarea.

Los pasos congelan y separan acciones para explicar; no representan cada render real ni prometen un calendario exacto de React o Query. Algunos hitos conservan el último commit visible mientras se explica cómo se prepara el siguiente. El escenario es independiente del tiempo real y su caché siempre permanece fresco durante el recorrido preparado.

Los controles de la app también son parte del recorrido: el input es de solo lectura, Buscar avanza al hito preparado y el selector puede llevar de resultados de películas al paso de edición de series. Para todos los demás cambios usa la línea de tiempo. No son un formulario libre ni una segunda implementación de la app.

## Preparar · Hitos 01–05

Antes de avanzar define **borrador** como los valores que editamos y **búsqueda enviada** como el pedido confirmado.

1. Empieza sin consulta: query.status pending y query.fetchStatus idle. enabled es una opción de entrada; los otros campos pertenecen al objeto query devuelto por useQuery.
2. Escribe D y luego Dune usando los hitos. Muestra Network: cero POST.
3. Elige Películas; todavía no envías.
4. Pausa antes de Buscar. Pregunta: “¿Debemos consultar por cada letra?”. Respuesta: en esta app esperamos un submit válido.
5. El handler evita la navegación del formulario, valida mínimo dos caracteres y solicita submittedSearch.

Analogía: llenar una hoja de pedido permite corregirla; entregarla confirma el pedido. No confundir editar un input con enviar parámetros.

## Consultar · Hitos 06–10

1. Confirma Dune / movie y construye la key real:
   `['media', 'search', { query: 'Dune', mediaType: 'movie' }]`.
2. Explica **key** como etiqueta del cajón y **Query Client** como quien coordina el archivador de respuestas. Las ranuras punteadas son destinos ilustrativos todavía sin consultar, no entradas reales de Devtools.
3. La entrada no tiene datos: queryFn llama a searchMedia(input). Una key identifica; no contiene el fetcher ni realiza transporte por sí misma.
4. Comienza request #1. query.status pending y query.fetchStatus fetching; ahora isLoading sí representa la primera carga.
5. El spinner CSS no implica que React renderice en cada giro.

Pregunta: “Si movie y series devuelven datos distintos, ¿qué dato no puede faltar en la etiqueta?”. Respuesta: mediaType, además del texto. La key incluye los parámetros usados por el fetcher para identificar esos datos.

## Mostrar · Hitos 11–15

1. La respuesta exitosa se conserva como DTO en Query. El error no inventa DTO.
2. Señala el ejemplo de la nota visible: releaseYear: 2021 pasa a releaseLabel: '2021'; coverUrl pasa a posterUrl en el adapter.
3. El adapter devuelve un modelo visual; no modifica el DTO ni almacena tarjetas en otro useState.
4. Separa preparar JSX y confirmar la vista. El halo verde señala cambios de UI; el violeta, acciones del usuario. Ámbar destaca la entrada de caché que estamos explicando. Los tres tienen etiquetas o contexto adicional; el color no es la única señal.
5. Edita Series sin enviar. **El borrador dice series; el pedido enviado y las tarjetas siguen siendo movie.**

Pregunta: “¿Por qué siguen las películas si elegimos Series?”. Respuesta: solo editamos el borrador. No es placeholderData ni keepPreviousData.

## Reutilizar · Hitos 16–20

1. Envía Dune / series. La key cambia y la consulta empieza; sin datos de esa nueva key la UI muestra carga. No conservamos resultados de otra key después de enviar.
2. request #2 obtiene la respuesta de series. El archivador conserva también la respuesta de películas.
3. Vuelve a enviar Dune / movie antes de cinco minutos. En resultados y vacío, los DTO frescos se reutilizan: Network permanece en dos POST.
4. En el recorrido de error, el primer cajón no tiene datos frescos: se hace request #3 y la respuesta preparada recupera la búsqueda.
5. Fresco significa suficientemente reciente según staleTime. El tiempo no es una garantía de que el servidor nunca cambió. Al vencer no se borran datos ni necesariamente sale una petición en ese instante.

Pregunta: “¿Por qué podemos volver a las películas sin confundirlas con las series?”. Respuesta: se guardaron con identidades distintas.

## Escenarios

- **Resultados:** primera respuesta de dos películas y segunda de una serie; volver a películas reutiliza datos frescos.
- **Vacía:** la primera respuesta es []; status success, cero tarjetas. Ese arreglo también se puede reutilizar.
- **Error y recuperación:** la primera petición falla, series tiene éxito y volver a películas provoca una nueva petición exitosa. retry automático está desactivado.

No enseñamos todavía caducidad interactiva, garbage collection, invalidaciones, mutations, Router, detalle, login ni caché permanente. El archivador no es una base de datos ni cambia el backend.

## Uso en clase

Después del deck completo, antes de abrir el editor. Sustituye explicación dentro de los 18 minutos de teoría; no añade tiempo al total de 90 minutos. Usa el recorrido de resultados como demostración principal. Vacío y error son alternativas para una duda concreta o una revisión posterior, no una obligación de recorrer los 60 estados en clase.

Al terminar pregunta: “¿Quién guarda cada cosa?”. Borrador y pedido confirmado: React local. DTO, error y ciclo de consulta: Query. Modelo visual: adapter puro. Después continúa en el coding de la guía, sin regresar a las diapositivas.

## Comprobar

```sh
pnpm test
pnpm build
pnpm test:browser
```

La prueba de navegador requiere Vite en 5188 y Chromium disponible para Playwright. Comprueba 60 snapshots, fuente fija sin recortes, edición sin submit, reutilización, errores, recorrido inverso, reproducción, viewport de portátil y movimiento reducido. Capturas locales en artifacts, excluidas de Git. Esto verifica el simulador, no React Query real ni el backend.

## Referencias

Contrastadas con documentación oficial mediante Context7 en la preparación:

- [Query keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)
- [Disabling queries](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries)
- [Important defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults)
- [Guía del profesor](../teacher-guide.md)

El siguiente recurso pendiente corresponde a la sesión 09: URL, rutas, parámetros y Outlet.
