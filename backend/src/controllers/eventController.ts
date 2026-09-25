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

  static async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await DataService.createEvent(req.body);
      res.status(201).json({
        success: true,
        message: 'Event created successfully',
        data: event,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updated = await DataService.updateEvent(id, req.body);
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Event not found to update',
        });
      }
      res.json({
        success: true,
        message: 'Event updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await DataService.deleteEvent(id);
      res.json({
        success: true,
        message: 'Event and associated records deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

