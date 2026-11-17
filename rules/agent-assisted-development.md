# Reglas para desarrollo asistido por agentes

## Propósito

El curso usa agentes para reducir trabajo repetitivo sin delegar las decisiones que forman el criterio del estudiante. El objetivo no es producir más código por minuto. El objetivo es aprender a definir una tarea, limitarla, revisar el resultado y demostrar qué funciona.

## Cuándo empieza

Las sesiones 01 a 06 se construyen de forma manual. En ese tramo, escribir componentes, props, callbacks y estado local forma parte del aprendizaje principal.

La rutina asistida comienza en la sesión 07, cuando aparecen contratos HTTP, DTOs, adapters y tests. Desde ese punto, cada guía debe identificar por separado:

- Qué decide y construye el estudiante.
- Qué trabajo repetitivo puede delegar al agente.
- Qué debe leer y explicar después de la delegación.
- Qué comando o comprobación produce evidencia.

Una guía puede excluir al agente de un bloque posterior si la implementación constituye el concepto central de esa sesión.

## Qué se puede delegar

Después de que la clase haya definido el contrato y los nombres, un agente puede ayudar con:

- Types que reflejan campos ya identificados en la respuesta de la API.
- Casos repetitivos de un adapter puro.
- Scaffolding mecánico que siga una estructura mostrada por el docente.
- Tests derivados de comportamientos y criterios de aceptación escritos por una persona.
- Documentación posterior del cambio: archivos, flujo de datos, decisiones y forma de comprobarlo.

El agente no decide por su cuenta:

- Quién es propietario de un estado.
- Si un dato pertenece a React, TanStack Query, Zustand, Firebase o la URL.
- Si un Effect es necesario.
- Qué significa una respuesta de la API.
- Qué familias de caché debe afectar una mutación.
- Qué comportamiento se considera correcto cuando el requisito es ambiguo.

## Rutina obligatoria desde la sesión 07

1. **Definir.** Escribir el objetivo, el alcance, el comportamiento esperado y lo que el agente no debe cambiar.
2. **Explorar.** Pedir que lea la implementación, los types y uno o dos ejemplos cercanos antes de proponer código.
3. **Proponer.** Revisar un plan o matriz de tests breve. Si aparece una expectativa no definida, resolverla antes de editar.
4. **Construir.** Permitir cambios solo dentro del alcance acordado.
5. **Leer.** Pedir un mapa de archivos, flujo de datos, decisiones, supuestos y vocabulario. El estudiante debe abrir el código y contrastar ese resumen.
6. **Comprobar.** Ejecutar el test enfocado y las validaciones pertinentes. Registrar comando, resultado y límite de la evidencia.
7. **Explicar.** El estudiante debe poder describir el comportamiento probado y una cosa que el test no demuestra.

La salida del agente no reemplaza el paso de lectura. Si una persona no puede explicar el cambio, la actividad todavía no está terminada.

## Sección obligatoria dentro de cada guía

Cada sesión que use un agente incluye una sección `Trabajo con agente`. Si la sesión contiene varias delegaciones, las numera en el orden de uso. Cada interacción debe indicar:

1. **Momento y motivo.** Qué parte de la secuencia ocupa y por qué se delega.
2. **Decisiones humanas previas.** Contrato, nombres y comportamientos que el grupo debe cerrar antes de invocar al agente.
3. **Prompt listo para copiar.** Texto completo con contexto, objetivo, archivos permitidos, restricciones y resultado esperado. No deja placeholders para que el docente reconstruya el alcance durante la clase.
4. **Salida esperada y condición de parada.** Archivos que pueden cambiar y situaciones en las que el agente debe detenerse y preguntar.
5. **Lectura posterior.** Archivos, flujo y decisiones que el estudiante debe explicar con sus palabras.
6. **Evidencia.** Comandos y comprobaciones manuales que deben ejecutarse.
7. **Frontera.** Qué no prueba la evidencia y qué trabajo continúa bajo responsabilidad humana.

Un prompt de implementación contiene, en este orden:

- Punto de entrada verificable.
- Objetivo único.
- Fuente del contrato o comportamiento esperado.
- Lista cerrada de archivos permitidos.
- Cambios prohibidos.
- Criterios observables.
- Comandos que debe ejecutar el agente.
- Formato de lectura posterior: archivos, flujo, decisiones, supuestos y límites.

Cuando la skill adecuada ya existe, el prompt la nombra y evita repetir instrucciones internas de la skill. Aun así, conserva el objetivo, la fuente humana del comportamiento, las rutas permitidas, las prohibiciones específicas del ejercicio y la comprobación enfocada. Cuando una skill todavía no existe, la guía incluye el contrato completo y señala esa condición.

