import { test, expect } from '@playwright/test';
import { iniciarSesionEstandar } from '../../utils/acciones';

test.describe('Inventario', () => {
  test.beforeEach(async ({ page }) => {
    await iniciarSesionEstandar(page);
  });

  test('muestra los 6 productos del catálogo', async ({ page }) => {
    await expect(page.getByTestId('inventory-item')).toHaveCount(6);
  });

  test('cada producto tiene nombre y precio', async ({ page }) => {
    const items = page.getByTestId('inventory-item');
    const total = await items.count();
    for (let i = 0; i < total; i++) {
      await expect(items.nth(i).getByTestId('inventory-item-name')).not.toBeEmpty();
      await expect(items.nth(i).getByTestId('inventory-item-price')).toContainText('$');
    }
  });

  test('ordenar por precio de menor a mayor funciona', async ({ page }) => {
    await page.getByTestId('product-sort-container').selectOption('lohi');

    const textos = await page.getByTestId('inventory-item-price').allTextContents();
    const precios = textos.map((t) => Number(t.replace('$', '')));

    const ordenados = [...precios].sort((a, b) => a - b);
    expect(precios).toEqual(ordenados);
  });

  test('ordenar por nombre de Z a A funciona', async ({ page }) => {
    await page.getByTestId('product-sort-container').selectOption('za');

    const nombres = await page.getByTestId('inventory-item-name').allTextContents();
    const ordenados = [...nombres].sort().reverse();
    expect(nombres).toEqual(ordenados);
  });
});
