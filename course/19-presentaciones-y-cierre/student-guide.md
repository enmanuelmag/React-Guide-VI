# Guía estudiantil · Sesión 19 · Presentaciones y cierre

> Paquete textual aprobado. La presentación visual y el checkpoint docente permanecen pendientes de sus etapas correspondientes.

- **Fecha:** sábado 14 de noviembre de 2026
- **Semana:** 8
- **Modalidad:** presencial
- **Duración:** 180 minutos
- **Lectura previa:** [pre-class-reading.md](pre-class-reading.md)
- **Rúbrica:** [workshop-rubric.md](workshop-rubric.md)

## Objetivo

Presentarás y defenderás el producto final. Mostrarás un recorrido real, explicarás una decisión técnica y declararás qué demuestra cada evidencia utilizada.

No implementarás una feature nueva durante esta sesión.

## Punto de partida

La sesión 18 te entrega el producto publicado y su ficha de evidencia. Llega con:

- URL `pages.dev`;
- rama de producción;
- revisión local comprobada;
- revisión publicada por Cloudflare Pages y confirmación de que coincide con la revisión local;
- identificador o enlace del deployment;
- ruta pública anidada comprobada;
- acceso a una cuenta de demostración;
- al menos una entrada personal preparada;
- resultados recientes de `pnpm test` y `pnpm build`;
- ficha final y orden de presentación confirmados.

No compartas contraseñas, tokens, variables privadas o credenciales en slides, repositorios o chat.

## Antes del descanso

### 1. Observa antes de nombrar

Compararemos tres recorridos con un restaurante y después con un diagrama de servidor, red y navegador. En cada caso identifica:

- cuándo se produce el HTML;
- qué viaja por la red;
- qué hace el navegador;
- cuándo aparece la interacción.

### 2. Formaliza el mapa

| Modelo | Idea central |
| --- | --- |
| CSR | React construye el contenido en el navegador. |
| SSR | Un runtime genera HTML durante la petición y el navegador puede hidratarlo. |
| SSG | Un proceso genera HTML antes de la visita y el hosting sirve ese resultado. |

Medialog sigue siendo una SPA CSR. Publicarla como archivos estáticos en Cloudflare Pages no prerenderiza automáticamente el árbol de componentes.

Este mapa no forma parte de la calificación y no cambia el proyecto.

### 3. Prepara tu defensa

Completa una frase por fila:

| Parte | Tu contenido |
| --- | --- |
| Problema | Qué puede lograr una persona con Medialog. |
| Arquitectura | Qué piezas participan en el recorrido. |
| Demostración | Qué acciones ejecutarás. |
| Decisión | Qué decisión técnica explicarás. |
| Evidencia | Qué registro respalda tu afirmación. |
| Límite | Qué no permite concluir esa evidencia. |

## Estructura de seis minutos

1. **Problema y producto:** aproximadamente 40 segundos.
2. **Mapa del recorrido:** aproximadamente 50 segundos.
3. **Demostración:** aproximadamente 3 minutos.
4. **Decisión técnica:** aproximadamente 50 segundos.
5. **Evidencia y límite:** aproximadamente 40 segundos.

Después tendrás dos minutos de preguntas. Si trabajas en equipo, cada integrante debe intervenir y responder una pregunta breve. El docente confirmará antes de clase que el tamaño de la unidad permite hacerlo sin recortar la demostración.

## Recorrido mínimo

Durante la demostración:

1. Muestra la URL publicada.
2. Abre directamente una ruta pública anidada y recárgala.
3. Abre `/app/library` sin sesión y muestra la redirección a Login.
4. Inicia sesión.
5. Completa una operación privada ya construida.
6. Explica una decisión técnica vinculada con ese recorrido.
7. Identifica la rama, las revisiones local y publicada, confirma que coinciden y muestra el deployment.

Elige una operación breve y segura. No improvises una eliminación si no la ensayaste.

## Decisiones técnicas posibles

Explica una sola con profundidad:

