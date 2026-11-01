import { Page, expect } from '@playwright/test';
import { PASSWORD } from './usuarios';

/**
 * Pequeñas funciones reutilizables para no repetir los mismos pasos en cada test.
 * Sauce Demo expone atributos `data-test` estables, así que los usamos como selectores.
 */

/** Inicia sesión y verifica que llegamos al listado de productos. */
export async function iniciarSesion(page: Page, usuario: string, password: string = PASSWORD) {
  await page.goto('/');
  await page.getByTestId('username').fill(usuario);
  await page.getByTestId('password').fill(password);
  await page.getByTestId('login-button').click();
}

/** Inicia sesión como el usuario estándar y espera el inventario visible. */
export async function iniciarSesionEstandar(page: Page, usuario = 'standard_user') {
  await iniciarSesion(page, usuario);
  await expect(page.getByTestId('inventory-list')).toBeVisible();
}

/** Devuelve el número que muestra la burbuja del carrito (0 si está vacío). */
export async function cantidadEnCarrito(page: Page): Promise<number> {
  const badge = page.getByTestId('shopping-cart-badge');
  if (await badge.count() === 0) return 0;
  return Number((await badge.textContent())?.trim() ?? '0');
}
