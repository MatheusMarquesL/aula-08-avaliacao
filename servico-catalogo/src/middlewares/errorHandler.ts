
import {
  Request,
  Response,
  NextFunction,
} from "express";

export function errorHandler(
  erro: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) {
    return next(erro);
  }

  console.error(erro);

  return res.status(500).json({
    mensagem: "Ocorreu um erro interno no servidor.",
    status: 500,
    origem: "servico-catalogo",
  });
}
