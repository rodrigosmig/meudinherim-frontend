import { StatusPagamento } from "@/types/enum/status-pagamento";

export interface Fatura {
  uuid: string;
  dataVencimento: string;
  dataFechamento: string;
  valorTotal: number;
  status: StatusPagamento;
  isFechada: boolean;
  cartao: {
    uuid: string;
    descricao: string;
  };
}

export interface ListaDeFaturas {
  faturas: Fatura[];
}
