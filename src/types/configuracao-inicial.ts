import { Notificacao } from "@/types/notificacoes";

import { Categoria } from "./categoria";
import { Fatura } from "./faturas";
import { Conta } from "./contas";

export interface ConfiguracaoInicial {
  contas: Conta[];
  faturas: Fatura[];
  categorias: Categoria[];
  notificacoes: Notificacao[];
}
