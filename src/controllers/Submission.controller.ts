import { Request, Response } from "express";
import { Submission } from "../models/Submission.model";
import { Assessment } from "../models/Assessment.model";
import { ResponseHandler } from "../middlewares/ResponseHandler.middlewares";
import { s3 } from "../utils/upload.util";
import multer from "multer";

export class SubmissionController {
  async submitAssessment(req: Request, res: Response) {
    try {
      const { answerText } = req.body;
      const { assessmentId, learnerId } = req.params;
      const file = req.file;

      console.log("Answer Text", req.body.answerText);
      console.log("Assessment ID", req.body.assessmentId);

      const assessment = await Assessment.findByPk(Number(assessmentId));
      if (!assessment) {
        return ResponseHandler.failure(res, "Assessment not found", 404);
      }

      const existingSubmission = await Submission.findOne({
        where: {
          learnerId: Number(learnerId),
          assessmentId: Number(assessmentId),
        },
      });

      if (existingSubmission) {
        return ResponseHandler.failure(
          res,
          "You have already submitted this assessment.",
          400
        );
      }

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

      console.log({
        answerText,
        learnerId: Number(learnerId),
        assessmentId: Number(assessmentId),
        submittedFile: fileUploadResult ? fileUploadResult.Location : null,
      });

      const submission = await Submission.create({
        answerText,
        learnerId: Number(learnerId),
        assessmentId: Number(assessmentId),
        submittedFile: fileUploadResult ? fileUploadResult.Location : null,
      });

      return ResponseHandler.success(
        res,
        submission,
        "Assessment submitted successfully"
      );
    } catch (error: any) {
      if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
          return ResponseHandler.failure(
            res, 
            'Invalid file type. Only images, PDFs, and documents are allowed.',
            400,
            error
          );
        } else if (error.code === "LIMIT_FILE_SIZE") {
          return ResponseHandler.failure(
            res, 
            "File size too large. Maximum allowed size is 10MB.",
            400,
            error
          );
        }
      }

      return ResponseHandler.failure(res, error.message, error)    
    }
  }
}
