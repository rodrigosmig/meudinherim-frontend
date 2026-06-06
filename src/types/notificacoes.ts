import { TipoNotificacao } from "./enum/tipo-notificacao";

export interface Notificacao {
  id: string;
  idContaAgendada?: string;
  idCobranca?: string;
  dataVencimento?: string;
  descricao?: string;
  valor?: number;
  tipo: TipoNotificacao;
  isParcela?: boolean;
}

export interface ListaDeNotificacoes {
  notificacoes: Notificacao[];
}
