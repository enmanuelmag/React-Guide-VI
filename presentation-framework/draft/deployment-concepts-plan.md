# Presentación complementaria: de mi computadora a la web

Estado: versión visual de 10 diapositivas aprobada por el usuario en el chat el 12 de noviembre de 2026, después del recorte solicitado. Este archivo conserva el plan de producción.

## Alcance

Explicación visual independiente junto al paquete de sesión 18. No reemplaza la presentación operativa completa de esa sesión ni modifica teacher guide, frontend o checkpoints. Recorrido aprobado: publicar una versión y visitar una SPA. La dirección Laboratorio claro y el runtime compartido ya están aprobados.

Se elige un mapa técnico ilustrado con iconos, frente a una analogía extensa de fábrica o una demostración de dashboards: muestra directamente actores y responsabilidades con menos vocabulario extra. Iconos Lucide locales, misma representación de cada actor, flechas con verbos, pocas palabras y explicación extensa en notas. Sin slides de tránsito. Portada conservada.

## Secuencia

1. Portada con proyecto, Internet y navegador.
2. Dos recorridos: publicar y visitar.
3. Cloud y hosting: computadoras del proveedor.
4. Pipeline: obtener, instalar, comprobar, construir, publicar.
5. Build: proyecto de entrada y archivos de salida.
6. CDN: red de nodos y hosting de origen.
7. Caché del CDN con y sin copia reutilizable.
8. URL, DNS y HTTPS.
9. CSR: ejecución de React en el navegador.
10. Publicar una nueva versión y pestañas abiertas.

El usuario solicitó eliminar las diapositivas originales 10, 11, 12, 14, 15 y 16. Quedan 10 diapositivas; duración pendiente de ensayo tras este recorte. HTML navegable y PDF con diagramas completos, sin depender de animaciones.

## Precisión y comprobación

No se ejecuta ni se crea un despliegue real. Pipeline no implica que tests corran sin configurarlos. CDN no ejecuta React en este CSR ni comparte automáticamente respuestas privadas. Nodos ilustrativos, no mapa geográfico real. Caducidad puede requerir revalidación. Cloudflare Pages integra hosting y CDN; otras plataformas requieren distinta configuración SPA. Pestañas abiertas no se actualizan automáticamente al publicar.

Revisar overflow, todos los SVG, navegación por flechas, fuentes locales, ausencia de solicitudes externas, PDF y PNG. Mantener evidencia en la memoria de esta iteración.
