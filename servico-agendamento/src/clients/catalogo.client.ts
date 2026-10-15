
type Recurso = {
  id: number;
  nome: string;
  tipo: "laboratorio" | "equipamento";
  local: string;
  status: "disponivel" | "manutencao" | "indisponivel";
};

type ResultadoConsulta =
  | { tipo: "nao_encontrado" }
  | { tipo: "falha" }
  | { tipo: "sucesso"; recurso: Recurso };

const CATALOGO_URL =
  process.env.CATALOGO_URL ?? "http://localhost:3001";

export async function buscarRecurso(
  recursoId: number
): Promise<ResultadoConsulta> {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 5000);

  try {
    const resposta = await fetch(
      `${CATALOGO_URL}/recursos/${recursoId}`,
      { signal: controller.signal }
    );

    if (resposta.status === 404) {
      return { tipo: "nao_encontrado" };
    }

    if (!resposta.ok) {
      return { tipo: "falha" };
    }

    const recurso: Recurso = await resposta.json();

    return { tipo: "sucesso", recurso };
  } catch {
    return { tipo: "falha" };
  } finally {
    clearTimeout(timeout);
  }
}
