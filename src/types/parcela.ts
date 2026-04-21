import { StatusPagamento } from "./enum/status-pagamento";

export interface Parcela {
  data: string;
  descricao: string;
  numeroDaParcela: number;
  totalDeParcelas: number;
  valorDaParcela: number;
  valorLancamento: number;
  idParcela: string;
  idLancamento: string;
  idContaAgendada: string | null;
  idFatura: string;
  status: StatusPagamento;
}
