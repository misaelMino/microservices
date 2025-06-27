//Middleware para verifdicar roles, se prueba cambiando el 
export const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || (!allowedRoles.includes(req.user.role) && req.user.role !== 'admin')) {
      return res.status(403).json({ error: 'No tenés permisos para acceder a este recurso' });
    }
    next();
  };
};


export default roleMiddleware;