import "reflect-metadata";
//
import express, { Express } from "express";
import cookieParser from "cookie-parser";
import { join } from "node:path";
import helmet from "helmet";
import cors from "cors";

import { globalErrorHandlerMiddleware } from "~/Express/Middlewares/GlobalErrorHandlerMiddleware";
import { notFoundMiddleware } from "~/Express/Middlewares/NotFoundMiddleware";
import { env } from "~/Config/env";

import { setupContainer } from "../Container";
import v1Routes from "./Routes";

setupContainer();

export const BootstrapApplication = (): void => {
  const app: Express = express();

  app.use(
    "/public",
    express.static(join(__dirname, "..", "..", "..", "public"))
  );

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.get("/", (_, res) => {
    res.json({
      success: true,
      message: "Vendora API",
      data: {
        endpoints: {
          health: "/v1/health",
        },
      },
    });
  });

  app.use("/v1", v1Routes);

  app.use(notFoundMiddleware);

  app.use(globalErrorHandlerMiddleware);

  app.listen(env.port, () => {
    console.log("Server is running");
    console.log(`Environment: ${env.nodeEnv}`);
  });
};
