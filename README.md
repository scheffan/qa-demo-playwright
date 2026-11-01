# 🧪 QA automatizado con Playwright: E2E + seguridad

[![E2E (Sauce Demo)](https://github.com/scheffan/qa-demo-playwright/actions/workflows/e2e.yml/badge.svg)](https://github.com/scheffan/qa-demo-playwright/actions/workflows/e2e.yml)
[![Seguridad (Juice Shop + OWASP ZAP)](https://github.com/scheffan/qa-demo-playwright/actions/workflows/seguridad.yml/badge.svg)](https://github.com/scheffan/qa-demo-playwright/actions/workflows/seguridad.yml)

Suite de pruebas automatizadas que combina dos cosas que se piden mucho en QA:

1. **Pruebas E2E (de punta a punta)** de un e-commerce, con [Playwright](https://playwright.dev/) y TypeScript.
2. **Pruebas de seguridad básicas** (cabeceras HTTP, cookies, validación de entradas) más un **escaneo automático con OWASP ZAP**.

Todo corre solo en **GitHub Actions** en cada push, con reportes descargables.

> ⚖️ **Nota ética.** Las pruebas apuntan únicamente a entornos pensados para practicar: la demo pública [Sauce Demo](https://www.saucedemo.com) y una instancia **local** de [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/), una aplicación vulnerable *a propósito*. Nunca se prueba contra sitios reales de terceros.

---

## ¿Qué se prueba?

### Pruebas E2E — Sauce Demo (`tests/e2e/`)

Simulan a un usuario real usando la tienda:

| Archivo | Qué cubre |
|---|---|
| `login.spec.ts` | Inicio de sesión correcto, usuario bloqueado, contraseña incorrecta, campos obligatorios y cierre de sesión. |
| `inventario.spec.ts` | Que aparezcan los 6 productos, con nombre y precio, y que el ordenamiento (por precio y por nombre) funcione. |
| `carrito.spec.ts` | Agregar y quitar productos y que el contador del carrito acompañe. |
| `checkout.spec.ts` | Compra completa de principio a fin, validación de datos de envío y que el total = subtotal + impuestos. |

### Pruebas de seguridad — Juice Shop (`tests/seguridad/`)

Lo que haría un QA al revisar la postura de seguridad de una web:

| Archivo | Qué revisa |
|---|---|
| `headers.spec.ts` | Cabeceras de seguridad (`X-Content-Type-Options`, `X-Frame-Options`) y detecta las que faltan (`Content-Security-Policy`, `Strict-Transport-Security`). |
| `cookies.spec.ts` | Higiene de cookies: banderas `HttpOnly`, `Secure` y `SameSite`. |
| `validacion-inputs.spec.ts` | Cómo responde la app a entradas raras o maliciosas (caracteres especiales, intentos de inyección), sin exponer errores internos. |

Además, el escaneo **OWASP ZAP baseline** recorre la app en busca de problemas frecuentes (cabeceras, cookies, contenido mixto, etc.) y deja un **reporte HTML** como artefacto.

---

## Cómo correrlo en tu máquina

Requisitos: [Node.js](https://nodejs.org/) 18+ y, para las pruebas de seguridad, [Docker](https://www.docker.com/).

```bash
# 1. Instalar dependencias y el navegador
npm install
npx playwright install chromium

# 2. Pruebas E2E contra Sauce Demo (web pública)
npm run test:e2e

# 3. Pruebas de seguridad: primero levantar Juice Shop en local
npm run juice          # en otra terminal; queda en http://localhost:3000
npm run test:seguridad

# Ver el último reporte en el navegador
npm run report
```

> Se puede apuntar a otra instancia con variables de entorno:
> `BASE_URL` (Sauce Demo) y `JUICE_URL` (Juice Shop).

---

## Integración continua (GitHub Actions)

Hay dos flujos de trabajo en `.github/workflows/`:

- **`e2e.yml`** — instala todo y corre las pruebas E2E contra Sauce Demo.
- **`seguridad.yml`** — levanta Juice Shop en un contenedor, corre las pruebas de seguridad y después pasa el escaneo de OWASP ZAP.

Ambos suben el reporte como *artifact*, así que se puede descargar y revisar desde la pestaña **Actions** de GitHub.

---

## Estructura del proyecto

```
├─ tests/
│  ├─ e2e/              # pruebas funcionales (Sauce Demo)
│  └─ seguridad/        # pruebas de seguridad (Juice Shop)
├─ utils/               # usuarios de prueba y acciones reutilizables
├─ .github/workflows/   # CI: e2e.yml y seguridad.yml
├─ .zap/rules.tsv       # reglas del escaneo OWASP ZAP
└─ playwright.config.ts # configuración (dos "projects": e2e y seguridad)
```

---

## Qué aprendí / qué muestra este proyecto

- Automatizar flujos completos de usuario con Playwright y selectores estables (`data-test`).
- Separar las pruebas por objetivo (funcionales vs. seguridad) con *projects* de Playwright.
- Nociones de seguridad web: cabeceras, cookies, validación de entradas e inyección SQL.
- Integrar OWASP ZAP en un pipeline de CI de forma ética y reproducible.
- Reportes y artefactos automáticos en cada push.

## Tecnologías

Playwright · TypeScript · Node.js · OWASP ZAP · OWASP Juice Shop · Docker · GitHub Actions
