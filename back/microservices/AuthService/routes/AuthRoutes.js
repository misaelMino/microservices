import express from 'express';
import { authenticateUser, authMiddleware } from '../middlewares/authMiddleware.js';
import { login, refresh } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', authenticateUser, login);
router.post('/refresh', refresh);
router.post('/generate-qr', generateQRController);
router.post('/verify-totp', authMiddleware, verifyTOTPController);
// si querés poner las otras (/generate-qr, /verify-totp), mandalas también a su controller

export default router;



app.post('/login', authenticateUser, (req, res) => {
  try {
    const { username, role } = req.user;

    const accessToken = generateToken({ username, role }, '1m');
    const refreshToken = generateToken({ username, role }, '15m');
    res.json({
      accessToken: accessToken,
      tokenExpiresIn: '1m',
      refreshToken: refreshToken,
      refreshTokenExpiresIn: '15m',
      message: 'Autenticación exitosa'
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al generar el token' });
  }
});

app.post('/refresh', async (req, res) => {
  try {
    const newAccessToken = await refreshToken(req.body.refreshToken);
    res.json({
      token: newAccessToken,
      expiresIn: '1m'
    });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Error al renovar token' });
  }
});

app.post('/generate-qr', async (req, res) => {
  const { email, appName } = req.body;
  if (!email || !appName) return res.status(400).json({ error: 'Faltan email o appName' });

  const secret = speakeasy.generateSecret({ length: 20 });
  const otpauthUrl = speakeasy.otpauthURL({
    secret: secret.base32,
    label: `${appName}:${email}`,
    issuer: appName,
    encoding: 'base32'
  });

  qrcodeTerminal.generate(otpauthUrl, { small: true });

  try {
    await saveOrUpdateTOTPSecret(email, appName, secret);
    const qrDataURL = await qrcode.toDataURL(otpauthUrl);

    res.json({
      message: 'QR generado y secret guardado',
      secret: secret.base32,
      qrcode: qrDataURL
    });
  } catch {
    res.status(500).json({ error: 'Error al generar QR o guardar secret' });
  }
});

app.post('/verify-totp', authMiddleware, async (req, res) => {
  const { email, appName, token } = req.body;

  if (!email || !appName || !token) {
    return res.status(400).json({ error: 'Faltan datos en la petición' });
  }

  try {
    const record = await TOTPSecret.findOne({ email, appName });

    if (!record) {
      return res.status(404).json({ error: 'Usuario o secret no encontrado' });
    }

    const verified = speakeasy.totp.verify({
      secret: record.secret.base32,
      encoding: 'base32',
      token,
      window: 1 //desfases que no entiendo que sigfnifica?
    });

    if (verified) {
      res.json({ message: 'Token válido ✅' });
    } else {
      res.status(400).json({ message: 'Token inválido ❌' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error en la verificación' });
  }
});

