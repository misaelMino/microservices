import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const verifyAsync = promisify(jwt.verify);

const generateToken = (user, timeExpires) => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: timeExpires });
};

const refreshToken = async (refreshToken) => {
  if (!refreshToken) throw { status: 401, message: 'Token requerido' };

  const decoded = await verifyAsync(refreshToken, JWT_SECRET).catch(() => {
    throw { status: 403, message: 'Token inválido o expirado' };
  });

  return generateToken({ username: decoded.username }, '1m');
};

export { generateToken, refreshToken };
