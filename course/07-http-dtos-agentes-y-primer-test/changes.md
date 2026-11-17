# Revisión personal

> Documento interno de revisión. No distribuir.
>
> Estado: abierto
> Fecha de revisión: YYYY-MM-DD

## Impresión general


## Cambios solicitados

Segun esta eta sesion 7, entiendo que ya se espera que la lib "@cardor/agent-harness-kit@2.4.0" esté instalada. Pero no vi en ninguna sesion anterior ese proceso. Ademas de que no solo es instalarla, si no tambien explicarla, darla a concoer en la fase de la presentacion las caracterisitcas y todo lo que mecione en memorias/rules para que se asimile el motivo y razon de ser de la lib; de no dejar por libre a los agentes.

Ademas deseo que instalemos la lib de manera global. Es decir si bien usmaos pnpm para todo, para no tener problemas la instalacion global la haremos con npm, para que no haya problemas de path y de version de node. asi TODOS los demas comando que hagan uso de "ahk", no requieran de "pnpm exec"

"media-detail-input-to-search-params" no se podria acortar mas el nombre? Para que no sea tan largo y se pueda escribir mas facil en los tests. Por ejemplo "media-input-to-params" o "media-input-to-search".

Ya la lib ahk tiene ahk-test (Revisala) por loq ue el pronto peude ser mas sencillo quizas?

### `session-draft.md`

### `pre-call-reading.md`

### `teacher-guide.md`

### `student-guide.md`


## Preguntas por resolver

- ¿...?

## Impacto posible en otras sesiones

- Sesión anterior:
- Sesión siguiente:
- Regla o decisión reutilizable:

## Notas para la presentación

- Concepto que necesita diagrama:
- Ejemplo que conviene proyectar:
- Explicación oral que debe conservarse:

## Notas para el proyecto progresivo

- Checkpoint que debe existir:
- Código o fixture necesario:
- Posible seed o contingencia:

## Resolución

### C01 · Instalación, presentación y uso de Agent Harness Kit

Aplicada la instalación global fijada de `@cardor/agent-harness-kit@2.11.0` con npm como excepción explícita al gestor del proyecto. La sesión 07 ahora diferencia CLI global y harness local, comprueba Node, npm, PATH y versión, recorre `ahk init`, inspecciona configuración, instrucciones, roles, skills y `health.sh`, y explica cómo esas piezas limitan el trabajo del agente.

`health.sh` se configura primero con `pnpm build`; `pnpm test` se añade después de instalar Vitest y crear el script. Se eliminó la preparación imposible que pedía tests antes de tener runner. `ahk doctor` comprueba materialización y `ahk health` ejecuta los checks declarados, sin ampliar su frontera de evidencia.

La versión verificada ya materializa `ahk-test`. El primer test y las actividades equivalentes de las sesiones 09–16 invocan la skill con una matriz humana, rutas permitidas, prohibiciones específicas y comando enfocado. Se retiró el boilerplate cubierto por la skill, conservando lectura completa, revisión del diff y evidencia ejecutada.

La agenda 07 fue redistribuida y continúa sumando 90 minutos. El guion de presentación incorpora instalación, materialización, características, límites y razón pedagógica. La lectura previa se revisó y no se amplió: ya ocupa 20 minutos con las dos fuentes permitidas y el onboarding se construye en vivo.

Seguimiento en el [plan](../../corrections-plan.md) y la [memoria C01](../../memories/review-c01-ahk-onboarding.md).

### D02 · Nombre del adapter

Aplicado el nombre `media-input-to-params` en las guías 07/08 y la fuente histórica 07, incluidos imports, árboles, tests y prompts. Se corrigió el import relativo del test desde `__tests__/`. La función conserva `toMediaDetailSearchParams`.

Seguimiento en el [plan](../../corrections-plan.md) y la [memoria D02](../../memories/review-d02-adapter-name.md).
