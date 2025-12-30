import { Response, Request } from "express";

export const notFoundMiddleware = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    code: "NOT_FOUND",
    message: `🔍 - Not Found - ${req.originalUrl}`,
    errors: [],
  });
};
