# Propuesta para Agent Harness Kit · `ahk-test`

> Estado: propuesta histórica implementada. `@cardor/agent-harness-kit@2.11.0` materializa `ahk-test`; disponibilidad verificada el 5 de septiembre de 2026.
>
> Base revisada: `@cardor/agent-harness-kit@2.4.0`, commit `6ec61e66a09f40c77bdb2dc4a4b4b07c228077ea` de `main`, consultado el 29 de agosto de 2026.

Este documento conserva el diseño que precedió a la publicación. Para las instrucciones vigentes del curso, consulta `rules/agent-assisted-development.md` y la sesión 07.

## Resumen

Se propone añadir `ahk-test`, una skill ligera para diseñar, escribir y ejecutar tests a partir de un objetivo o comportamiento explícito.

La skill mantiene una estructura fija:

1. Lee el código y las convenciones existentes.
2. Identifica la fuente del comportamiento esperado.
3. Propone una matriz breve de casos.
4. Detiene la escritura si la expectativa es ambigua.
5. Modifica solo archivos de tests.
6. Ejecuta el test enfocado.
7. Informa qué demostró y qué quedó fuera de la evidencia.

No se propone un comando nuevo. La capacidad se materializa como skill junto con `ahk-ask`, `ahk-consultant`, `ahk-triage` y `ahk-review`.

## Problema que resuelve

Pedir “crea tests para esto” suele producir alguno de estos resultados:

- Casos derivados de la implementación actual, aunque esa implementación esté equivocada.
- Exceso de mocks y assertions sobre detalles internos.
- Tests que compilan en apariencia, pero nunca se ejecutan.
- Cambios de producción introducidos sin permiso para conseguir verde.
- Casos felices genéricos que no reflejan el ticket.
- Una afirmación de cobertura completa sin una frontera de evidencia.

La skill debe convertir una petición abierta en un flujo controlado. La persona conserva el oráculo: decide qué comportamiento es correcto. El agente explora, propone, implementa y verifica dentro de ese contrato.

## Encaje con el kit actual

La versión revisada distribuye cuatro skills ligeras. Todas evitan crear tareas o acciones del harness. `ahk-test` conserva esa convención:

- No llama `tasks.*` ni `actions.*`.
- No crea una tarea en `.harness`.
- No modifica criterios de aceptación.
- Puede invocarse para una función, un bug, un adapter o un cambio reciente.
- Usa los roles existentes con instrucciones de modo directo.

La diferencia es que esta skill sí necesita escritura. Explorer reúne contexto, Builder modifica exclusivamente tests y Reviewer ejecuta la comprobación sin editar archivos.

## Nombre y activación

Nombre recomendado: `ahk-test`.

El singular coincide con el prefijo y la forma breve de las skills actuales. La descripción debe activar la skill cuando la persona pida crear, completar o mejorar tests de un comportamiento concreto.

Ejemplos de peticiones que deben activar la skill:

```text
Use the ahk-test skill to create tests for toLibraryListBody. all must send movie and series; never anime.
```

```text
Use the ahk-test skill to reproduce the bug where blank notes are sent as an empty string. Write the regression test only.
```

```text
Use the ahk-test skill to add missing tests for the library filter adapter using the approved acceptance criteria.
```

## Contrato de entrada

`$ARGUMENTS` debe contener un objetivo o comportamiento. La skill puede completar el contexto leyendo el repositorio, pero no debe inventar la expectativa.

Una petición útil contiene:

- Unidad o comportamiento que se probará.
- Resultado esperado.
- Archivos o límites conocidos.
- Referencia a ticket, contrato o criterio de aceptación cuando exista.
- Restricciones, por ejemplo “sin snapshots” o “no edites producción”.

Si `$ARGUMENTS` está vacío, la skill pregunta qué se desea probar. Si el código, el ticket y los tests existentes se contradicen, presenta la contradicción y espera una decisión antes de escribir.

## Fuentes válidas del comportamiento esperado

