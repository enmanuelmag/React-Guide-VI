# Lectura previa · Sesión 13 · Mutaciones e invalidación

- **Tiempo estimado:** 20 minutos
- **Verificación de fuentes:** 26 de octubre de 2026
- **Versión del curso:** TanStack Query `5.102.8`

## Propósito

Reconocer cómo TanStack Query representa una escritura remota y por qué una mutación puede permanecer pendiente mientras actualiza las lecturas que dejó obsoletas.

## Conocimientos previos

- Query function y query key.
- Estados de carga, error, vacío y éxito.
- Query activa e inactiva.
- Formularios validados y body de creación.
- Sesión Firebase y request autenticado.

## Fuente 1 · Mutations

Lee [Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/mutations) en:

- la introducción y el primer ejemplo;
- los cuatro estados de una mutación;
- el paso de variables mediante `mutate`;
- `Mutation Side Effects`.

Busca estas ideas:

- `useMutation` representa una operación que crea, actualiza o elimina datos remotos;
- `mutate(variable)` entrega esa variable a `mutationFn`;
- `isPending`, `isError` e `isSuccess` provienen de la mutación;
- los callbacks conectan el resultado remoto con acciones posteriores.

No leas todavía las secciones de persistencia y scopes.

## Fuente 2 · Invalidations from Mutations

Lee [Invalidations from Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations) desde el inicio hasta `Further reading`.

Busca estas ideas:

- una escritura exitosa puede dejar desactualizadas varias queries;
- `invalidateQueries` selecciona esas lecturas mediante sus keys;
- `Promise.all` permite esperar varias invalidaciones;
- si `onSuccess` devuelve una promesa, la mutación permanece pendiente hasta que esa promesa se resuelve.

## Vocabulario previo

- **Mutación:** operación iniciada por una acción que cambia datos en el servidor.
- **Variable de mutación:** objeto entregado a `mutate` y recibido por `mutationFn`.
- **Callback:** función que TanStack Query ejecuta en un momento conocido del ciclo de la operación.
- **Invalidación:** marca una query como desactualizada para que TanStack Query pueda volver a consultarla.
- **Query activa:** query con un consumidor montado.
- **Query inactiva:** entrada conservada en caché sin un consumidor montado.
