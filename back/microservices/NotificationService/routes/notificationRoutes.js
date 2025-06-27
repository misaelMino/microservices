import express from 'express';
import {
  createNotificationController,
  getNotificationsController,
  markAsReadController
} from '../controllers/notificationController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post(
  '/notifications',
  authMiddleware,
  roleMiddleware('organizador'), // solo organizadores
  createNotificationController
);
router.get('/notifications/:userId', authMiddleware, getNotificationsController);
router.patch('/notifications/:id/read', authMiddleware, markAsReadController);

export default router;
