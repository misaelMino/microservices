import { refreshToken } from '../services/authService.js';
import { loginWithTOTP } from '../services/loginService.js';

//import { refreshToken as generateNewAccessToken } from '../services/authService.js';

export const loginController = async (req, res) => {
  try {
    const { username, role, email } = req.user;
    const { token } = req.body;
    const tokens = await loginWithTOTP({ email, username, role, token });
    res.json({ ...tokens, message: 'OK' });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Error interno' });
  }
};

export const refreshController = async (req, res) => {
  try {
    const newAccessToken = await refreshToken(req.body.refreshToken);
    res.json({ token: newAccessToken });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};