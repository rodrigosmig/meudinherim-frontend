export interface DashboardData {
  resumoMes: DashboardResumoMes;
  categorias: DashboardCategorias;
  tendencia: { pontos: PontoTendencia[] };
  topCategorias: { top10Saidas: TopCategoriaSaida[] };
  progressoCategorias: ProgressoCategoria[];
}

export interface DashboardResumoMes {
  mes: string;
  totalEntradas: number;
  totalSaidas: number;
  saldoContas: number;
  totalCartaoCredito: number;
}

export interface CategoriaValor {
  categoriaUuid: string;
  categoriaNome: string;
  valor: number;
  percentual: number;
  exibirNaDashboard: boolean;
}

export interface DashboardCategorias {
  saidas: CategoriaValor[];
  entradas: CategoriaValor[];
  cartao: CategoriaValor[];
}

export interface PontoTendencia {
  mes: string;
  anoMes: string;
  entradas: number;
  saidas: number;
}

export interface TopCategoriaSaida {
  categoriaUuid: string;
  categoriaNome: string;
  valor: number;
  percentualDoTotal: number;
}

export interface ProgressoCategoria {
  categoriaUuid: string;
  categoriaNome: string;
  valorGasto: number;
  orcamento: number | null;
  percentualUsado: number;
}
