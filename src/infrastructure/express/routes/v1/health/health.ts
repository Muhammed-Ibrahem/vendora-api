import { container } from "tsyringe";
import { Router } from "express";

import { V1RoutesRegistry } from "~/infra/express/routes/v1";
import { env } from "~/config/env";

const router: Router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: env.nodeEnv,
    uptime: process.uptime(),
  });
});

container.resolve(V1RoutesRegistry).register(router);