- por qué una query key incluye todos los inputs de su query function;
- por qué `logId` y `mediaType + externalId` representan identidades distintas;
- por qué TanStack Query conserva DTOs remotos y Zustand solo la intención del modal;
- por qué logout elimina la familia Media después de `signOut` exitoso;
- por qué el formulario espera la respuesta del servidor antes de cerrar;
- por qué una ruta privada espera la restauración de Firebase antes de decidir.

No enumeres conceptos sin conectarlos con un archivo, un flujo o una acción visible.

## Evidencia requerida

Prepara:

- URL pública;
- rama de producción;
- revisión local comprobada;
- revisión publicada por Cloudflare Pages;
- confirmación de que ambas revisiones coinciden;
- deployment de Cloudflare Pages;
- salida reciente de `pnpm test`;
- salida reciente de `pnpm build`;
- recorrido real en navegador;
- limitaciones conocidas.

Recuerda:

- test no demuestra navegador;
- build no demuestra deployment;
- deployment no demuestra login o API;
- una URL que abre no demuestra el recorrido privado completo.

## Ensayo opcional con agente

Antes de invocarlo, decide tu recorrido, tu decisión técnica y tus evidencias.

```text
Actúa como entrevistador técnico para una presentación final de React.

Primero responde únicamente: "Pega tu ficha de presentación".

Cuando reciba la ficha:
- formula exactamente cinco preguntas breves;
- cubre recorrido del usuario, propietario de estado, identidad de ruta, estado remoto y límite de evidencia;
- señala aparte cualquier afirmación que la ficha no respalde;
- no escribas respuestas modelo;
- no propongas features, refactors o cambios de código;
- no uses herramientas, archivos o servicios externos;
- termina después de las cinco preguntas y la lista de afirmaciones sin respaldo.
```

Responde oralmente con tus palabras. El agente no demuestra que tu producto funcione y no puede responder durante la evaluación.

## Comprobaciones antes del turno

Ejecuta en el proyecto correcto:

```bash
pnpm test
pnpm build
```

Después abre la URL publicada en una ventana nueva y recorre las acciones de tu presentación. Conserva las salidas completas; no presentes solo una captura recortada que oculte el resultado.

## Durante el turno

- Empieza con la pestaña pública correcta.
- Mantén Devtools cerrado salvo que forme parte de una evidencia ya ensayada.
- No edites código.
- No muestres valores privados.
- Si algo falla, describe exactamente lo observado. No digas que funcionó antes como sustituto de la evidencia actual.
- Respeta la señal de cierre a los seis minutos.

## Entrega final

Entrega mediante el canal institucional:

```text
Nombre o equipo:
URL pública:
Rama de producción:
Revisión local comprobada:
Revisión publicada:
¿Coinciden ambas revisiones?:
Deployment:
Operación privada demostrada:
Decisión técnica explicada:
Resultado de pnpm test:
Resultado de pnpm build:
Limitaciones conocidas:
```

No escribas “ninguna” si observaste un bloqueo. Describe el síntoma sin incluir credenciales o datos privados.

## Criterios de aceptación

- La presentación termina dentro de seis minutos.
- La ruta pública abre directamente y sobrevive una recarga.
- La ruta privada redirige sin sesión.
- Login y una operación privada quedan demostrados o el bloqueo externo queda declarado.
- La arquitectura coincide con el recorrido construido durante el curso.
- Una decisión técnica tiene propietario, flujo y motivo identificables.
- La evidencia se interpreta dentro de su límite.
- Cada integrante puede responder por el trabajo presentado.
- La ficha final queda entregada.

Una evidencia anterior puede documentar una dependencia externa registrada, pero no convierte el comportamiento actual en aprobado. El docente calificará por separado los criterios que sí pueda observar.

## Rúbrica

La nota base suma 100 puntos y no existen puntos extra. CSR, SSR, SSG, decoración, animaciones y cantidad de slides no se califican.

Consulta [workshop-rubric.md](workshop-rubric.md) antes de preparar el turno.

## Cierre

Al finalizar podrás explicar qué construiste, cómo lo comprobaste y qué decisión investigarías si otro producto necesitara generar HTML antes de ejecutar React en el navegador.
