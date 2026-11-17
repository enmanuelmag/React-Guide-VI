# Decisiones aprobadas del framework de presentaciones

Esta carpeta conserva las decisiones que ya forman parte del contrato de producción de las 18 presentaciones.

## Estado actual

- [Catálogo de diapositivas y stack](slide-catalog-and-stack.md): aprobados 18 geometrías, 59 casos semánticos, estructura de trabajo y stack HTML + Reveal.js + Tailwind compilado + Vite con pnpm.
- [Dirección visual · Laboratorio claro](visual-direction.md): aprobados filosofía, marca, paleta, tipografía, densidad, grilla, recursos, movimiento y accesibilidad.
- Runtime, galería y pipeline ejecutable: aprobados después de la revisión visual de la galería y del piloto de la sesión 01.
- [Comandos de uso](USAGE.md): `deck:dev` sirve cualquier deck y `deck:generate` produce build, auditoría, PNG y PDF mediante un solo orquestador.

Los experimentos permanecen en `../draft/`; las presentaciones finales de cada sesión viven en `course/<sesión>/presentation/` y consumen este runtime compartido.
