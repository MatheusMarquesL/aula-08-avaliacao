
import { Request, Response, NextFunction } from "express";

export function validarRecurso(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { nome, tipo, local, status } = req.body ?? {};

  if (
    typeof nome !== "string" ||
    !nome.trim() ||
    typeof local !== "string" ||
    !local.trim() ||
    !["laboratorio", "equipamento"].includes(tipo) ||
    !["disponivel", "manutencao", "indisponivel"].includes(status)
  ) {
    return res.status(400).json({
      mensagem: "Dados inválidos para cadastrar o recurso.",
      status: 400,
      origem: "servico-catalogo",
    });
  }

  next();
}
