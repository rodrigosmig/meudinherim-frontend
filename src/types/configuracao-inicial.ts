import { Notificacao } from "@/types/notificacoes";

import { Categoria } from "./categorias";
import { Conexao } from "./conexao";
import { Conta } from "./contas";
import { Fatura } from "./faturas";

export interface ConfiguracaoInicial {
  contas: Conta[];
  faturas: Fatura[];
  categorias: Categoria[];
  notificacoes: Notificacao[];
  tags: string[];
  conexoes: Conexao[];
}
