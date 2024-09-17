import { Router } from "express";
import { AssessmentController } from "../controllers/Assessment.controller";
import { SubmissionController } from "../controllers/Submission.controller";
import { GradeController } from "../controllers/Grading.controller";
import { upload } from "../utils/upload.util";

const router = Router();
const { createAssessment, getLearnersForAssessment } =
  new AssessmentController();
const { submitAssessment } = new SubmissionController();
const { gradeSubmission } = new GradeController();

// ADD INPUT VALIDATION FOR ALL ENDPOINTS

router.post("/create", upload.single("file"), createAssessment); // Done

// For Create Assessment
// 1. change the "description" field to "question"
// 2. Add a field - "highest attainable score"

router.put("/grade/:submissionId", gradeSubmission); // Done

router.get("/learners/:assessmentId", getLearnersForAssessment);

router.post("/submit", upload.single("file"), submitAssessment); // Done

// For learners submission
// 1. Make sure a learner cannot pass in values for "score" and "comment" fields
// 2. Make sure a learner can only submit once.

export default router;
