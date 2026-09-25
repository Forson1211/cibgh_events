import { Router } from 'express';
import { AdminController } from '../controllers/adminController.js';

const router = Router();

router.post('/login', AdminController.login);
router.get('/stats', AdminController.getStats);
router.get('/registrations', AdminController.getAllRegistrations);

export default router;
