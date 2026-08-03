import { StatusCobranca } from "./enum/status-cobranca";

export interface UsuarioResumo {
  id: string;
  nome: string;
  email: string;
}

export interface CobrancaEmitida {
  uuid: string;
  devedor: UsuarioResumo;
  descricao: string;
  valor: number;
  status: StatusCobranca;
  criadoEm: string;
  pagoEm?: string;
  data: string;
  isParcelado: boolean;
}

export interface CobrancaRecebida {
  uuid: string;
  cobrador: UsuarioResumo;
  descricao: string;
  valor: number;
  status: StatusCobranca;
  criadoEm: string;
  pagoEm?: string;
  gerouContaAPagar: boolean;
  data: string;
  isParcelado: boolean;
}

export interface ListarCobrancasRequest {
  comPaginacao: boolean;
  status?: StatusCobranca;
  inicio?: string;
  fim?: string;
  pagina: number;
  size: number;
}

export interface GerarContaAPagarRequest {
  idCategoria: string;
  isParcelado?: boolean;
  quantidadeParcelas?: number;
}

export interface GerarContaAPagarResponse {
  idContaAPagar: string;
}
