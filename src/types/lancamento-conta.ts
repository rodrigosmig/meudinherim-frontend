export interface LancamentosContaRequest {
  idConta: string;
  inicio: string;
  fim: string;
  comPaginacao: boolean;
  pagina: number;
  size: number;
}

export interface ListaDeLancamentosConta {
  lancamentos: LancamentoConta[];
}

export type LancamentoConta = {
  uuid: string;
  data: string;
  descricao: string;
  valor: number;
  categoria: {
    uuid: string;
    descricao: string;
  };
  conta: {
    uuid: string;
    descricao: string;
  };
  tags: string[];
};
