import express from 'express';
import { authenticateUser, authMiddleware } from '../middlewares/authMiddleware.js';
import { loginController, refreshController } from '../controllers/authController.js';
import { generateQRController, verifyTOTPController } from '../controllers/totpController.js';
import { registerController } from '../controllers/userController.js';
const router = express.Router();

router.post('/login', authenticateUser, loginController);
router.post('/refresh', refreshController);
router.post('/generate-qr', generateQRController);
router.post('/verify-totp', authMiddleware, verifyTOTPController);
router.post('/register', registerController);






export default router;