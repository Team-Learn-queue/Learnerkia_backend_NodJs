import { Router } from 'express';
import { AssessmentController } from '../controllers/Assessment.controller';

const router = Router();
const {generateAndAssignQuestions} = new AssessmentController();


router.post('/generate', generateAndAssignQuestions);

export default router;