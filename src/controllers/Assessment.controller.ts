import { Request, Response, NextFunction } from 'express';
// import { assessmentService } from '../services/Assessment.service';
import { CustomError, ErrorType } from '../middlewares/CustomError.middleware';
import { ResponseHandler } from '../middlewares/ResponseHandler.middlewares';
import { Assessment } from '../models/Assessment.model';
import { Submission } from '../models/Submission.model';

export class AssessmentController {
  // async generateAndAssignQuestions(req: Request, res: Response, next: NextFunction): Promise<void> {
    // try {
    //   const { contentId, learnerIds, groupId } = req.body;

    //   if (!contentId || !Array.isArray(learnerIds) || learnerIds.length === 0) {
    //     throw new CustomError(
    //       ErrorType.BAD_REQUEST,
    //       'contentId and a non-empty array of learnerIds are required.',
    //       400
    //     );
    //   }

    //   await assessmentService.generateAndAssignQuestions(contentId, learnerIds, groupId);
    //   ResponseHandler.success(res, null, 'Assessments generated and assigned successfully.', 201);
    // } catch (error) {
    //   next(error);
    // }
  // }

  async createAssessment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, description, courseId } = req.body;
      const { instructorId } = req.query;
      const file = req.file ? req.file.path: undefined;

      const assessment = await Assessment.create({
        title, 
        description,
        file, 
        courseId,
        createdBy: Number(instructorId)
      })

      return ResponseHandler.success(req, assessment, "Assessment created successfully", 201);
    } catch (error) {
      next(error);
    };
  };

  async getLearnersForAssessment(req: Request, res: Response, next: NextFunction) {
    try {
      const { assessmentId } = req.params;

      const submissions = await Submission.findAll({
        where: { id: Number(assessmentId) },
        include: [{ model: Submission, as: 'submission' }]
      });

      res.status(200).json({ message: 'Learners fetched successfully', data: submissions });
    } catch (error) {
      next(error)
    }
  }

  // async gradeLearner(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   try {
  //     const { learnerId, assessmentId, score, comments } = req.body;

  //     const submission = await Submission.findOne({
  //       where: { learnerId, assessmentId },
  //       include: [{ model: Assessment, as 'assessment'}]
  //     })

  //     if (!submission) throw new Error('Submission not found');

  //     submission.score = score;
  //     submission.comments = comments;
  //     await submission.save();

  //     return ResponseHandler.success(res, submission, 'Learner graded successfully')
  //   } catch (error) {
  //     next(error);
  //   };
  // };

}

