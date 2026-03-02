import { StatusPagamento } from "@/helpers/enum/statusPagamento";

export interface Fatura {
  uuid: string;
  dataVencimento: string;
  dataFechamento: string;
  valorTotal: number;
  status: StatusPagamento;
  isFechada: boolean;
}

export interface ListaDeFaturas {
  faturas: Fatura[];
}
