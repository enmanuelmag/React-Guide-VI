# Encargo de implementación · backend docente de MediaLog Bootcamp

## Objetivo final

Preparar en `medialog-server` una versión paralela para React Guide VI, identificada como `bootcamp`, que el docente pueda entregar como una URL funcional antes de la cohorte. La aplicación estudiantil, ubicada en `../MediaLog-Bootcamp`, debe poder buscar películas y series, consultar el catálogo, autenticarse con el proyecto Firebase de cada estudiante y administrar una biblioteca personal con status, prioridad y notas. Los estudiantes desarrollan solamente el frontend.

La versión docente usa la base de desarrollo prevista para este entorno, sin conectarse a producción. Expone solo health, la comprobación de autenticación y las operaciones Media enumeradas aquí. No registra rutas, integraciones, schedulers, pollers ni servicios de las demás capacidades de Medialog. La preparación de la rama, la configuración del entorno y la publicación de la URL son trabajo previo del docente o del agente encargado del servidor; no forman parte de una clase.

Este documento es la especificación de trabajo para otro agente. Define el resultado exigido por el curso; **no afirma que la versión `bootcamp` ya exista ni que el servidor actual cumpla el contrato**. Antes de editar el servidor, el agente debe comprobar su estado efectivo y registrar qué partes ya funcionan, cuáles requieren adaptación y cuáles faltan.

## Fuentes y prioridad

1. [Regla de arquitectura del curso](rules/course-architecture.md): producto, frontera del backend, identidad, autenticación y alcance.
2. [Tarea del backend docente](TASKS.md): versión paralela, base de desarrollo, `projectId + uid`, CORS y superficie mínima.
3. Contratos de las sesiones [07](course/07-http-dtos-agentes-y-primer-test/session-draft.md), [11](course/11-formularios-zod-y-modal-global/teacher-guide.md), [12](course/12-firebase-auth-y-rutas-privadas/teacher-guide.md), [13](course/13-taller-crear-listar-y-filtrar-biblioteca/teacher-guide.md), [14](course/14-detalle-privado-e-identidades/teacher-guide.md), [15](course/15-edicion-y-reutilizacion/teacher-guide.md) y [16](course/16-eliminacion-y-regresion-crud/teacher-guide.md).

Si el contrato del servidor difiere de una guía aprobada, el agente debe identificar la diferencia y resolverla en la versión docente sin cambiar silenciosamente el comportamiento esperado por la app. Una corrección del contrato del curso requiere una decisión separada.

## Alcance de la API docente

| Operación | Método y ruta | Acceso | Resultado que consume la app |
| --- | --- | --- | --- |
| Salud | Endpoint health existente o equivalente que se documente | Público | Permite comprobar disponibilidad de esta versión. |
| Comprobación de sesión | `GET /api/v2/auth/check` | Bearer obligatorio | Sin token: `401`. Con token permitido: `200` y `authenticated: true`. |
| Búsqueda | `POST /api/v2/media/search` | Anónimo o Bearer opcional | Arreglo de resultados; `isLogged` refleja la biblioteca de la identidad autenticada cuando existe. |
| Detalle de catálogo | `GET /api/v2/media/detail?externalId=<id>&mediaType=<movie\|series>` | Anónimo o Bearer opcional | Raíz `catalog`, `entry`, `isLogged`; la entrada personal puede ser `null`. |
| Crear entrada | `POST /api/v2/media/create` | Bearer obligatorio | `201` y al menos `id` del nuevo registro; errores observables `401`, `404` y `409`. |
| Listar biblioteca | `POST /api/v2/media/list` | Bearer obligatorio | Arreglo filtrado y ordenado por el servidor. |
| Detalle de entrada | `GET /api/v2/media/detail?logId=<id>` | Bearer obligatorio | Misma raíz `catalog`, `entry`, `isLogged`; `catalog` puede ser `null`. |
| Editar entrada | `PUT /api/v2/media/:logId` | Bearer obligatorio | Actualiza status, prioridad y notas; respuesta con al menos `id`. |
| Eliminar entrada | `DELETE /api/v2/media/:logId` | Bearer obligatorio | Sin body; responde `{ "message": "entry deleted" }`. |

