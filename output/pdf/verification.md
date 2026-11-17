# Verificación de los PDF del proyecto

Fecha: 19 de octubre de 2026.

Última revisión: se retiró de las tres fuentes el aviso interno de aprobación docente y futura exportación. El pie ahora indica «Proyecto · Consigna de trabajo» y los recuadros de participación se mantienen completos en una página. Los prompts y los comentarios fuente de los watermarks se conservaron. Se regeneraron los tres PDF y sus hashes; se repitieron los cuatro extractores, las 232 selecciones parciales con PDFKit y la comparación de las 31 páginas con controles sin texto invisible. Se revisaron las hojas de contacto. No se repitió la copia manual del portapapeles en esta revisión.

Los PDF se generaron desde los tres Markdown aprobados de `Projects/`, sin modificar su contenido. El registro `verification.json` conserva hashes SHA-256 de fuentes y PDF, resultados por extractor y comprobación de la copia desde Vista Previa.

| Fase | Páginas | Recordatorios completos | Extracción | Copia manual previa desde Vista Previa |
| --- | ---: | ---: | --- | --- |
| 1 · Definición funcional | 11 | 6 de 6 | Cuatro métodos correctos | 6 de 6 |
| 2 · Procesos y reglas | 9 | 6 de 6 | Cuatro métodos correctos | 6 de 6 |
| 3 · Diseño técnico | 11 | 6 de 6 | Cuatro métodos correctos | 6 de 6 |

## Texto invisible sin huecos

El exportador lee los comentarios `AHK-LEARNING-CHECKPOINT` y los asocia con su página sin reservar altura en la maquetación. Al terminar la página, escribe sus textos con el modo de renderizado PDF 3: texto no pintado. Se ubican en una zona independiente bajo el pie visible, sin superponerse al cuerpo ni cambiar su distribución. No son texto blanco sobre fondo blanco, una imagen ni un bloque en blanco dentro del contenido.

Se compararon imágenes de las 31 páginas contra PDF de control que omiten por completo esos textos: igualdad píxel a píxel en todas. También se revisaron las páginas renderizadas, incluidas tablas y prompts. La revisión del usuario detectó un hueco en la primera exportación; se corrigió eliminando el espacio reservado y se repitieron las comprobaciones sobre los archivos finales.

## Extracción y copia

Cada payload completo se recuperó con pypdf, pdfplumber, Poppler `pdftotext` y Poppler `pdftotext -layout`. Se comprobó además que no faltaran palabras de las fuentes al extraer, excluyendo sintaxis Markdown y destinos de enlaces que se conservan como anotaciones.

Para la copia se abrió cada PDF final en Vista Previa de macOS, se seleccionó todo el documento y se copió. Se leyó el portapapeles resultante y se contrastó cada identificador y texto completo del recordatorio con el Markdown. Pasaron los 18 recordatorios. Las pruebas programáticas no se presentaron como sustituto de esta interacción real del visor.

La prueba manual de copia completa anterior corresponde a la versión con recordatorios al pie. Después se añadió el refuerzo de copia parcial descrito a continuación y se regeneraron los archivos. La versión actual se verificó mediante extracción y selección nativa de regiones con PDFKit; no se presenta esa prueba como una nueva interacción manual de portapapeles.

## Refuerzo de selección parcial en prompts

Los nueve prompts contienen resúmenes invisibles del acuerdo entre sus líneas, sin añadir altura ni modificar el aspecto. Cada resumen recuerda AHK 3.0.0, skill de fase, MCP operativo, detenerse si falta el entorno y participación del estudiante sin respuestas o aprobaciones inventadas. Se conservan también los seis recordatorios completos por fase.

| Fase | Selecciones parciales con PDFKit | Resultado |
| --- | ---: | --- |
| 1 | 77 | Todas conservaron el resumen completo y el inicio visible seleccionado. |
| 2 | 76 | Todas conservaron el resumen completo y el inicio visible seleccionado. |
| 3 | 79 | Todas conservaron el resumen completo y el inicio visible seleccionado. |

Son 232 selecciones: segmentos de prompt completos por página y todas sus ventanas consecutivas de tres líneas. Se utilizó `PDFPage.selection(for: rect).string`, el motor nativo de PDF de macOS. Se verificó también la selección de página completa y sus recordatorios íntegros. No faltan palabras de las fuentes al extraer con ninguno de los cuatro motores ni al seleccionar páginas completas con PDFKit.

La automatización de Vista Previa devolvió `timeoutReached` en esta iteración, por lo que no se pudo repetir la prueba manual de copiar fragmentos. Las pruebas nativas de selección se registran con su alcance y no como una interacción UI que no se ejecutó. El piloto de `ActualText` funcionó en Poppler pero fue ignorado por PDFKit; se eligió texto invisible entre líneas.

No se garantiza una palabra o línea aislada, fragmentos de otras secciones, todos los visores, OCR de capturas ni que un agente obedezca el texto. Los resúmenes pueden aparecer repetidos al copiar un prompt largo. Los prompts mantienen además sus instrucciones visibles y los recordatorios son accesibles como texto a tecnologías de asistencia.

## Reproducción

El exportador es `scripts/export-project-pdfs.py`. Con el Python del runtime de Codex que incluye ReportLab, pypdf, pdfplumber, pypdfium2 y Pillow, más Poppler disponible en PATH:

```bash
python3 scripts/export-project-pdfs.py --controls --check-partial-selections
```

Ese comando genera los tres PDF, controles temporales, imágenes de revisión y el informe de extracción, comparación visual y selección parcial con PDFKit. Requiere Swift con PDFKit en macOS para esta última comprobación. Para una comprobación adicional de portapapeles es necesario repetir la interacción real del visor y guardar su texto en los archivos `tmp/pdfs/<nombre-del-documento>-preview-copy.txt`. Después:

```bash
python3 scripts/export-project-pdfs.py --verify-only --controls --check-partial-selections --check-copies
```

El exportador usa las fuentes Arial y Courier New de macOS. No instala dependencias en la aplicación estudiantil ni ejecuta AHK, servicios remotos, pruebas del producto o despliegues.
