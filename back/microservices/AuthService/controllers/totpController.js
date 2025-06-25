import { generateTOTPSecret, verifyTOTPToken, saveOrUpdateTOTPSecret  } from '../services/TOTPService.js';
import TOTPSecret from '../models/TOTPSecret.js';
/**
 * Controlador para generar un nuevo QR TOTP y guardar el secret asociado
 */
export const generateQRController = async (req, res) => {
  const { email, appName } = req.body;

  if (!email || !appName) {
    return res.status(400).json({ error: 'Faltan email o appName' });
  }

  try {
    const { secret, url } = generateTOTPSecret(email, appName);
    await saveOrUpdateTOTPSecret(email, appName, secret);

    res.json({
      message: 'QR generado y secret guardado',
      secret: secret.base32,
      otpauth_url: url
    });
  } catch (err) {
    console.error('❌ Error al generar QR o guardar secret:', err);
    res.status(500).json({ error: 'Error al generar QR o guardar secret' });
  }
};

/**
 * Controlador para verificar un token TOTP
 */
export const verifyTOTPController = async (req, res) => {
  const { email, appName, token } = req.body;

  if (!email || !appName || !token) {
    return res.status(400).json({ error: 'Faltan datos en la petición' });
  }

  try {
    const record = await TOTPSecret.findOne({ email, appName });

    if (!record) {
      return res.status(404).json({ error: 'Usuario o secret no encontrado' });
    }

    const verified = verifyTOTPToken(token, record.secret.base32);

    if (verified) {
      res.json({ message: 'Token válido ✅' });
    } else {
      res.status(400).json({ message: 'Token inválido ❌' });
    }
  } catch (error) {
    console.error('❌ Error en la verificación:', error);
    res.status(500).json({ error: 'Error en la verificación del token' });
  }
};
