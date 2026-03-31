import { TipoCategoria } from "./enum/tipo-categoria";

export interface Categoria {
  uuid: string;
  nome: string;
  tipo: TipoCategoria;
  ativo: boolean;
  exibirNaDashboard: boolean;
}
