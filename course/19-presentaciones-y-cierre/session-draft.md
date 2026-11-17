# Sesión 19 · Presentaciones y cierre

> Estado: paquete textual aprobado definitivamente. La presentación visual y el proyecto progresivo o seed ejecutable permanecen pendientes de sus frentes correspondientes.

- **Fecha:** sábado 14 de noviembre de 2026
- **Semana:** 8
- **Modalidad:** presencial
- **Duración:** 180 minutos
- **Lectura previa:** [pre-class-reading.md](pre-class-reading.md)
- **Guía docente:** [teacher-guide.md](teacher-guide.md)
- **Guía estudiantil:** [student-guide.md](student-guide.md)
- **Rúbrica:** [workshop-rubric.md](workshop-rubric.md)
- **Checkpoint docente propuesto:** `s08-c19-presentation-checkpoint`

## Fuente y posición en el curso

La sesión migra únicamente el cierre de la antigua clase 24. Conserva regresión, demostración y límites explícitos. No migra drawer, `lazy`, `Suspense`, calendario u otra feature retirada del itinerario.

La sesión 18 entrega el producto publicado. La sesión 19 no añade implementación: convierte el recorrido construido durante el curso en una presentación técnica comprobable.

## Punto de entrada

Cada unidad de presentación llega con:

- una URL `pages.dev` registrada;
- la rama de producción registrada;
- la revisión local comprobada y la revisión publicada por Cloudflare Pages;
- la confirmación de que ambas revisiones coinciden;
- el identificador o enlace del deployment de Cloudflare Pages;
- una ruta pública anidada que puede abrirse directamente y recargarse;
- rutas privadas protegidas;
- login y un recorrido autenticado contra la API docente;
- biblioteca personal con creación, detalle, edición, eliminación;
- resultados recientes de `pnpm test` y `pnpm build`;
- una matriz que distingue evidencia local, deployment y navegador.

Si una dependencia docente impide el recorrido autenticado, el incidente debe estar registrado antes de la clase. La sesión no usa los 60 minutos calificables para terminar CORS, Firebase, CRUD o despliegue.

## Resultado de aprendizaje

El estudiante presentará y defenderá el producto final conectando cada afirmación técnica con una acción observable, una evidencia pertinente y el límite de esa evidencia.

## Pregunta que organiza la sesión

¿Cómo demostramos que una aplicación funciona sin confundir lo que vemos, la causa técnica y el alcance de cada comprobación?

## Checkpoint de salida

Al terminar, cada unidad de presentación habrá:

- identificado el producto mediante URL, rama, revisión local comprobada, revisión publicada y deployment;
- confirmado que la revisión publicada coincide con la que superó las comprobaciones locales;
- explicado el problema que resuelve Medialog y su recorrido principal;
- demostrado una ruta pública anidada y su recarga directa;
- demostrado la protección de `/app/library` sin sesión;
- iniciado sesión y completado una operación privada ya construida;
- explicado una decisión de arquitectura mediante un flujo concreto;
- relacionado la evidencia presentada con lo que demuestra y lo que no demuestra;
- respondido preguntas sin delegar la explicación al agente;
- entregado una ficha final con enlaces, evidencia y limitaciones conocidas.

No existe una sesión posterior que reciba un checkpoint incompleto. Un bloqueo externo queda declarado con su evidencia y responsable; no se presenta como funcionamiento aprobado.

## Concepto principal

```text
afirmación técnica
→ acción observable
→ evidencia pertinente
→ límite declarado
```

Ejemplo:

```text
“La ruta pública es compartible y recargable”
→ abrir directamente /media/movie/<externalId> y recargar
→ URL visible, respuesta del hosting y contenido correcto
→ no demuestra login, API privada o mutaciones
```

## Mapa conceptual no evaluado

La clase ubica tres modelos mediante una pregunta: ¿dónde y cuándo se genera el HTML con contenido?

