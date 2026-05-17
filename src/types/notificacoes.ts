import { TipoContaAgendada } from "./enum/tipo-conta-agendada";

export interface Notificacao {
  id: string;
  idContaAgendada: string;
  dataVencimento: string;
  descricao: string;
  valor: number;
  tipo: TipoContaAgendada;
  isParcela: boolean;
}

export interface ListaDeNotificacoes {
  notificacoes: Notificacao[];
}
