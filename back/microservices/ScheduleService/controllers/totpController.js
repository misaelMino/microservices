import { generateTOTPSecret, verifyTOTPToken, saveOrUpdateTOTPSecret  } from '../services/TOTPService.js';
import TOTPSecret from '../models/Activities.js';


//Controlador para generar un nuevo QR TOTP y guardar el secret asociado
export const generateQRController = async (req, res) => {
  const { email, appName = 'Eventos y conferencias' } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Se requiere el email' });
  }

  try {
    const { secret, url } = await generateTOTPSecret(email, appName);

    await saveOrUpdateTOTPSecret(email, appName, secret.base32);

    return res.status(200).json({
      message: '✅ Secret TOTP generado',
      qrURL: url,
      base32: secret.base32
    });
  } catch (err) {
    console.error('❌ Error al generar QR:', err);
    return res.status(500).json({ error: 'Error al generar el secreto TOTP' });
  }
};


 //Controlador para verificar un token TOTP
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

    const verified = verifyTOTPToken(token, record.secret);

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


