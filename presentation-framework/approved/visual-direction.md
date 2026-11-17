# Dirección visual aprobada · Laboratorio claro

> Estado: dirección visual, runtime, galería y piloto de la sesión 01 aprobados por el usuario el 7 de septiembre de 2026. Aplica a las presentaciones de las 18 sesiones.

## 1. Propósito

Las diapositivas presentan conceptos y temas antes de que el docente abra el editor. Los `teacher-guide.md` y `student-guide.md` conservan la explicación de programación, los pasos de construcción y las actividades.

El sistema prioriza a estudiantes que observan una proyección. Las notas de Reveal.js ayudan al docente sin añadir texto a la vista pública.

## 2. Filosofía visual

El sistema se llama **Laboratorio claro**. Su tono es técnico, editorial, didáctico y juvenil.

Principios:

- Mostrar una idea principal por diapositiva.
- Usar jerarquía, alineación y espacio vacío antes que decoración.
- Mantener composiciones planas y precisas.
- Usar el azul institucional como señal, no como relleno habitual.
- Introducir variedad mediante las 18 geometrías aprobadas.
- Reservar los momentos de marca intensa para portadas, separadores y checkpoints seleccionados.
- Llevar la explicación extensa a las notas docentes y las guías.

## 3. Marca

### 3.1 Azul principal

La referencia suministrada por el usuario tiene como color dominante `#223B8F`. El framework usa ese valor como ancla inicial:

```css
--color-accent: oklch(38.7% 0.142 267); /* #223B8F */
```

El piloto debe comparar el valor con cualquier archivo oficial de marca disponible. Una diferencia confirmada se corrige en el token, no en cada slide.

### 3.2 Presencia del logo

La marca tiene una presencia moderada:

- El logo completo aparece en portadas, separadores principales y cierre.
- Las slides normales usan la línea azul de firma, el color o una marca pequeña cuando ayuda a identificar el curso.
- El logo conserva proporción, colores y espacio de seguridad.
- El framework no modifica ni redibuja la marca.

### 3.3 Logos de tecnologías

Cuando una slide introduce una librería, tecnología o plataforma, el autor busca e integra su logo oficial. También lo usa en comparaciones, mapas de stack y relaciones entre herramientas.

- Preferir PNG oficial con transparencia y resolución suficiente.
- Guardar el archivo dentro de los assets locales.
- Registrar la fuente en las notas docentes.
- No depender de una URL remota durante la presentación.
- No repetir el logo en cada mención posterior.
- No usar logos como decoración.

## 4. Paleta

La identidad usa azul y neutrales tintados hacia el mismo matiz. Verde, ámbar y rojo comunican estados. No funcionan como colores decorativos.

| Token | OKLCH | Equivalente sRGB | Uso |
| --- | --- | --- | --- |
| `--color-paper` | `oklch(99.1% 0.004 271)` | `#FBFCFF` | Fondo principal |
| `--color-paper-2` | `oklch(96.4% 0.009 265)` | `#F0F3F9` | Superficie secundaria |
| `--color-paper-3` | `oklch(94.3% 0.017 268)` | `#E7ECF8` | Énfasis suave |
| `--color-ink` | `oklch(22.7% 0.051 266)` | `#111B34` | Texto principal |
| `--color-ink-2` | `oklch(38.8% 0.049 266)` | `#38445F` | Texto secundario fuerte |
| `--color-muted` | `oklch(50.5% 0.043 263)` | `#58657E` | Texto secundario |
| `--color-rule` | `oklch(86.8% 0.024 262)` | `#CBD4E4` | Divisiones y bordes |
| `--color-accent` | `oklch(38.7% 0.142 267)` | `#223B8F` | Identidad y foco |
| `--color-accent-strong` | `oklch(32.3% 0.126 267)` | `#172B73` | Estado activo oscuro |
| `--color-code-dark` | `oklch(22.7% 0.049 267)` | `#121B33` | Escenario de código oscuro |
| `--color-success` | `oklch(49.5% 0.072 173)` | `#2F6F5E` | Éxito confirmado |
| `--color-warning` | `oklch(52.2% 0.108 80)` | `#8A6100` | Advertencia |
| `--color-danger` | `oklch(50.6% 0.136 16)` | `#A43D4A` | Error o riesgo |

Las combinaciones de texto normal deben alcanzar contraste WCAG 2.1 de 4.5:1. Texto grande, iconos y foco deben alcanzar 3:1.

## 5. Tipografía

El sistema usa tres familias con responsabilidades distintas:

| Rol | Familia | Uso |
| --- | --- | --- |
| Display | Sora | Portadas, títulos y conceptos dominantes |
| Lectura | IBM Plex Sans | Cuerpo, captions, tablas y notas visibles |
| Código | JetBrains Mono | Código, comandos, rutas y valores técnicos |

Reglas:

- Usar archivos locales y fijar sus versiones durante la implementación.
- Usar títulos rectos. La cursiva no forma parte de la voz de display.
- Limitar cada slide a los pesos necesarios.
- Aplicar números tabulares en tablas y métricas.
- Recortar contenido o dividir la slide antes de reducir el texto bajo el mínimo.

### 5.1 Escala FHD

| Elemento | Tamaño inicial |
| --- | --- |
| Título de portada | 80–96 px |
| Título de slide | 52–64 px |
| Concepto dominante | 72–120 px según longitud |
| Texto normal | 30–36 px |
| Código | 25–30 px |
| Caption o fuente | mínimo 20 px |

## 6. Lienzo, grilla y espacio

