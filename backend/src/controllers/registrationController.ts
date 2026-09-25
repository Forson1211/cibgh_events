import { Request, Response, NextFunction } from 'express';
import { DataService } from '../services/dataService.js';
import { EmailService } from '../services/emailService.js';
import { CreateRegistrationRequest } from '../types/index.js';

export class RegistrationController {
  static async createRegistration(req: Request, res: Response, next: NextFunction) {
    try {
      const input: CreateRegistrationRequest = req.body;

      if (!input.event_id || !input.first_name || !input.last_name || !input.email) {
        return res.status(400).json({
          success: false,
          message: 'Missing required registration fields (event_id, first_name, last_name, email)',
        });
      }

      const { registration, ticket } = await DataService.createRegistration(input);

      // If registration fee is free or paid, trigger confirmation email
      if (registration.payment_status === 'SUCCESSFUL') {
        EmailService.sendTicketConfirmation(ticket).catch((err) =>
          console.error('Failed to trigger email asynchronously:', err)
        );
      }

      res.status(201).json({
        success: true,
        message: 'Registration created successfully',
        data: {
          registration,
          ticket,
        },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create registration',
      });
    }
  }

  static async getRegistration(req: Request, res: Response, next: NextFunction) {
    try {
      const { identifier } = req.params;
      let registration = await DataService.getRegistrationById(identifier);
      if (!registration) {
        registration = await DataService.getRegistrationByNumber(identifier);
      }

      if (!registration) {
        return res.status(404).json({
          success: false,
          message: 'Registration not found',
        });
      }

      const ticket = await DataService.getTicket(registration.registration_number);

      res.json({
        success: true,
        data: {
          registration,
          ticket,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
