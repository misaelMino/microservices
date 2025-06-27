import express from 'express';
import { authBasicMiddleware } from '../middlewares/authMiddleware.js';
import { loginController, refreshController } from '../controllers/authController.js';
import { generateQRController } from '../controllers/totpController.js';
import { registerController } from '../controllers/userController.js';
const router = express.Router();
 
router.post('/login-basic', authBasicMiddleware, loginController);
router.post('/refresh', refreshController);
router.post('/generate-qr', generateQRController);
router.post('/register', registerController);






export default router;