La búsqueda recibe JSON `{ "query": "Dune", "mediaType": "movie" }`; `query` tiene al menos dos caracteres. `mediaType` en la app del curso admite `movie` y `series`. La búsqueda devuelve para cada resultado, como mínimo, `externalId: string`, `title: string`, `releaseYear: number`, `coverUrl: string | null`, `mediaType` e `isLogged: boolean`.

El detalle público conserva los campos de catálogo que usa la app: identidad externa, tipo, título, descripción, portada, año/mes/día de lanzamiento, duración, temporadas, episodios, géneros y puntuación, con la nulabilidad documentada en la sesión 07. La raíz admite `catalog: null` y `entry: null` según el selector. El registro personal incluye como mínimo `id`, `title`, `status`, `priority` y `notes`. El detalle por `logId` debe resolver solo un registro del propietario autenticado; un id ajeno o inexistente no debe revelar datos.

La creación recibe exactamente la intención del frontend:

```json
{
  "source": "catalog",
  "mediaType": "movie",
  "externalId": "438631",
  "status": "pending",
  "priority": "medium",
  "notes": null
}
```

El servidor obtiene la identidad del Bearer, no de un `userId` enviado por el cliente. Los values de status son `pending`, `acquired`, `watching`, `seen`, `dropped` y `paused`; los de prioridad son `low`, `medium` y `high`. La interfaz no crea entradas manuales ni envía metadatos del catálogo en este flujo. Debe mantenerse `409` para un catálogo ya registrado por la misma identidad y `404` cuando el catálogo solicitado no exista.

La lista recibe `viewLogType: "list"` y un objeto `filters` completo: `query`, `status`, `priority`, `mediaType`, `releaseDateRange`, `genres` y `tags`. Los filtros por values usan `{ "values": [...], "matchMode": "OR" }` en el caso del curso. Los filtros no usados llegan vacíos o `null`. El filtro `mediaType.values` siempre es `["movie", "series"]`, `["movie"]` o `["series"]`; un arreglo vacío ampliaría la consulta a anime. La respuesta debe aplicar el filtro en servidor, conservar `id`, `mediaType`, `title`, la fecha de lanzamiento separada y `status`/`priority`, y entregar el orden ascendente por fecha de lanzamiento asociado a `viewLogType: "list"`. La app no filtra ni ordena después de recibirla.

La edición recibe JSON solo con `status`, `priority` y `notes`. `notes` puede ser `null`; el cliente envía `null` al guardar texto vacío. El curso no edita título, fechas ni metadata del catálogo. La eliminación usa el `logId` personal, sin body; una entrada ajena, inexistente o ya eliminada responde `404` sin revelar su propietario. Tras crear o eliminar, la búsqueda y el detalle autenticados deben reflejar el nuevo `isLogged` al volver a consultarse.

## Cambios requeridos en `medialog-server`

### 1. Perfil de ejecución reducido

- Crear o adaptar la configuración de la versión `bootcamp` sin modificar el comportamiento de la versión principal. La rama o despliegue docente debe registrar únicamente las rutas indicadas arriba y las dependencias indispensables para operarlas.
- Usar la base de desarrollo prevista para esta versión. Documentar las variables requeridas, la migración necesaria y el comando de arranque sin publicar credenciales.
- Evitar el arranque de jobs, pollers, tareas programadas, integraciones de proveedores y servicios ajenos al flujo de búsqueda, detalle y biblioteca. Verificar en el arranque real que no se activan.
- Conservar las implementaciones y contratos Media V2 existentes cuando ya satisfagan este encargo. Añadir adaptaciones específicas de `bootcamp` donde la versión principal necesite mantener otra configuración.

### 2. Firebase multi-proyecto e identidad

- Aceptar únicamente Firebase ID tokens de proyectos de la cohorte incluidos en una allowlist configurada en servidor. La cuenta de servicio local no debe limitar por sí sola el `projectId` del token aceptado.
- Identificar primero el proyecto declarado y permitido; luego verificar firma, emisor, audiencia, vigencia y demás claims necesarios con el proyecto correcto. La presencia de un header Bearer o un `uid` declarado por el cliente no basta.
- Definir la identidad persistida y consultada como el par `projectId + uid`. Dos proyectos pueden producir el mismo `uid`; sus bibliotecas deben permanecer separadas. Dos usuarios de un mismo proyecto también deben permanecer separados.
- Aplicar ese alcance a create, list, detail por `logId`, update, delete y al enriquecimiento `isLogged` de search/detail. No aceptar `userId` o `projectId` como sustitutos del token en el body o en headers adicionales.
- Mantener búsqueda y detalle de catálogo accesibles sin token. Si se presenta un Bearer inválido o de un proyecto no permitido, rechazarlo; no convertirlo en una sesión anónima silenciosamente.

