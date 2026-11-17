# Lectura previa · Sesión 12 · Firebase Auth y restauración de sesión

- **Tiempo estimado:** 25 minutos
- **Verificación de fuentes:** 8 de octubre de 2026
- **Versión del curso:** Firebase JavaScript SDK `12.16.0`

## Propósito

Reconocer qué hace Firebase al crear o iniciar una sesión y por qué la interfaz debe esperar la primera respuesta del observer antes de proteger una ruta.

## Conocimientos previos

- Formulario uncontrolled de Mantine.
- Schema Zod y tipo inferido.
- Rutas, layouts, `Outlet`, `Navigate` y `useNavigate`.
- Effect con cleanup para sincronizar un sistema externo.

## Preflight antes de leer

Completa estos pasos en Firebase Console. No escribas código todavía:

1. Crea o abre un proyecto dedicado al curso.
2. Registra una Web app.
3. Abre **Authentication → Sign-in method**.
4. Habilita **Email/Password**.
5. Conserva la configuración web en un lugar privado para usarla durante la clase.

No crees una cuenta de servicio y no compartas contraseñas, claves privadas o tokens. La configuración web identifica tu proyecto y terminará en el navegador; no es una contraseña de administrador. La copiarás a `.env.local` durante el bloque de código, después de la presentación.

La preparación puede necesitar tiempo adicional si es tu primer acceso a Firebase Console. Los 25 minutos corresponden a las secciones de lectura; comunica antes de la clase cualquier bloqueo al crear tu proyecto.

## Fuente 1 · Password Authentication

Lee [Authenticate with Firebase using Password-Based Accounts](https://firebase.google.com/docs/auth/web/password-auth) en:

- `Before you begin`;
- `Create a password-based account`;
- `Sign in a user with an email address and password`;
- el fragmento de `signOut` dentro de `Next steps`.

Busca estas ideas:

- el proveedor Email/Password debe estar habilitado;
- registro recibe correo y contraseña;
- una cuenta creada inicia sesión;
- login y logout son operaciones asíncronas.

## Fuente 2 · Manage Users

Lee [Manage Users in Firebase](https://firebase.google.com/docs/auth/web/manage-users) en:

- `Get the currently signed-in user`;
- la nota sobre inicialización de `currentUser`.

Busca estas ideas:

- Firebase recomienda un observer para conocer el usuario actual;
- `currentUser` puede ser `null` mientras Auth inicializa;
- el observer comunica usuario o ausencia de usuario después de resolver ese estado intermedio.

## Vocabulario previo

- **Autenticación:** comprobación de quién entra mediante su cuenta.
- **Sesión:** estado que permite a Firebase reconocer a la persona entre cargas.
- **Observer:** función registrada para recibir cambios de un sistema externo.
- **Inicialización:** periodo en que Firebase todavía recupera la sesión almacenada.
- **ID token:** pase temporal emitido por Firebase para que el servidor compruebe la sesión. Se envía con un request; no reemplaza la decisión del servidor sobre qué permite hacer.

El [control de lectura](reading-check.md) se responde después de la clase.
