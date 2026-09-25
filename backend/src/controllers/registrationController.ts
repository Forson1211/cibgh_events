import { Request, Response, NextFunction } from 'express';
import { DataService } from '../services/dataService.js';
import { EmailService } from '../services/emailService.js';
import { CreateRegistrationRequest } from '../types/index.js';

export class RegistrationController {
  static async getAllRegistrations(req: Request, res: Response, next: NextFunction) {
    try {
      const { event_id, status, search, payment_status, membership_category } = req.query;
      const registrations = await DataService.getAllRegistrations({
        eventId: event_id as string,
        status: status as string,
        search: search as string,
        paymentStatus: payment_status as string,
        membershipCategory: membership_category as string,
      });

      res.json({
        success: true,
        count: registrations.length,
        data: registrations,
      });
    } catch (error) {
      next(error);
    }
  }

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

      // Trigger official payment receipt and digital ticket pass confirmation email
      EmailService.sendPaymentConfirmation({
        registration,
        ticket,
        eventTitle: input.event_title || ticket.event_title,
      }).catch((err) =>
        console.error('[RegistrationController] Failed to trigger confirmation email asynchronously:', err)
      );

      res.status(201).json({
        success: true,
        message: 'Registration created successfully and payment confirmation email queued',
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
        registration = await DataService.getRegistrationByPaymentReference(identifier);
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

  static async resendConfirmation(req: Request, res: Response, next: NextFunction) {
    try {
      const { identifier } = req.params;
      let registration = await DataService.getRegistrationById(identifier);
      if (!registration) {
        registration = await DataService.getRegistrationByNumber(identifier);
      }
      if (!registration) {
        registration = await DataService.getRegistrationByPaymentReference(identifier);
      }

      if (!registration) {
        return res.status(404).json({
          success: false,
          message: 'Registration record not found',
        });
      }

      const ticket = await DataService.getTicket(registration.registration_number);
      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: 'Associated ticket pass could not be retrieved',
        });
      }

      const result = await EmailService.sendPaymentConfirmation({
        registration,
        ticket,
        eventTitle: registration.event_title,
      });

      return res.json({
        success: true,
        message: `Payment confirmation and ticket pass sent to ${registration.email}`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