La skill puede derivar la matriz únicamente de estas fuentes, en este orden:

1. Objetivo y restricciones escritos por la persona.
2. Criterios de aceptación o contrato de API referenciado.
3. Documentación vigente del proyecto.
4. Tests existentes que expresen una convención compatible.
5. Comportamiento público del código, solo cuando no contradiga una fuente superior.

La implementación actual no constituye por sí sola el oráculo. Un test que solo inmortaliza el código existente puede consolidar un bug.

## Flujo recomendado

### 1. Exploración

Explorer debe leer:

- La unidad bajo prueba completa.
- Sus types e imports relevantes.
- Los scripts de test y la configuración del runner.
- Uno o dos tests cercanos que muestren convenciones.
- El ticket, contrato o documentación nombrada por la persona.

Su salida distingue hechos, ambigüedades y comportamientos candidatos. No escribe archivos.

### 2. Matriz de tests

Antes de editar, la skill construye una tabla pequeña:

| Comportamiento | Entrada o acción | Resultado esperado | Nivel | Fuente |
| --- | --- | --- | --- | --- |
| `all` limita el dominio | filtro `all` | body con `movie` y `series` | Unitario | criterio del curso |
| Un tipo conserva su valor | filtro `movie` | body con un solo tipo | Unitario | contrato del adapter |

No existe una cuota artificial de casos. Se incluyen happy path, borde o error solo cuando el contrato los define o la exploración muestra un riesgo real.

### 3. Puerta de ambigüedad

La skill se detiene antes de Builder cuando:

- Dos fuentes definen resultados distintos.
- No existe un resultado observable.
- La prueba exige cambiar producción o instalar una dependencia no autorizada.
- El runner no existe y la petición no incluye configurarlo.
- Solo sería posible crear un test tautológico.

La pregunta debe nombrar la decisión concreta que falta. No presenta un bloque de tests especulativo.

### 4. Implementación limitada

Builder recibe la matriz sin ambigüedades, las convenciones y una lista explícita de archivos permitidos. Puede crear o modificar tests y fixtures exclusivos de esos tests, siempre dentro del `__tests__/` del área verificada. No puede:

- Editar producción.
- Cambiar el contrato esperado.
- Eliminar o debilitar tests existentes.
- Añadir `.only`, `.skip` o `.todo` sin petición explícita.
- Sustituir assertions por snapshots para reducir trabajo.
- Instalar librerías o cambiar configuración sin autorización.

Si descubre que producción necesita un cambio, termina con el test fallando y reporta el siguiente paso. La persona puede pedir después una implementación separada.

### 5. Verificación

Reviewer ejecuta primero el test enfocado con el comando propio del repositorio. Después ejecuta la suite o check adicional que sea proporcional al alcance y esté disponible.

La salida diferencia:

- Test enfocado.
- Suite relacionada.
- Typecheck o build.
- Verificación manual, navegador, red o despliegue todavía pendiente.

Un archivo escrito no se reporta como test aprobado si no fue ejecutado.

## Borrador de `SKILL.md`

El contenido siguiente está escrito en inglés para conservar el idioma y la forma de las skills empaquetadas actuales.

