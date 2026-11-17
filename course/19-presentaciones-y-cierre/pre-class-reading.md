# Lectura previa · Sesión 19 · ¿Dónde se genera el HTML?

## Propósito

Reconocer la diferencia entre construir una interfaz en el navegador, hidratar HTML generado previamente y producir HTML estático antes de una visita. En clase observarás primero estos recorridos en dos visualizaciones y después les asignarás los nombres CSR, SSR y SSG.

No implementarás estas APIs en Medialog.

- **Tiempo estimado:** 20 minutos
- **Verificación de fuentes:** 7 de septiembre de 2026
- **Versión fijada del curso:** React y React DOM `19.2.8`

## Conocimientos previos

- `createRoot` como entrada de la aplicación actual.
- Vite, `pnpm build` y la carpeta `dist`.
- React Router en el navegador.
- Deployment estático en Cloudflare Pages.
- Diferencia entre build, deployment y comportamiento del navegador.

## Fuente principal · React DOM

- **Organización:** React.
- **Documentación:** React 19.2 para la versión fijada `19.2.8` de React y React DOM.
- **Fecha de verificación:** 7 de septiembre de 2026.

Lee estas páginas oficiales:

1. [`createRoot`](https://react.dev/reference/react-dom/client/createRoot): introducción y “Rendering an app fully built with React”.
2. [`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot): introducción y “Hydrating server-rendered HTML”.
3. [`prerender`](https://react.dev/reference/react-dom/static/prerender): introducción, parámetros, retorno y la primera nota sobre HTML estático.

Busca estas ideas:

- `createRoot` toma control de un nodo DOM del navegador y representa componentes dentro de él;
- `hydrateRoot` conecta React con HTML que ya fue generado;
- el HTML previo todavía necesita hidratación para que React conecte sus eventos;
- `prerender` produce una salida HTML estática antes de servirla a una visita.

No necesitas memorizar imports, parámetros avanzados, streaming o reanudación.

## Fuente secundaria · TanStack Start

- **Organización:** TanStack.
- **Documentación:** TanStack Start para React, rama `latest`.
- **Fecha de verificación:** 7 de septiembre de 2026.

Revisa solamente:

- la introducción y las opciones `true`, `false` y `data-only` de [Selective SSR](https://tanstack.com/start/latest/docs/framework/react/guide/selective-ssr);
- la introducción de [Static Prerendering](https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering).

Busca dos conclusiones:

- un framework puede decidir el modelo por ruta;
- prerenderizar exige una configuración de build explícita.

No leas Server Functions, loaders, ISR, React Server Components o configuración de deployment. Son posibles continuaciones, no contenido práctico de esta sesión.

## Vocabulario previo

- **CSR:** construcción del contenido React en el navegador.
- **SSR:** generación de HTML durante una petición en un runtime de servidor.
- **SSG:** generación anticipada de HTML, normalmente durante build.
- **Hidratación:** conexión de React y sus eventos con HTML generado previamente.
- **HTML inicial:** markup recibido antes de que React complete la interacción.
- **Prerender:** proceso que produce HTML antes de la visita que lo consumirá.
