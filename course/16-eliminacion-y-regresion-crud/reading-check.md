# Control de lectura · Sesión 16

### Pregunta 1 · Opción múltiple

¿Qué cambio aplica `invalidateQueries` a las queries que coinciden?

- A. Las elimina siempre de la caché
- B. Las marca como desactualizadas (`stale`)
- C. Borra todas las queries de la aplicación
- D. Cambia la ruta del navegador

### Pregunta 2 · Opción múltiple

¿Qué hace `refetchType: "none"` durante una invalidación?

- A. Marca las queries como desactualizadas sin volver a pedir sus datos
- B. Se refetchean todas las queries activas e inactivas
- C. Se elimina el Query Client
- D. La mutación cambia a estado error

### Pregunta 3 · Opción múltiple

¿Qué queries vuelve a consultar por defecto `invalidateQueries`?

- A. Solo las que nunca se han consultado
- B. Las queries activas que coinciden
- C. Todas las queries de todas las features
- D. Ninguna query

### Pregunta 4 · Verdadero o falso

`useNavigate` devuelve una función para navegar desde el código.

- Verdadero
- Falso

### Pregunta 5 · Opción múltiple

¿Cómo cambia el historial `navigate("/app/library", { replace: true })`?

- A. Añade dos entradas al historial
- B. Recarga todo el documento
- C. Sustituye la entrada actual del historial por `/app/library`
- D. Elimina la caché de TanStack Query
