# Reglas para memorias de iteración

## Propósito

Cada iteración de una clase mantiene un archivo de trabajo dentro de `memories/`. Ese archivo conserva el contexto que puede perderse entre sesiones: reglas revisadas, checkpoints relacionados, decisiones locales, dudas, fuentes y validaciones.

Una memoria documenta el razonamiento de una tarea. `rules/` contiene convenciones aprobadas y reutilizables. No trates una observación escrita en una memoria como regla del curso.

## Nombre y alcance

Usa un nombre que permita reconocer la tarea:

```text
memories/class-02-props-listas-y-typescript.md
memories/class-03-taller-catalogo-estatico.md
```

Una memoria puede abarcar varias clases solo cuando la decisión no pueda separarse, por ejemplo, una migración que cambie los checkpoints de una semana completa.

## Lectura antes de editar

Antes de modificar una clase:

1. Relee `rules/index.md` y todos sus archivos obligatorios.
2. Abre la memoria existente o crea una para la iteración.
3. Registra la clase objetivo, el checkpoint anterior y la siguiente dependencia.
4. Anota documentación o contratos que deban verificarse.
5. Describe contradicciones, vacíos y decisiones pendientes antes de cambiar la guía.

La memoria debe permitir que otra sesión reconstruya por qué se eligió el nuevo flujo.

## Secciones de la memoria

Incluye cuando correspondan:

- Objetivo y estado de la iteración.
- Material revisado.
- Punto de entrada y checkpoint esperado.
- Hallazgos y contradicciones.
- Decisiones aprobadas.
- Alcance reservado para otras clases.
- Fuentes consultadas.
- Preguntas pendientes.
- Validaciones realizadas.
- Candidatos para promover a `rules/`.

No agregues secciones vacías para cumplir una plantilla. Escribe `Ninguna` cuando la ausencia de preguntas o candidatos sea una conclusión útil.

## Actualización durante el trabajo

Actualiza la memoria cuando aparezca un insight que pueda cambiar la guía, una clase adyacente o un proyecto semilla. Registra también por qué se descartó una alternativa si esa razón puede evitar que otra iteración repita la discusión.

Si una duda cambia el alcance, detén la edición y consulta al usuario. Si la duda permite una suposición local y reversible, documenta la suposición y continúa.

## Promoción a reglas

Promueve un hallazgo a `rules/` cuando:

- El usuario lo aprueba como convención.
- Afecta varias clases o proyectos semilla.
- Su repetición evita una contradicción pedagógica o técnica.

Al promoverlo, registra en la memoria el archivo de reglas actualizado. No copies notas exploratorias completas a `rules/`; redacta una decisión breve con motivo, alcance y excepción.

## Cierre

Antes de terminar la iteración:

- Registra archivos modificados y validaciones.
- Marca contradicciones que debe resolver la clase siguiente.
- Actualiza `memories/index.md` si se creó una memoria nueva.
- Conserva la memoria aunque sus candidatos ya se hayan promovido; seguirá explicando el origen de la decisión.

No guardes tokens, credenciales, datos personales ni respuestas completas de una API en estas memorias.
