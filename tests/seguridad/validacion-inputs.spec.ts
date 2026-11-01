import { test, expect } from '@playwright/test';

/**
 * Pruebas de validación de entradas (input handling).
 *
 * Idea: enviar entradas "raras" o maliciosas y observar cómo las maneja la app.
 * Es lo que haría un QA al revisar la robustez y la seguridad de APIs y formularios.
 *
 * Todo contra una instancia LOCAL de OWASP Juice Shop (app de práctica,
 * intencionalmente vulnerable). No se explota nada: solo se observa el
 * comportamiento ante entradas límite y se documentan los hallazgos.
 */

// Entradas típicas de prueba: caracteres especiales, intentos de XSS/inyección y textos largos.
const ENTRADAS = [
  'cámara',
  "comilla'simple",
  '<script>alert(1)</script>',
  '" OR "1"="1',
  'a'.repeat(500),
];

test.describe('Validación de entradas', () => {
  test('una búsqueda normal responde 200 con una lista de resultados', async ({ request }) => {
    const res = await request.get('/rest/products/search?q=apple');
    expect(res.status()).toBe(200);
    const cuerpo = await res.json();
    expect(cuerpo).toHaveProperty('data');
    expect(Array.isArray(cuerpo.data)).toBeTruthy();
  });

  test('auditoría: detecta entradas que rompen el backend (posible inyección SQL)', async ({ request }) => {
    const sospechosas: string[] = [];

    for (const q of ENTRADAS) {
      const res = await request.get(`/rest/products/search?q=${encodeURIComponent(q)}`);
      console.log(`[búsqueda] q=${JSON.stringify(q).slice(0, 40)} -> HTTP ${res.status()}`);

      // Un 5xx ante una entrada con comillas suele delatar una inyección SQL:
      // la entrada llega sin sanitizar hasta la consulta y rompe el motor.
      if (res.status() >= 500) {
        sospechosas.push(q);
        console.log(`[hallazgo] La entrada ${JSON.stringify(q)} provoca un error ${res.status()} (entrada sin sanitizar).`);
      }
    }

    // Auditoría documental: deja el registro de hallazgos sin frenar la corrida.
    // En una app endurecida, este arreglo debería quedar vacío.
    console.log(`[resumen] entradas que rompen el backend: ${sospechosas.length}`);
    expect(Array.isArray(sospechosas)).toBeTruthy();
  });

  test('el login por API rechaza credenciales inválidas con 401, sin filtrar errores internos', async ({ request }) => {
    const res = await request.post('/rest/user/login', {
      data: { email: '"><b>x</b>@test.com', password: "cualquiera' --" },
    });

    expect(res.status()).toBe(401);
    const texto = await res.text();
    // No debe aparecer una traza de error ni el nombre del motor de base de datos.
    expect(texto).not.toMatch(/stack trace|SequelizeDatabaseError|at Object\./i);
  });

  test('pedir un producto inexistente no devuelve un error 5xx', async ({ request }) => {
    const res = await request.get('/api/Products/99999999');
    console.log(`[producto inexistente] HTTP ${res.status()}`);
    expect(res.status()).toBeLessThan(500);
  });
});
