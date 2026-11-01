/**
 * Usuarios públicos de prueba de Sauce Demo (https://www.saucedemo.com).
 * Son credenciales de demostración que el propio sitio publica en su pantalla de login.
 */
export const PASSWORD = 'secret_sauce';

export const USUARIOS = {
  estandar: 'standard_user',
  bloqueado: 'locked_out_user',
  conProblemas: 'problem_user',
  lento: 'performance_glitch_user',
} as const;

/** Datos de envío de ejemplo para completar el checkout. */
export const DATOS_ENVIO = {
  nombre: 'Lucas',
  apellido: 'Kane',
  codigoPostal: '2000',
};
