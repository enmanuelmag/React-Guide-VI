# Roadmap de producción · React Guide VI

## Propósito

Este documento reúne el trabajo pendiente para convertir las 18 sesiones ya diseñadas en un curso listo para impartirse. Coordina cinco productos que deben avanzar juntos:

1. guías Markdown definitivas;
2. presentaciones creadas en HTML y exportadas a PDF;
3. proyecto frontend progresivo de referencia;
4. backend docente reducido;
5. materiales, comprobaciones y operación de la cohorte.

`TASKS.md` conserva el resumen de trabajo activo. Este archivo contiene el orden, las dependencias y las condiciones de cierre.

## Regla del contador de sesiones

- El curso contiene 18 sesiones académicas efectivamente dictadas.
- Cada sesión conserva su número y su fecha.
- Una jornada sin horas de React interrumpe el calendario, pero no crea una sesión vacía ni consume el siguiente número.
- Después de una interrupción, el contador continúa en la siguiente clase que sí tenga contenido.
- El sábado 7 de noviembre de 2026 no consume sesión. La sesión 16 ocurre el jueves 5 y la sesión 18 el jueves 12.

## Resultado final esperado

Antes de iniciar la cohorte deben existir:

- 18 paquetes textuales aprobados y sincronizados;
- 18 presentaciones HTML y sus 18 PDF verificados;
- un repositorio frontend ejecutable con progreso acumulativo por sesión;
- seeds de talleres que contengan el progreso anterior, pero no su solución;
- una versión docente reducida de `medialog-server` desplegada contra la base de datos de desarrollo;
- contratos y variables de entorno documentados sin secretos;
- materiales de plataforma, cuestionarios, rúbricas y enlaces preparados;
- un ensayo técnico de los recorridos críticos y un plan de contingencia docente.

## Orden de trabajo y dependencias

```text
arquitectura de 18 sesiones aprobada
→ congelar contratos y guías textuales
→ aprobar framework de presentaciones
→ preparar frontend progresivo y backend docente
→ producir cada sesión como una unidad vertical
→ cargar materiales y ejecutar QA transversal
→ ensayar recorridos críticos
→ publicar el paquete de cohorte
```

La producción visual y el proyecto de referencia pueden avanzar después de que el contenido y el checkpoint de una sesión estén aprobados. No deben adelantarse a una guía que todavía pueda cambiar su alcance.

## Frente 1 · Cerrar las guías textuales

> Estado: completado. Los 18 paquetes textuales recibieron aprobación final del usuario el 7 de septiembre de 2026.

### Objetivo

Convertir los paquetes actuales en material definitivo para impartir, estudiar y evaluar.

### Tareas

- [x] Revisar las sesiones 01 a 16 y 18 a 19 una por una mediante `rules/session-production-workflow.md`.
- [x] Mantener una sola sesión activa por iteración.
- [x] Confirmar en cada sesión el punto de entrada, checkpoint final y frontera con sus vecinas.
- [x] Refinar `session-draft.md`, `pre-class-reading.md`, `teacher-guide.md` y `student-guide.md`.
- [x] Revisar `workshop-rubric.md` solamente en las sesiones 03, 06, 10, 13 y 19.
- [x] Verificar tiempos, enlaces, cuestionario previo, clave docente, comandos y evidencia observable.
- [x] Actualizar la memoria de cada iteración y comprobar `draft/index.md`.
- [x] Aprobar cada paquete antes de marcarlo como definitivo.
- [x] Realizar al final una revisión transversal de vocabulario, versiones, contratos y progresión.

### Restricciones aprobadas

- No añadir puntos de evaluación extra a la sesión 19.
- No convertir análisis de evidencias, diagnóstico de fallos o trazabilidad de deployment en nuevos criterios de calificación.
- No introducir conceptos nuevos después del descanso de una presencial.
- No crear todavía una solución visual o de código para una sesión cuyo contenido no esté cerrado.

### Condición de cierre

Cada sesión tiene un paquete coherente, aprobado y utilizable sin depender de notas privadas fuera del repositorio.

Condición cumplida. Los pendientes de presentación, frontend, backend y operación no reabren la aprobación textual de las guías; se gestionan en sus frentes correspondientes.

