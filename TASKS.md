# Tasks

Roadmap detallado: [ROADMAP.md](ROADMAP.md).

## Active

- [ ] **Crear las presentaciones HTML → PDF de las 18 sesiones** - Diseñar el framework visual aprobado y producir las diapositivas de cada clase en HTML antes de exportarlas y verificar el PDF.
  - Catálogo, geometrías, estructura de trabajo y stack Reveal.js + Tailwind compilado + Vite aprobados.
  - Dirección visual Laboratorio claro aprobada: fondo claro, azul ESPOL, tipografía Sora + IBM Plex Sans + JetBrains Mono, grilla FHD y código híbrido.
  - Plan de implementación, runtime y galería mínima aprobados; el runtime compartido vive en `presentation-framework/approved/`.
  - La galería fue aprobada visualmente después de corregir el recorte de código; genera 10 PNG FHD y un PDF de 10 páginas, conserva notas privadas en Presenter View y pasa la auditoría automática sin incidencias.
  - La presentación de la sesión 01 fue aprobada como piloto operativo: 10 slides, 10 notas docentes y assets oficiales locales; su fuente definitiva vive junto a la sesión.
  - Los artefactos se regeneran bajo demanda con `pnpm session-01:generate`; no es necesario conservar PNG y PDF durante cada iteración.
  - La presentación HTML de la sesión 02 fue aprobada: 14 slides, 14 notas docentes y assets oficiales locales; incorporó contratos de props explícitos, vocabulario visible, contexto de archivos y diagramas direccionales a partir de la revisión del usuario.
  - La presentación HTML de la sesión 03 fue aprobada: 17 slides, 17 notas docentes, assets oficiales locales y auditoría sin incidencias; cubre la jornada presencial, el taller sin solución y el cierre.
  - La presentación HTML de la sesión 04 fue aprobada: 15 slides, 15 notas docentes, assets locales, ejemplos explícitos para principiantes y auditoría FHD sin incidencias después de corregir el último recorte visual.
  - La presentación HTML de la sesión 05 fue aprobada: 15 slides, 15 notas docentes, assets locales y auditoría FHD sin incidencias.
  - Las presentaciones HTML de las sesiones 06, 07 y 08 también fueron aprobadas: cada una tiene 25 slides, conserva 25 notas docentes y pasa la auditoría FHD sin incidencias. La sesión 08 explicita el origen de los campos devueltos por `useQuery`.
  - La presentación HTML de la sesión 09 fue aprobada: 24 slides, 24 notas docentes, logo oficial local, auditoría FHD sin incidencias y PDF de 24 páginas verificado.
  - La presentación HTML de la sesión 10 está aprobada: 24 slides y 24 notas tras retirar las antiguas 20 y 21 por petición del usuario el 22 de octubre de 2026. Conserva barra persistente URL → título y ejemplo nullable sin identidad artificial. La versión anterior tenía 26 slides.
  - Las presentaciones 01 a 11 quedan aprobadas como línea base. La sesión 11 contiene 28 slides y notas docentes, HTML y PDF; el usuario aprobó continuar con su código y guía el 8 de octubre de 2026. [Plan y alcance](presentation-framework/draft/session-11-presentation-plan.md).
  - Sesión 12 aprobada: 28 slides, 28 notas privadas, HTML y PDF. [Presentación](course/12-firebase-auth-y-rutas-privadas/presentation/README.md). Código y guía docente se alinearon después de esa aprobación; la guía detallada queda disponible para revisión del usuario.
  - Se conserva presentación continua → coding → práctica → cierre oral.
  - Sesión 08: [Animación 02 · El mostrador de consultas](course/08-tanstack-query-y-busqueda-remota/02-animacion-mostrador-cache/README.md), aprobada el 15 de octubre de 2026. Analogía sin código, 23 pasos y 3 opcionales. Por indicación del usuario no se añade al teacher guide; tampoco cambia la presentación aprobada.
  - Basar el contenido en el guion de presentación de cada guía definitiva.
  - Mantener un sistema visual, estructura y vocabulario consistentes durante todo el curso.
