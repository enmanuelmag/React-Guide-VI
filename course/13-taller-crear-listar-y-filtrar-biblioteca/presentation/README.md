# Sesión 13 · Crear, listar y filtrar biblioteca

Presentación aprobada por el usuario el 26 de octubre de 2026. Se conserva la portada y el recorrido de 19 diapositivas; la aprobación autorizó alinear código y guía docente de la sesión 13.

Desde `presentation-framework/approved/`:

```bash
pnpm deck:dev -- --deck ../../course/13-taller-crear-listar-y-filtrar-biblioteca/presentation --port 5197
pnpm deck:generate -- --deck ../../course/13-taller-crear-listar-y-filtrar-biblioteca/presentation
```

Fuente: [index.html](index.html). Estilos: [session.css](session.css). PDF: [presentation.pdf](artifacts/presentation.pdf).

19 diapositivas tras la revisión del 26 de octubre de 2026: portada y 18 vistas de contenido. Recorrido: Elegir → Guardar → Actualizar → Ver biblioteca → Filtrar → Salir. Flechas para navegar; `S` abre notas privadas, excluidas del PDF. Presentación continua antes del editor.

La explicación y su ejemplo se muestran juntos cuando comparten una misma idea. La portada se conserva por petición del usuario. Se retiraron el mapa independiente, la analogía en una slide separada y el cierre dedicado solo a abrir el editor. Se conservaron lectura/escritura, autenticación, estados, invalidación, consulta privada, modelo visual, filtro y encargo del taller. La analogía de la lista impresa queda como apoyo oral en las notas.

El deck explica las piezas del taller sin entregar la implementación de filas, lista o filtro interactivo. El código progresivo y la guía detallada se alinean con esta versión aprobada; el seed anterior al taller omite las soluciones evaluadas.

## Fuentes

Consultadas con Context7 el 10 de octubre de 2026:

- [Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/mutations).
- [Invalidations from Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations).
- [Query Keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys).
- [Query Invalidation](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation).
- [QueryClient](https://tanstack.com/query/latest/docs/reference/QueryClient).

Los endpoints y estados HTTP representan el contrato del curso; crear la presentación no comprueba Firebase ni el backend real.

