import { Status } from "@/helpers/enum/status";

export type Conta = {
  uuid: string;
  nome: string;
  tipo: string;
  status: Status;
  icon: string;
  saldo: number;
};

export interface ContasRequest {
  comPaginacao: boolean;
  status: Status;
  pagina: number;
  size: number;
}

export interface ListaDeContas {
  contas: Conta[];
}
