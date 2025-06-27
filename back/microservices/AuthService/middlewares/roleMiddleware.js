//Middleware para verifdicar roles, se prueba cambiando el 
const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ error: 'No tenés permisos para acceder a este recurso' });
    }
    next();
  };
};
export default roleMiddleware;