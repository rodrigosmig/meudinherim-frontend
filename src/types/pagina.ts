export interface Pagina<T = unknown> {
  pagina: {
    conteudo: T[];
    paginacao: Paginacao;
  };
}

export interface Paginacao {
  paginaAtual: number;
  ultimaPagina: number;
  tamanhoPagina: number;
  totalElementos: number;
  doElemento: number;
  paraElemento: number;
}

export interface PaginaRequest {
  comPaginacao: boolean;
  pagina: number;
  size: number;
}
