# Reglas para talleres y rúbricas

## Propósito

Los talleres presenciales convierten lo explicado antes del descanso en un entregable verificable. La rúbrica informa desde el inicio qué debe funcionar, qué evidencia se revisará y cómo se asigna cada punto.

## Alcance

Las sesiones presenciales 03, 06, 10, 13 y 19 tienen `workshop-rubric.md`.

- Las sesiones 03, 06, 10 y 13 califican una aplicación práctica de conceptos ya explicados.
- La sesión 19 califica la presentación final, la demostración del proyecto y la capacidad de explicar decisiones. No introduce una implementación nueva.
- Las sesiones virtuales pueden terminar con una comprobación o un mini-entregable, pero no reciben esta rúbrica numérica salvo una decisión institucional posterior.

## Momento del taller

La presencial conserva la secuencia aprobada:

```text
75 minutos de explicación y práctica guiada
30 minutos de descanso
60 minutos de taller calificable
15 minutos de revisión o demostración
```

Después del descanso no se introduce una API, hook, librería o patrón nuevo. El proyecto semilla contiene el progreso anterior y omite la solución evaluada.

## Contenido de `workshop-rubric.md`

El archivo incluye:

1. Identificación de la sesión, duración y puntaje.
2. Resultado que debe demostrar el estudiante.
3. Proyecto semilla o checkpoint de partida.
4. Escenario del encargo.
5. Trabajo obligatorio.
6. Restricciones y trabajo fuera de alcance.
7. Evidencias requeridas.
8. Casos de aceptación que usará el docente.
9. Instrucciones de entrega.
10. Una única tabla con criterios base, actividades extra cuando correspondan, totales y registro de la nota.
11. Notas privadas del docente solo cuando el archivo permanezca fuera de la distribución estudiantil.

La versión que recibe el estudiante debe estar disponible antes de comenzar el taller.

## Escala de puntaje

- Los criterios obligatorios suman exactamente 100 puntos.
- Incluye entre cuatro y seis criterios base para que cada fila represente una responsabilidad reconocible.
- Cada fila indica un puntaje exacto para cumplimiento completo, parcial y no demostrado. No dejes rangos a interpretación durante la calificación.
- Las sesiones 03, 06, 10 y 13 incluyen al menos una actividad opcional y permiten como máximo 10 puntos extra.
- La sesión 19 es una excepción aprobada: su rúbrica de presentación cierra en 100 puntos y no incluye actividades ni puntaje extra.
- Cuando existen extras, el puntaje bruto máximo es 110 y la nota de plataforma es `min(puntaje bruto, 100)`.

El extra no puede:

- Sustituir un requisito obligatorio incompleto.
- Reparar un comportamiento principal que no funciona.
- Exigir un concepto que no fue enseñado antes del descanso.
- Premiar solo decoración, cantidad de archivos o volumen de código.
- Repetir una evidencia que ya forma parte del puntaje base.

## Una sola tabla

La rúbrica completa usa una tabla Markdown con seis columnas: `Tipo`, `Criterio o actividad`, `Qué se evalúa`, `Escala de asignación`, `Máximo` y `Obtenido`.

Dentro de esa misma tabla aparecen, en orden:

1. Criterios base.
2. Total base.
3. Actividades opcionales, cuando correspondan.
4. Total extra y puntaje bruto, cuando correspondan.
5. Nota registrada en la plataforma.

No uses tablas separadas para el extra o el resultado. No uses `rowspan`, `colspan`, HTML ni celdas combinadas; estos recursos producen resultados inconsistentes entre visores Markdown y exportaciones.

## Modelo de formato

La siguiente tabla demuestra la estructura, no los pesos definitivos de todas las sesiones. Reemplaza sus descriptores por comportamientos concretos del taller.

