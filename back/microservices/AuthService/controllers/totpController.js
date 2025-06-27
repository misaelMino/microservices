import { generateTOTPSecret, saveOrUpdateTOTPSecret  } from '../services/TOTPService.js';
import TOTPSecret from '../models/TOTPSecret.js';


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


