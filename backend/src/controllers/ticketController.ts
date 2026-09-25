import { Request, Response, NextFunction } from 'express';
import { DataService } from '../services/dataService.js';
import { VerifyQrRequest } from '../types/index.js';

export class TicketController {
  static async getTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const { identifier } = req.params;
      const ticket = await DataService.getTicket(identifier);

      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: 'Digital pass not found',
        });
      }

      res.json({
        success: true,
        data: ticket,
      });
    } catch (error) {
      next(error);
    }
  }

  static async verifyQrCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { qr_data, event_id }: VerifyQrRequest = req.body;

      if (!qr_data) {
        return res.status(400).json({
          success: false,
          message: 'Missing qr_data payload',
        });
      }

      let parsedPayload: any;
      try {
        parsedPayload = typeof qr_data === 'string' ? JSON.parse(qr_data) : qr_data;
      } catch (err) {
        // May be a raw registration number string
        parsedPayload = { reg_num: qr_data };
      }

      const identifier = parsedPayload.reg_num || parsedPayload.reg_id || qr_data;
      const ticket = await DataService.getTicket(identifier);

      if (!ticket) {
        return res.status(404).json({
          success: false,
          valid: false,
          message: 'Invalid QR code or unrecognized delegate pass',
        });
      }

      // Verify event match if event_id is supplied
      if (event_id && ticket.event_id !== event_id) {
        return res.status(400).json({
          success: false,
          valid: false,
          message: 'Ticket is for a different CIB Ghana event',
        });
      }

      res.json({
        success: true,
        valid: true,
        data: ticket,
      });
    } catch (error) {
      next(error);
    }
  }

  static async checkIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { identifier } = req.params;
      const result = await DataService.checkInAttendee(identifier);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.message,
          data: result.ticket,
        });
      }

      res.json({
        success: true,
        message: result.message,
        data: result.ticket,
      });
    } catch (error) {
      next(error);
    }
  }
}
