
export type Agendamento = {
  id: number;
  solicitante: string;
  curso: string;
  recursoId: number;
  data: string;
  horario: string;
  finalidade: string;
  status: "pendente" | "confirmado" | "cancelado";
};

export const agendamentos: Agendamento[] = [];

export let proximoId = 1;
