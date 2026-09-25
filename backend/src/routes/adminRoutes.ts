import { Router } from 'express';
import { AdminController } from '../controllers/adminController.js';

const router = Router();

router.get('/stats', AdminController.getStats);

export default router;
