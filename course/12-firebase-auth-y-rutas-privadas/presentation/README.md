# Sesión 12 · Firebase Auth y rutas privadas

Presentación aprobada por el usuario el 8 de octubre de 2026. El frontend y la guía detallada de coding se alinean ahora con esta versión.

Desde `presentation-framework/approved/`:

```bash
pnpm session-12:dev -- --port 5194
pnpm session-12:generate
```

Fuente: [index.html](index.html), estilos: [session.css](session.css), PDF: [presentation.pdf](artifacts/presentation.pdf). Flechas para navegar; `S` abre las notas privadas, excluidas del PDF. Servir por HTTP, no mediante `file://`.

28 slides: Entrar → Comprobar → Abrir → Pedir → Salir. La segunda muestra el mapa completo. Presentación continua antes del editor. [Plan y presupuesto](../../../presentation-framework/draft/session-12-presentation-plan.md): 28 minutos iniciales, pendientes de ensayo con estudiantes; la ruta docente conserva los archivos completos después de las slides.

## Referencias oficiales

- [Correo, contraseña y registro](https://firebase.google.com/docs/auth/web/password-auth).
- [Restauración y observer](https://firebase.google.com/docs/auth/web/manage-users).
- [getIdToken](https://firebase.google.com/docs/reference/js/auth#getidtoken).
- [Verificar ID tokens en servidor](https://firebase.google.com/docs/auth/admin/verify-id-tokens).
- [Configuración web y API keys](https://firebase.google.com/docs/projects/api-keys).
- [Rutas y Outlet](https://reactrouter.com/start/declarative/routing).
- [Navegación](https://reactrouter.com/start/declarative/navigating).

401/200 son resultados esperados del contrato, no una comprobación del servidor al crear el deck. No se usan credenciales reales ni recursos remotos en el render.
