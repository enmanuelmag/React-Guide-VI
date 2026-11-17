# Guía docente · Sesión 19 · Presentaciones y cierre

> Material privado del docente. No publicar la clave del cuestionario ni las notas de calificación con la guía estudiantil.
>
> Estado: paquete textual aprobado. La presentación visual y el checkpoint de contingencia ejecutable permanecen pendientes.

- **Fecha:** sábado 14 de noviembre de 2026
- **Semana:** 8
- **Modalidad:** presencial
- **Duración:** 180 minutos
- **Lectura previa:** [pre-class-reading.md](pre-class-reading.md)
- **Guía estudiantil:** [student-guide.md](student-guide.md)
- **Taller calificable:** 60 minutos
- **Rúbrica:** [workshop-rubric.md](workshop-rubric.md)
- **Borrador de sesión:** [session-draft.md](session-draft.md)
- **Checkpoint de contingencia propuesto:** `s08-c19-presentation-checkpoint`

## Objetivo docente

Conducir una sesión final en la que el grupo observe primero tres recorridos de renderizado, formalice después CSR, SSR y SSG y, tras el descanso, defienda el producto construido sin añadir código.

La dificultad principal no es hablar en público. Es sostener una afirmación técnica mediante una acción observable, una evidencia pertinente y un límite honesto.

La sesión recibe de la sesión 18 la URL, la rama de producción, la revisión local comprobada, la revisión publicada, el deployment y la ficha de evidencia de cada unidad. Antes de presentar, confirma que ambas revisiones coinciden. No usa este bloque para completar la publicación.

## Preparación antes de clase

### Organización institucional

- Publica un máximo de seis unidades de presentación.
- Confirma integrantes, orden y producto que usará cada unidad.
- Asegura que cada integrante tendrá una intervención y una pregunta individual breve dentro de los dos minutos de preguntas.
- Si existen más de seis entregas o la agrupación no permite esa participación individual, asigna otra franja. No aumentes el tamaño de los equipos ni reduzcas los turnos el mismo día.
- Abre una hoja de calificación por unidad con la tabla exacta de la rúbrica.

### Evidencia y servicios

- Recoge URL, rama de producción, revisión local comprobada, revisión publicada y deployment antes de la sesión; confirma que las dos revisiones coinciden.
- Abre cada URL en una pestaña separada y comprueba solo disponibilidad inicial.
- Confirma que los orígenes registrados siguen autorizados por el backend docente.
- Conserva una cuenta de demostración por unidad o define quién iniciará sesión.
- Pide que exista al menos una entrada personal que pueda actualizarse sin improvisar datos.
- Lleva el checkpoint docente de contingencia sin secretos incorporados.

### Visuales

La futura producción visual debe refinar estas fuentes privadas:

- `Obsidian-KnowledgeBase/Contenido/Webinars/Tanstack-start-query-server/assets/restaurant-rendering.html`;
- `Obsidian-KnowledgeBase/Contenido/Webinars/Tanstack-start-query-server/assets/rendering-modes.html`.

No proyectes las versiones actuales como material definitivo. Antes deben aplicarse las correcciones registradas en `session-draft.md`: absolutos de SEO y rendimiento, cifras sin medición, `pnpm build`, SSR posterior a hidratación, filtros cliente en SSG y configuración vigente de TanStack Start.

Si los HTML refinados todavía no existen, reproduce los recorridos con tres diagramas estáticos. No improvises snippets de TanStack Start.

## Fronteras que debes declarar

- CSR, SSR y SSG son orientación no evaluada.
- Medialog no se migra y continúa como SPA CSR.
- El taller no corrige código ni deployment.
- Una captura de respaldo no sustituye una demostración disponible.
- Un bloqueo externo documentado no se presenta como éxito, pero tampoco borra automáticamente criterios independientes.
- No existen puntos extra en esta sesión.

## Secuencia general

```text
75 min explicación y práctica guiada
30 min descanso
60 min presentaciones calificables
15 min revisión y cierre
```

## 0–10 min · Recuperar el producto publicado

### Apertura

