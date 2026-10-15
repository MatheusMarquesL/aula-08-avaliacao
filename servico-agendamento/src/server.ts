
import express, { Request, Response } from "express";

import {
  agendamentos,
  Agendamento,
  proximoId as idInicial
} from "./agendamentos";

import { buscarRecurso } from "./clients/catalogo.client";
import { logger } from "./middlewares/logger";
import { verificarToken } from "./middlewares/verificarToken";
import { validarAgendamento } from "./middlewares/validarAgendamento";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(logger);

let proximoId = idInicial;

app.get("/agendamentos", (req: Request, res: Response) => {
  let resultado = [...agendamentos];

  const { curso, status } = req.query;

  if (typeof curso === "string") {
    resultado = resultado.filter(
      (item) => item.curso.toLowerCase() === curso.toLowerCase()
    );
  }

  if (typeof status === "string") {
    resultado = resultado.filter(
      (item) => item.status === status
    );
  }

  return res.status(200).json(resultado);
});

app.get("/agendamentos/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      mensagem: "O ID informado é inválido.",
      status: 400,
      origem: "servico-agendamento"
    });
  }

  const agendamento = agendamentos.find(
    (item) => item.id === id
  );

  if (!agendamento) {
    return res.status(404).json({
      mensagem: "Agendamento não encontrado.",
      status: 404,
      origem: "servico-agendamento"
    });
  }

  return res.status(200).json(agendamento);
});

app.post(
  "/agendamentos",
  validarAgendamento,
  async (req: Request, res: Response) => {
    const consulta = await buscarRecurso(req.body.recursoId);

    if (consulta.tipo === "nao_encontrado") {
      return res.status(404).json({
        mensagem: "O recurso informado não existe no catálogo.",
        status: 404,
        origem: "servico-agendamento"
      });
    }

    if (consulta.tipo === "falha") {
      return res.status(502).json({
        mensagem: "Não foi possível consultar o serviço de catálogo.",
        status: 502,
        origem: "servico-agendamento"
      });
    }

    const recurso = consulta.recurso;

    if (recurso.status !== "disponivel") {
      return res.status(409).json({
        mensagem: "O recurso não está disponível para agendamento.",
        status: 409,
        origem: "servico-agendamento"
      });
    }

    const novoAgendamento: Agendamento = {
      id: proximoId++,
      solicitante: req.body.solicitante.trim(),
      curso: req.body.curso.trim(),
      recursoId: req.body.recursoId,
      data: req.body.data,
      horario: req.body.horario,
      finalidade: req.body.finalidade.trim(),
      status: "pendente"
    };

    agendamentos.push(novoAgendamento);

    return res.status(201).json({
      mensagem: "Agendamento criado com sucesso.",
      agendamento: novoAgendamento,
      recurso: {
        id: recurso.id,
        nome: recurso.nome,
        tipo: recurso.tipo,
        local: recurso.local
      }
    });
  }
);

app.patch(
  "/agendamentos/:id/status",
  verificarToken,
  (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { status } = req.body ?? {};

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        mensagem: "O ID informado é inválido.",
        status: 400,
        origem: "servico-agendamento"
      });
    }

    const statusValidos = [
      "pendente",
      "confirmado",
      "cancelado"
    ];

    if (
      typeof status !== "string" ||
      !statusValidos.includes(status)
    ) {
      return res.status(400).json({
        mensagem: "Status inválido.",
        status: 400,
        origem: "servico-agendamento"
      });
    }

    const agendamento = agendamentos.find(
      (item) => item.id === id
    );

    if (!agendamento) {
      return res.status(404).json({
        mensagem: "Agendamento não encontrado.",
        status: 404,
        origem: "servico-agendamento"
      });
    }

    agendamento.status = status as Agendamento["status"];

    return res.status(200).json({
      mensagem: "Status atualizado com sucesso.",
      agendamento
    });
  }
);

app.delete(
  "/agendamentos/:id",
  verificarToken,
  (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        mensagem: "O ID informado é inválido.",
        status: 400,
        origem: "servico-agendamento"
      });
    }

    const indice = agendamentos.findIndex(
      (item) => item.id === id
    );

    if (indice === -1) {
      return res.status(404).json({
        mensagem: "Agendamento não encontrado.",
        status: 404,
        origem: "servico-agendamento"
      });
    }

    agendamentos.splice(indice, 1);

    return res.status(204).send();
  }
);

app.use((req: Request, res: Response) => {
  return res.status(404).json({
    mensagem: "Rota não encontrada.",
    status: 404,
    origem: "servico-agendamento"
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(
    `Serviço de Agendamentos rodando na porta ${PORT}`
  );
});
