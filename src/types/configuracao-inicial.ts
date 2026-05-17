import { Notificacao } from "@/types/notificacoes";

import { Categoria } from "./categorias";
import { Conta } from "./contas";
import { Fatura } from "./faturas";

export interface ConfiguracaoInicial {
  contas: Conta[];
  faturas: Fatura[];
  categorias: Categoria[];
  notificacoes: Notificacao[];
  tags: string[];
}
