// src/controllers/Assignment.controller.ts
import { Request, Response, NextFunction } from 'express';
import { Assignment } from '../models/Assignment.model';
import { CustomError, ErrorType } from '../middlewares/CustomError.middleware';
import { ResponseHandler } from '../middlewares/ResponseHandler.middlewares';

export class AssignmentController {
  async getAssignment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const assignment = await Assignment.findByPk(parseInt(id));

      if (!assignment) {
        throw new CustomError(ErrorType.NOT_FOUND, 'Assignment not found.', 404);
      }

      ResponseHandler.success(res, assignment, 'Assignment retrieved successfully.');
    } catch (error) {
      next(error);
    }
  }
}
