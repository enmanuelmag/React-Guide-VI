# Lectura previa · Sesión 18 · Build, publicación y configuración pública

- **Duración estimada:** 20 minutos
- **Fuentes:** Cloudflare Pages y Vite, documentación oficial
- **Fecha de verificación:** 7 de septiembre de 2026

## Propósito

Llegar a clase con un mapa simple del despliegue:

```text
repositorio
  → build remoto
  → carpeta dist
  → URL pages.dev
  → React Router en el navegador
```

También debes reconocer que una variable `VITE_*` forma parte de la aplicación cliente. Su value no queda oculto por configurarlo en el dashboard del proveedor.

La lectura no te pide crear un proyecto Cloudflare, conectar tu repositorio o copiar variables. Esas acciones se realizarán con guía durante la sesión.

## Conocimientos previos

Recupera antes de leer:

- `pnpm build` y `pnpm preview`;
- `dist` como salida de Vite;
- `import.meta.env`;
- `BrowserRouter`, rutas y parámetros;
- diferencia entre frontend, Firebase y API docente;
- `.env.example` como inventario: URL pública de la API y nombres de Firebase sin values propios.

## Fuente 1 · Publicar React en Cloudflare Pages

Lee en Cloudflare:

- **Título principal:** [React · Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/)
- **Título complementario:** [Serving Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/)
- **Organización:** Cloudflare
- **URL principal:** `https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/`
- **URL complementaria:** `https://developers.cloudflare.com/pages/configuration/serving-pages/`
- **Versión:** servicio Cloudflare Pages y documentación vigentes al verificar.
- **Fecha de verificación:** 7 de septiembre de 2026

**Tiempo sugerido:** 14 minutos.

En la guía de React, lee únicamente:

- `Before you continue`;
- `Deploy via the Cloudflare dashboard`;
- la nota `SPA rendering`.

En `Serving Pages`, lee únicamente:

- `Not Found behavior`;
- `Single-page application (SPA) rendering`.

La documentación muestra `npm run build`. El curso conserva pnpm, por lo que usará `pnpm build`. La salida de Vite sigue siendo `dist`.

Concéntrate en estas relaciones:

```text
rama conectada
  → Pages instala dependencias
  → ejecuta el build
  → publica dist
  → asigna una URL
```

Cloudflare Pages trata la salida como SPA cuando no encuentra un `404.html` superior. Así puede entregar la entrada raíz para una URL anidada y permitir que React Router decida qué página renderizar.

No estudies C3, Direct Upload, Wrangler, Pages Functions, custom domains o preview branches.

## Fuente 2 · Variables que llegan al cliente

Lee en Vite:

- **Título:** [Env Variables and Modes](https://vite.dev/guide/env-and-mode.html)
- **Organización:** Vite
- **URL:** `https://vite.dev/guide/env-and-mode.html`
- **Versión:** Vite `8.2.2`, fijada por el proyecto; Context7 confirmó el contrato en la documentación versionada disponible de Vite 8.
- **Fecha de verificación:** 7 de septiembre de 2026

**Tiempo sugerido:** 6 minutos.

Lee únicamente:

- `Env Variables`;
- la advertencia sobre variables `VITE_*` y datos sensibles;
- el párrafo que explica que los values se reemplazan durante el build.

Observa:

```ts
const apiUrl = import.meta.env.VITE_API_URL
```

El prefijo permite usar el value en el código cliente. Vite lo incorpora al bundle que descarga el navegador. No coloques allí contraseñas, tokens de ID, tokens de Cloudflare, cuentas de servicio o claves privadas.

La configuración web de Firebase usada por el curso identifica el proyecto y puede vivir en el cliente. Una cuenta de servicio de Firebase pertenece al servidor y nunca usa el prefijo `VITE_`.

## Vocabulario previo

- **Build:** transformación del código fuente en archivos distribuibles.
- **Artefacto:** archivo producido por el build.
- **Deploy:** publicación de artefactos en un entorno accesible.
- **Build remoto:** build ejecutado en la infraestructura del proveedor.
- **Variable pública:** configuración incorporada al código cliente.
- **Secreto:** credencial que no puede enviarse al navegador.
- **Fallback SPA:** entrega de la entrada de la aplicación para una ruta que interpretará el router cliente.
- **Origen:** esquema y host, con puerto cuando corresponde, desde los cuales el navegador realiza requests.