| Modelo | Dónde se genera el HTML inicial | Cuándo | Papel del navegador |
| --- | --- | --- | --- |
| CSR | El contenido React se construye en el navegador | Después de descargar y ejecutar JavaScript | Crea la interfaz y conserva la interacción |
| SSR | Un runtime de servidor genera HTML | Durante una petición | Muestra el HTML y después hidrata la interfaz |
| SSG | Un proceso de prerender genera HTML | Antes de la visita, normalmente durante build | Recibe el archivo generado y puede hidratarlo |

Medialog continúa siendo una SPA CSR. Cloudflare Pages sirve archivos estáticos producidos por Vite, pero `index.html` no contiene el árbol React prerenderizado. Servir una SPA desde un CDN no cambia por sí solo su modelo de renderizado.

TanStack Start aparece únicamente como mapa de continuidad. Su configuración vigente usa SSR por defecto, admite `ssr: false` y configura prerender en el plugin de Vite. La clase no instala TanStack Start, no migra Router y no implementa loaders, Server Functions o prerender.

## Visuales conceptuales para la fase posterior

La futura presentación partirá de dos fuentes privadas del webinar `Tanstack-start-query-server`:

1. `assets/restaurant-rendering.html` para la primera intuición.
2. `assets/rendering-modes.html` para observar servidor, red, navegador, HTML, JavaScript, datos e hidratación.

El docente los presenta antes de definir CSR, SSR y SSG. El grupo predice qué viajará y dónde se ensamblará la interfaz. Después vuelve a cada frame y asigna el vocabulario formal.

Los HTML no se distribuyen sin revisión. La producción visual posterior debe:

- reemplazar afirmaciones absolutas sobre SEO y rendimiento;
- retirar cifras de latencia sin medición;
- aclarar que SSR no obliga a recargar toda la página después de hidratar;
- mostrar que SSG puede combinarse con interacción y consultas del cliente;
- formular la eliminación de una segunda petición como posibilidad, no garantía;
- diferenciar archivos estáticos de Vite de HTML React prerenderizado;
- usar `pnpm build` en lugar de `npm run build`;
- retirar snippets desactualizados y contenido de Server Functions, Zod, ISR y loaders.

## Vocabulario

- **Afirmación técnica:** frase concreta sobre el comportamiento o la arquitectura del producto.
- **Demostración:** acción ejecutada delante de otra persona para hacer observable un comportamiento.
- **Evidencia:** registro que respalda una afirmación, como una URL, salida de comando, request o deployment.
- **Límite de evidencia:** aquello que una comprobación todavía no permite concluir.
- **Revisión:** estado identificable del repositorio, normalmente mediante un commit.
- **Deployment:** ejecución que publica una revisión y produce un resultado accesible.
- **CSR:** construcción de la interfaz React en el navegador.
- **SSR:** generación de HTML durante una petición en un runtime de servidor.
- **SSG:** generación anticipada de HTML para servirlo como archivo.
- **Hidratación:** conexión de React y sus eventos con HTML generado previamente.

## Decisiones pedagógicas

- La clase observa primero y nombra después: visual del restaurante, visual técnico y formalización.
- CSR, SSR y SSG no forman parte de la calificación.
- La calidad visual de la presentación apoya la comunicación, pero no reemplaza funcionamiento o explicación.
- Cada integrante responde al menos una pregunta breve. Una respuesta de otro integrante no demuestra comprensión individual.
- Una captura o evidencia anterior de respaldo se usa solo cuando el recorrido real está bloqueado por una dependencia externa registrada; respalda el incidente, pero no convierte el comportamiento actual en aprobado.
- No se diagnostican fallos preparados ni se asignan puntos extra.
- La rúbrica cierra en 100 puntos.

## Organización de las presentaciones

