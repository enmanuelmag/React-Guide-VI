# Control de lectura · Sesión 13

### Pregunta 1 · Opción múltiple

¿Qué hook se usa para crear, actualizar o eliminar datos remotos?

- A. `useQuery`
- B. `useMutation`
- C. `useState`
- D. `useEffect`

### Pregunta 2 · Opción múltiple

¿Cómo se entrega el body a `mutationFn`?

- A. Como argumento de `mutate`
- B. Leyéndolo desde Query Client
- C. Copiándolo desde el evento después del request
- D. Recuperándolo desde la query key

### Pregunta 3 · Verdadero o falso

`isPending` permite mostrar que una mutación está en curso sin crear otro estado booleano.

- Verdadero
- Falso

### Pregunta 4 · Opción múltiple

¿Qué operación marca como desactualizadas las queries relacionadas después de una mutación exitosa?

- A. `invalidateQueries`
- B. `getQueryData`
- C. `useEffect`
- D. `clear`

### Pregunta 5 · Verdadero o falso

Si `onSuccess` devuelve la promesa de invalidación, `isPending` puede continuar hasta que esa promesa termine.

- Verdadero
- Falso
