import { Request, Response, NextFunction } from 'express';
import { DataService } from '../services/dataService.js';

export class EventController {
  static async listEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, search, status, isPast } = req.query;
      const events = await DataService.getAllEvents({
        category: category ? String(category) : undefined,
        search: search ? String(search) : undefined,
        status: status ? String(status) : undefined,
        isPast: isPast !== undefined ? isPast === 'true' : undefined,
      });

      res.json({
        success: true,
        count: events.length,
        data: events,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { slugOrId } = req.params;
      const event = await DataService.getEventBySlugOrId(slugOrId);

      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found',
        });
      }

      res.json({
        success: true,
        data: event,
      });
    } catch (error) {
      next(error);
    }
  }
}
