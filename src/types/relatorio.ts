import { ApiFormErrorResponse, ApiResponse } from "./api";
import { ContaAgendada } from "./conta-agendada";
import { StatusPagamento } from "./enum/status-pagamento";

export interface RelatorioContasAgendadasRequest {
  inicio: string;
  fim: string;
  statusPagamento: StatusPagamento;
}

export interface RelatorioContasAgendadas {
  contasAPagar: ItemRelatorioContasAgendadas;
  contasAReceber: ItemRelatorioContasAgendadas;
  totalFaturas: number;
}

export interface ItemRelatorioContasAgendadas {
  itens: ContaAgendada[];
  total: number;
}

export type RelatorioContasAgendadasResponse =
  | ApiResponse<RelatorioContasAgendadas>
  | ApiFormErrorResponse;
