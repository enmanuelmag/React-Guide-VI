# Taller y rúbrica · Sesión 13 · Crear, listar y filtrar biblioteca

- **Modalidad:** presencial
- **Duración del taller:** 60 minutos
- **Puntaje base:** 100 puntos
- **Puntaje extra máximo:** 10 puntos
- **Puntaje bruto máximo:** 110 puntos
- **Nota máxima registrada:** 100 puntos

## Resultado que debes demostrar

Completarás el recorrido autenticado desde la creación de una película o serie hasta su representación en una biblioteca privada filtrada por tipo. La aplicación mantendrá coherencia mediante invalidación y retirará la caché Media al cerrar sesión.

## Punto de partida

Comienza desde el trabajo previo al descanso o desde el checkpoint docente de rescate:

- optional auth y `authScope` funcionan;
- la mutación crea desde catálogo e invalida búsqueda y detalle;
- `getMediaLibrary`, `mediaKeys.lists()` y `useMediaLibrary(body)` consultan la lista privada;
- `ListMediaLogsBody` está definido por completo y `toLibraryListBody` traduce `all`, `movie` y `series` sin una constante base;
- crear invalida también listas;
- logout elimina `mediaKeys.all` después de `signOut`;
- la página todavía contiene una salida diagnóstica;
- no existen modelo visual, componentes finales, control de filtro o tests del taller.

## Trabajo obligatorio

1. Extraer labels de status y prioridad cuando aparece el segundo consumidor.
2. Crear un modelo visual con `logId`.
3. Adaptar cada DTO sin mutarlo y sin ordenar.
4. Construir componentes de fila y lista con key estable.
5. Representar carga y error con `PageState`, vacío con `EmptyState` y éxito con la lista.
6. Conectar un filtro local con Todos, Películas y Series y validar el value del control con `libraryTypeFilterSchema.safeParse`.
7. Enviar el body correspondiente y usarlo en la query key.
8. Mantener el filtrado y el orden en el backend.
9. Comprobar invalidación después de crear y eliminación después de logout.
10. Definir la matriz humana y usar el agente solo para redactar el test del adapter.
11. Leer el test, revisar el diff y volver a ejecutarlo.
12. Ejecutar el recorrido manual y `pnpm build`.

## Restricciones

- No uses `.filter()` o `.sort()` sobre la respuesta de biblioteca.
- No copies DTOs o modelos a otro `useState`, Zustand o storage.
- No uses Effects para requests, filtro, invalidación o cierre.
- No uses search params o persistencia en URL.
- No envíes `mediaType.values: []` para Todos.
- No incluyas anime.
- No uses `queryClient.clear()`.
- No limpies caché antes de que `signOut` termine correctamente.
- No navegues todavía a `/app/library/:logId`.
- No añadas React Testing Library, jsdom, MSW o dependencias.
- Todo `.test.*`, `.spec.*` y soporte exclusivo de pruebas debe vivir dentro de `__tests__/`.
- El agente no puede cambiar producción durante la petición limitada a tests.

## Casos de aceptación

El docente comprobará:

1. Crear produce un único POST autenticado y bloquea doble submit.
2. El error mantiene formulario y values; el éxito espera invalidaciones.
3. Búsqueda, detalle y listas se invalidan después de crear.
4. La biblioteca usa una key con body y scope.
5. La página distingue cuatro estados: carga/error usan `PageState`, vacío usa `EmptyState` y éxito conserva la lista.
6. El adapter produce `logId`, labels y fecha sin mutar ni ordenar.
7. Todos, Películas y Series producen los bodies acordados y un value ajeno al schema no actualiza el estado.
8. Ninguna variante permite anime.
9. Logout elimina `mediaKeys.all` después del cierre exitoso.
10. El test dirigido y el build terminan con código 0.
11. La persona explica los límites de cada evidencia.

## Evidencia requerida

Entrega:

- código del checkpoint;
- salida completa del test dirigido;
- salida completa de `pnpm build`;
- matriz manual con resultados observados;
- captura de Query Devtools con una key de lista;
- grabación breve de crear, listar, filtrar y cerrar sesión;
- diff del test si se utilizó un agente;
- explicación de `authScope`, invalidación y eliminación.

El test cubre el adapter puro. El build cubre tipado y empaquetado. Network, Devtools y el recorrido manual cubren el entorno observado; ninguna de esas comprobaciones prueba por sí sola todos los demás entornos.

## Actividades opcionales

