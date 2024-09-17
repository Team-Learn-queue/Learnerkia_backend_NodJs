import { Router } from "express";
import assessmentRoutes from "./assessment.routes";

const router = Router();

router.use("/assessments", assessmentRoutes);

export default router;
