import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "../middlewares/ResponseHandler.middlewares";
import { v4 as uuidv4 } from "uuid";
import { AIGradingService } from "../services/aiGrading.service";
import { MarkingGuide } from "../models/markingGuide.model";
import { Assessment } from "../models/Assessment.model";
import { Submission } from "../models/Submission.model";
import { s3 } from "../utils/upload.util";

export class AssessmentController {
  async createAssessment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { title, question, highestAttainableScore, markingGuide } = req.body;
      const { courseId, instructorId } = req.params;
      const file = req.file;

      let fileUploadResult: any = null;

      if (file) {
        const filename = `${Date.now()}-${file.originalname}`;
        const fileStream = file.buffer;
        const contentType = file.mimetype;

        const uploadParams = {
          Bucket: process.env.AWS_BUCKET!,
          Key: filename,
          Body: fileStream,
          ContentType: contentType,
        };

        fileUploadResult = await s3.upload(uploadParams).promise();
      }

      const assessment = await Assessment.create({
        id: uuidv4(),
        title,
        question,
        highestAttainableScore,
        file: fileUploadResult ? fileUploadResult.Location : null,
        courseId,
        createdBy: Number(instructorId),
      });

      await MarkingGuide.create({
        assessmentId: assessment.id,
        question: markingGuide.question,
        expectedAnswer: markingGuide.expectedAnswer,
        keywords: markingGuide.keywords,
        maxScore: highestAttainableScore,
      })

      return ResponseHandler.success(
        res,
        assessment,
        "Assessment created successfully",
        201
      );
    } catch (error) {
      next(error);
    }
  }

  async getSubmissionsForAssessment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { assessmentId, instructorId } = req.params;

      const assessment = await Assessment.findOne({
        where: {
          id: assessmentId,
          createdBy: Number(instructorId),
        },
      });
      if (!assessment) {
        return ResponseHandler.failure(
          res,
          "Assessment not found for this instructor",
          404
        );
      }

      const submissions = await Submission.findAll({
        where: { assessmentId },
      });

      res.status(200).json({
        message: "Submissions fetched successfully",
        data: submissions,
      });
    } catch (error) {
      next(error);
    }
  }

  async gradeSubmission(req: Request, res: Response) {
    try {
      const { submissionId, instructorId } = req.params;
      const { score, comments, useAI } = req.body;

      const submission = await Submission.findByPk(submissionId);

      if (!submission) throw new Error("Submission not found");

      const assessment = await Assessment.findByPk(submission.assessmentId);

      if (!assessment) {
        return ResponseHandler.failure(
          res,
          "Associated assessment not found",
          404
        );
      }

      if (assessment.createdBy !== Number(instructorId)) {
        return ResponseHandler.failure(
          res,
          "You are not authorized to grade this assessment",
          403
        );
      }

      if (submission.score !== null) {
        return ResponseHandler.failure(
          res,
          "Submission has already been graded.",
          400
        );
      }

      if (useAI) {
        const markingGuide = await MarkingGuide.findOne({
          where: { assessmentId: assessment.id },
        });
        if (!markingGuide) {
          return ResponseHandler.failure(res, "Marking guide not found", 404);
        }

        const aiResult = await AIGradingService.gradeSubmission(
          submission.answerText,
          markingGuide.expectedAnswer,
          markingGuide.keywords,
          markingGuide.maxScore
        )

        if (aiResult.error) {
          return ResponseHandler.failure(res, 'AI Grading failed', 500)
        }

        submission.score = aiResult.score;
        submission.comments = aiResult.feedback;
      } else {
        if (score > assessment.highestAttainableScore) {
          return ResponseHandler.failure(
            res,
            `Score cannot exceed the highest attainable score of ${assessment.highestAttainableScore}.`,
            400
          );
        }
  
        submission.score = score;
        submission.comments = comments;
      }

      await submission.save();

      return ResponseHandler.success(res, submission, "Learner graded successfully")
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
