import { Router } from 'express';
import { RegistrationController } from '../controllers/registrationController.js';

const router = Router();

router.post('/', RegistrationController.createRegistration);
router.get('/:identifier', RegistrationController.getRegistration);

export default router;
