import express from 'express';
import {
  createNotificationController,
  getNotificationsController,
  markAsReadController
} from '../controllers/notificationController.js';
import { authBasicMiddleware } from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post(
  '/notifications',
  authBasicMiddleware,
  roleMiddleware(['organizador']), // solo organizadores
  createNotificationController
);

router.get('/notifications/:userId', authBasicMiddleware, getNotificationsController);


router.patch('/notifications/:id/read',authBasicMiddleware, markAsReadController);

export default router;
