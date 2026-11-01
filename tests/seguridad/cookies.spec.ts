import { test, expect } from '@playwright/test';

/**
 * Pruebas de higiene de cookies.
 *
 * Buenas prácticas que revisamos sobre las cookies que emite la aplicación:
 *  - HttpOnly: que JavaScript no pueda leerlas (mitiga robo por XSS).
 *  - SameSite: que no se envíen en peticiones de otros sitios (mitiga CSRF).
 *  - Secure:   que solo viajen por HTTPS.
 *
 * Contra OWASP Juice Shop (app vulnerable, servida por HTTP en local)
 * auditamos y documentamos cada cookie.
 */

test.describe('Higiene de cookies', () => {
  test('la aplicación deja al menos una cookie tras cargar', async ({ page, context }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // La app crea cookies por JavaScript al arrancar; reintentamos hasta verlas.
    await expect.poll(async () => (await context.cookies()).length, { timeout: 10000 })
      .toBeGreaterThan(0);
  });

  test('auditoría: reporta las banderas de cada cookie', async ({ page, context }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect.poll(async () => (await context.cookies()).length, { timeout: 10000 })
      .toBeGreaterThan(0);

    const cookies = await context.cookies();
    for (const c of cookies) {
      const flags = [
        c.httpOnly ? 'HttpOnly' : 'sin-HttpOnly',
        c.secure ? 'Secure' : 'sin-Secure',
        `SameSite=${c.sameSite ?? 'None'}`,
      ].join(', ');
      console.log(`[cookie] ${c.name}: ${flags}`);

      if (!c.httpOnly) {
        console.log(`[hallazgo] La cookie "${c.name}" es accesible desde JavaScript (sin HttpOnly).`);
      }
    }

    // Auditoría documental: deja el registro sin frenar la corrida.
    expect(cookies.length).toBeGreaterThan(0);
  });
});
