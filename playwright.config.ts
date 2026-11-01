import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración de Playwright.
 *
 * Hay dos grupos de pruebas ("projects"):
 *  - e2e:       pruebas funcionales contra la demo pública Sauce Demo.
 *  - seguridad: pruebas de seguridad contra una instancia LOCAL de OWASP Juice Shop,
 *               una app intencionalmente vulnerable pensada para practicar.
 *
 * Las URL se pueden sobreescribir con variables de entorno para poder
 * apuntar a otra instancia sin tocar el código.
 */

const URL_SAUCEDEMO = process.env.BASE_URL ?? 'https://www.saucedemo.com';
const URL_JUICESHOP = process.env.JUICE_URL ?? 'http://localhost:3000';

export default defineConfig({
  testDir: './tests',
  // Falla la corrida si alguien dejó un test.only olvidado (típico en CI).
  forbidOnly: !!process.env.CI,
  // En CI reintenta una vez para tolerar parpadeos de red; en local, cero.
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'e2e',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Chrome'], baseURL: URL_SAUCEDEMO },
    },
    {
      name: 'seguridad',
      testDir: './tests/seguridad',
      use: { ...devices['Desktop Chrome'], baseURL: URL_JUICESHOP },
    },
  ],
});
