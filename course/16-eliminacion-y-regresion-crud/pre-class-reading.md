# Lectura previa · Sesión 16 · Invalidación y navegación posterior

- **Duración estimada:** 20 minutos
- **Fuentes:** 2 referencias oficiales
- **Fecha de verificación:** 7 de septiembre de 2026

## Propósito

Llegar a clase con dos comportamientos reconocibles:

- TanStack Query puede marcar queries stale y decidir cuáles refetchear.
- React Router puede cambiar de ruta por código y reemplazar la entrada actual del historial.

En clase aplicarás ambos comportamientos después de eliminar una entrada privada. La lectura no incluye la integración final.

## Conocimientos previos

Recupera antes de leer:

- `useMutation` e invalidación desde las sesiones 13 y 15;
- familias de query keys;
- query activa e inactiva;
- `BrowserRouter`, rutas y `Link`;
- detalle privado identificado por `logId`;
- diferencia entre estado pending, error y éxito.

No necesitas escribir código ni ejecutar el proyecto antes de la sesión.

## Fuente 1 · Invalidar y controlar el refetch

Lee en TanStack Query:

- **Título:** [QueryClient](https://tanstack.com/query/latest/docs/reference/QueryClient)
- **Organización:** TanStack
- **URL:** `https://tanstack.com/query/latest/docs/reference/QueryClient`
- **Versión:** `@tanstack/react-query@5.102.8`, fijada por el curso y vigente al verificar.
- **Fecha de verificación:** 7 de septiembre de 2026

**Tiempo sugerido:** 12 minutos.

Busca el método `queryClient.invalidateQueries` y concéntrate en:

- qué significa marcar una query como invalid;
- qué queries refetchea el comportamiento predeterminado;
- los valores `active` y `none` de `refetchType`;
- la diferencia entre marcar stale y ejecutar un nuevo request.

No estudies filtros mediante `predicate`, cancelación ni reintentos.

Mientras lees, interpreta este caso:

```text
la pantalla consume un detalle
→ la mutación elimina ese recurso
→ el detalle sigue activo durante unos milisegundos
```

Pregúntate qué ocurriría si el cliente refetchea ese detalle antes de abandonar la ruta.

## Fuente 2 · Navegar y reemplazar historial

Lee en React Router:

- **Título:** [useNavigate](https://reactrouter.com/api/hooks/useNavigate)
- **Organización:** React Router
- **URL:** `https://reactrouter.com/api/hooks/useNavigate`
- **Versión:** `react-router@8.3.1`, fijada por el curso en modo declarativo con `BrowserRouter` y vigente al verificar.
- **Fecha de verificación:** 7 de septiembre de 2026

**Tiempo sugerido:** 8 minutos.

Lee las secciones sobre:

- navegar a un path mediante la función devuelta por `useNavigate`;
- la opción `replace`;
- el efecto de reemplazar la entrada actual del historial.

No estudies Data Mode, Framework Mode, loaders, actions, `RouterProvider` o navegación por deltas.

Compara:

```ts
navigate("/app/library")
navigate("/app/library", { replace: true })
```

La segunda opción sustituye la entrada actual. En clase decidirás por qué ese comportamiento sirve cuando la ruta actual apunta a un recurso eliminado.

## Vocabulario previo

- **Invalidar:** marcar datos de caché como desactualizados.
- **Stale:** estado de una query que ya no debe considerarse actual.
- **Query activa:** query con un consumidor montado.
- **Refetch:** nueva ejecución de una query.
- **Navegación programática:** cambio de ruta iniciado desde código.
- **Historial:** secuencia de ubicaciones que administra el navegador.
- **Replace:** opción que sustituye la entrada actual del historial.
