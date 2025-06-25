import TOTPSecret from './models/TOTPSecret.js';


//sv para totp
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
