# Lectura previa · Sesión 15 · Snapshot inicial e identidad de componente

- **Duración estimada:** 20 minutos
- **Fuentes:** 2 referencias oficiales

## Propósito

Llegar a clase con dos ideas preparadas:

- un formulario puede volver a sus values iniciales mediante reset;
- React puede conservar o reiniciar estado según la posición y la `key` de un componente.

En clase aplicarás ambas para editar una entrada privada sin copiar el DTO mediante un Effect.

## Conocimientos previos

Antes de leer, recupera:

- `useForm` de Mantine en modo uncontrolled;
- `initialValues`, `form.key(field)` y `getInputProps`;
- `mediaLogFormSchema` y `MediaLogFormValues`;
- estado local y desmontaje condicional;
- la entrada privada `entry` obtenida en la sesión 14.

No necesitas estudiar actualización remota ni escribir código antes de la sesión.

## Fuente 1 · Values iniciales y reset en Mantine Form

Lee en Mantine Form:

- [Form values](https://mantine.dev/form/values/)
- **Organización:** Mantine.
- **Versión:** `@mantine/form@9.4.1`, versión fijada para la cohorte; la referencia web vigente corresponde a una versión posterior y el API usado se comprobó también en el paquete fijado.
- **Verificada:** 7 de septiembre de 2026.

**Tiempo sugerido:** 10 minutos.

Concéntrate en:

- cómo se declaran `initialValues`;
- qué restaura `form.reset()`;
- qué ocurre con los errores del formulario al hacer reset;
- la diferencia entre los values iniciales y los values actuales.

No estudies `form.initialize`, listas anidadas ni integración con TanStack Query. La sesión usará un snapshot disponible antes de montar el editor.

Mientras lees, interpreta esta secuencia:

```text
initial status: pending
persona cambia status: completed
persona pulsa reset
status visible: pending
```

## Fuente 2 · Preservar y reiniciar estado con `key`

Lee en React:

- [Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state)
- **Organización:** React.
- **Versión:** React `19.2.8`, versión fijada para la cohorte.
- **Verificada:** 7 de septiembre de 2026.

Lee las secciones que explican:

- que el estado está asociado a una posición del árbol;
- cómo una `key` distingue componentes en la misma posición;
- cómo cambiar la `key` reinicia el estado del subtree.

**Tiempo sugerido:** 10 minutos.

No estudies el ejemplo completo del marcador ni diseñes todavía el modal. Concéntrate en la relación entre identidad y estado.

Compara:

```tsx
<EditMediaLogForm key="log-a" />
<EditMediaLogForm key="log-b" />
```

React recibe el mismo tipo de componente y la misma posición, pero keys distintas.

## Vocabulario previo

- **Values iniciales:** valores usados para crear el estado inicial de una instancia del formulario.
- **Values actuales:** valores que reflejan la edición presente de la persona.
- **Reset:** operación que restaura values iniciales y limpia errores.
- **Identidad:** forma en que React distingue una instancia de otra.
- **Subtree:** componente y descendientes que React administra como una rama.
- **Remount:** reemplazo de una instancia por otra, con estado nuevo.
