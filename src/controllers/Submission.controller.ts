import { Request, Response } from 'express';
import { Submission } from '../models/Submission.model';
import { CustomError, ErrorType } from '../middlewares/CustomError.middleware';
import { ResponseHandler } from '../middlewares/ResponseHandler.middlewares';

export class SubmissionController {
  async submitAssessment (req: Request, res: Response): Promise<void> {
    try {
      const { answerText, assessmentId } = req.body;
      const file = req.file?.path;  
      const { learnerId } = req.query;
  
      const submission = await Submission.create({
        answerText,
        learnerId: Number(learnerId),
        assessmentId: Number(assessmentId),
        submittedFile: file,
      });
  
      return ResponseHandler.success(req, submission, "Assessment submitted successfully");
  
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}