### 3. CORS y acceso desde navegadores estudiantiles

- Autorizar solo los orígenes exactos previstos para desarrollo local y para cada aplicación publicada `https://<proyecto>.pages.dev`, mediante configuración explícita; no usar `*`.
- Admitir el preflight para `Authorization` y `Content-Type` y los métodos `GET`, `POST`, `PUT` y `DELETE` que usa la app.
- Probar CORS desde al menos un origen permitido y uno no permitido, tanto en petición anónima como en una privada con Bearer.

### 4. Contrato HTTP y documentación del servidor

- Ajustar rutas, schemas, casos de uso, persistencia y respuestas solo donde el comportamiento actual no coincida con la tabla anterior. La separación entre identidad pública (`mediaType + externalId`) y personal (`logId`) debe ser inequívoca.
- Documentar en OpenAPI o en el mecanismo canónico del servidor los request/response y errores que se hayan cambiado. Regenerar clientes derivados únicamente cuando ese sea el flujo existente del repositorio.
- Publicar una guía breve de configuración y operación de la versión `bootcamp`: variables sin valores secretos, allowlist, CORS, base de desarrollo, arranque, health y verificación de los endpoints. Indicar expresamente qué servicios quedan fuera de este perfil.

## Criterios de aceptación para el agente implementador

1. Antes de editar, seguir `AGENTS.md` de `medialog-server`, consultar su Harness y ejecutar `bash health.sh`. Registrar línea base y diferencias entre el servidor actual y este contrato. Si su Harness no está disponible, detener los cambios en ese repositorio y reportar el bloqueo.
2. La versión `bootcamp` arranca contra una base de desarrollo preparada, responde health y muestra en su inventario de rutas solo la superficie docente permitida. No hay jobs ni pollers activos.
3. `auth/check` devuelve `401` sin credencial y `200` con un token válido de cada proyecto autorizado. Tokens vencidos, alterados, de proyecto no permitido o con claims incorrectos son rechazados.
4. Una identidad `projectId + uid` crea, lista, consulta, edita y elimina solo sus entradas. Repetir la prueba con el mismo `uid` en dos proyectos y con dos usuarios del mismo proyecto; no debe cruzarse ningún dato ni `isLogged`.
5. Búsqueda y detalle de catálogo funcionan sin sesión y con sesión válida. Los resultados autenticados cambian `isLogged` después de create/delete; los anónimos no muestran datos personales.
6. La creación desde catálogo conserva `201`, `401`, `404` y `409` en los casos documentados. El detalle personal acepta `catalog: null`; un `logId` ajeno o inexistente no revela datos. PUT conserva las notas nullable y DELETE responde el mensaje acordado.
7. Las tres variantes de `mediaType.values` devuelven solo películas/series y mantienen el orden de lanzamiento del servidor. El caso `["movie", "series"]` nunca incluye anime.
8. El preflight y las peticiones reales pasan desde orígenes permitidos; un origen no permitido no recibe acceso CORS. Los métodos y headers requeridos por el frontend están cubiertos.
9. Las pruebas focalizadas, las pruebas de integración pertinentes, el contrato OpenAPI si cambió y `bash health.sh` pasan. Registrar por separado cualquier comprobación que requiera navegador, despliegue o token real y no se haya ejecutado.
10. Entregar un resumen de archivos cambiados, decisiones de compatibilidad, comandos usados, resultados y URL/forma de ejecutar la versión docente. No afirmar disponibilidad para la cohorte hasta validar el entorno accesible por estudiantes.

## Límites del encargo

- No ampliar el frontend del curso a anime, entradas manuales, linking, calendario, ofertas, listas dinámicas, OAuth, MCP u otras capacidades del producto principal.
- No usar credenciales de producción, datos de producción ni despliegues productivos para validar la versión docente.
- No cambiar las guías aprobadas o el proyecto estudiantil para acomodar una diferencia del servidor sin una decisión explícita sobre el contrato del curso.
- No crear commits, ramas, tags o publicaciones desde este documento. El agente que ejecute el encargo debe seguir las autorizaciones e instrucciones del repositorio del servidor.
