import { Request, Response, NextFunction } from 'express';
import { assessmentService } from '../services/Assessment.service';
import { CustomError, ErrorType } from '../middlewares/CustomError.middleware';
import { ResponseHandler } from '../middlewares/ResponseHandler.middlewares';

export class AssessmentController {
  async generateAndAssignQuestions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { contentId, learnerIds, groupId } = req.body;

      if (!contentId || !Array.isArray(learnerIds) || learnerIds.length === 0) {
        throw new CustomError(
          ErrorType.BAD_REQUEST,
          'contentId and a non-empty array of learnerIds are required.',
          400
        );
      }

      await assessmentService.generateAndAssignQuestions(contentId, learnerIds, groupId);
      ResponseHandler.success(res, null, 'Assessments generated and assigned successfully.', 201);
    } catch (error) {
      next(error);
    }
  }
}