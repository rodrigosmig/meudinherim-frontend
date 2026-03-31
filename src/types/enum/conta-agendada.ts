export enum ContaAgendada {
  CONTA_A_RECEBER = "Contas a Receber",
  CONTA_A_PAGAR = "Contas a Pagar",
}

export const getTipoContaAgendada = (tipo: string) => {
  return ContaAgendada[tipo as keyof typeof ContaAgendada] ?? tipo;
};
