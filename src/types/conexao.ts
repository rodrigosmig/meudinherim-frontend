import { StatusConexao } from "./enum/status-conexao";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  ativaNotificacao: boolean;
  avatar?: string;
}

export interface UsuarioConexao {
  id: string;
  nome: string;
  email: string;
}

export interface Conexao {
  uuid: string;
  usuarioConexao: UsuarioConexao;
  status: StatusConexao;
  criadoEm: string;
  atualizadoEm: string;
}

export interface EnviarSolicitacaoConexaoRequest {
  idDestinatario: string;
}

export interface EnviarSolicitacaoConexaoResponse {
  idConexao: string;
}
