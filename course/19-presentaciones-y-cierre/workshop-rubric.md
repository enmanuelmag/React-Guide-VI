# Presentación final y rúbrica · Sesión 19

> Estado: paquete textual aprobado.

- **Fecha:** sábado 14 de noviembre de 2026
- **Semana:** 8
- **Modalidad:** presencial
- **Duración del bloque calificable:** 60 minutos
- **Duración por unidad:** 6 minutos de presentación, 2 de preguntas y 1 de transición
- **Puntaje base y máximo:** 100 puntos
- **Puntos extra:** no existen en esta sesión

## Resultado que debes demostrar

Presentarás el producto final mediante un recorrido real, explicarás una decisión técnica y responderás preguntas sobre el trabajo construido durante el curso.

La evaluación no añade código ni califica CSR, SSR, SSG, decoración, animaciones o cantidad de diapositivas.

## Punto de partida

La presentación recibe el checkpoint desplegado de la sesión 18:

- URL `pages.dev`;
- rama de producción, revisión local comprobada y revisión publicada;
- confirmación de que ambas revisiones coinciden y deployment identificado;
- rutas públicas y privadas;
- Firebase Authentication;
- API docente;
- búsqueda, detalle, biblioteca y CRUD;
- de status;
- tests, build y evidencia de navegador.

## Encargo

Dentro de seis minutos:

1. Presenta el problema y el producto.
2. Explica el recorrido entre navegador, Router, Query, Firebase, API y hosting.
3. Abre directamente una ruta pública anidada y recárgala.
4. Demuestra la protección de `/app/library` sin sesión.
5. Inicia sesión y completa una operación privada.
6. Explica una decisión técnica vinculada con el recorrido.
7. Identifica la rama, las revisiones local y publicada, confirma que coinciden y declara el límite de la evidencia presentada.

Después responde preguntas durante dos minutos. Cada integrante debe intervenir y responder una pregunta breve. La composición de la unidad debe permitirlo sin reducir la demostración.

## Restricciones

- No añadas o corrijas código durante el turno.
- No muestres contraseñas, tokens, credenciales o values privados.
- No sustituyas una demostración disponible por capturas.
- No presentes un bloqueo como funcionamiento aprobado.
- No atribuyas a test, build o deployment evidencia que pertenece al navegador.
- No uses una respuesta producida por un agente durante las preguntas.
- No se conceden puntos extra.

## Evidencia requerida

- URL pública.
- Rama de producción.
- Revisión local comprobada.
- Revisión publicada por Cloudflare Pages y confirmación de que coincide con la revisión local.
- Deployment de Cloudflare Pages.
- Salida reciente de `pnpm test`.
- Salida reciente de `pnpm build`.
- Recorrido observable en el navegador.
- Ficha final con la operación, decisión y limitaciones conocidas.

## Casos de aceptación

El docente comprobará:

1. La presentación comunica el problema y termina dentro del tiempo.
2. La ruta pública anidada abre directamente y sobrevive una recarga.
3. `/app/library` redirige a Login sin sesión.
4. Login permite completar una operación privada cuando las dependencias están disponibles.
5. La arquitectura explicada coincide con el recorrido real.
6. La decisión técnica identifica propietario, flujo y motivo.
7. Las revisiones local y publicada coinciden; deployment, test, build y navegador no se confunden entre sí.
8. Cada integrante responde con sus palabras.
9. La ficha final queda entregada sin secretos.

## Contingencias

Una dependencia externa registrada puede impedir una parte de la demostración. El docente evalúa por separado los criterios todavía observables. La evidencia anterior de respaldo debe identificar fecha, acción y resultado; documenta el incidente, pero no acredita funcionamiento actual ni convierte un bloqueo en éxito.

Una falla en un criterio no convierte automáticamente toda la presentación en cero.

## Tabla única de evaluación

| Tipo | Criterio | Qué se evalúa | Escala de asignación | Máximo | Obtenido |
| --- | --- | --- | --- | ---: | ---: |
| Base | Demostración del recorrido | La unidad abre y recarga una ruta pública anidada, demuestra la protección de `/app/library`, inicia sesión y completa una operación privada ya construida. | Completo: 30 · Parcial: 15 si demuestra el recorrido público y parte del privado, pero omite una transición, recarga u operación · No demostrado: 0 si no existe un recorrido observable o solo se describen capturas sin una contingencia registrada | 30 | ___ |
| Base | Arquitectura del producto | La explicación conecta navegador, React Router, TanStack Query, Zustand, Firebase, API y Cloudflare solo donde participan, sin confundir autenticación, estado remoto, intención de interfaz o hosting. | Completo: 20 · Parcial: 10 si el mapa principal es correcto pero confunde u omite una responsabilidad relevante · No demostrado: 0 si la explicación contradice el recorrido o atribuye sus datos a una capa incorrecta | 20 | ___ |
| Base | Decisión técnica | La unidad explica una decisión mediante propietario, identidad o flujo concreto y justifica por qué evita un estado inválido, una caché incoherente o una navegación incorrecta. | Completo: 20 · Parcial: 10 si identifica la decisión y su resultado, pero no puede reconstruir el flujo o el motivo · No demostrado: 0 si solo enumera librerías, repite una definición o atribuye la decisión al agente | 20 | ___ |
| Base | Evidencia y entrega | Presenta URL, rama, revisiones local y publicada coincidentes, deployment, test, build y ficha final; distingue qué demuestra cada registro y declara limitaciones conocidas sin incluir secretos. | Completo: 20 · Parcial: 10 si el producto es identificable pero falta un registro, una coincidencia, una limitación o una frontera de evidencia · No demostrado: 0 si no puede identificarse la revisión publicada, falta la entrega o se afirma evidencia inexistente | 20 | ___ |
| Base | Comunicación, tiempo y respuestas | Comunica el problema, termina dentro de seis minutos, mantiene el recorrido comprensible y cada integrante interviene y responde una pregunta con sus palabras. | Completo: 10 · Parcial: 5 si el contenido puede evaluarse, pero excede el tiempo, pierde el orden o una participación individual queda incompleta · No demostrado: 0 si la exposición no permite evaluar el trabajo o las respuestas se delegan a otra persona o a un agente | 10 | ___ |
| Total | Nota final | Suma de los cinco criterios base. Esta sesión no contiene actividades ni puntos extra. | Suma de filas base | 100 | ___ |

## Entrega

Sube la ficha final y los enlaces solicitados mediante el canal institucional. Si existe un bloqueo, registra la acción realizada, el resultado observado y la dependencia involucrada.