## Frente 2 · Framework de presentaciones HTML → PDF

> Estado: catálogo, geometrías, estructura, stack, dirección visual, runtime y galería aprobados. Las presentaciones HTML de las sesiones 01 a 13 están aprobadas. La sesión 12 tiene HTML/PDF de 28 slides; el usuario aprobó avanzar su código y teacher-guide el 8 de octubre de 2026.

### Objetivo

Definir un sistema reutilizable para producir las 18 presentaciones con una identidad consistente y exportarlas a PDF sin reconstruir estilos en cada sesión.

### Investigación y diseño

- [x] Inventariar los HTML de `Obsidian-KnowledgeBase/Contenido/Webinars/Tanstack-start-query-server`.
- [x] Separar contenido reutilizable, patrones visuales y detalles que no pertenecen al curso.
- [ ] Usar esos HTML como semilla para la explicación visual de TanStack Query: presentar primero el ejemplo concreto y después regresar a formalizar los conceptos.
- [x] Definir formato 16:9 FHD, márgenes seguros, tipografía, paleta, escala, grilla y espaciado.
- [x] Definir el catálogo semántico y las geometrías para portada, objetivo, recapitulación, concepto, contraste, diagrama, snippet, pregunta, checkpoint, taller y cierre.
- [x] Definir reglas para densidad de texto, tamaño mínimo de código y división de ejemplos largos.
- [x] Definir cómo se incluyen notas docentes sin exponerlas en el PDF estudiantil.
- [x] Elegir y documentar el mecanismo de render y exportación reproducible.

Especificación aprobada: [catálogo de diapositivas y stack](presentation-framework/approved/slide-catalog-and-stack.md).

Dirección aprobada: [Laboratorio claro](presentation-framework/approved/visual-direction.md).

Plan aprobado: [implementación del runtime, galería mínima y piloto de la sesión 01](presentation-framework/draft/implementation-plan.md).

### Piloto y aprobación

- [x] Implementar el runtime local candidato, la galería mínima y el pipeline reproducible de build, auditoría, PNG y PDF.
- [x] Comprobar y aprobar la galería en navegador, Presenter View, PNG FHD y PDF rasterizado; la corrección final eliminó el recorte interno de snippets y añadió una auditoría específica.
- [x] Construir la presentación candidata de la sesión 01 y usarla como piloto operativo con teoría, código, mockup y diagrama.
- [x] Revisar visualmente y aprobar el piloto 01; promover el runtime y la presentación a sus carpetas canónicas.
- [x] Construir, auditar e iterar la presentación HTML de la sesión 02; aprobar sus 14 slides y 14 notas docentes, dejando el PDF diferido hasta que se requiera el artefacto final.
- [x] Construir, auditar e iterar la presentación HTML presencial de la sesión 03; aprobar sus 17 slides, notas, separador de descanso, taller sin solución y cierre.
- [x] Construir, auditar, corregir y aprobar la presentación HTML de la sesión 04 con 15 slides, 15 notas docentes y PDF diferido bajo demanda.
- [x] Revisar y aprobar la presentación HTML de la sesión 05 con 15 slides, 15 notas docentes y auditoría sin incidencias.
- [x] Construir, revisar y aprobar las presentaciones HTML de las sesiones 06, 07 y 08; cada una conserva 25 slides, 25 notas docentes y auditoría FHD sin incidencias.
- [x] Revisar y aprobar la presentación de la sesión 09 con 24 slides, 24 notas docentes, auditoría FHD sin incidencias y PDF de 24 páginas verificado.
- [x] Revisar y aprobar la presentación de la sesión 10; ahora contiene 24 slides tras retirar las antiguas 20 y 21 por petición del usuario el 22 de octubre de 2026. Conserva barra de recorrido persistente y las demás correcciones aprobadas.
- [x] Comprobar el HTML en navegador y el PDF exportado.
- [x] Revisar legibilidad proyectada, saltos de página, contraste y consistencia del código.
- [x] Corregir el framework y aprobarlo antes de producir en serie.
- [x] Probar una presencial con la sesión 03 y confirmar separadores de descanso, taller y revisión.

