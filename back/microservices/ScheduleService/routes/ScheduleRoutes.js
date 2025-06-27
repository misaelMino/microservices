import { registerActController,
     getAllActivitiesController,
     getActivityByIdController,
     updateActivityController,
     deleteActivityController
     } from '../controllers/activityController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';
import express from 'express';
import { getUpcomingActivities } from '../controllers/activityController.js';

const router = express.Router();
router.post(
  '/activities',
  authMiddleware,            // Verifica token JWT
  roleMiddleware(['organizador']), // Solo organizador puede crear
  registerActController         // Lógica de crear actividad
);
router.get('/activities/upcoming', roleMiddleware(['organizador']), getUpcomingActivities);
router.get('/activities', roleMiddleware(['organizador']), getAllActivitiesController);
router.get('/activities/:id', roleMiddleware(['expositor', 'asistente']), getActivityByIdController);
router.put('/activities/:id', authMiddleware, roleMiddleware(['organizador']), updateActivityController);
router.delete('/activities/:id', authMiddleware, roleMiddleware(['organizador']),  deleteActivityController);




export default router;