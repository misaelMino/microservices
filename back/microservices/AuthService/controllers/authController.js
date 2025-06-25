import { generateToken, refreshToken } from '../services/authService.js';
//import { refreshToken as generateNewAccessToken } from '../services/authService.js';

export const loginController = (req, res) => {
  const { username, role } = req.user;
  const accessToken = generateToken({ username, role }, '1m');
  const refreshToken = generateToken({ username, role }, '15m');
  res.json({ accessToken, refreshToken, message: 'OK' });
};

export const refreshController = async (req, res) => {
  try {
    const newAccessToken = await refreshToken(req.body.refreshToken);
    res.json({ token: newAccessToken });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};