La guía también debe indicar qué hacer si el agente tarda o falla. El checkpoint docente puede aportar los archivos mecánicos ya resueltos, pero no puede entregar la decisión conceptual que el estudiante debía tomar antes de delegar.

## Tests generados con agentes

El comportamiento esperado siempre lo define una persona a partir del objetivo, el contrato de la API o un criterio de aceptación. El agente puede redactar el archivo de tests después de recibir esa información.

Los tests deben:

- Verificar entradas, salidas, efectos observables o errores públicos.
- Mantener un comportamiento principal por caso.
- Usar nombres que describan el resultado esperado.
- Seguir las convenciones y el runner existentes en el proyecto.
- Preferir implementaciones reales cuando sean rápidas y deterministas.
- Evitar snapshots y mocks por defecto; usarlos solo cuando exista una razón explícita.
- Ejecutarse antes de presentarse como evidencia.

Todo archivo de prueba y todo fixture, builder, factory, mock, stub, snapshot o helper creado exclusivamente para esas pruebas debe quedar dentro del `__tests__/` del área que verifica. El prompt del agente enumera esas rutas completas y le prohíbe crear `.test.*` o soporte de pruebas fuera de `__tests__/`. Los fixtures de producto usados por la aplicación o por una demostración permanecen en su carpeta de producción.

El agente no puede debilitar, eliminar, omitir o reescribir una expectativa solo para obtener verde. Tampoco modifica código de producción durante una petición limitada a tests, salvo autorización explícita.

Un test no demuestra por sí solo que TypeScript compila, que el build termina, que una petición real funciona, que Firebase autoriza, que la interfaz es accesible o que el despliegue está disponible. Cada guía debe nombrar la frontera de prueba.

## Agent Harness Kit

Las consignas de proyecto de `Projects/` fijan AHK 3.0.0 por decisión aprobada el 19 de octubre de 2026; consulta [project-deliverables.md](project-deliverables.md). Esa excepción se limita a los entregables del proyecto y no migra las sesiones descritas a continuación. Actualizar el CLI global cambia el ejecutable disponible también en otras carpetas: comprueba su versión antes de retomar una sesión y no regeneres un harness previo automáticamente.

La sesión 07 fija `@cardor/agent-harness-kit@2.11.0` y explica cuatro ideas antes del primer uso:

- Un harness delimita roles, memoria, herramientas y evidencia.
- Una skill conserva una rutina reutilizable; no es una garantía de calidad.
- El agente trabaja dentro de un repositorio y de unas restricciones que la persona debe conocer.
- `health.sh` solo prueba las comprobaciones que realmente ejecuta y el archivo inicial debe personalizarse antes de usar `ahk health` como evidencia.

El CLI se instala fuera del proyecto con la excepción global aprobada:

```bash
npm install --global @cardor/agent-harness-kit@2.11.0
command -v ahk
ahk --version
```

En PowerShell se usa `Get-Command ahk` en lugar de `command -v ahk`. La guía no usa `sudo`: ante un binario ausente, identifica el Node activo, consulta `npm prefix -g`, vuelve a abrir la terminal si corresponde y corrige PATH antes de continuar. El mínimo de Node de la cohorte sigue siendo `>=22.22.0`.

La instalación global proporciona el comando; `ahk init` crea el harness local en la raíz del proyecto. La clase revisa la configuración, instrucciones y skills materializadas para el provider, configura `health.sh`, y ejecuta `ahk doctor` y `ahk health`. No añade el paquete al `package.json` ni al lockfile del frontend.

La versión `2.11.0` materializa `ahk-test`. Esta skill solo modifica archivos de tests, no crea tareas del harness y no corrige producción. La persona sigue definiendo la matriz; el prompt conserva objetivo, rutas y comando enfocado; después lee el archivo y ejecuta la evidencia. `ahk health` complementa la prueba enfocada y no la reemplaza.

### Context7 MCP y AutoSkills

La misma introducción presenta tres herramientas con responsabilidades distintas:

- **Agent Harness Kit** organiza roles, tareas, límites, memoria y evidencia dentro del repositorio.
- **Context7 MCP** recupera documentación actual y específica de una librería antes de diseñar o generar código que dependa de ella.
- **AutoSkills** inspecciona el stack del proyecto y propone skills cuando el contexto del agente no contiene una adecuada.

No presentes Context7 como una skill ni AutoSkills como sustituto de la documentación. Una skill conserva instrucciones de trabajo; Context7 aporta documentación; el harness controla el proceso y registra evidencia.

