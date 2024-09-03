import { Router } from 'express';
import { ContentController } from '../controllers/Content.controller';
import { AssessmentController } from '../controllers/Assessment.controller';

const router = Router();

router.post('/content/create', ContentController.createContent);

router.post('/assessment/generate', AssessmentController.generateAndAssign);

export default router;