Proyecta la URL del checkpoint docente y pregunta:

> Cloudflare ya sirve archivos desde una URL externa. ¿Eso nos dice dónde construyó React el contenido de esta pantalla?

Respuesta esperada: no. Hosting estático describe cómo se distribuyen los archivos. Para reconocer el modelo de renderizado hay que observar el HTML inicial, cuándo se ejecuta React y si existía contenido generado antes de llegar al navegador.

### Comprobación rápida

Pide a cada unidad mostrar, sin proyectar todavía:

- URL;
- rama de producción;
- revisión local comprobada;
- revisión publicada y coincidencia entre ambas;
- deployment;
- cuenta o recorrido privado preparado;
- ficha de presentación.

Si falta uno, regístralo. No abras un bloque de reparación.

### Transición

> Antes de presentar lo que construimos, vamos a mirar tres formas de producir la primera pantalla. Todavía no les pondremos nombre.

## 10–18 min · Observar el restaurante

Recorre los tres modos en `restaurant-rendering.html`. En cada uno detente antes del primer traslado y pregunta:

1. ¿La cocina prepara un plato completo o solo entrega piezas?
2. ¿La mesa recibe algo visible antes de que llegue la interactividad?
3. ¿La preparación ocurre ahora o ya ocurrió?

No corrijas usando CSR, SSR o SSG durante la primera vuelta. Registra palabras del grupo: antes, petición, navegador, completo, piezas, interacción.

### Cuidado con la analogía

La cocina no siempre equivale a “un servidor permanente”. En SSG representa el proceso de build. El mesero tampoco representa únicamente HTML: puede transportar HTML, JavaScript o datos. Explicita estas limitaciones antes de abandonar el visual.

## 18–30 min · Observar servidor, red y navegador

Abre `rendering-modes.html` y repite carga inicial para los tres modos.

### Preguntas por frame

- ¿Qué proceso está activo?
- ¿Qué cruza la red?
- ¿El HTML contiene contenido o solo el punto de montaje?
- ¿Cuándo aparecen los handlers de interacción?
- ¿Qué parte del recorrido no podemos concluir a partir de este frame?

En búsqueda y filtros, evita afirmar que SSR exige recarga completa o que SSG impide interacción. Formula el contraste así:

- una página ya hidratada puede navegar o consultar datos desde el cliente;
- un archivo prerenderizado puede incluir JavaScript y filtros cliente;
- para producir HTML personalizado por petición sí hace falta un runtime que atienda esa petición.

### Checkpoint intermedio

El grupo puede describir cada recorrido sin usar todavía ventajas universales de SEO, velocidad o costo.

## 30–45 min · Formalizar CSR, SSR, SSG e hidratación

### CSR

Vuelve al `main` de Medialog:

```text
index.html con nodo raíz
→ navegador descarga JavaScript
→ createRoot toma el nodo
→ React construye la interfaz
```

Evita “HTML vacío” como absoluto. El documento contiene un shell, metadatos y referencias; lo relevante es que el contenido React no llega prerenderizado.

### SSR

```text
petición
→ runtime ejecuta renderizado
→ responde HTML con contenido
→ navegador muestra
→ hydrateRoot conecta React y eventos
```

El HTML inicial puede ser visible antes de hidratar, pero la interacción React todavía no está conectada. SSR no garantiza mejor resultado para todos los proyectos ni obliga a que las navegaciones posteriores recarguen el documento.

### SSG

```text
build o prerender
→ genera HTML por adelantado
→ CDN sirve el archivo
→ navegador puede hidratar
```

La diferencia central frente a SSR es cuándo se generó el HTML. No prometas “SEO perfecto” o “máximo rendimiento”. El resultado depende del contenido, caché, JavaScript, red y medición.

### Preguntas de comprobación

1. ¿Qué API del proyecto actual toma un nodo DOM? `createRoot`.
2. ¿Qué necesita HTML generado previamente para conectar eventos React? Hidratación.
3. ¿Qué cambia principalmente entre SSR y SSG? El momento de generación del HTML.
4. ¿Un CDN convierte automáticamente la SPA en SSG? No.

