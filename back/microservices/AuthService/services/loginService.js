import TOTPSecret from '../models/TOTPSecret.js';
import { verifyTOTPToken } from './TOTPService.js';
import { generateToken } from './authService.js';

export const loginWithTOTP = async ({ email, username, role, token }) => {
  if (!token) throw { status: 400, message: 'Falta el token TOTP' };
  //aca cuidado con el nombre de la APP sino lo encuentra y no trae el totp.. tambien se podria sacar pero bueno xd
  const totp = await TOTPSecret.findOne({ email, appName: 'Eventos y conferencias' });
  if (!totp) throw { status: 400, message: 'TOTP no configurado' };

  const valid = verifyTOTPToken(token, totp.secret);
  if (!valid) throw { status: 401, message: 'Token TOTP inválido' };

  const accessToken = generateToken({ username, role }, '60m');
  const refreshTokenValue = generateToken({ username, role }, '2h');

  return { accessToken, refreshToken: refreshTokenValue };
};
