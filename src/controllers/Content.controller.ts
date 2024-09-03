import { Request, Response, NextFunction } from 'express';
import { contentService } from '../services/Content.service';
import { BadRequestError } from '../middlewares/errorHandler.middleware';

export class ContentController {
  static async createContent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, type, instructorId } = req.body;

      if (!title || !type || !instructorId) {
        throw new BadRequestError('Missing required fields: title, type, or instructorId.');
      }

      const content = await contentService.generateContent(title, type, instructorId);
      res.status(201).json(content);
    } catch (error) {
      next(error); 
    }
  }
}