## 45–55 min · Ubicar Medialog y TanStack Start

Presenta este contraste:

```text
Medialog actual
Vite build → archivos estáticos → navegador ejecuta createRoot

Posible continuidad
framework full-stack → SSR por defecto, cliente selectivo o prerender configurado
```

TanStack Start sirve como ejemplo porque puede decidir renderizado por ruta. La documentación vigente usa:

- SSR por defecto;
- `ssr: false` para desactivar SSR en una ruta;
- `ssr: "data-only"` para ejecutar datos en servidor y componente en cliente;
- `prerender` dentro de la configuración del plugin de Vite.

No muestres implementación. El objetivo es que el grupo sepa qué pregunta investigar después, no que copie otra arquitectura.

## 55–67 min · Preparar la defensa

Entrega esta matriz:

| Parte | Pregunta que responde |
| --- | --- |
| Problema | ¿Qué puede lograr una persona con el producto? |
| Arquitectura | ¿Qué piezas participan en el recorrido? |
| Demostración | ¿Qué comportamiento veremos ahora? |
| Decisión | ¿Quién posee este estado o identidad y por qué? |
| Evidencia | ¿Qué registro respalda la afirmación? |
| Límite | ¿Qué no demuestra ese registro? |

Cada unidad prepara una frase por fila. No escribas su presentación.

### Ensayo con agente opcional

La persona puede usar este prompt. El agente formula cinco preguntas y señala afirmaciones sin respaldo. No accede a archivos ni produce respuestas.

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

Después, cada integrante responde oralmente una pregunta. Intervén cuando la respuesta:

- confunda TanStack Query con el backend;
- llame autenticación a la guardia de ruta;
- use build como prueba de navegador;
- diga que Zustand contiene datos remotos;
- confunda `externalId` con `logId`.

## 67–75 min · Explicar el contrato de evaluación

Proyecta la rúbrica completa. Recorre sus cinco criterios y declara:

- base total: 100;
- sin extras;
- seis minutos de exposición y demo;
- dos minutos de preguntas;
- un minuto de transición;
- cada integrante responde una pregunta breve dentro de los dos minutos;
- CSR, SSR y SSG no se califican.

Pide que la primera pestaña sea la URL pública y que las credenciales no aparezcan en slides, chat o código.

## 75–105 min · Descanso

Abre las URL según el orden publicado. Si una no responde, anota el incidente y prepara el checkpoint docente. No modifiques el proyecto del estudiante.

## 105–165 min · Presentaciones calificables

### Cronómetro por unidad

```text
0:00–6:00 presentación y demostración
6:00–8:00 preguntas
8:00–9:00 transición
```

Usa seis minutos globales de reserva. No los anuncies como tiempo adicional por unidad.

### Recorrido mínimo esperado

1. Problema y usuario.
2. Arquitectura del recorrido.
3. Ruta pública anidada abierta directamente y recargada.
4. `/app/library` sin sesión y redirección a Login.
5. Login y una operación privada.
6. Una decisión técnica con propietario identificable.
7. Evidencia y límite.

### Banco de preguntas

Elige preguntas acordes con lo presentado:

- ¿Qué dato identifica la ruta pública y cuál identifica un registro personal?
- ¿Quién conserva el DTO remoto y quién conserva la intención de abrir el modal global?
- ¿Por qué el filtro privado forma parte de la query key?
- ¿Qué ocurre con la caché Media después de un logout exitoso?
- ¿Por qué el formulario espera la respuesta del servidor antes de cerrar?
- ¿Qué demuestra `pnpm build` y qué no demuestra?
- ¿Qué parte del recorrido depende de Firebase y cuál del backend docente?

No preguntes sintaxis que la unidad no utilizó ni CSR, SSR o SSG como parte de la nota.

### Incidentes durante el turno

