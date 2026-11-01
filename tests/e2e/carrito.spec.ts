import { test, expect } from '@playwright/test';
import { iniciarSesionEstandar, cantidadEnCarrito } from '../../utils/acciones';

test.describe('Carrito', () => {
  test.beforeEach(async ({ page }) => {
    await iniciarSesionEstandar(page);
  });

  test('agregar un producto actualiza la burbuja del carrito', async ({ page }) => {
    expect(await cantidadEnCarrito(page)).toBe(0);
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    expect(await cantidadEnCarrito(page)).toBe(1);
  });

  test('agregar dos productos deja la burbuja en 2', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
    expect(await cantidadEnCarrito(page)).toBe(2);
  });

  test('quitar un producto vuelve la burbuja a cero', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('remove-sauce-labs-backpack').click();
    expect(await cantidadEnCarrito(page)).toBe(0);
  });

  test('el producto agregado aparece dentro del carrito', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('shopping-cart-link').click();

    await expect(page).toHaveURL(/cart\.html/);
    await expect(page.getByTestId('inventory-item')).toHaveCount(1);
    await expect(page.getByTestId('inventory-item-name')).toHaveText('Sauce Labs Backpack');
  });
});
