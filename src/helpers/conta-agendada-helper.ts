import { TipoContaAgendada } from "@/types/enum/tipo-conta-agendada";
import { LancamentoConta } from "@/types/lancamento-conta";

export const isPagamentoContaAgendada = (
  lancamento: LancamentoConta,
): boolean => {
  return lancamento.parcela !== null || lancamento.contaAgendada !== null;
};

export const isContaAPagar = (lancamento: LancamentoConta): boolean => {
  return (
    (lancamento.contaAgendada !== null &&
      lancamento.contaAgendada.tipo === TipoContaAgendada.CONTA_A_PAGAR) ||
    (lancamento.parcela !== null &&
      lancamento.parcela.tipoContaAgendada === TipoContaAgendada.CONTA_A_PAGAR)
  );
};

export const isParcelaContaAPagar = (lancamento: LancamentoConta): boolean => {
  return (
    lancamento.parcela !== null &&
    lancamento.parcela.tipoContaAgendada === TipoContaAgendada.CONTA_A_PAGAR
  );
};