### Producción

- [ ] Crear una presentación HTML por sesión a partir de su guion aprobado.
- [ ] Exportar un PDF por sesión.
- [ ] Mantener diagramas, snippets y preguntas sincronizados con las guías.
- [ ] Conservar el HTML como fuente editable y el PDF como artefacto distribuible.
- [ ] Usar autoría híbrida: campos repetibles parametrizados y ajustes manuales cuando el contenido o la revisión visual lo requieran.
- [ ] Registrar el comando exacto de preview, build y exportación.

### Condición de cierre

Las 18 presentaciones pueden reproducirse mediante el mismo proceso y cada PDF fue revisado visualmente, no solo generado.

## Frente 3 · Proyecto frontend progresivo

Plan activo: [MediaLog-Bootcamp y ruta docente por bloques](progressive-project-plan.md). Sesiones 01–13 implementadas en un repositorio hermano; guía detallada 13 disponible para revisión del usuario. La presentación 13 está aprobada; el siguiente contenido corresponde a la sesión 14 cuando lo solicite el usuario. El ritmo se medirá cuando comiencen las clases.

### Objetivo

Construir la versión reducida de Medialog que progresa con el curso y permite recuperar el estado exacto de cada sesión.

### Estructura propuesta

- [x] Crear el proyecto en una carpeta o repositorio independiente del material docente: `../MediaLog-Bootcamp`, package `medialog-bootcamp`.
- [x] Mantener `main` en `session-01-start`, sin aplicación, y reservar la publicación gradual de ramas al docente.
- [ ] Mantener ramas acumulativas `session-01-end` a `session-19-end`; existen los cierres 01–10 con sus etapas. No crear referencias futuras vacías.
- [x] Crear seeds específicos para los talleres 03, 06, 10 y 13 cuando el estado inicial no coincida exactamente con la rama anterior. Los seeds 03, 06, 10 y 13 omiten sus integraciones evaluadas; 13 termina antes del modelo visual, filas, estados finales, control y test del taller.
- [ ] No crear una solución nueva para la sesión 19: esa rama representa el release presentado.
- [ ] Documentar de qué rama parte cada sesión y cuál contiene su checkpoint final.

### Base técnica

- [ ] Crear el scaffold con pnpm, Vite, React y TypeScript en las versiones aprobadas.
- [ ] Fijar scripts comunes de desarrollo, test, build, lint y comprobación.
- [ ] Crear `.env.example` sin secretos.
- [ ] Establecer convenciones de archivos, componentes, tests y fixtures.
- [ ] Preparar una ruta de instalación limpia desde un clon nuevo.
- [ ] Mantener un solo lockfile.

### Progreso por sesión

- [ ] Implementar cada checkpoint solamente después de aprobar su guía.
- [ ] Confirmar que la rama incluya todo el progreso anterior.
- [ ] Confirmar que el seed de una presencial omita la solución del taller.
- [ ] Ejecutar los comandos indicados en las guías desde el estado exacto de la rama.
- [ ] Mantener sincronizados DTOs, adapters, query keys, rutas, formularios y variables de entorno.
- [ ] Añadir tags de release de cohorte solo cuando el usuario lo solicite.

### Documentación para estudiantes y docentes

- [ ] Explicar cómo clonar, instalar, cambiar de rama y ejecutar el proyecto.
- [ ] Incluir una tabla `sesión → rama inicial → rama final` para el curso completo; sesión 01 trazada en el plan y la guía docente.
- [ ] Separar instrucciones estudiantiles de soluciones y contingencias docentes.
- [ ] Preparar un checkpoint alternativo para cada dependencia externa crítica.

### Condición de cierre

Una instalación limpia puede abrir cualquier sesión, ejecutar sus comprobaciones y observar el checkpoint descrito por la guía correspondiente.

## Frente 4 · Backend docente reducido

### Objetivo

Crear una versión paralela de `medialog-server` para el curso. Debe ofrecer únicamente el contrato usado por React Guide VI, aceptar los proyectos Firebase autorizados de la cohorte y usar la base de datos de desarrollo.

### Estrategia de mantenimiento

