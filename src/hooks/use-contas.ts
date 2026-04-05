"use client";

import { SelectOption } from "@/components/primitives/select";
import { Conta } from "@/types/contas";
import { useEffect, useState } from "react";
import { useConfiguracaoInicial } from "./use-configuracao-inicial";

type UseContasResult = {
  contas: Conta[];
  contasOptions: SelectOption[];
  saldoTotal: number;
  isLoading: boolean;
  isFetching: boolean;
};

export function useContas(): UseContasResult {
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
    contasOptions: contas.map((conta) => ({
      value: conta.uuid,
      label: conta.nome,
    })),
    saldoTotal: total,
    isLoading,
    isFetching,
  };
}
