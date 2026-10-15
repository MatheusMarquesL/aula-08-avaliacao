
import {
  Request,
  Response,
  NextFunction
} from "express";

export function verificarToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const autorizacao = req.headers.authorization;

  if (autorizacao !== "Bearer ifms2026") {
    return res.status(401).json({
      mensagem: "Token ausente ou inválido.",
      status: 401,
      origem: "servico-agendamento"
    });
  }

  next();
}