- [ ] Crear una rama o worktree `bootcamp` a partir del servidor actual cuando el usuario autorice la operación Git.
- [ ] Mantener el código compartido necesario, pero usar un composition root o entrypoint específico del curso.
- [ ] No crear una copia desconectada que obligue a corregir dos implementaciones del dominio.
- [ ] Configurar un deployment docente separado del servidor normal.
- [ ] Apuntar exclusivamente a la base de datos de desarrollo indicada por el usuario.
- [ ] No ejecutar migraciones destructivas ni modificar datos existentes como parte del arranque.

### Autenticación Firebase multiproyecto

- [ ] Definir una allowlist explícita de project IDs Firebase autorizados para la cohorte.
- [ ] Interpretar “token Firebase válido” como un ID token válido emitido por un proyecto incluido en esa allowlist; no aceptar proyectos arbitrarios de Internet.
- [ ] Leer `aud` únicamente como pista para seleccionar el verificador; no confiar en una claim sin verificar.
- [ ] Rechazar el token antes de crear o seleccionar recursos si su proyecto no está permitido.
- [ ] Verificar firma, algoritmo, `kid`, `aud`, `iss`, `sub`, expiración, emisión y tiempo de autenticación mediante Firebase Admin o un verificador equivalente probado.
- [ ] Evitar que la cuenta de servicio local limite la validación a su propio proyecto.
- [ ] No requerir cuentas de servicio ni claves privadas de los estudiantes.
- [ ] Construir la identidad de propiedad con namespace, por ejemplo `firebase:<projectId>:<uid>`, porque un `uid` aislado no es globalmente único entre proyectos.
- [ ] Confirmar cómo convivirá la identidad namespaced con registros previos de la base de desarrollo.
- [ ] No registrar tokens, credenciales ni payloads completos.
- [ ] Definir el proceso docente para añadir y retirar proyectos de la allowlist sin editar código.

### Superficie HTTP mínima

Mantener registrados únicamente:

| Método | Ruta | Uso en el curso |
| --- | --- | --- |
| `GET` | `/health` | Disponibilidad del deployment docente |
| `GET` | `/api/v2/auth/check` | Probe temporal autenticado de la sesión 12 |
| `POST` | `/api/v2/media/search` | Búsqueda remota desde la sesión 07 |
| `GET` | `/api/v2/media/detail` | Detalle público o privado |
| `POST` | `/api/v2/media/create` | Crear una entrada personal |
| `POST` | `/api/v2/media/list` | Listar y filtrar la biblioteca |
| `PUT` | `/api/v2/media/:id` | Editar status, prioridad y notas |
| `DELETE` | `/api/v2/media/:id` | Eliminar una entrada personal |

- [ ] Restringir Media a `movie | series` en el borde HTTP del perfil bootcamp.
- [ ] Conservar autenticación opcional en búsqueda y detalle de catálogo cuando el contrato lo requiera.
- [ ] Exigir autenticación en el probe y en todas las operaciones de biblioteca.
- [ ] Mantener TMDB para búsqueda, detalle y creación desde catálogo.
- [ ] Decidir si OpenAPI permanece disponible solo en desarrollo docente; no publicarlo por accidente.
- [ ] Responder `404` para endpoints retirados porque no deben registrarse, no solo ocultarse de la documentación.

### Capacidades que deben quedar fuera

- [ ] No registrar Media V1 ni las rutas V2 de month, calendar, order, link o tags.
- [ ] No registrar Games, HLTB, Anime/Jikan, Music, Books o Tags.
- [ ] No registrar Dynamic Lists, Account Preferences, Push, Discounts, OAuth o MCP.
- [ ] No construir clientes externos que el perfil bootcamp no consume.
- [ ] No iniciar sync schedulers, catalog pollers, discount jobs ni entregas push.
- [ ] Mantener apagadas las capacidades retiradas desde composición, no depender solamente de flags de entorno.

### CORS y operación de cohorte

- [ ] Permitir únicamente los orígenes locales y `pages.dev` aprobados para la cohorte.
- [ ] Documentar cómo registrar el proyecto Firebase y el origen Cloudflare de cada estudiante.
- [ ] Preparar una cuenta y un origen docente de contingencia.
- [ ] Definir rate limits suficientes para una clase completa sin retirar protección básica.
- [ ] Añadir un chequeo previo de backend, TMDB, base de datos, CORS y allowlist antes de las sesiones dependientes.

