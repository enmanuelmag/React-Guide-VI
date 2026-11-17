# Presentación 13 · Plan de producción

Fecha: 10 de octubre de 2026. Estado: deck de 19 diapositivas aprobado el 26 de octubre de 2026; código y guía detallada autorizados y alineados.

## Diseño

Laboratorio claro, 16:9, runtime compartido sin nuevas dependencias. Revisión del 26 de octubre de 2026: 19 slides, portada y 18 vistas de contenido, frente a las 29 iniciales. El usuario pidió conservar la introducción. Explicación y ejemplo juntos; sin mapa independiente o slide de tránsito al editor. Barra de orientación estable: Elegir → Guardar → Actualizar → Ver biblioteca → Filtrar → Salir.

Punto de entrada: cierre 12 y formulario local 11. Salida conceptual: escribir, renovar lecturas relacionadas, consultar biblioteca, cambiar filtro remoto y retirar caché al salir. La sesión 14 conserva el detalle privado por logId.

## Proceso

1. Contexto: reglas, guion 13, narrativa docente, rúbrica, cierre 12 y apertura 14.
2. Dirección: aplicar la aprobada y el recorrido autorizado en el chat.
3. Diseño: ejemplos de Dune; lenguaje directo; términos necesarios definidos visiblemente.
4. Producción: fuente HTML/CSS local y notas privadas por slide.
5. Revisión: build, auditoría, PNG, PDF y comprobación visual.
6. Iteración: cambios solicitados por el usuario. No avanzar código ni guía detallada 13 antes de aprobación.

La revisión actual reúne: público/isLogged con autenticación; Bearer/authScope con keys concretas; handler con destino del POST; estados con botón; invalidación con familias; callback con secuencia de cierre; query privada con body y key; matriz de filtros con su flujo. La analogía de la lista impresa se explica oralmente en las notas. Las decisiones conceptualmente distintas permanecen separadas para evitar recargar una sola vista.

## Ritmo propuesto para la futura alineación

Presentación continua estimada: 18 minutos. Coding guiado: 57 minutos. Estos bloques suman los 75 minutos anteriores al descanso; siguen 30 de descanso, 60 de taller y 15 de revisión: 180.

El texto anterior reserva 10 minutos para la apertura y alterna construcción conceptual: no corresponde todavía al nuevo deck. Este presupuesto es una propuesta de implementación pendiente de ensayo y se ajustará junto a la ruta detallada cuando se apruebe la presentación. No acredita ritmo real de aula.

Para proteger el coding, se entregan contratos extensos y soporte preparados; el grupo construye las decisiones nuevas. Si el ensayo supera 18 minutos, condensar explicación o entregar un tramo mecánico identificado, sin quitar taller ni comprobaciones.

## Alcance del taller protegido

Se explican el propósito del adapter de fila, logId, los cuatro estados y la traducción de filtros, sin mostrar la solución de componentes ni el handler final. No se implementa detalle privado, edición, eliminación, nuevos filtros o cambios de backend.

## Precisiones

- Query/mutación se distinguen por lectura/escritura, no por GET/POST.
- isLogged significa medio guardado, no sesión iniciada.
- authScope etiqueta caché; Bearer autentica.
- Invalidation marca datos desactualizados; normalmente refetchea queries activas y habilitadas.
- Await onSuccess conserva isPending; un refetch fallido no revierte una creación aceptada.
- Todos restringe el dominio a movie y series; no envía un arreglo vacío.
- Logout retira mediaKeys.all después del éxito de signOut; no usa clear.
- http.ts añade API_URL desde 12: futuros fetchers deben entregar un path, evitando duplicarlo.