El docente publica antes de clase un máximo de seis unidades de presentación. Una unidad puede ser individual o grupal según la organización institucional. La composición debe permitir que cada integrante intervenga y responda una pregunta breve dentro de los dos minutos disponibles. Si existen más de seis entregas o la agrupación no permite esa participación, el docente asigna otra franja; no agrupa más personas ni comprime los turnos silenciosamente.

Cada unidad dispone de nueve minutos:

```text
6 minutos de presentación y demostración
2 minutos de preguntas
1 minuto de transición
```

Seis unidades ocupan 54 minutos. Los seis minutos restantes cubren una reconexión breve, apertura de enlaces y ajustes acumulados. No se amplía una presentación consumiendo el turno siguiente.

## Checkpoint docente propuesto

`s08-c19-presentation-checkpoint` conserva el producto completo del checkpoint 18 y una configuración de demostración sin credenciales incluidas. Sirve para explicar el formato o continuar la clase si un proyecto individual no puede proyectarse.

No es el objeto calificable normal. Tampoco contiene un guion de defensa resuelto. Antes de compartirlo, el docente debe ejecutar:

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm build
```

La comprobación ejecutable pertenece a la futura construcción del checkpoint. Este paquete documental no demuestra todavía esos resultados.

## Secuencia completa

### Explicación y práctica guiada · 75 minutos

| Tiempo | Bloque | Actividad observable |
| --- | --- | --- |
| 0–10 | Recuperación | Confirmar URL, rama, revisiones local y publicada, deployment y orden; formular dónde y cuándo se crea el HTML visible. |
| 10–18 | Visual del restaurante | Recorrer CSR, SSR y SSG sin definiciones previas; el grupo predice qué prepara la cocina y qué llega a la mesa. |
| 18–30 | Visual técnico | Seguir servidor, red y navegador; identificar HTML, JavaScript, datos e hidratación. |
| 30–45 | Formalización | Nombrar CSR, SSR y SSG, corregir absolutos y ubicar `createRoot`, `hydrateRoot` y prerender. |
| 45–55 | Medialog y continuidad | Justificar por qué Medialog sigue siendo CSR y mencionar TanStack Start sin implementar otro stack. |
| 55–67 | Preparación de la defensa | Ordenar problema, recorrido, decisión, evidencia y límite; ensayar una pregunta individual. |
| 67–75 | Contrato del taller | Confirmar turnos, duración, contingencias, entrega y rúbrica de 100 puntos sin extras. |

### Descanso · 30 minutos

Durante el descanso, el docente abre en pestañas separadas las URL registradas y confirma que el orden coincide con la lista publicada. No corrige proyectos ni añade una demostración técnica nueva.

### Taller calificable · 60 minutos

- Hasta seis unidades ejecutan su turno de nueve minutos.
- El docente aplica la misma tabla a todas las unidades.
- Cada integrante interviene y responde una pregunta breve dentro de los dos minutos; la composición de la unidad ya fue validada antes de clase.
- Los seis minutos de reserva se consumen únicamente en transiciones o incidentes breves.
- No se modifica código durante el turno.

### Revisión y cierre · 15 minutos

| Tiempo | Actividad |
| --- | --- |
| 0–6 | Verificar que cada ficha final y enlace solicitado quedó entregado. |
| 6–11 | Recuperar tres decisiones transversales: propietario del estado, identidad en rutas y frontera de evidencia. |
| 11–15 | Cerrar el mapa de continuidad y registrar el siguiente paso personal sin convertirlo en requisito del curso. |

La suma es `75 + 30 + 60 + 15 = 180` minutos.

## Estructura de la defensa

La presentación de seis minutos usa este orden:

1. **Problema y producto, 40 segundos.** Qué puede hacer una persona con Medialog.
2. **Mapa del recorrido, 50 segundos.** Navegador, Router, Query, Firebase, API y Pages.
3. **Demostración, 3 minutos.** Ruta pública, protección privada, login y una operación personal.
4. **Decisión técnica, 50 segundos.** Un flujo aprendido y su propietario.
5. **Evidencia y límite, 40 segundos.** Qué revisiones local y publicada se presentan, si coinciden y qué prueba cada comprobación.

Los tiempos son referencias internas. El criterio evaluado es terminar dentro de seis minutos sin omitir el recorrido obligatorio.

## Trabajo con agente

El agente puede utilizarse antes del descanso como entrevistador de ensayo. No cambia archivos, no abre servicios, no redacta la exposición y no responde por el estudiante.

### Decisiones humanas previas

Antes de usarlo, la persona ya eligió:

- las afirmaciones que defenderá;
- el recorrido que demostrará;
- una decisión técnica propia;
- la evidencia y sus límites.

### Prompt listo para copiar

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

### Lectura posterior y comprobación

La persona responde oralmente sin copiar una respuesta generada. Después vuelve a ejecutar o revisar la evidencia que piensa presentar:

```bash
pnpm test
pnpm build
```

También recorre la URL publicada. Test y build no demuestran Cloudflare, Firebase, CORS, API o navegador.

## Guion de presentación conceptual

La futura presentación docente puede usar nueve momentos:

1. **La última pregunta:** ¿dónde y cuándo aparece el HTML?
2. **El restaurante:** tres recorridos sin etiquetas formales.
3. **Servidor, red y navegador:** repetir los recorridos con elementos técnicos.
4. **Pausa de predicción:** qué recibe primero el navegador en cada caso.
5. **Nombres formales:** CSR, SSR, SSG e hidratación.
6. **Medialog:** por qué el deployment actual sigue siendo CSR.
7. **Continuidad:** TanStack Start puede combinar modos, sin recomendar una migración.
8. **Defensa técnica:** afirmación, acción, evidencia y límite.
9. **Contrato de presentación:** seis minutos, preguntas, entrega y criterios.

El recurso principal es el visual técnico. La analogía del restaurante se retira después de formalizar para que cocina, mesero y mesa no sustituyan el vocabulario real.

## Fuera de alcance

- Implementar SSR, SSG, hidratación o TanStack Start.
- Migrar desde React Router declarativo.
- Crear loaders, Server Functions, ISR o React Server Components.
- Añadir una feature final o corregir el CRUD durante el taller.
- Calificar CSR, SSR o SSG.
- Calificar decoración, cantidad de slides o animaciones.
- Incluir diagnóstico de fallos preparados o puntos extra.
- Crear ahora la presentación visual, los HTML refinados, assets, PNG o PDF.

## Fuentes verificadas · 7 de septiembre de 2026

- React y React DOM `19.2.8`, documentación oficial del minor 19.2, [`createRoot`](https://react.dev/reference/react-dom/client/createRoot).
- React y React DOM `19.2.8`, documentación oficial del minor 19.2, [`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot).
- React y React DOM `19.2.8`, documentación oficial del minor 19.2, [`prerender`](https://react.dev/reference/react-dom/static/prerender).
- TanStack Start, [Selective SSR](https://tanstack.com/start/latest/docs/framework/react/guide/selective-ssr).
- TanStack Start, [Static Prerendering](https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering).

## Cambios retrospectivos

- La sesión 18 entrega URL, rama de producción, revisión local comprobada, revisión publicada, deployment id y matriz de evidencia; este paquete exige además confirmar que ambas revisiones coinciden y no vuelve a enseñar despliegue.
- `draft/index.md` se revisó y ya enlaza esta sesión como cierre del itinerario; no requiere cambios.
- Lectura previa, guía docente, guía estudiantil y rúbrica se revisaron y conservan el mismo contrato de presentación y evidencia.
- `rules/course-architecture.md` ya establece que CSR, SSR y SSG son un mapa conceptual no evaluado y que la sesión no añade implementación.
- No existe una sesión posterior que reciba el checkpoint: los bloqueos o límites restantes quedan declarados en la ficha final.