### Pruebas mínimas

- [ ] Token correcto de cada proyecto permitido → autenticación aceptada.
- [ ] Token sin firma válida, alterado o vencido → `401`.
- [ ] Token válido de un proyecto no permitido → `401`.
- [ ] Dos proyectos con el mismo `uid` simulado → propietarios distintos.
- [ ] Request sin Bearer a ruta privada → `401`.
- [ ] Búsqueda y detalle público → contrato esperado.
- [ ] Crear, listar, editar y eliminar → aislamiento por identidad.
- [ ] Anime y endpoints retirados → validación o `404`, según corresponda.
- [ ] Schedulers y servicios retirados → no se construyen ni arrancan.
- [ ] CORS permite un origen registrado y rechaza uno ajeno.

### Hitos de disponibilidad

- [ ] Antes de la sesión 07: health, búsqueda y detalle público disponibles.
- [ ] Antes de la sesión 12: allowlist Firebase, identidad namespaced, CORS y `/api/v2/auth/check` disponibles.
- [ ] Antes de la sesión 13: create, list, update y delete disponibles y probados.
- [ ] Antes de la sesión 18: URL docente estable para el frontend desplegado.

### Condición de cierre

El deployment docente sirve solo el contrato del curso, acepta tokens verificados de los proyectos autorizados, aísla correctamente a sus usuarios y no arranca capacidades ajenas.

## Frente 5 · Ciclo vertical por sesión

Después de aprobar el framework y los repositorios, cada sesión se produce en este orden:

1. cerrar el paquete textual;
2. implementar o confirmar su checkpoint frontend;
3. confirmar la dependencia del backend, si existe;
4. crear el HTML de presentación;
5. exportar y revisar el PDF;
6. probar comandos, links, tiempos y recorrido observable;
7. preparar archivos de plataforma;
8. registrar el estado y pasar a la siguiente sesión solo con aprobación.

### Lista de control por sesión

- [ ] Fecha, modalidad y duración correctas.
- [ ] Punto de entrada reproducible.
- [ ] Checkpoint final observable.
- [ ] Guías docente y estudiantil sincronizadas.
- [ ] Lectura previa y cuestionario listos.
- [ ] Rúbrica lista, si corresponde.
- [ ] Rama o seed correcto.
- [ ] Presentación HTML revisada.
- [ ] PDF revisado visualmente.
- [ ] Dependencias externas comprobadas.
- [ ] Material de plataforma preparado.
- [ ] Memoria e índice actualizados.

## Frente 6 · Plataforma y distribución

- [ ] Preparar para cada sesión título, descripción, lectura previa, cuestionario, enlaces y entregables.
- [ ] Mantener separadas las respuestas docentes y el material visible para estudiantes.
- [ ] Definir convención de nombres para HTML, PDF, seeds y recursos descargables.
- [ ] Preparar una tabla maestra con fecha, modalidad, guía, presentación, rama, backend y entrega.
- [ ] Confirmar permisos y visibilidad antes de publicar.
- [ ] Comprobar que ningún `.env`, token, cuenta de servicio o respuesta privada llegue al material distribuido.
- [ ] Preparar instrucciones breves de recuperación para enlaces, PDF o repositorios no disponibles.

## Frente 7 · QA transversal

### Contenido

- [ ] Confirmar que no existan conceptos sin uso o adelantados.
- [ ] Confirmar que las sesiones vecinas continúen desde el checkpoint correcto.
- [ ] Buscar `TODO`, `TBD`, placeholders, soluciones filtradas y actividades duplicadas.
- [ ] Confirmar que la sesión 19 no añade implementación ni calificación extra.

### Código

- [ ] Ejecutar instalación limpia con pnpm.
- [ ] Ejecutar test, lint y build en los checkpoints relevantes.
- [ ] Comprobar las ramas y seeds desde clones limpios.
- [ ] Verificar los contratos contra el backend docente realmente desplegado.
- [ ] Separar en el reporte qué demuestran los checks estáticos, las pruebas HTTP y el navegador.

