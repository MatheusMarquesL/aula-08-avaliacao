
import { Request, Response, NextFunction } from "express";

export function logger(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const data = new Date().toLocaleString("pt-BR");

  console.log(
    `[${data}] ${req.method} ${req.originalUrl}`
  );

  next();
}
