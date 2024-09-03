import { Request, Response, NextFunction } from 'express';
import { assessmentService } from '../services/Assessment.service';

export class AssessmentController {
  static async generateAndAssign(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { contentId, learnerIds, groupId } = req.body;
      await assessmentService.generateAndAssignQuestions(contentId, learnerIds, groupId);
      res.status(200).json({ message: 'Assessments generated and assigned successfully.' });
    } catch (error) {
      next(error);
    }
  }
}