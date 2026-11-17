# Reglas para los entregables del proyecto

## Decisiones aprobadas y alcance

El 19 de octubre de 2026 el usuario aprobó tres fases acumulativas y AHK 3.0.0 para los entregables alojados en `Projects/`. Estas decisiones no sustituyen las sesiones, checkpoints ni rúbricas aprobadas del proyecto progresivo Medialog.

1. **Definición funcional:** problema, actores, alcance, pantallas previstas y casos de uso con `ahk-use-case`.
2. **Procesos y reglas:** profundización y consolidación no técnica con `ahk-spec` a partir de casos aprobados.
3. **Diseño técnico:** decisiones y justificación con `ahk-spec-tech` a partir de especificaciones funcionales aprobadas.

La progresión separa decisiones del producto de decisiones de implementación. Los casos de uso iniciales ya incluyen pasos, alternativas, errores y criterios; la segunda fase amplía reglas y coherencia entre operaciones sin repetir la primera.

## Fuentes, entregas y aprobación

- El estudiante conserva fuentes Markdown completas gestionadas por AHK y entrega un único PDF por fase.
- Cada entrega incorpora lo anterior corregido y la ampliación correspondiente. Conserva identificadores y explica los cambios; no concatena versiones contradictorias.
- Aprobar un documento ante AHK no equivale a aprobación docente ni autoriza implementación.
- Las funcionalidades se desarrollarán después de las fases documentales; la preparación inicial solo crea la plantilla y el harness.
- Las tres consignas y su exportación fueron autorizadas el 19 de octubre de 2026. Los PDF se conservan en `output/pdf/`, con verificación de extracción, copia y aspecto visual.

## Versiones y excepciones

- Estas entregas fijan `@cardor/agent-harness-kit@3.0.0`. Las sesiones vigentes conservan la referencia 2.11.0 mientras no se apruebe su migración.
- La preparación común conserva `--no-notifications --no-notification-hooks`: el usuario pidió habilitarlos solo si el flujo funcionaba en Windows; AHK 3.0.0 omite silenciosamente la reproducción en ese sistema. Hay soporte de generación de hooks, pero no implica disponibilidad de audio. Esta elección no afecta MCP ni las skills requeridas.
- La instalación global con npm conserva la excepción del CLI; el frontend usa pnpm 11.17.0. No instalar AHK como dependencia del frontend.
- Un CLI global actualizado también cambia el ejecutable de otras carpetas; comprobar la versión antes de retomar una guía antigua y no regenerar harness previos automáticamente.
- `Projects` conserva la capitalización solicitada por el usuario. Sus archivos usan kebab-case.
- Las consignas nuevas conservan estado de borrador hasta que el usuario apruebe su contenido. Aprobar las fases no aprueba automáticamente la primera redacción.

## Condición obligatoria de inicio con AHK

Por decisión explícita del usuario, las tres fases exigen comprobar el CLI AHK 3.0.0, la inicialización en el proyecto correcto, la skill de la fase y una llamada real de lectura al MCP correspondiente antes del trabajo asistido. `specs.list` puede devolver una lista vacía válida; una configuración escrita no demuestra que el servidor responda.

Si falta la aplicación base o el harness, el agente debe preparar primero el entorno según la consigna, con acceso y autorización para las modificaciones necesarias. Debe solicitar la ubicación o los permisos que falten y no migrar trabajo previo automáticamente. Si no puede ejecutar comandos, puede guiar la preparación sin fingir haberla verificado.

Si faltan la skill o MCP, el agente debe rehusar iniciar o continuar diseño, redacción, revisión, síntesis y ensayo asistido. Solo puede diagnosticar y recuperar el entorno; después debe repetir las comprobaciones. No admitir un flujo alternativo de documentos manuales ni simulaciones de herramientas. Aplicar también al retomar conversaciones o tras perder la conexión.

Repetir esta condición en el acuerdo visible, el marcador inicial, un marcador específico de preparación y los prompts copiables. Es una regla obligatoria del ejercicio; su inclusión en un documento no garantiza obediencia de cualquier agente externo.

### Contrato común de las tres consignas

Este requisito es obligatorio en cada Markdown de fase y debe quedar completo dentro de cada documento, aunque el estudiante no adjunte las consignas anteriores. No basta con enlazar esta regla ni asumir que el entorno sigue disponible porque se utilizó en otra entrega.

