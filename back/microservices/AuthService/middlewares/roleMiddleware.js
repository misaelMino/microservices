const roleMiddleware = (roles) => (req, res, next) => {
  const user = req.decoded;
  if (!roles.includes(user.role)) {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  next();
};