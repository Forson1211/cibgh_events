import { Router } from 'express';
import { EventController } from '../controllers/eventController.js';

const router = Router();

router.get('/', EventController.listEvents);
router.get('/:slugOrId', EventController.getEvent);

export default router;