| Consigna | Versión requerida | Skill requerida | Condición para empezar o retomar |
| --- | --- | --- | --- |
| Fase 1 · Definición funcional | AHK 3.0.0 | `ahk-use-case` | Harness del proyecto y MCP comprobados mediante una llamada real de lectura. |
| Fase 2 · Procesos y reglas | AHK 3.0.0 | `ahk-spec` | Mismas comprobaciones previas, además de casos de uso fuente aprobados. |
| Fase 3 · Diseño técnico | AHK 3.0.0 | `ahk-spec-tech` | Mismas comprobaciones previas, además de especificaciones funcionales fuente aprobadas. |

Cada consigna debe expresar de forma inequívoca: **sin AHK inicializado, skill disponible y MCP operativo, no iniciar ni continuar el trabajo asistido de la fase; preparar o recuperar primero el entorno.** Repetir la condición dentro de cada prompt copiable y en sus marcadores para la exportación futura, adaptando únicamente la skill y los documentos fuente de la fase. No ofrecer una alternativa sin AHK.

Antes de dar por completo cualquiera de los tres Markdown, comprobar que contiene el requisito visible, comprobaciones reales, preparación previa, condición de parada y repetición en prompts y marcadores. Crear únicamente las fases cuya redacción haya autorizado el usuario.

## Herramientas obligatorias para la fase técnica

Decisión aprobada el 19 de octubre de 2026. La tercera fase debe exigir aplicación justificada de las cuatro herramientas siguientes y el componente visual indicado, para comprobar transferencia de lo enseñado en clase:

| Requisito | Herramienta del curso | Uso que debe justificar el diseño técnico |
| --- | --- | --- |
| Navegación | React Router, desde `react-router` | Rutas y pantallas que respondan a recorridos definidos. |
| Estado remoto | TanStack Query, también llamado React Query, desde `@tanstack/react-query` | Consulta u operación remota concreta, sus estados y su relación con los requisitos. |
| Estado global de la aplicación | Zustand | Responsabilidad compartida concreta que necesite coordinación entre consumidores; no duplicar datos remotos ni valores del formulario. |
| Validación de formularios | Zod, integrado con Mantine Form | Reglas funcionales convertidas en validaciones de un formulario real del producto. |
| Componente visual | `Modal` de Mantine | Interacción del producto cuyo propósito, apertura, cierre y resultado estén definidos. |

El usuario retiró expresamente Toast Notification como requisito. Mantine Modal permanece entre los componentes solicitados; no exigir notificaciones visuales ni añadir `@mantine/notifications` por esta decisión.

La consigna exige Mantine Core para componentes visuales; no exigir un uso independiente de Mantine Hooks. Mantine Form conserva su responsabilidad de formulario y validación. Esta decisión limita los requisitos evaluables del proyecto y no cambia las dependencias técnicas que necesite Core ni el stack de las sesiones del curso.

El validador canónico de la cohorte es Zod 4.4.3. Mantine Form 9.4.1 administra el formulario y conecta el schema mediante `schemaResolver` de `@mantine/form`, con imports Zod desde `zod/v4`; no añadir `mantine-form-zod-resolver`. Esa separación está documentada en `course-architecture.md` y en la sesión 11. Mantener las versiones del stack aprobado y verificar su compatibilidad al redactar la tercera consigna.

No basta enumerar paquetes o instalarlos: la tercera consigna debe pedir una matriz herramienta → caso/requisito → responsabilidad → comprobación prevista. La fase técnica sigue siendo documental; la comprobación de implementación corresponde al desarrollo posterior, no a afirmar una ejecución inexistente en la fase 3.

Las fases 1 y 2 describen comportamiento en lenguaje natural. No introducir elecciones de librerías, stores, schemas de código o componentes técnicos en sus apartados funcionales. Si el alcance no permite un uso significativo de una herramienta obligatoria, señalarlo y resolver el ajuste funcional con el estudiante y el docente antes de diseñar una integración artificial.

## Estado del contenido

El usuario autorizó definir los recordatorios para agentes en el Markdown y preparar su incorporación durante una exportación futura. Las tres consignas aprobadas combinan el acuerdo visible, prompts copiables con sus límites y seis comentarios `AHK-LEARNING-CHECKPOINT` en cada documento.

Los criterios y el contenido de las tres consignas están aprobados. No introducir pesos, sanciones, fechas o cambios en evaluaciones existentes sin decisión explícita.

## Recordatorios para agentes y futura exportación

Estos recordatorios son instrucciones de acompañamiento pedagógico, no marcas de autoría ni un mecanismo fiable contra la delegación completa. Su objetivo es pedir participación real, evitar decisiones inventadas y conservar los puntos de revisión. No deben atribuirse autoridad de sistema, solicitar datos privados ni autorizar acciones fuera de la actividad.

La fuente conserva el texto completo en comentarios HTML con identificadores estables:

