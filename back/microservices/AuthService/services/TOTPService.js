import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import TOTPSecret from '../models/TOTPSecret.js';


export const generateTOTPSecret = async (email, appName) => {
  const secret = speakeasy.generateSecret({ length: 20 });

  const url = speakeasy.otpauthURL({
    secret: secret.base32,
    label: `${appName}:${email}`,
    issuer: appName,
    encoding: 'base32'
  });

  // 🖨️ Mostrar en consola (reutilizable desde cualquier lugar)
  qrcode.toString(url, { type: 'terminal', small: true }, (err, qr) => {
    if (err) return console.error('❌ Error al generar QR:', err);
    console.log('📲 Escaneá este QR con Google Authenticator:\n');
    console.log(qr);
    console.log(`🔐 Base32 (manual): ${secret.base32}`);
  });

  return { secret, url };
};

export const verifyTOTPToken = (token, base32Secret) => {
  return speakeasy.totp.verify({
    secret: base32Secret,
    encoding: 'base32',
    token,
    window: 1
  });
};

export async function saveOrUpdateTOTPSecret(email, appName, secret) {
  try {
    const existing = await TOTPSecret.findOne({ email, appName });
    if (existing) {
      existing.secret = secret;
      await existing.save();
      console.log('🔁 Secret actualizado.');
    } else {
      await new TOTPSecret({ email, appName, secret }).save();
      console.log('✅ Secret guardado.');
    }
  } catch (err) {
    console.error('❌ Error al guardar o actualizar secret:', err);
    throw err;
  }
}
