import { test, expect } from '@playwright/test';
import { iniciarSesionEstandar } from '../../utils/acciones';
import { DATOS_ENVIO } from '../../utils/usuarios';

test.describe('Checkout', () => {
  test.beforeEach(async ({ page }) => {
    await iniciarSesionEstandar(page);
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('shopping-cart-link').click();
    await page.getByTestId('checkout').click();
  });

  test('completa la compra de principio a fin', async ({ page }) => {
    await page.getByTestId('firstName').fill(DATOS_ENVIO.nombre);
    await page.getByTestId('lastName').fill(DATOS_ENVIO.apellido);
    await page.getByTestId('postalCode').fill(DATOS_ENVIO.codigoPostal);
    await page.getByTestId('continue').click();

    // Resumen: debe mostrar el total.
    await expect(page.getByTestId('total-label')).toContainText('Total');

    await page.getByTestId('finish').click();
    await expect(page.getByTestId('complete-header')).toContainText('Thank you for your order');
  });

  test('no deja continuar sin el nombre', async ({ page }) => {
    await page.getByTestId('lastName').fill(DATOS_ENVIO.apellido);
    await page.getByTestId('postalCode').fill(DATOS_ENVIO.codigoPostal);
    await page.getByTestId('continue').click();

    await expect(page.getByTestId('error')).toContainText('First Name is required');
  });

  test('el total es la suma del subtotal más los impuestos', async ({ page }) => {
    await page.getByTestId('firstName').fill(DATOS_ENVIO.nombre);
    await page.getByTestId('lastName').fill(DATOS_ENVIO.apellido);
    await page.getByTestId('postalCode').fill(DATOS_ENVIO.codigoPostal);
    await page.getByTestId('continue').click();

    const leerMonto = async (testId: string) => {
      const txt = (await page.getByTestId(testId).textContent()) ?? '';
      return Number(txt.replace(/[^0-9.]/g, ''));
    };

    const subtotal = await leerMonto('subtotal-label');
    const impuestos = await leerMonto('tax-label');
    const total = await leerMonto('total-label');

    expect(Number((subtotal + impuestos).toFixed(2))).toBe(total);
  });
});
