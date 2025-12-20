import { NextFunction, Response, Request } from "express";

export const errorMiddleware = (
  _err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  res.status(500).json({
    statusCode: 500,
    message: "Internal Server Error",
  });
};
