"use client";

import { Status } from "@/helpers/enum/status";
import { CONTAS_QUERY_KEY } from "@/helpers/query-keys-helper";
import { contaService } from "@/services/conta-service";
import { useQuery } from "@tanstack/react-query";

export function useContas() {
  return useQuery({
    queryKey: [CONTAS_QUERY_KEY],
    queryFn: async () => {
      const response = await contaService.listar({
        comPaginacao: false,
        status: Status.ATIVO,
        pagina: 0,
        size: 10,
      });
      return response.data;
    },
  });
}
