import { Router } from 'express';
import { PaymentController } from '../controllers/paymentController.js';

const router = Router();

router.post('/initialize', PaymentController.initializePayment);
router.get('/verify/:reference', PaymentController.verifyPayment);
router.post('/webhook', PaymentController.handleWebhook);

export default router;
