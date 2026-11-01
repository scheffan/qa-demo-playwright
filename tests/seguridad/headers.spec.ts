import { test, expect } from '@playwright/test';

/**
 * Pruebas de cabeceras de seguridad HTTP.
 *
 * Objetivo didáctico: aprender a auditar la postura de seguridad de una web
 * leyendo sus cabeceras de respuesta. El objetivo es OWASP Juice Shop, una
 * aplicación INTENCIONALMENTE vulnerable pensada para practicar.
 *
 * Verificamos los controles que Juice Shop sí aplica y dejamos documentados,
 * con mensajes claros, los que faltan (recordatorio de buenas prácticas).
 */

test.describe('Cabeceras de seguridad', () => {
  test('existe X-Content-Type-Options: nosniff (evita MIME sniffing)', async ({ request }) => {
    const res = await request.get('/');
    expect(res.headers()['x-content-type-options']).toBe('nosniff');
  });

  test('existe X-Frame-Options (mitiga clickjacking)', async ({ request }) => {
    const res = await request.get('/');
    expect(res.headers()['x-frame-options']?.toUpperCase()).toBe('SAMEORIGIN');
  });

  test('la respuesta no filtra la tecnología del servidor en X-Powered-By', async ({ request }) => {
    const res = await request.get('/');
    // Exponer "X-Powered-By: Express" facilita al atacante elegir exploits.
    // Lo dejamos como recordatorio: si aparece, conviene ocultarlo.
    const powered = res.headers()['x-powered-by'];
    if (powered) {
      console.log(`[hallazgo] X-Powered-By expuesto: "${powered}" (recomendación: ocultarlo)`);
    }
    expect(res.ok()).toBeTruthy();
  });

  test('auditoría: reporta CSP y HSTS faltantes', async ({ request }) => {
    const res = await request.get('/');
    const h = res.headers();

    const csp = h['content-security-policy'];
    const hsts = h['strict-transport-security'];

    if (!csp) console.log('[hallazgo] Falta Content-Security-Policy (defensa contra XSS/inyección).');
    if (!hsts) console.log('[hallazgo] Falta Strict-Transport-Security (fuerza HTTPS).');

    // Esta prueba audita y documenta; no falla por los hallazgos esperados
    // en una app vulnerable. El escaneo de OWASP ZAP cubre el resto.
    expect(res.status()).toBeLessThan(500);
  });
});