| Tipo | Criterio o actividad | Qué se evalúa | Escala de asignación | Máximo | Obtenido |
| --- | --- | --- | --- | ---: | ---: |
| Base | Comportamiento principal | El flujo obligatorio produce el resultado descrito en los casos de aceptación. | Completo: 35 · Parcial: 18 · No demostrado: 0 | 35 | ___ |
| Base | Estado y flujo de datos | El estado tiene un propietario identificable y los datos viajan mediante los contratos enseñados. | Completo: 20 · Parcial: 10 · No demostrado: 0 | 20 | ___ |
| Base | Componentes y contratos | Los componentes conservan responsabilidades claras y usan props o callbacks con firmas coherentes. | Completo: 15 · Parcial: 8 · No demostrado: 0 | 15 | ___ |
| Base | Estados de interfaz | La interfaz representa los estados exigidos y las acciones permanecen comprensibles y accesibles. | Completo: 15 · Parcial: 8 · No demostrado: 0 | 15 | ___ |
| Base | Verificación y explicación | El proyecto ejecuta, se entrega completo y el estudiante puede explicar el flujo y el límite de su evidencia. | Completo: 15 · Parcial: 8 · No demostrado: 0 | 15 | ___ |
| Total | Total base | Suma de los criterios obligatorios. | Suma de filas base | 100 | ___ |
| Extra | Mejora opcional 1 | Comportamiento adicional definido para la sesión sin reemplazar requisitos base. | Cumple la condición completa: +5 · No cumple: 0 | +5 | ___ |
| Extra | Mejora opcional 2 | Segunda mejora o verificación opcional definida para la sesión. | Cumple la condición completa: +5 · No cumple: 0 | +5 | ___ |
| Total | Total extra | Suma de actividades opcionales válidas. | Máximo adicional permitido | +10 | ___ |
| Total | Puntaje bruto | Total base más total extra. | Máximo antes de aplicar el límite institucional | 110 | ___ |
| Registro | Nota en plataforma | Puntaje bruto limitado al máximo que admite la plataforma. | `min(puntaje bruto, 100)` | 100 | ___ |

Una rúbrica con extras puede usar una sola actividad de +10 o varias que sumen hasta +10. Conserva todas dentro de la tabla. La sesión 19 omite las filas de extra y registra directamente el total base como nota máxima de 100.

## Descriptores observables

Evita criterios como “entiende React”, “código limpio” o “buena experiencia” sin evidencia. Cada descriptor debe nombrar lo que el docente puede comprobar.

Ejemplos:

- Al seleccionar una tarjeta aparece el detalle correspondiente.
- Seleccionar otro medio reemplaza el contenido anterior sin conservar datos mezclados.
- `MediaCard` comunica la selección mediante la firma aprobada de `onSelect`.
- La interfaz muestra carga, error, vacío y éxito cuando esos estados pertenecen al alcance.
- `pnpm build` termina con código de salida cero.
- El estudiante explica qué prueba un test y qué no demuestra.

El nivel parcial también necesita una condición concreta. Por ejemplo: “la selección abre el modal, pero muestra siempre el primer elemento” describe mejor un cumplimiento parcial que “funciona con algunos errores”.

## Evidencia y entrega

Cada taller define solo la evidencia necesaria para sus criterios:

- Archivo ZIP o enlace aceptado por la plataforma institucional.
- Comando ejecutado y resultado relevante.
- Recorrido manual de los casos de aceptación.
- Captura o demostración cuando el docente no pueda reproducir el entorno.
- Explicación breve del flujo, contrato o decisión central.

Un build exitoso no demuestra el comportamiento del navegador. Un test unitario no demuestra Firebase, Network, el backend o el despliegue. La rúbrica debe separar esas fronteras.

Si una falla de compilación impide ejecutar el proyecto, asigna cero únicamente a los criterios cuya evidencia no puede demostrarse. Evalúa por separado la estructura o explicación que todavía pueda comprobarse; no conviertas automáticamente toda la entrega en cero salvo una política institucional explícita.

## Uso de agentes

Cuando la sesión permita agentes, la rúbrica evalúa el resultado, la revisión y la explicación del estudiante; no premia escribir manualmente más líneas ni castiga por usar la herramienta aprobada.

- El estudiante define el comportamiento antes de delegar.
- El agente puede redactar trabajo mecánico o tests dentro de los límites de la sesión.
- El estudiante lee los cambios, ejecuta la evidencia y explica el resultado.
- Una prueba generada pero no ejecutada no recibe el puntaje de verificación.
- Un test puede ser actividad extra solo si no era ya un requisito base de esa sesión.

## Verificación de la rúbrica

Antes de publicar:

- Los criterios base suman 100.
- Las sesiones 03, 06, 10 y 13 incluyen al menos una opción y sus actividades extra suman como máximo 10; la sesión 19 no contiene extras.
- Todos los criterios, extras cuando existan y totales aparecen en una sola tabla.
- Cada nivel asigna puntos exactos y describe evidencia observable.
- Los requisitos del encargo aparecen también en los casos de aceptación.
- Cuando existe, el extra no introduce contenido nuevo ni repara requisitos base.
- La versión estudiantil y la versión usada para calificar son iguales.
