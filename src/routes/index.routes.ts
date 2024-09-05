import { Router } from 'express';
import contentRoutes from './content.routes';
import assessmentRoutes from './assessment.routes';

const router = Router();

router.use('/content', contentRoutes);
router.use('/assessments', assessmentRoutes);

export default router;
