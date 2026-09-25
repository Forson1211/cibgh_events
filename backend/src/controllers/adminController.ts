import { Request, Response, NextFunction } from 'express';
import { DataService } from '../services/dataService.js';

export class AdminController {
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await DataService.getAdminStats();
      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

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

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { password } = req.body;
      if (password && password.trim() === 'cibghana') {
        return res.json({
          success: true,
          message: 'Admin authentication successful',
          token: 'cib_admin_token_active',
          user: {
            role: 'SUPER_ADMIN',
            email: 'admin@cibgh.org',
            name: 'CIB Administrator',
          },
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid administrator password',
      });
    } catch (error) {
      next(error);
    }
  }
}
