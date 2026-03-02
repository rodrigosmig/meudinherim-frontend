import { ContaAgendada } from "./conta-agendada";

export interface Notificacao {
  id: string;
  idContaAgendada: string;
  dataVencimento: string;
  descricao: string;
  valor: number;
  tipo: ContaAgendada;
  isParcela: boolean;
}

export interface ListaDeNotificacoes {
  notificacoes: Notificacao[];
}