La rutina docente sigue este orden:

1. Definir qué librería, versión y concepto necesita documentación.
2. Consultar Context7 y leer el fragmento recuperado antes de pedir una implementación.
3. Revisar las skills que el agente ya conoce y escoger solo las que correspondan al objetivo.
4. Si no existe una skill pertinente, previsualizar las propuestas de AutoSkills.
5. Revisar procedencia, alcance y archivos que se instalarían.
6. Instalar únicamente las skills aprobadas y leer su `SKILL.md`.
7. Ejecutar la tarea con la skill pertinente, dentro de los límites y la evidencia de Agent Harness Kit.

El curso usa pnpm y fija `autoskills@0.3.6` como versión verificada durante esta planeación:

```bash
pnpm dlx autoskills@0.3.6 --dry-run
pnpm dlx autoskills@0.3.6
```

`--dry-run` es obligatorio antes de instalar. Después de la instalación, el estudiante revisa las skills materializadas y `skills-lock.json`; no asume que una selección automática es correcta o segura por sí sola. La skill instalada tampoco autoriza cambios fuera del prompt ni demuestra que el código funciona.

La versión verificada de Agent Harness Kit recomienda AutoSkills cuando sus roles no encuentran una skill pertinente y cuando detecta cambios importantes en dependencias. La guía debe verificar de nuevo ese comportamiento antes de la cohorte y no atribuirlo a versiones que todavía no se hayan comprobado.

## Casos concretos del curso

- **Sesión 07:** el estudiante define los campos útiles de los DTOs. El agente puede completar variantes repetitivas y proponer tests de adapters puros.
- **Sesiones 08 a 16:** el agente puede generar tests para adapters, schemas, constructores de body, validadores de parámetros y helpers puros. La integración de Router, Query, Firebase y Network mantiene comprobaciones separadas.
- **Sesión 18:** el agente realiza un audit de solo lectura sobre scripts, lockfile, nombres de variables, configuración Vite y rutas. Puede ejecutar test y build, pero no corrige, no lee values privados, no usa servicios externos y no despliega. El estudiante revisa el informe, ejecuta la publicación y comprueba Cloudflare, Router, Firebase, CORS y API.
- **Sesión 19:** el agente puede actuar como entrevistador de ensayo después de recibir la ficha decidida por el estudiante. Formula cinco preguntas y señala afirmaciones sin respaldo; no accede a archivos, no redacta respuestas, no cambia el producto y no participa durante la evaluación.

## Guion de presentación

La primera presentación que use agentes debe contrastar:

- Prompt abierto frente a tarea limitada.
- Código generado frente a código comprendido.
- Test escrito frente a test ejecutado.
- Check automático frente a comprobación manual.
- Confianza declarada frente a evidencia observable.
- CLI global frente a harness local: el primero expone `ahk`; el segundo materializa reglas y skills dentro del proyecto.

Esa presentación incluye además un recorrido breve de las tres piezas:

```text
Context7: consultar documentación vigente
→ AutoSkills: comprobar si existe una skill pertinente
→ Agent Harness Kit: limitar, ejecutar y registrar la tarea
→ estudiante: leer los cambios y verificar la evidencia
```

Antes de ese recorrido, la presentación muestra `instalar CLI → verificar PATH y versión → ejecutar ahk init → inspeccionar archivos → definir health.sh`. Explica que el harness reduce libertad mediante instrucciones, roles, skills, límites de archivos y checks conocidos. La primera clase no introduce backlog, dashboard, base de datos ni el flujo completo de roles.

El docente muestra `pnpm dlx autoskills@0.3.6 --dry-run` antes de cualquier instalación y explica que AutoSkills solo propone material según señales del repositorio. La diapositiva debe conservar estas preguntas:

- ¿Qué documentación consultamos y para qué versión?
- ¿Qué skill se propone y qué instrucciones agrega?
- ¿Qué archivos puede modificar el agente?
- ¿Qué evidencia comprobará una persona?

Las presentaciones posteriores incluyen una caja breve llamada “Trabajo con agente” con cuatro datos: objetivo, límites, lectura obligatoria y evidencia.

## Fuera de alcance

- Puntuar a un estudiante por cantidad de código generado.
- Delegar una aplicación completa con un solo prompt.
- Introducir múltiples roles, MCP, base de datos del harness y dashboard en una misma explicación inicial.
- Instalar todas las skills sugeridas por AutoSkills sin revisar su alcance y procedencia.
- Tratar la salida de Context7, una skill o el harness como garantía de corrección.
- Obligar a crear un test artificial cuando el comportamiento solo puede verificarse de forma manual con el stack disponible.
