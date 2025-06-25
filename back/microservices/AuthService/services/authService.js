import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import dotenv from 'dotenv';
dotenv.config();

const verifyAsync = promisify(jwt.verify);
const JWT_SECRET = process.env.JWT_SECRET;


// Verificamosssss el token JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso no autorizado: Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Acceso no autorizado: Token inválido o expirado' });
    }
    req.user = decoded;
    next();
  });
};

const refreshToken = async (refreshToken) => {
  if (!refreshToken) {
    throw { status: 401, message: 'Token no proporcionado' };
  }
  const decoded = await verifyAsync(refreshToken, JWT_SECRET).catch(() => {
    throw { status: 403, message: 'Token inválido o expirado' };
  });
  return generateToken({ username: decoded.username }, '1m');
};


// Generamos el Token JWT
const generateToken = (user, timeExpires) => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: `${timeExpires}` });
};



// Middleware de autenticación básica para login que podemos pasarlo en el body
const authenticateUser = (req, res, next) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'El nombre de usuario y la contraseña son requeridos' });
  }

  // Aquí se podrían obtener las credenciales desde variables de entorno o una base de datos
  const validUsername = process.env.AUTH_USERNAME;
  const validPassword = process.env.AUTH_PASSWORD;
  const validRole = process.env.AUTH_ROLE;

  if (username === validUsername && password === validPassword) {
    req.user = { username, role: validRole };
    next();
  } else {
    res.status(401).json({ error: 'Credenciales inválidas' });
  }
};

//Middleware para verifdicar roles, se prueba cambiando el 
const verifyRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ error: 'No tenés permisos para acceder a este recurso' });
    }
    next();
  };
};


export {
  verifyToken,
  generateToken,
  authenticateUser,
  refreshToken,
  verifyRole
};
