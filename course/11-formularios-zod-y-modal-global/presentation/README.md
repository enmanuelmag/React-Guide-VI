# Sesión 11 · Formularios, Zod y modal global

Presentación aprobada por el usuario el 8 de octubre de 2026. El frontend llega a `session-11-end` y la guía docente contiene la ruta detallada desde `session-10-end`.

## Abrir y regenerar

Desde `presentation-framework/approved/`:

```bash
pnpm session-11:dev -- --port 5191
pnpm session-11:generate
```

La fuente editable es [index.html](index.html), con estilos locales en [session.css](session.css). El runtime de Reveal.js, las fuentes y los recursos compartidos proceden del framework aprobado. La generación produce `artifacts/presentation.pdf`, build, auditoría y capturas de las 28 diapositivas.

Flechas: navegar. Tecla `S`: notas del presentador. El PDF excluye las notas privadas. No abrir el HTML fuente con `file://`: necesita el servidor o el build servido por HTTP.

## Recorrido docente

1. Diapositivas 01–06: portada, mapa de herramientas, checkpoint, problema y responsables de los datos.
2. 07–12: store mínimo, estado derivado, selectores y un modal en el layout.
3. 13–20: datos del medio elegido, schema, validación y campos del formulario.
4. 21–26: submit, body local, adapter y reinicios.
5. 27–28: límites del agente y transición al coding.

El bloque se presenta de manera continua antes del editor. Los snippets explican conceptos: no sustituyen los archivos completos de la guía docente. El cierre posterior será oral. No se realiza POST de creación en esta sesión.

Diseño y ritmo propuesto: [plan de producción](../../../presentation-framework/draft/session-11-presentation-plan.md). Procedencia de imágenes: [assets/sources.md](assets/sources.md).