### Presentaciones

- [ ] Comprobar que HTML y PDF tengan el mismo contenido.
- [ ] Revisar visualmente cada PDF completo.
- [ ] Confirmar legibilidad de snippets, diagramas, tablas y preguntas.
- [ ] Confirmar que no existan desbordes, cortes o páginas vacías.

### Seguridad y configuración

- [ ] Buscar secretos y credenciales antes de distribuir.
- [ ] Verificar CORS y allowlists con orígenes reales.
- [ ] Confirmar aislamiento de datos entre dos identidades de proyectos Firebase distintos.
- [ ] Confirmar que el backend bootcamp use la base de desarrollo y el deployment esperado.

## Frente 8 · Ensayo docente y contingencias

- [ ] Ensayar al menos una sesión virtual completa con sus tiempos.
- [ ] Ensayar una presencial, incluido descanso, taller y revisión.
- [ ] Medir instalación, cambios de rama, build y operaciones remotas.
- [ ] Probar búsqueda, detalle, registro, login y CRUD con el frontend del curso.
- [ ] Probar una URL `pages.dev` con CORS y Firebase reales.
- [ ] Preparar capturas, fixtures o checkpoints alternativos para una caída de Firebase, TMDB, backend o plataforma.
- [ ] Preparar una cuenta docente temporal para incidencias de allowlist.
- [ ] Definir qué partes pueden continuar sin red y cuáles deben reprogramarse.

## Frente 9 · Publicación y operación

- [ ] Congelar las versiones de dependencias usadas por la cohorte.
- [ ] Publicar repositorio, ramas y seeds aprobados.
- [ ] Publicar presentaciones y lecturas según el calendario, no todas de forma accidental.
- [ ] Desplegar y comprobar el backend docente reducido en `https://bootcamp-medialog.cardor.dev`; verificar DNS, TLS, CORS y endpoints antes de la sesión 07.
- [ ] Registrar proyectos Firebase y orígenes Cloudflare de la cohorte.
- [ ] Ejecutar el preflight de cada sesión antes de impartirla.
- [ ] Registrar correcciones descubiertas durante clase sin cambiar silenciosamente checkpoints anteriores.
- [ ] Crear una versión de cierre de cohorte cuando terminen las 18 sesiones.

## Secuencia recomendada inmediata

1. Mantener las presentaciones 01 a 13 como línea base aprobada.
2. Código y ruta docente llegan a `session-13-end`; la [guía detallada 13](course/13-taller-crear-listar-y-filtrar-biblioteca/teacher-guide.md) queda disponible para revisión del usuario.
3. La [presentación 13](course/13-taller-crear-listar-y-filtrar-biblioteca/presentation/README.md) de 19 slides está aprobada. Revisar la guía detallada y medir el ritmo en aula antes de la siguiente iteración; no se inicia 14 automáticamente.
4. Regenerar PNG o PDF solo cuando una versión requiera inspección visual o esté lista para distribuirse.
5. Conservar el repositorio hermano `MediaLog-Bootcamp`, sus checkpoints 01–13 y `main` en el estado inicial.
6. Diseñar en detalle el perfil bootcamp de `medialog-server`, incluida la compatibilidad de identidad con la base de desarrollo.
7. Implementar primero el contrato público requerido por la sesión 07.
8. Implementar y probar autenticación multiproyecto antes de la sesión 12.
9. Producir cada sesión mediante el ciclo vertical y no como tres trabajos desconectados.
10. Ejecutar QA transversal, ensayos y publicación.

## Decisiones que todavía requieren aprobación

- Ubicación y nombre definitivos del repositorio frontend progresivo.
- Convención final de ramas y seeds.
- Forma operativa de mantener la allowlist Firebase de la cohorte.
- Compatibilidad o aislamiento de los registros anteriores de la base de desarrollo frente a la identidad namespaced.
- Plataforma operativa y verificación del despliegue del backend docente. La URL base aprobada es `https://bootcamp-medialog.cardor.dev`.

No se crearán ramas, commits, deployments ni cambios en `medialog-server` hasta que el usuario apruebe la fase correspondiente.