- [ ] **Crear el proyecto progresivo de referencia del curso** - Implementar la aplicación de Medialog reducida y organizar checkpoints o ramas progresivas para facilitar el acceso de los estudiantes y la consulta de implementaciones.
  - Plan activo: [MediaLog-Bootcamp y ruta docente continua](progressive-project-plan.md).
  - Sesión 01 implementada: repositorio hermano `../MediaLog-Bootcamp`, cuatro etapas ejecutables con instalación, build y lint verificados; guía docente con bloques recuperables y pantalla final observada en navegador.
  - Sesión 02 implementada: entrada idéntica a `session-01-end`, cuatro etapas intermedias y `session-02-end`; props, fixture tipado, lista, fallbacks y sexta entrada. Guía con bloques S02-B01–B08 y presentación continua antes del coding.
  - Sesión 03 implementada: seed con CSS preparado, MediaGrid antes del descanso, rama `session-03-workshop-start` sin solución, vacío y badge hasta `session-03-end`. Guía autosuficiente con bloques S03-B01–B11.
  - Sesión 04 implementada: entrada idéntica a `session-03-end`, input controlado, búsqueda derivada, SearchInput y distinción de vacíos hasta `session-04-end`. Guía completa S04-B01–B08 con registro del ritmo de aula.
  - Sesión 05 implementada: entrada idéntica a `session-04-end`, control definido, segundo estado conectado, predicado combinado y vacíos hasta `session-05-end` con contador y limpieza. Guía completa S05-B01–B09, siempre después de slides.
  - Sesión 06 implementada: soporte desde 05-end, Mantine, selección comprobable y modal temporal; taller sin callbacks resueltos, contratos conectados y tarjetas hasta `session-06-end`. Guía autosuficiente S06-B01–B15 después de presentación continua.
  - Sesión 07 implementada: contratos HTTP, fetchers duplicados antes del helper genérico, Vitest y Agent Harness Kit materializado hasta `session-07-end`.
  - Sesión 08 implementada: Query Client, keys, búsqueda enviada, adapter visual y cinco estados hasta `session-08-end`.
  - Sesión 09 implementada: Router declarativo, layout, rutas, parámetros validados, enlaces y tests hasta `session-09-end`.
  - Las guías 07–09 presentan primero el deck completo y luego una ruta de coding autosuficiente; sus materiales estudiantiles están sincronizados en el repositorio hermano.
  - Sesión 10 implementada: entrada idéntica a 09-end, siete etapas, `session-10-workshop-start` sin integración resuelta y `session-10-end`. Guía docente con archivos completos por transformación, error/cleanup y extra separado; guía estudiantil, lectura y rúbrica sincronizadas.
  - Sesión 11 implementada: entrada idéntica a 10-end, seis etapas y `session-11-end`; modal compartido, Mantine Form, Zod y body local. Guía docente con 21 archivos completos por transformación, ejemplos temporales y nueve bloques recuperables; materiales públicos sincronizados.
  - Sesión 12 implementada: entrada idéntica a 11-end, siete etapas y `session-12-end`; Firebase, provider, formularios, guardia, HTTP autenticado y logout. Guía docente con 33 archivos completos por transformación, 28 minutos de presentación continua y 44 de coding. Material público sincronizado, guía detallada pendiente de revisión del usuario.
  - Presentación 13 aprobada el 26 de octubre de 2026: 19 slides y 19 notas privadas tras condensarla el 26 de octubre de 2026; conserva portada, evita slides de tránsito y reúne explicación y ejemplo. Conserva Elegir → Guardar → Actualizar → Ver biblioteca → Filtrar → Salir. [Presentación](course/13-taller-crear-listar-y-filtrar-biblioteca/presentation/README.md). Código y guía detallada alineados desde `session-12-end`: ocho pasos, `session-13-workshop-start` sin solución y `session-13-end`; guía disponible para revisión del usuario.
  - Cada checkpoint debe corresponder al resultado observable de una sesión.
  - Preparar proyectos semilla que incluyan el progreso previo y omitan la solución del taller correspondiente.
  - Documentar cómo encontrar, ejecutar y comparar cada etapa con pnpm.
- [ ] **Crear el backend docente reducido** - Preparar una versión paralela de `medialog-server` que use la base de desarrollo y exponga únicamente el contrato requerido por React Guide VI.
  - URL base aprobada: `https://bootcamp-medialog.cardor.dev`. El hostname ya está definido; todavía hay que verificar despliegue, DNS, TLS, CORS y endpoints.
  - Verificar Firebase ID tokens de los proyectos autorizados de la cohorte sin depender del project ID de la cuenta de servicio local.
  - Aislar identidades mediante `projectId + uid`, limitar CORS y mantener solo health, auth check y las operaciones Media usadas por el curso.
  - No registrar endpoints, integraciones, schedulers o servicios ajenos al alcance reducido.

## Waiting On

## Someday

## Done

- [x] **Cerrar y aprobar las 18 guías Markdown definitivas** - Los paquetes textuales de las sesiones 01 a 16 y 18 a 19 fueron revisados, incorporaron las últimas correcciones solicitadas y recibieron aprobación final del usuario el 7 de septiembre de 2026. La fase de guías queda sin pendientes activos; presentaciones y proyectos ejecutables conservan sus frentes propios.
- [x] **Aplicar las correcciones de la revisión de septiembre** - D01–D06 y C01–C08 quedaron resueltas y validadas documentalmente. C08 descartó `z.compile()` del itinerario base por falta de un caso medible; el [plan trazable de correcciones](corrections-plan.md) conserva la decisión y la evidencia.
