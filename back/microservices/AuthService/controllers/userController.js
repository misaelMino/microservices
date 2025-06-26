import { registerUser } from '../services/userService.js';

export const registerController = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ message: 'Usuario registrado con éxito', user });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Error en el registro' });
  }
};
