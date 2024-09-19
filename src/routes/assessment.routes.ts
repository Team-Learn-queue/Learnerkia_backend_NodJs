import { Router } from "express";
import { AssessmentController } from "../controllers/Assessment.controller";
import { SubmissionController } from "../controllers/Submission.controller";
import { createAssessmentValidator, submissionValidator, gradeAssessmentValidator, viewLearnersValidator } from '../validators/assessment.validator';
import { upload } from "../utils/upload.util";

const router = Router();


const { createAssessment: createAssessmentHandler, getSubmissionsForAssessment, gradeSubmission } =
  new AssessmentController();
const { submitAssessment } = new SubmissionController();

router.post(
  "/create/:instructorId/:courseId", 
  upload.single("file"), 
  ...createAssessmentValidator,
  createAssessmentHandler
); 

router.put(
  "/grade/:instructorId/:submissionId", 
  ...gradeAssessmentValidator,
  gradeSubmission
); 

router.get(
  "/submissions/:instructorId/:assessmentId",
  ...viewLearnersValidator,
  getSubmissionsForAssessment
);

router.post(
  "/submit/:learnerId/:assessmentId", 
  upload.single("file"), 
  ...submissionValidator,
  submitAssessment
); 

export default router;
