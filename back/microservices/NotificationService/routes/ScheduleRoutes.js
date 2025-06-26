import { registerActController,
     getAllActivitiesController,
     getActivityByIdController,
     updateActivityController,
     deleteActivityController
     } from '../controllers/activityController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';



const router = express.Router();
router.post(
  '/activities',
  authMiddleware,            // Verifica token JWT
  roleMiddleware('organizador'), // Solo organizador puede crear
  registerActController         // Lógica de crear actividad
);
router.get('/activities', getAllActivitiesController);
router.get('/activities/:id', getActivityByIdController);
router.put('/activities/:id', authMiddleware, roleMiddleware('organizador'), updateActivityController);
router.delete('/activities/:id', authMiddleware, roleMiddleware('organizador'), deleteActivityController);




export default router;