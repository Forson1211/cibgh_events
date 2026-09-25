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
}
