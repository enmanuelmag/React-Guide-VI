# Control de lectura · Sesión 14

### Pregunta 1 · Opción múltiple

¿Qué campo permite distinguir las dos opciones de esta unión?

```ts
type Selector =
  | { kind: "catalog"; externalId: string }
  | { kind: "log"; logId: string }
```

- A. `externalId`
- B. `kind`
- C. `logId`
- D. `Selector`

### Pregunta 2 · Verdadero o falso

Después de comprobar `selector.kind === "log"`, TypeScript sabe que `selector` contiene `logId`.

- Verdadero
- Falso

### Pregunta 3 · Opción múltiple

¿Qué objeto usa `kind: "log"` pero no incluye el `logId` requerido?

- A. `{ kind: "catalog", externalId: "438631" }`
- B. `{ kind: "log", logId: "cm123" }`
- C. `{ kind: "log", externalId: "438631" }`
- D. `{ kind: "catalog", logId: "cm123" }`

### Pregunta 4 · Opción múltiple

Si la URL es `/posts/123`, ¿qué valor recibe `params.postId`?

- A. El número `123`
- B. El string `"123"`
- C. Un objeto `{ id: 123 }`
- D. Un booleano

### Pregunta 5 · Verdadero o falso

Antes de convertir un valor de `useParams` a un tipo de la aplicación, el componente debe validarlo como entrada externa.

- Verdadero
- Falso
