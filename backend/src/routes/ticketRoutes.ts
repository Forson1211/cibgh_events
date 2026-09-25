import { Router } from 'express';
import { TicketController } from '../controllers/ticketController.js';

const router = Router();

router.get('/:identifier', TicketController.getTicket);
router.post('/verify-qr', TicketController.verifyQrCode);
router.post('/:identifier/check-in', TicketController.checkIn);

export default router;
