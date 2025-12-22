import "reflect-metadata";
//
import express, { Express } from "express";
import cookieParser from "cookie-parser";
import { container } from "tsyringe";
import path from "node:path";
import helmet from "helmet";
import cors from "cors";

import { notFoundMiddleware } from "~/express/middlewares/not-found.middleware";
import { errorMiddleware } from "~/express/middlewares/error.middleware";
import { V1RoutesRegistry } from "~/express/routes/v1";
import { setupContainer } from "~/container/tsyringe";

setupContainer();

export const createApp = async (): Promise<Express> => {
  const app: Express = express();

  app.use(
    "/public",
    express.static(path.join(__dirname, "..", "..", "..", "public"))
  );

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.get("/", (_req, res) => {
    res.json({
      message: "Vendora API",
      version: "1.0.0",
      endpoints: {
        health: "/api/v1/health",
      },
    });
  });

  const v1Registry = container.resolve(V1RoutesRegistry);

  await v1Registry.autoLoadRoutesAsync();

  app.use("/api/v1", v1Registry.getRoutes());

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
};
