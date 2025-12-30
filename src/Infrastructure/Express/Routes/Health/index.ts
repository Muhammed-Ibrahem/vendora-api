import { Router } from "express";

import { env } from "~/Config/env";

const router: Router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: env.nodeEnv,
    uptime: process.uptime(),
  });
});

export default router;