- **URL no abre:** permite evidencia anterior de respaldo solo si una dependencia externa estaba registrada. Evalúa por separado los criterios todavía observables; la evidencia anterior documenta el incidente, pero no acredita funcionamiento actual.
- **Login falla:** pide demostrar la ruta pública y explicar el recorrido privado. No inventes éxito.
- **API no responde:** conserva la evidencia disponible y aplica únicamente los criterios demostrados.
- **Expositor excede seis minutos:** detén con una transición clara y pasa a preguntas.
- **Una persona monopoliza:** dirige la siguiente pregunta a otro integrante.

No abras ejercicios de diagnóstico ni concedas puntos adicionales.

## 165–180 min · Revisión y cierre

### 0–6 min · Entregas

Confirma que cada unidad entregó:

- URL;
- rama de producción;
- revisión local comprobada;
- revisión publicada y coincidencia entre ambas;
- deployment;
- evidencia de test y build;
- ficha final;
- limitaciones conocidas.

### 6–11 min · Tres decisiones transversales

Pide ejemplos del curso para:

1. propietario de estado;
2. identidad en URL, catálogo y registro personal;
3. frontera entre test, build, Network y deployment.

### 11–15 min · Cierre

Pregunta:

> Si el próximo producto necesitara HTML generado antes de ejecutar JavaScript en el navegador, ¿qué decisión investigarías primero?

Respuesta esperada: el modelo de renderizado y el framework o runtime que lo soportará, junto con requisitos de contenido, personalización, caché y medición. No basta elegir SSR o SSG por una ventaja genérica.

## Clave del cuestionario previo

### Pregunta 1

- **Respuesta:** B. Crea una raíz de React dentro de un nodo del DOM.
- **Justificación:** `createRoot` permite que React administre el contenido del nodo recibido.
- **Fuente:** React, `createRoot`, introducción y “Rendering an app fully built with React”.

### Pregunta 2

- **Respuesta:** Verdadero.
- **Justificación:** `hydrateRoot` conecta React y sus eventos con un HTML que ya fue generado.
- **Fuente:** React, `hydrateRoot`, “Hydrating server-rendered HTML”.

### Pregunta 3

- **Respuesta:** A. HTML estático.
- **Justificación:** `prerender` produce un stream con HTML estático.
- **Fuente:** React, `prerender`, introducción y retorno.

### Pregunta 4

- **Respuesta:** Falso.
- **Justificación:** servir archivos desde un CDN describe distribución. El árbol React solo está prerenderizado si un proceso lo generó dentro del HTML.
- **Fuente:** contraste entre React `createRoot`, React `prerender` y el checkpoint de Vite.

### Pregunta 5

- **Respuesta:** C. El HTML se genera en momentos diferentes.
- **Justificación:** SSR genera durante la petición; SSG genera antes de la visita.
- **Fuente:** React `hydrateRoot`, React `prerender` y TanStack Start, “Static Prerendering”.

## Criterio privado de calibración

- La demostración base no necesita recorrer todo el CRUD. Debe completar una operación privada y mostrar que conoce el resto del producto.
- La explicación puede usar un diagrama propio, pero no se puntúa su diseño ornamental.
- Si el producto funciona pero nadie puede explicar propiedad, identidad o evidencia, no recibe el criterio completo de explicación.
- Si una dependencia externa falla, no asignes cero a una decisión técnica que todavía pueda explicarse y comprobarse en código o evidencia anterior.
- La calificación no incluye puntos extra.

## Plan de contingencia

1. **Sin HTML refinado:** usa tres diagramas estáticos y conserva observación antes de definición.
2. **Sin internet para documentación:** usa las definiciones y contrastes de esta guía; no improvises APIs.
3. **Cloudflare o backend caído para varias unidades:** proyecta el checkpoint docente para explicar el formato, recibe grabaciones fechadas y aplica solo evidencia verificable según la política institucional.
4. **Falta una unidad:** conserva el turno para revisión posterior; no distribuyas sus minutos como puntos o ventaja a otra unidad.
5. **Falla el agente:** omite el ensayo asistido y usa el banco de preguntas. El agente no es prerrequisito.

## Límite de esta guía

Esta documentación especifica la clase y la evaluación. No demuestra que el checkpoint compile, que los HTML refinados existan o que Cloudflare, Firebase y la API estén disponibles el día de la sesión.
