import { test, expect } from '@playwright/test';
import { iniciarSesion } from '../../utils/acciones';
import { USUARIOS, PASSWORD } from '../../utils/usuarios';

test.describe('Login', () => {
  test('el usuario estándar puede iniciar sesión', async ({ page }) => {
    await iniciarSesion(page, USUARIOS.estandar);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByTestId('title')).toHaveText('Products');
  });

  test('el usuario bloqueado ve un mensaje de error', async ({ page }) => {
    await iniciarSesion(page, USUARIOS.bloqueado);
    await expect(page.getByTestId('error')).toContainText('locked out');
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('una contraseña incorrecta no deja entrar', async ({ page }) => {
    await iniciarSesion(page, USUARIOS.estandar, 'password_incorrecta');
    await expect(page.getByTestId('error')).toContainText('do not match');
  });

  test('sin usuario pide completar el campo', async ({ page }) => {
    await iniciarSesion(page, '', PASSWORD);
    await expect(page.getByTestId('error')).toContainText('Username is required');
  });

  test('se puede cerrar sesión', async ({ page }) => {
    await iniciarSesion(page, USUARIOS.estandar);
    // El sitio tiene dos versiones del menú; aceptamos ambos selectores.
    await page.getByTestId('open-menu').or(page.locator('#react-burger-menu-btn')).click();
    await page.getByTestId('logout-sidebar-link').or(page.locator('#logout_sidebar_link')).click();
    await expect(page.getByTestId('login-button')).toBeVisible();
  });
});
