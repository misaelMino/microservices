import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
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



export { authMiddleware, authenticateUser };
