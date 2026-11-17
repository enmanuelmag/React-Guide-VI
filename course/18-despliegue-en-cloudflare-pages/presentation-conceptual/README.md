# De mi computadora a la web

Presentación complementaria conceptual aprobada por el usuario el 12 de noviembre de 2026, con 10 diapositivas. No es la presentación operativa completa de la sesión 18 ni acredita un despliegue real.

10 diapositivas visuales: actores, pipeline, build, artefactos, hosting, CDN, caché, DNS, HTTPS, CSR y nuevas versiones. Las explicaciones extensas y preguntas viven en las notas del presentador.

Desde `presentation-framework/approved`:

```sh
pnpm session-18:dev
pnpm session-18:generate
```

Flechas para navegar; `S` para notas; `F` para pantalla completa. PDF en `artifacts/presentation.pdf`.

`generate.py` contiene el contenido y los diagramas editables. `session-18:generate` regenera el HTML desde esa fuente y luego produce y verifica el build, las capturas y el PDF. `session.css` añade únicamente el layout de este deck al framework aprobado. Los alias de sesión 18 apuntan por ahora a esta presentación conceptual complementaria.

## Fuentes

- [Cloudflare Pages: integración Git](https://developers.cloudflare.com/pages/configuration/git-integration/)
- [Cloudflare Pages: entrega de páginas y SPA](https://developers.cloudflare.com/pages/configuration/serving-pages/)
- [Cloudflare: CDN](https://www.cloudflare.com/learning/cdn/what-is-a-cdn/)
- [Cloudflare: nodos de CDN](https://www.cloudflare.com/learning/cdn/glossary/edge-server/)
- [Cloudflare: caché y rendimiento](https://www.cloudflare.com/learning/cdn/performance/)
- [Vite: despliegue estático](https://vite.dev/guide/static-deploy.html)
- [Vite: variables públicas](https://vite.dev/guide/env-and-mode.html)
- [Lucide: iconos SVG](https://github.com/lucide-icons/lucide). Copias locales; licencia completa en `assets/LUCIDE-LICENSE.txt`. Los iconos se insertan como SVG inline, conservando sus trazos.

Fuentes consultadas el 12 de noviembre de 2026. Context7 consultado para Cloudflare Pages; documentación primaria para las explicaciones y assets. El índice Mintlify no está disponible en las herramientas de esta sesión.
