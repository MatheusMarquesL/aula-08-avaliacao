import { validarRecurso } from "./middlewares/validarRecursos";
import { errorHandler } from "./middlewares/errorHandler";
import { logger } from "./middlewares/logger";
import { verificarToken } from "./middlewares/verificarToken";
import express, { Request, Response } from "express";
import { recursos, Recurso, proximoId as idInicial } from "./recursos";

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(logger);

let proximoId = idInicial;

app.get("/recursos", (req: Request, res: Response) => {
  let resultado = [...recursos];

  const { status, tipo } = req.query;

  if (status) {
    resultado = resultado.filter(
      (recurso) => recurso.status === status
    );
  }

  if (tipo) {
    resultado = resultado.filter(
      (recurso) => recurso.tipo === tipo
    );
  }

  return res.status(200).json(resultado);
});

app.get("/recursos/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      mensagem: "O ID deve ser um número inteiro positivo.",
      status: 400,
      origem: "servico-catalogo",
    });
  }

  const recurso = recursos.find((item) => item.id === id);

  if (!recurso) {
    return res.status(404).json({
      mensagem: "Recurso não encontrado.",
      status: 404,
      origem: "servico-catalogo",
    });
  }

  return res.status(200).json(recurso);
});

app.post("/recursos", validarRecurso, (req: Request, res: Response) => {
  const { nome, tipo, local, status } = req.body;

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

  const novoRecurso: Recurso = {
    id: proximoId++,
    nome: nome.trim(),
    tipo,
    local: local.trim(),
    status,
  };

  recursos.push(novoRecurso);

  return res.status(201).json(novoRecurso);
});

app.patch(
  "/recursos/:id/status",
  verificarToken,
  (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        mensagem: "O ID deve ser um número inteiro positivo.",
        status: 400,
        origem: "servico-catalogo",
      });
    }

    const recurso = recursos.find((item) => item.id === id);

    if (!recurso) {
      return res.status(404).json({
        mensagem: "Recurso não encontrado.",
        status: 404,
        origem: "servico-catalogo",
      });
    }

    if (
      !["disponivel", "manutencao", "indisponivel"].includes(status)
    ) {
      return res.status(400).json({
        mensagem: "Status inválido.",
        status: 400,
        origem: "servico-catalogo",
      });
    }

    recurso.status = status;

    return res.status(200).json({
      mensagem: "Status do recurso atualizado.",
      recurso,
    });
  }
);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Serviço de Catálogo rodando na porta ${PORT}`);
});
