export const CONTAS_QUERY_KEY = "contas" as const;
export const LANCAMENTOS_CONTA_QUERY_KEY = "lancamentos_conta" as const;
export const LANCAMENTOS_CARTAO_QUERY_KEY = "lancamentos_cartao" as const;
export const DADOS_CONFIGURACAO_QUERY_KEY = "dados_configuracao" as const;
export const DASHBOARD_QUERY_KEY = "dashboard" as const;
export const CATEGORIAS_QUERY_KEY = "categorias" as const;
export const CARTOES_QUERY_KEY = "cartoes" as const;
export const FATURAS_QUERY_KEY = "faturas" as const;
export const CONTAS_A_PAGAR_QUERY_KEY = "contas_a_pagar" as const;
export const CONTAS_A_RECEBER_QUERY_KEY = "contas_a_receber" as const;
export const ORCAMENTOS_QUERY_KEY = "orcamentos" as const;

export const keysToInvalidate = [
  CONTAS_QUERY_KEY,
  DASHBOARD_QUERY_KEY,
  DADOS_CONFIGURACAO_QUERY_KEY,
  LANCAMENTOS_CONTA_QUERY_KEY,
  CONTAS_A_PAGAR_QUERY_KEY,
  CONTAS_A_RECEBER_QUERY_KEY,
  LANCAMENTOS_CARTAO_QUERY_KEY,
  CARTOES_QUERY_KEY,
  FATURAS_QUERY_KEY,
];

export const keysToInvalidateForCategoria = [
  CATEGORIAS_QUERY_KEY,
  ORCAMENTOS_QUERY_KEY,
  DASHBOARD_QUERY_KEY,
  DADOS_CONFIGURACAO_QUERY_KEY,
];