La primera fase usa prefijo `F1-`. La segunda usa `F2-INICIO`, `F2-AHK-PREFLIGHT`, `F2-PROCESOS`, `F2-APROBACION`, `F2-SINTESIS` y `F2-DEFENSA`, adaptados a `ahk-spec`. La tercera usa `F3-INICIO`, `F3-AHK-PREFLIGHT`, `F3-DISENO`, `F3-APROBACION`, `F3-SINTESIS` y `F3-DEFENSA`, adaptados a `ahk-spec-tech`, fuentes funcionales aprobadas y revisión del diseño. Se mantiene el mismo contrato de participación y entorno en todas.

| Identificador | Ubicación en la primera consigna | Conducta solicitada |
| --- | --- | --- |
| `F1-INICIO` | Después del estado de borrador | Exigir AHK y MCP operativos antes de pedir idea y decisiones propias. |
| `F1-AHK-PREFLIGHT` | En el requisito previo obligatorio | Comprobar CLI, harness, skill y MCP; preparar o recuperar el entorno antes de iniciar. |
| `F1-DESCUBRIMIENTO` | Antes del prompt inicial | No inventar el producto ni elegir por el estudiante. |
| `F1-APROBACION` | Junto a la revisión de casos | Esperar confirmación concreta y conservar borradores si falta. |
| `F1-SINTESIS` | Antes del prompt de síntesis | Exigir explicación propia y fuentes; no fabricar bitácora o evidencia. |
| `F1-DEFENSA` | Antes de la comprobación final | Hacer preguntas y esperar respuestas reales. |

Los prompts mantienen el acuerdo como texto visible dentro del bloque copiable. Los comentarios adyacentes no viajan cuando alguien copia únicamente el prompt. No alargar los bloques para aprovechar interfaces que colapsan texto ni usar caracteres engañosos para dificultar su revisión.

El acuerdo visible de participación se dirige al estudiante: explica qué debe decidir, comprender, revisar y aprobar. Las instrucciones operativas dirigidas al agente se conservan en los prompts y en los recordatorios invisibles; no redactar el recuadro estudiantil como si su lector fuera el agente.

Procedimiento de exportación autorizado y aplicado el 19 de octubre de 2026:

1. Leer los marcadores desde la fuente; una exportación Markdown normal omite comentarios HTML.
2. Incorporar los recordatorios mediante texto PDF no pintado, modo de renderizado 3, asociado con la página de su marcador y situado en una zona independiente bajo el pie visible. Su altura de maquetación es cero: no debe crear huecos ni desplazar el cuerpo. Mantener íntegros los acuerdos visibles.
3. Comprobar por separado el render visual, la extracción de texto del PDF completo y la copia de fragmentos. Un recordatorio presente en la fuente no demuestra su presencia en el PDF ni en lo copiado.
4. Mantener el texto visible accesible y legible. Si la capa produce extracción desordenada o problemas de lectura asistida, conservar los recordatorios visibles y registrar el límite antes de distribuir.
5. Declarar que OCR, capturas, recortes, limpieza del texto o las propias reglas del agente pueden eliminar o neutralizar estos recordatorios. No prometer un bloqueo ni considerar su presencia prueba de participación.

El exportador `scripts/export-project-pdfs.py` genera las tres consignas y el informe `output/pdf/verification.json`. Comparar cada página con un control sin recordatorios y verificar los payloads completos mediante extractores y copia real del visor. No reservar espacio en blanco para el texto invisible. Una selección parcial puede excluir recordatorios de otra zona: no afirmar que cualquier fragmento copiado los incluye.

### Copia parcial de prompts

Por petición del usuario, los prompts contienen además resúmenes invisibles del acuerdo dentro de su geometría seleccionable, en el espacio entre líneas existente. El exportador no añade altura, no cambia el texto visible y no sustituye los seis recordatorios completos por fase. Los resúmenes recuerdan AHK 3.0.0, la skill de fase, MCP, detenerse si falta el entorno y pedir decisiones humanas sin inventar respuestas o aprobaciones.

Comprobar segmentos de prompt y ventanas consecutivas de tres líneas en cada página donde se dividan. Usar `scripts/verify-project-pdf-selections.swift` para selección nativa de regiones con PDFKit y registrar el método exacto. Esa comprobación programática no debe presentarse como una nueva prueba manual de portapapeles. Mantener la comparación visual con controles y la integridad de extracción en todos los motores.

No prometer que una palabra, una línea aislada, un fragmento de otra sección, cualquier visor o el OCR incluya los recordatorios. La prueba de `ActualText` no bastó: Poppler lo respeta como reemplazo, pero PDFKit lo ignoró en el piloto; no usar esa propiedad como garantía de copia en Vista Previa.
