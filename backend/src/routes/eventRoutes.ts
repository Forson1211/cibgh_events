import { Router } from 'express';
import { EventController } from '../controllers/eventController.js';

const router = Router();

router.get('/', EventController.listEvents);
router.post('/', EventController.createEvent);
router.get('/:slugOrId', EventController.getEvent);
router.put('/:id', EventController.updateEvent);
router.delete('/:id', EventController.deleteEvent);

export default router;