- Mostrar un contador derivado del arreglo visible.
- Mostrar un indicador discreto de `isFetching` mientras permanecen visibles los datos anteriores.

Estas mejoras no reemplazan requisitos base ni autorizan nuevos filtros, dependencias o fuentes de estado.

## Tabla única de evaluación

| Tipo | Criterio o actividad | Qué se evalúa | Escala de asignación | Máximo | Obtenido |
| --- | --- | --- | --- | ---: | ---: |
| Base | Creación autenticada y ciclo de mutación | El formulario entrega el body validado a `mutate`; el POST usa Bearer; `isPending` bloquea doble submit; `401`, `404`, `409` y error general tienen feedback; el error conserva values y el éxito cierra después de esperar invalidaciones. | Completo: 20 · Parcial: 10 si crea pero duplica pending, cierra antes de coherencia o no representa algún error acordado · No demostrado: 0 si solo prepara un body local, permite requests duplicados o presenta error como éxito | 20 | ___ |
| Base | Lista privada, estados e identidad visual | La key contiene body y `authScope`; el request privado devuelve DTOs; `PageState` representa carga/error con retry y `EmptyState` la colección vacía; el adapter produce `logId`, labels y fecha; la lista usa key estable y conserva el orden remoto. | Completo: 25 · Parcial: 13 si la lista principal funciona pero falta un estado, el retry, parte del modelo, la identidad estable o la prueba del orden · No demostrado: 0 si no existe una lista privada reproducible o se copia/ordena la respuesta fuera de Query | 25 | ___ |
| Base | Filtro por tipo y contrato remoto | `libraryTypeFilterSchema` origina `LibraryTypeFilter`; el handler valida con `safeParse`; el adapter crea un body completo y estructuras independientes; Todos envía movie y series; las opciones concretas envían un solo tipo; body y scope forman la key; no hay anime, URL, Effect ni filtro local de la respuesta. | Completo: 20 · Parcial: 10 si dos variantes funcionan pero falta validar el control, una amplía el dominio, omite un filtro requerido, reutiliza estructuras mutables, omite el body en la key o duplica estado · No demostrado: 0 si el filtro solo cambia la interfaz, usa un cast sobre el value o depende de `.filter()` | 20 | ___ |
| Base | Consistencia y cierre de sesión | Crear invalida `searches()`, `details()` y `lists()` mediante promesas esperadas; logout espera `signOut`, elimina `mediaKeys.all` y conserva caché si falla; no usa `clear()` ni logout automático por `401`. | Completo: 20 · Parcial: 10 si el flujo principal funciona pero falta una familia, la espera o el orden seguro del logout · No demostrado: 0 si la biblioteca permanece stale después de crear o datos de una sesión quedan reutilizables después de salir | 20 | ___ |
| Base | Tests, evidencia y explicación | La persona define los casos; test y soporte viven dentro de `__tests__/`; se lee el diff; test dirigido y build salen con 0; el recorrido manual queda registrado; la persona distingue lo demostrado por test, build, Network y Devtools. | Completo: 15 · Parcial: 8 si existe evidencia funcional pero falta una salida completa, un caso, la revisión del agente o un límite de evidencia · No demostrado: 0 si no se ejecutan las comprobaciones, el test queda fuera de `__tests__/` o se afirma evidencia inexistente | 15 | ___ |
| Total | Total base | Suma de los cinco criterios obligatorios. | Suma de filas base | 100 | ___ |
| Extra | Contador derivado | Muestra la cantidad de elementos de `libraryQuery.data` o de los modelos derivados sin crear estado sincronizado. | Cumple todas las condiciones: +5 · No cumple o reemplaza un requisito base: 0 | +5 | ___ |
| Extra | Indicador de actualización | Cuando ya existen datos, muestra un indicador discreto durante `isFetching` sin ocultar la lista, duplicar pending o añadir otra query. | Cumple todas las condiciones: +5 · No cumple o reemplaza un requisito base: 0 | +5 | ___ |
| Total | Total extra | Suma de actividades opcionales válidas. | Máximo adicional permitido | +10 | ___ |
| Total | Puntaje bruto | Total base más total extra. | Máximo antes del límite institucional | 110 | ___ |
| Registro | Nota en plataforma | Puntaje bruto limitado al máximo institucional. | `min(puntaje bruto, 100)` | 100 | ___ |

## Entrega

Sube los archivos o el enlace solicitado por el docente junto con la matriz y las salidas completas. Si un caso queda pendiente, registra la acción, el resultado observado y la causa identificada.
