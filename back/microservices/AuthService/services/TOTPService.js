import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import TOTPSecret from '../models/TOTPSecret';


export const generateTOTPSecret = (email, appName) => {
  const secret = speakeasy.generateSecret({ length: 20 });
  const url = speakeasy.otpauthURL({
    secret: secret.base32,
    label: `${appName}:${email}`,
    issuer: appName,
    encoding: 'base32'
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
