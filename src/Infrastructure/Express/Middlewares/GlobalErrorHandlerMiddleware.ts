import { NextFunction, Response, Request } from "express";
import { treeifyError, ZodError } from "zod";

import { env } from "~/Config/env";

export const globalErrorHandlerMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      code: "VALIDATION_ERROR",
      message: "Invalid Request Payload",
      details: treeifyError(err),
    });
  }
  if (err instanceof Error) {
    return res.status(500).json({
      success: false,
      code: "UNEXPECTED_ERROR",
      message: err.message,
      ...(env.nodeEnv === "development" && { strackTrace: err.stack }),
    });
  }
  return res.status(500).json({
    statusCode: 500,
    message: "Internal Server Error",
  });
};
