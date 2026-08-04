"use client";

import { Conexao } from "@/types/conexao";
import { StatusConexao } from "@/types/enum/status-conexao";
import { useEffect, useState } from "react";
import { useConfiguracaoInicial } from "./use-configuracao-inicial";

type UseConexoesConfiguracaoInicialResult = {
  conexoes: Conexao[];
  conexoesAtivas: Conexao[];
  isLoading: boolean;
  isFetching: boolean;
};

export function useConexoesConfiguracaoInicial(): UseConexoesConfiguracaoInicialResult {
  const { data, isLoading, isFetching } = useConfiguracaoInicial();
  const [conexoes, setConexoes] = useState<Conexao[]>([]);

  useEffect(() => {
    if (data?.conexoes) {
      setConexoes(data.conexoes);
    }
  }, [data]);

  const conexoesAtivas = conexoes.filter(
    (conexao) => conexao.status === StatusConexao.ACEITA,
  );

  return {
    conexoes,
    conexoesAtivas,
    isLoading,
    isFetching,
  };
}