```md
---
name: ahk-test
description: Design, write, and run behavior-focused tests for an objective or existing code. Writes test files only and reports evidence. No tasks created, no harness tracking.
---

You are in **lightweight test mode**. The testing objective: $ARGUMENTS

> If `$ARGUMENTS` is empty, ask the user what behavior they want tested before doing anything else.

## Rules
- NO MCP calls — no tasks.*, no actions.*, no tasks.acceptance.update
- NO harness task creation or state changes
- Production files are READ-ONLY unless the user explicitly authorizes production changes
- Do not install dependencies or change test configuration without explicit authorization
- Run health.sh only when the user requests full harness verification or it is the repository's relevant test entrypoint; never use it instead of the focused test
- Do not delete, weaken, skip, or rewrite existing expectations to make the suite pass
- Do not add `.only`, `.skip`, `.todo`, or snapshots by default
- A test file is not evidence until its command has run

## Process

1. Invoke **Explorer** as a subagent with this instruction:
   > "Read-only test investigation — no MCP harness and no task creation. Testing objective: `$ARGUMENTS`. Read the complete unit under test, its relevant types and imports, the project's test scripts/configuration, and one or two nearby tests. Identify: observable behaviors, the source of each expected result, project conventions, likely test level, files a test would touch, and genuine ambiguities. Do not write files."

2. Build a concise test matrix with these columns:
   - Behavior
   - Input or action
   - Expected observable result
   - Test level
   - Source of expectation

3. Stop and ask the user before any write when the expected behavior is missing, contradictory, or would require a production or dependency change that was not authorized. Do not invent an oracle from the current implementation.

4. If the matrix is unambiguous, invoke **Builder** in direct test mode:
> "Direct test implementation — no MCP harness and no task creation. Implement only the resolved test matrix. Follow the repository's existing runner, naming, and assertion style. Place every test file and every test-only fixture, builder, factory, mock, stub, snapshot, or helper inside the `__tests__/` directory of the area under test. You may create or modify only the paths listed in the resolved scope. Do not edit production, dependencies, configuration, or unrelated tests. Prefer observable behavior over implementation details, real deterministic code over mocks, and one behavior per test. Return files changed and the focused command to run."

5. Invoke **Reviewer** in direct verification mode:
   > "Direct test verification — no MCP harness, no task state changes, and no file edits. Review the new tests against the objective and matrix. Run the narrowest focused test command first, then the relevant existing suite or static check when proportional. Report every command with exit status, failures, and what the evidence does not prove."

6. Synthesize the required output. Do not hide a failing test or convert it into a passing claim.

## Required output format

---

**Test matrix**
Behavior, input/action, expected result, level, and source.

**Files changed**
Test files created or modified. State explicitly when no files were written.

**Verification**
Commands run, exit status, and relevant result.

**Evidence boundary**
What these tests prove and what still requires typecheck, build, browser, network, deployment, or manual verification.

**Blocked or next step**
Omit when nothing remains. If production appears wrong, describe the separate change needed without making it.

---
```

## Decisiones del diseño

### Skill ligera

`ahk-test` no crea tareas. Este comportamiento coincide con las cuatro skills actuales y permite usarla durante una clase, una revisión local o un cambio pequeño sin llenar el backlog.

Un flujo tracked puede invocar la misma filosofía desde una tarea existente, pero esa integración no pertenece a esta primera versión de la skill.

### Tests primero, producción después

La skill escribe tests únicamente. Este límite evita que una petición pequeña termine en una corrección no revisada. También permite el flujo de regresión: reproducir, observar rojo y luego solicitar el fix en una tarea distinta.

### Matriz visible

La matriz evita que Builder deduzca en silencio qué debería ocurrir. También deja un artefacto corto que una persona puede corregir antes de pagar el costo de una implementación equivocada.

### Evidencia con límites

La skill no usa “all tests pass” cuando solo ejecutó un archivo. Tampoco confunde una suite unitaria con evidencia de navegador, red o despliegue.

## Superficie de implementación en el repositorio

La implementación mínima debería tocar:

| Archivo o zona | Cambio esperado |
| --- | --- |
| `src/core/materializer/skills/ahk-test/SKILL.md` | Añadir la fuente canónica de la skill |
| `src/core/materializer/scaffold-utils.ts` | Añadir `ahk-test` a `skillNames` para todos los materializers |
| `src/core/doctor.ts` | Añadir `ahk-test` a `SKILL_NAMES` |
| `src/__tests__/doctor.test.ts` | Cubrir estados `ok`, `missing` y `outdated` para la quinta skill |
| Tests de materialización nuevos o existentes | Comprobar que `init` y `build` la escriben en cada directorio de proveedor |
| `README.md` | Documentar la quinta skill y un ejemplo de uso |
| `.agents/skills/ahk-test/SKILL.md` | Actualizar la copia usada por el propio repositorio mediante el flujo de build correspondiente |

