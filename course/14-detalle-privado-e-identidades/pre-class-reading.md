# Lectura previa · Sesión 14 · Uniones discriminadas y parámetros de ruta

- **Duración estimada:** 20 minutos
- **Fuentes:** 3 referencias oficiales

## Propósito

Llegar a clase con dos ideas preparadas:

- Zod puede representar varias formas válidas con `z.discriminatedUnion`; `z.infer` conserva el narrowing de TypeScript.
- React Router entrega los parámetros dinámicos de la URL como datos que el componente debe interpretar.

En clase aplicarás ambas ideas para distinguir una obra de catálogo de un registro personal.

## Conocimientos previos

Antes de leer, recupera:

- una unión como `"movie" | "series"`;
- objetos tipados con TypeScript;
- rutas declarativas con segmentos `:param`;
- `useParams` y el adapter nullable de detalle público;
- query keys y queries deshabilitadas mediante `enabled`.

No necesitas conocer el contrato privado ni preparar código antes de la sesión.

## Fuente 1 · Narrowing y uniones discriminadas

Lee en el TypeScript Handbook:

- [Discriminated unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)
- **Organización:** Microsoft.
- **Versión:** Handbook vigente de TypeScript; esta sección no depende de una versión específica del compilador.
- **Verificada:** 7 de septiembre de 2026.

**Tiempo sugerido:** 8 minutos.

Concéntrate en:

- el campo literal compartido por los miembros de la unión;
- cómo una comparación reduce el tipo a una rama;
- por qué cada miembro conserva solo sus propiedades válidas;
- qué error detecta TypeScript cuando intentas usar una propiedad de otra rama.

Recupera además la cadena aprendida en la sesión 11:

```text
schema Zod → z.infer → tipo estático
valor externo → safeParse → dato validado o error
```

En clase aplicarás esa cadena al parámetro `logId` de Router. Definir un schema o inferir su tipo no valida por sí solo el valor de la URL.

Mientras lees, compara estas formas:

```ts
type Selector =
  | {
      kind: "catalog"
      mediaType: "movie" | "series"
      externalId: string
    }
  | { kind: "log"; logId: string }
```

```ts
type OptionalSelector = {
  mediaType?: "movie" | "series"
  externalId?: string
  logId?: string
}
```

No decidas todavía cuál usa el proyecto. Identifica qué combinaciones permite cada una.

## Fuente 2 · Unión discriminada con Zod

Lee en la documentación de Zod 4:

- [`z.discriminatedUnion`](https://zod.dev/api#discriminated-unions)
- **Organización:** Zod.
- **Versión:** Zod `4.4.3`, versión fijada para la cohorte.
- **Verificada:** 7 de septiembre de 2026.

**Tiempo sugerido:** 4 minutos.

Concéntrate en:

- el nombre del campo discriminante;
- un schema por cada rama permitida;
- la diferencia entre derivar el tipo con `z.infer` y ejecutar `safeParse` sobre un valor.

## Fuente 3 · Parámetros dinámicos con `useParams`

Lee en React Router 8.3.1:

- [`useParams`](https://reactrouter.com/api/hooks/useParams)
- **Organización:** React Router.
- **Versión:** React Router `8.3.1`, modo declarativo.
- **Verificada:** 7 de septiembre de 2026.

**Tiempo sugerido:** 8 minutos.

Concéntrate en:

- qué objeto devuelve el hook;
- qué valor recibe un parámetro después de hacer match con una ruta;
- cómo una ruta como `/posts/:postId` expone `postId`;
- por qué el tipo admite parámetros ausentes.

No estudies loaders, actions, Data Mode ni Framework Mode. El curso conserva rutas declarativas y TanStack Query como propietario del estado remoto.

## Vocabulario previo

- **Unión discriminada:** unión de objetos que comparten un campo literal para distinguir sus miembros.
- **Discriminante:** campo literal común, como `kind`.
- **Narrowing:** reducción de una unión a una rama después de comprobar el discriminante.
- **Parámetro dinámico:** segmento variable de una ruta, declarado con `:`.
- **Entrada externa:** valor que llega desde fuera del dominio del componente y debe validarse antes de usarlo.
