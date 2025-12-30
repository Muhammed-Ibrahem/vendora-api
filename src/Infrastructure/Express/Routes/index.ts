import { Router } from "express";

import healthRoutes from "./Health";

const router: Router = Router();

router.use(healthRoutes);

export default router;
