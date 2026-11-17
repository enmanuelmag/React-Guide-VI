# Guía estudiantil · Sesión 12 · Firebase Auth y rutas privadas

## Qué vas a construir

**Virtual · 90 minutos.** Crearás una cuenta o iniciarás sesión con Firebase. La aplicación reconocerá esa sesión después de una recarga y decidirá si permite mostrar `/app/library`. También prepararás una petición que envía un pase temporal al servidor. La biblioteca conserva texto provisional: todavía no guardamos ni consultamos registros personales.

Lectura previa: [Firebase y restauración](pre-class-reading.md). Control posterior: [preguntas de lectura](reading-check.md).

Primero veremos las 28 diapositivas completas. Después pasaremos al editor, práctica y comprobación; no necesitas copiar archivos durante la presentación.

## Punto de partida

`session-12-start` coincide con `session-11-end`. Búsqueda, detalle y formulario local funcionan. Mantine Form controla campos, Zod comprueba reglas y Zustand conserva tipo e ID del medio elegido. Reutiliza [la conexión de campos de 11](../11-formularios-zod-y-modal-global/student-guide.md#4-conectar-los-campos).

Comprueba ese recorrido antes de editar. Guarda tu trabajo antes de cambiar de rama. Las ramas docentes son respaldos compartidos gradualmente; `main` conserva el inicio del curso.

## La ficha, la recepción y el pase

Piensa en una recepción. Puedes completar correctamente una ficha de acceso y aun así no tener una cuenta registrada: **Zod comprueba la ficha**, mientras **Firebase comprueba la cuenta**. Al volver, la recepción consulta si todavía existe una sesión; por eso la pantalla empieza diciendo «Comprobando», en lugar de decidir inmediatamente que estás fuera.

Para solicitar información privada a otro edificio, necesitas llevar un pase. El **ID token** es ese pase temporal. Mostrar una puerta privada en React no envía automáticamente el pase ni obliga al servidor a aceptarlo.

| Trabajo | Responsable |
| --- | --- |
| Campos, reglas y errores de formato | Mantine Form y Zod |
| Cuenta, sesión y token | Firebase Auth |
| Datos de sesión que leen los componentes | AuthProvider y Context |
| Carga, redirección o página privada | PrivateLayout |
| Añadir Bearer a una petición concreta | requestJsonWithAuth |
| Comprobar el token y autorizar una operación | Servidor |

Zustand conserva el modal de creación; TanStack Query conserva búsqueda y detalle. No copiamos el usuario ni el token a esos lugares.

## Ruta de la clase

| Bloque | Minutos | Resultado |
| --- | ---: | --- |
| Presentación continua | 28 | Reconocer los dos recorridos: pantalla y petición. |
| Construcción guiada | 44 | Configuración, formularios, observer, guardia, cliente y salida. |
| Práctica y prueba dirigida | 10 | Explicar el destino y comprobar sus entradas. |
| Comprobación y cierre | 8 | Separar evidencia local, navegador y servidor. |

Total: 90 minutos. El docente entrega soporte mecánico dentro de cada paso de código. El presupuesto se ajustará con experiencia real; no implica que debas escribir toda la interfaz desde cero.

## 1. Preparar Firebase después de las diapositivas

Confirma el preflight: proyecto propio, Web app registrada y Email/Password habilitado. En la copia de clase, instala solamente la versión acordada:

```bash
pnpm install --frozen-lockfile
```

Antes de añadir Firebase, copia la política de scripts entregada por el docente. Son dos scripts inspeccionados que no necesita nuestra inicialización explícita; no aprobamos scripts desconocidos:

**`pnpm-workspace.yaml`:**

```yaml
allowBuilds:
  '@firebase/util': false
  protobufjs: false
```

Después ejecuta:

```bash
pnpm add --save-exact firebase@12.16.0
pnpm install --frozen-lockfile
```

Si intentaste añadir antes de copiar el YAML y pnpm mostró scripts ignorados, conserva los cambios de manifest/lockfile, entrega la política y repite la instalación congelada con el docente.

`.env.example` enumera la URL pública y seis variables de Firebase. Copia tus valores a `.env.local` sin sobrescribir una configuración existente. Ese archivo permanece ignorado por Git:

```dotenv
VITE_API_URL=https://bootcamp-medialog.cardor.dev
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Las variables `VITE_` se incorporan al navegador. Son configuración de la Web app; no agregues contraseñas, cuentas de servicio, claves privadas ni tokens. Reinicia Vite después de cambiar la configuración.

El módulo `src/firebase/firebase.ts` inicializa una sola app y exporta Auth. Si falta configuración, la interfaz debe explicar esa ausencia y no fingir una sesión o un error de contraseña. Completa los valores antes de intentar registrarte.

**Comprueba:** búsqueda y detalle continúan disponibles. Una configuración ausente aparece como problema de preparación; una configuración válida permite iniciar Auth.

## 2. Conectar Login y Registro

Recorre los archivos que entrega el docente y completa los handlers:

- `src/schemas/auth.ts`: correo, contraseña mínima y confirmación coincidente.
- `src/pages/login-page.tsx`: `signInWithEmailAndPassword`.
- `src/pages/register-page.tsx`: `createUserWithEmailAndPassword`.

Mantine Form reutiliza `initialValues`, `schemaResolver`, `form.key`, `getInputProps` y `form.onSubmit`. La confirmación sirve para comparar dos campos; Firebase recibe solamente correo y contraseña.

El handler espera la promesa, bloquea otro envío y muestra un mensaje general ante fallo. Un error local aparece junto al campo; un fallo remoto aparece como mensaje del intento. No copies el usuario a un estado global desde el submit.

**Comprueba:** correo inválido y contraseñas distintas no envían. Crear una cuenta también inicia sesión. Un fallo de acceso muestra un mensaje general y permite reintentar.

## 3. Escuchar la sesión

`AuthProvider` registra `onAuthStateChanged` una sola vez y cancela esa escucha al desmontarse. El Effect sincroniza React con Firebase, como en 10 sincronizábamos el título con el navegador.

El contrato distingue tres situaciones:

| Valor de código | Qué significa |
| --- | --- |
| checking | Firebase todavía comprueba la sesión. |
| anonymous | Terminó de comprobar y no existe sesión. |
| authenticated | Existe sesión y hay datos del usuario. |

Conserva solo `uid` y `email`; valida ese objeto antes de actualizar Context. `useAuth` permite leerlo. El objeto completo del SDK y el token continúan administrados por Firebase.

**Comprueba:** recargar empieza comprobando y termina en la situación correcta. No retires Strict Mode para ocultar el ciclo adicional de desarrollo: el cleanup cancela la escucha anterior.

## 4. Proteger la pantalla y conservar el destino

`PrivateLayout` primero resuelve la comprobación pendiente, después la ausencia de sesión y finalmente muestra su `Outlet`. Sin sesión redirige a Login y conserva la página solicitada.

`toAuthDestination(state: unknown)` comprueba el objeto recibido, recorta espacios del destino y usa `/app/library` cuando falta un string válido. Un cast con `as` no examinaría ese valor real.

Login y Registro mantienen ese destino en sus enlaces y regresan allí después del éxito mediante `navigate(destination, { replace: true })`. La guardia usa `Navigate` al decidir qué renderizar; el submit navega dentro del evento que conoce el éxito.

**Comprueba:** abre `/app/library` sin sesión, cambia de Login a Registro y completa el acceso. Debes terminar en el destino solicitado. El contenido de biblioteca sigue siendo provisional.

## 5. Enviar el pase al servidor

El helper heredado `src/api/http.ts` ya añade `VITE_API_URL` a una ruta. El fetcher recibe `/api/v2/auth/check`; no duplica el dominio.

`ApiError` conserva el status. `requestJsonWithAuth` lee el usuario actual, pide `getIdToken`, conserva otros headers y añade `Authorization: Bearer`. El helper público continúa sin credencial para búsqueda y detalle.

El docente monta temporalmente `AuthRequestProbe` dentro de `LibraryPage`. Desde una sesión activa compararás el mismo endpoint con los dos helpers:

| Petición | Qué comprobar |
| --- | --- |
| Sin credencial | El servidor responde 401. |
| Con credencial aceptada | El servidor responde 200 y confirma authenticated. |

No expandas, copies, imprimas ni captures el token. Registra status y resultado. Un proyecto Firebase no permitido o un bloqueo CORS es una dependencia externa; un build exitoso no demuestra que el servidor aceptó tu sesión.

**Comprueba:** reconoce cuál helper usa cada botón. Después retira el probe, su import y su consumidor con el docente. El checkpoint final no contiene botones de diagnóstico.

## 6. Cerrar sesión

`PrivateHeader` muestra el correo, permite volver a búsqueda y ejecuta `signOut(auth)` desde el botón. Espera el éxito antes de navegar. Si la operación falla, conserva la sesión y permite otro intento.

**Comprueba:** salir vuelve a Login y otro intento de abrir biblioteca activa la guardia. Búsqueda y detalle públicos siguen funcionando. No limpiamos queries personales porque todavía no existen.

## 7. Trabajo con agente y práctica

Antes de delegar, acuerda estos comportamientos del destino. La persona escribe la función; el agente redacta únicamente sus tests:

```text
Lee src/auth/auth-destination.ts, src/schemas/auth.ts y un test puro cercano.
Usa la skill ahk-test para proponer, redactar y ejecutar pruebas Vitest:
1. Conserva un from string.
2. Recorta espacios exteriores.
3. State undefined usa /app/library.
4. State null usa /app/library.
5. From no string usa /app/library.
6. From vacío o de solo espacios usa /app/library.

Solo puedes modificar src/auth/__tests__/auth-destination.test.ts
y soporte exclusivo dentro de src/auth/__tests__/fixtures/.
Producción, Firebase, provider, páginas, rutas, cliente HTTP, configuración,
dependencias y otros tests permanecen en solo lectura.
No uses snapshots ni debilites expectativas. Si aparece una contradicción,
detente y explícala antes de cambiar código.

Ejecuta pnpm exec vitest run src/auth/__tests__/auth-destination.test.ts.
Entrega matriz, archivos, resultado y exit status; explica entradas,
salidas, supuestos y límites. No afirmes haber probado Firebase o el navegador.
```

Lee cada caso y el diff antes de aceptarlo. Si el agente tarda o no está disponible, usa la referencia del docente después de acordar la matriz; también debes leerla y ejecutarla.

```bash
pnpm exec vitest run src/auth/__tests__/auth-destination.test.ts
pnpm test
pnpm lint
pnpm build
```

Practica con una cuenta de prueba propia y conserva un registro del recorrido. Una cuenta de demostración pertenece al entorno de clase y no debe aparecer en Git.

## Evidencia y palabras del código

Entrega código, diff del agente leído, salida de comandos y casos manuales observados: formato inválido, error remoto, acceso anónimo, acceso correcto, recarga, destino conservado, logout y ausencia del probe. Marca pendiente cualquier caso que no ejecutaste.

- **Context:** forma de compartir un dato con los componentes que están dentro del provider.
- **Provider:** componente que entrega ese dato al árbol.
- **Observer:** función registrada para recibir cambios; su cleanup cancela la escucha.
- **Guardia:** componente que decide si muestra carga, redirige o permite mostrar una página.
- **Bearer:** forma de enviar el token en el header Authorization.
- **Autorización:** decisión del servidor sobre lo que permite hacer tras comprobar la credencial.

Un test puro demuestra la normalización del destino. Lint y build comprueban el código local. El navegador demuestra el recorrido observado. Solo una petición real aceptada demuestra que ese servidor aceptó el token.

## Si no terminaste

Anota último bloque y paso comprobado, cambio guardado, primera acción pendiente y evidencia que falta. Un respaldo recupera archivos; no reemplaza explicar y comprobar el trabajo pendiente. El cierre de referencia es `session-12-end`.

En la próxima sesión conectaremos el formulario local con creación y biblioteca remotas. Aquí no añadimos mutaciones, queries privadas, Firestore ni persistencia propia del token.
