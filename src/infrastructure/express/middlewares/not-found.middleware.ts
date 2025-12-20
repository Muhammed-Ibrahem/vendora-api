import { Response, Request } from "express";

export const notFoundMiddleware = (req: Request, res: Response) => {
  res.status(404).json({
    statusCode: 404,
    message: `🔍 - Not Found - ${req.originalUrl}`,
  });
};
