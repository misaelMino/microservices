import { generateToken, refreshToken } from '../services/authService.js';

export const login = (req, res) => {
  const { username, role } = req.user;

  const accessToken = generateToken({ username, role }, '1m');
  const refreshTokenValue = generateToken({ username, role }, '15m');

  res.json({
    accessToken,
    refreshToken: refreshTokenValue,
    message: 'Autenticación exitosa',
  });
};

export const refresh = async (req, res) => {
  try {
    const newAccessToken = await refreshToken(req.body.refreshToken);
    res.json({ token: newAccessToken });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};
