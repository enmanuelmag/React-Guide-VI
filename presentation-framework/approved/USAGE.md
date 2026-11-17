# Uso del runtime aprobado

Ejecuta los comandos desde `presentation-framework/approved/`.

## Galería

```bash
pnpm gallery:dev
pnpm gallery:build
pnpm gallery:audit
pnpm gallery:capture
pnpm gallery:pdf
pnpm gallery:verify
```

## Lecturas previas para Aula Virtual

```bash
pnpm readings:generate
```

Genera `pre-class-reading.html` en cada carpeta de `course/`. Cada archivo incorpora su estilo, no requiere Node ni dependencias del repositorio para abrirse y es el archivo que se carga para estudiantes; `pre-class-reading.md` permanece como fuente editable.

Para abrir el navegador automáticamente:

```bash
pnpm gallery:dev -- --open true
```

## Otro deck

```bash
pnpm deck:dev -- --deck <ruta>
pnpm deck:generate -- --deck <ruta>
```

`deck:generate` ejecuta un único orquestador, `scripts/verify-deck.mjs`. En secuencia genera el build, audita las slides, captura los PNG FHD, exporta el PDF y verifica sus páginas. `deck:verify` se conserva como alias compatible del mismo proceso.

## Sesión 01

```bash
pnpm session-01:dev
pnpm session-01:generate
```

El primer comando solo abre el servidor de desarrollo. El segundo genera y verifica todos los artefactos cuando se necesiten; no hace falta ejecutarlo después de cada corrección textual o visual.

## Flujo de iteración

1. Mantén parametrizados los campos repetibles de la sesión: metadata, títulos, contenido, assets, captions y notas.
2. Sirve el deck con `deck:dev` y ajusta manualmente el HTML o CSS cuando una composición lo necesite.
3. Genera PNG durante el trabajo cuando sea la forma más rápida de inspeccionar una o varias slides.
4. Genera el PDF durante la iteración solo si necesitas comprobar impresión, fragments o paginación.
5. Ejecuta `deck:generate` completo antes de cerrar una presentación definitiva.

La parametrización es una ayuda de autoría, no una restricción. El HTML resultante debe seguir siendo comprensible y editable sin depender de un esquema universal.

La ruta se resuelve desde el directorio donde ejecutas pnpm. El deck debe contener `index.html` y cargar el entrypoint compartido `src/framework/deck.js`.

La auditoría activa cada slide antes de medirla. Falla si un snippet tiene contenido oculto, además de comprobar el overflow del lienzo, metadatos, tipografía y assets.

## Notas docentes

Cada slide puede incluir notas privadas:

```html
<aside class="notes">Explicación y preguntas para el docente.</aside>
```

Durante la presentación, presiona `S` para abrir Presenter View. El PDF estudiantil usa `showNotes: false` y no incluye esas notas.

## Artefactos

Los comandos generan archivos dentro de `<deck>/artifacts/`:

```text
artifacts/
├── build/
├── presentation.pdf
└── review/
    ├── audit.json
    ├── presentation.txt
    ├── pdf/
    └── slides/
```

El HTML, los assets y las notas son fuente. Los archivos dentro de `artifacts/` se regeneran y no forman parte del estado editorial de una presentación.
