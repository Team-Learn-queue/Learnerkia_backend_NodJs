import { Request, Response } from "express";
import { Submission } from "../models/Submission.model";
import { CustomError, ErrorType } from "../middlewares/CustomError.middleware";
import { ResponseHandler } from "../middlewares/ResponseHandler.middlewares";
import { s3 } from "../utils/upload.util";

export class SubmissionController {
  async submitAssessment(req: Request, res: Response): Promise<void> {
    try {
      const { answerText, assessmentId } = req.body;
      const { learnerId } = req.query;
      const file = req.file;

      console.log("Answer Text", req.body.answerText);
      console.log("Assessment ID", req.body.assessmentId);

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
      res.status(500).json({ message: error.message });
    }
  }
}
