"use client";

import { Conta } from "@/types/contas";
import { useEffect, useState } from "react";
import { useConfiguracaoInicial } from "./use-configuracao-inicial";

export function useContas() {
  const { data, isLoading, isFetching } = useConfiguracaoInicial();
  const [total, setTotal] = useState(0);
  const [contas, setContas] = useState<Conta[]>([]);

  useEffect(() => {
    if (data?.contas) {
      setContas(data.contas);
      setTotal(data.contas.reduce((acc, conta) => acc + conta.saldo, 0));
    }
  }, [data]);

  return {
    contas,
    saldoTotal: total,
    isLoading,
    isFetching,
  };
}
