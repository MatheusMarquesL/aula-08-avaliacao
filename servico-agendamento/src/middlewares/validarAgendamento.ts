
import {
  Request,
  Response,
  NextFunction
} from "express";

export function validarAgendamento(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const {
    solicitante,
    curso,
    recursoId,
    data,
    horario,
    finalidade
  } = req.body ?? {};

  const idValido =
    Number.isInteger(recursoId) && recursoId > 0;

  const dataValida =
    typeof data === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(data) &&
    !Number.isNaN(Date.parse(`${data}T00:00:00`)) &&
    new Date(`${data}T00:00:00`).toISOString().slice(0, 10) === data;

  const horarioValido =
    typeof horario === "string" &&
    /^([01]\d|2[0-3]):[0-5]\d$/.test(horario);

  if (
    typeof solicitante !== "string" ||
    !solicitante.trim() ||
    typeof curso !== "string" ||
    !curso.trim() ||
    !idValido ||
    !dataValida ||
    !horarioValido ||
    typeof finalidade !== "string" ||
    !finalidade.trim()
  ) {
    return res.status(400).json({
      mensagem: "Dados inválidos ou incompletos para o agendamento.",
      status: 400,
      origem: "servico-agendamento"
    });
  }

  next();
}
