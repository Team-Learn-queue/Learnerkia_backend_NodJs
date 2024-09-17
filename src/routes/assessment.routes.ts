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

router.post("/create", upload.single("file"), createAssessment);

router.put("/grade/:submissionId", gradeSubmission);

router.get("/learners/:assessmentId", getLearnersForAssessment);

router.post("/submit", upload.single("file"), submitAssessment);

export default router;
