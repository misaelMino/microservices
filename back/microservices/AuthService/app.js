import express from 'express';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import qrcodeTerminal from 'qrcode-terminal';
import connectMongo from './configMongo.js';
import { saveOrUpdateTOTPSecret } from './repository.js';
import TOTPSecret from './models/TOTPSecret.js';
import authMiddleware from './authMiddleware.js';
import { authenticateUser, generateToken } from './auth.js';

const app = express();
app.use(express.json());

await connectMongo();

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

app.post('/login', authenticateUser, (req, res) => {
  const token = generateToken(req.user, '1h'); // Token válido por 1 hora
  res.json({ token });
});


app.listen(3000, () => console.log('🚀 Server en puerto 3000'));



