import { Request, Response } from 'express';
import { Submission } from '../models/Submission.model';


export class GradeController {
  async gradeSubmission(req: Request, res: Response): Promise<void> {
    try {
      const { submissionId } = req.params;
      const { score, comments } = req.body;
  
      const submission = await Submission.findByPk(submissionId);
  
      if (!submission) throw new Error('Submission not found');
  
      submission.score = score;
      submission.comments = comments;
      await submission.save();
  
      res.status(200).json({ message: 'Learner graded successfully', data: submission });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}