Directorios esperados por proveedor según la implementación actual:

| Proveedor | Destino |
| --- | --- |
| Claude Code | `.claude/skills/ahk-test/SKILL.md` |
| OpenCode | `.opencode/skills/ahk-test/SKILL.md` |
| Codex CLI | `.agents/skills/ahk-test/SKILL.md` |
| Grok CLI | `.grok/skills/ahk-test/SKILL.md` |

No se requiere:

- Un comando `ahk test`.
- Un cambio de schema de la base de datos.
- Una herramienta MCP nueva.
- Un rol nuevo.
- Un cambio de permisos de los roles existentes.

## Criterios de aceptación para la librería

1. `ahk init` materializa `ahk-test` en el directorio correspondiente al proveedor.
2. `ahk build` restaura una skill ausente y actualiza una versión desfasada con la misma política que las skills existentes.
3. `ahk doctor` reporta `ok`, `missing` u `outdated` para `ahk-test`.
4. La skill vacía solicita un objetivo antes de explorar o escribir.
5. Una expectativa ambigua detiene el flujo antes de Builder.
6. Un objetivo claro permite crear o modificar solo archivos de tests.
7. Una necesidad de cambio en producción se reporta sin editar producción.
8. Reviewer ejecuta primero el test enfocado y conserva el exit status en el reporte.
9. El reporte diferencia test, suite, checks estáticos y verificaciones externas.
10. Los tests del paquete cubren la materialización en Claude Code, OpenCode, Codex CLI y Grok CLI.

## Pruebas de aceptación sugeridas

### Materialización

- Crear un proyecto temporal por proveedor.
- Ejecutar el materializer.
- Comprobar que existe `ahk-test/SKILL.md` y coincide byte por byte con la fuente empaquetada.

### Doctor

- Skill presente e idéntica: `ok`.
- Skill ausente: `missing`.
- Skill editada: `outdated`.
- `ahk build` posterior: vuelve a `ok`.

### Comportamiento de la skill

- Objetivo claro con runner existente: genera test, lo ejecuta y reporta la frontera.
- Objetivo sin resultado esperado: no escribe.
- Runner ausente: no instala dependencias y solicita autorización.
- Test rojo por comportamiento de producción: conserva el rojo y propone un cambio separado.
- Test existente incompatible con el ticket: presenta la contradicción antes de editar.

## Riesgos

- **Builder ignora el límite.** La instrucción debe repetir “test files only” y Reviewer debe bloquear cualquier archivo de producción modificado.
- **La matriz se vuelve ceremonia.** Debe ser corta y proporcional; dos comportamientos requieren dos filas, no una plantilla extensa.
- **El agente sobregenera casos.** La skill no impone happy path, borde y error cuando el contrato no los justifica.
- **El runner domina la skill.** La rutina debe detectar el stack del repositorio. Vitest, Jest, pytest o cualquier otro runner son detalles locales.
- **La skill promete cobertura.** El reporte debe limitarse a comandos ejecutados y comportamientos observados.
- **Los roles directos intentan usar el harness.** Cada instrucción de subagente declara `no MCP harness` y `no task creation`, igual que las skills ligeras existentes.

## Fuentes

- [Repositorio oficial de Agent Harness Kit](https://github.com/enmanuelmag/agent-harness-kit)
- [Guía oficial de Vitest: Testing in Practice](https://vitest.dev/guide/learn/testing-in-practice)
- [Guía oficial de Vitest: Writing Tests with AI](https://main.vitest.dev/guide/learn/writing-tests-with-ai)

La recomendación de probar contratos observables, limitar mocks, ejecutar los tests generados y reproducir bugs antes de corregirlos coincide con la documentación oficial de Vitest. La propuesta añade controles de alcance y evidencia compatibles con la filosofía del harness.
