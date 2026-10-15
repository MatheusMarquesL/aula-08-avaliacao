
export type Recurso = {
  id: number;
  nome: string;
  tipo: "laboratorio" | "equipamento";
  local: string;
  status: "disponivel" | "manutencao" | "indisponivel";
};

export const recursos: Recurso[] = [
  {
    id: 1,
    nome: "Laboratório de Informática 1",
    tipo: "laboratorio",
    local: "Bloco A",
    status: "disponivel",
  },
  {
    id: 2,
    nome: "Laboratório de Redes",
    tipo: "laboratorio",
    local: "Bloco B",
    status: "manutencao",
  },
  {
    id: 3,
    nome: "Projetor Multimídia",
    tipo: "equipamento",
    local: "Biblioteca",
    status: "disponivel",
  },
  {
    id: 4,
    nome: "Notebook para Empréstimo",
    tipo: "equipamento",
    local: "Coordenação",
    status: "indisponivel",
  },
];

export let proximoId = 5;