- Lienzo lógico y captura PNG: `1920 × 1080`.
- Proporción: 16:9.
- Grilla: 12 columnas.
- Márgenes laterales: 120 px.
- Márgenes superior e inferior: 88 px.
- Gutter: 32 px.
- Escala de espacio: `8, 16, 24, 32, 48, 64, 96, 128` px.
- Títulos de slides normales parten desde una posición estable.
- El folio y las fuentes ocupan una zona inferior estable.
- Las composiciones asimétricas conservan alineación con la grilla.

## 7. Densidad

- Una slide conceptual normal contiene entre 25 y 45 palabras visibles.
- Una lista admite hasta cinco puntos cuando la estructura de lista aporta claridad.
- Un snippet debe leerse completo sin desplazamiento.
- Una idea que no cabe con comodidad se divide en dos slides.
- La explicación oral permanece en `aside.notes`.

Estos rangos funcionan como límites de revisión. El contenido no debe crecer para llenar una cuota.

## 8. Superficies y formas

- Usar composiciones planas sin sombras habituales.
- Usar bordes de 1–2 px en gris azulado.
- Aplicar radios de 6–8 px a imágenes, bloques de código y contenedores que los necesiten.
- Evitar degradados, glassmorphism, cápsulas decorativas y tarjetas anidadas.
- Usar una línea azul corta como firma recurrente en slides normales.
- Reservar fondos azules completos para portada, separadores importantes y checkpoints seleccionados.
- Preferir alineación izquierda. Centrar mensajes únicos, preguntas y cierres cuando la geometría lo pida.
- Evitar encabezados y pies repetitivos que no aporten ubicación o evidencia.

## 9. Código

El framework usa un tratamiento híbrido:

- Los snippets breves aparecen sobre una superficie clara.
- Las slides donde el código domina usan fondo azul tinta oscuro.
- Reveal Highlight o highlight.js aplica una paleta accesible y contenida.
- El resaltado dirige la lectura hacia las líneas relevantes.
- El framework no dibuja ventanas falsas de editor, navegador o terminal.
- Un bloque muestra una sola idea y evita el scroll.
- La versión PDF conserva el foco visual sin depender de fragments.

## 10. Diagramas, capturas e imágenes

### 10.1 Diagramas

- Construirlos con HTML y SVG reutilizables.
- Mostrar entre cinco y siete nodos visibles como límite inicial.
- Usar azul para el elemento activo y neutrales para el contexto.
- Usar conectores rectos y etiquetas próximas a su referente.
- Evitar que las conexiones crucen texto.
- Revelar pasos con fragments solo cuando el orden forme parte de la explicación.

### 10.2 Capturas

- Usar capturas reales y recortarlas al área relevante.
- Mantener un borde fino cuando la captura necesite separarse del fondo.
- Añadir anotaciones numeradas para dirigir la mirada.
- Evitar marcos falsos de dispositivos, navegadores o editores.

### 10.3 Imágenes

- Usar imágenes grandes con una función pedagógica definida.
- Evitar miniaturas decorativas y fotografías genéricas.
- Mantener una sola pieza dominante entre imagen, diagrama o código en slides complejas.
- Conservar el archivo original y su atribución cuando corresponda.

## 11. Movimiento

- Usar una transición `fade` breve como valor general.
- No animar entradas por defecto.
- Usar fragments para pasos, predicciones o recorridos que necesiten secuencia.
- Usar Auto-Animate para explicar una transformación entre estados relacionados.
- Limitar cada slide a una secuencia animada.
- Evitar rebotes, giros, zoom decorativo y loops.
- Mantener una versión PDF comprensible.
- Respetar `prefers-reduced-motion`.
- Permitir una transición más pausada en portadas y separadores sin cambiar el lenguaje visual.

## 12. Voz editorial

- Nombrar el concepto de forma directa en los títulos.
- Usar preguntas para activar predicción o discusión.
- Evitar slogans, lenguaje promocional y dramatización artificial.
- Reservar mayúsculas sostenidas para metadata breve.
- Mantener términos técnicos oficiales en inglés cuando la traducción cause confusión.
- Explicar esos términos en español.
- Preferir frases cortas y ejemplos concretos.
- Usar bullets solo cuando el contenido tenga estructura de lista.

## 13. Accesibilidad y revisión

- No comunicar una diferencia solo mediante color.
- Mantener el orden del DOM alineado con el orden de lectura.
- Añadir texto alternativo o descripción a las imágenes informativas.
- Mantener texto importante fuera de imágenes si no existe una superficie sólida que garantice contraste.
- Probar slides a tamaño reducido para simular la vista desde el fondo del aula.
- Respetar las zonas seguras en navegador, captura y PDF.
- Validar overflow, texto recortado, assets ausentes y código ilegible.
- Revisar cada deck en navegador, PNG y PDF antes de aprobarlo.

## 14. Próxima fase

La aprobación visual cierra el diseño de alto nivel. El siguiente trabajo es preparar el plan de implementación para:

1. instalar Reveal.js, Vite y Tailwind CSS con pnpm;
2. materializar los tokens, fuentes y geometrías;
3. construir una galería pequeña con los casos más exigentes;
4. producir la presentación oficial de la sesión 01 como piloto operativo;
5. revisar navegador, PNG y PDF antes de ampliar el catálogo.

El piloto puede ajustar valores técnicos como line-height, tamaño mínimo de código o márgenes de exportación cuando una prueba visual demuestre el problema. Un ajuste de identidad, familia tipográfica o color de marca requiere otra aprobación.
