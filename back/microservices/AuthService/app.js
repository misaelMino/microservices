import express from 'express';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import qrcodeTerminal from 'qrcode-terminal';
import connectMongo from './config/configMongo.js';
import { saveOrUpdateTOTPSecret } from './repository.js';
import TOTPSecret from './models/TOTPSecret.js';
import authMiddleware from './authMiddleware.js';
import { authenticateUser, generateToken } from './auth.js';

const app = express();
app.use(express.json());

await connectMongo();




app.listen(3000, () => console.log('🚀 Server en puerto 3000'));



