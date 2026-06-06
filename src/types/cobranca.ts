import { StatusCobranca } from "./enum/status-cobranca";

export interface UsuarioResumo {
  id: string;
  nome: string;
}

export interface CobrancaEmitida {
  uuid: string;
  devedor: UsuarioResumo;
  descricao: string;
  valor: number;
  status: StatusCobranca;
  criadoEm: string;
  pagoEm?: string;
}

export interface CobrancaRecebida {
  uuid: string;
  cobrador: UsuarioResumo;
  descricao: string;
  valor: number;
  status: StatusCobranca;
  criadoEm: string;
  pagoEm?: string;
  contaAgendadaDevedorUuid?: string | null;
}

export interface GerarContaAPagarRequest {
  idCategoria: string;
}

export interface GerarContaAPagarResponse {
  idContaAPagar: string;
}
