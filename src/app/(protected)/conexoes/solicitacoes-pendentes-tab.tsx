"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/primitives/button";
import QueryListState from "@/components/primitives/query-list-state";
import { toast } from "@/components/toast";
import { useConexoesPendentes } from "@/hooks/use-conexoes-pendentes";
import {
  CONEXOES_QUERY_KEY,
  CONEXOES_PENDENTES_QUERY_KEY,
} from "@/helpers/query-keys-helper";
import { conexoesService } from "@/services/conexoes-service";

export default function SolicitacoesPendentesTab() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useConexoesPendentes();

  const pendentes = data ?? [];

  const aceitarMutation = useMutation({
    mutationFn: (uuid: string) => conexoesService.aceitar(uuid),
    onSuccess: () => {
      toast.success("Conexão aceita!");
      queryClient.invalidateQueries({ queryKey: [CONEXOES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CONEXOES_PENDENTES_QUERY_KEY] });
    },
    onError: () => {
      toast.error("Erro ao aceitar conexão");
    },
  });

  const recusarMutation = useMutation({
    mutationFn: (uuid: string) => conexoesService.recusar(uuid),
    onSuccess: () => {
      toast.success("Solicitação recusada");
      queryClient.invalidateQueries({ queryKey: [CONEXOES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CONEXOES_PENDENTES_QUERY_KEY] });
    },
    onError: () => {
      toast.error("Erro ao recusar solicitação");
    },
  });

  return (
    <QueryListState
      isLoading={isLoading}
      isError={isError}
      isEmpty={pendentes.length === 0}
      emptyMessage="Nenhuma solicitação pendente"
      onRetry={() => refetch()}
    >
      <ul className="flex flex-col gap-2">
        {pendentes.map((c) => (
          <li
            key={c.uuid}
            className="flex items-center justify-between gap-4 rounded-lg border border-default-border bg-gray-800/40 px-4 py-3"
          >
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-gray-200 truncate">
                {c.usuarioConexao.nome}
              </span>
              <span className="text-xs text-gray-500 truncate">
                {c.usuarioConexao.email}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                icon={UserCheck}
                variant="primary"
                disabled={aceitarMutation.isPending || recusarMutation.isPending}
                onClick={() => aceitarMutation.mutate(c.uuid)}
                className="border-green-600/50 bg-green-600/20 text-green-400 hover:bg-green-600/30 hover:text-green-300"
              >
                Aceitar
              </Button>

              <Button
                icon={UserX}
                variant="cancel"
                disabled={aceitarMutation.isPending || recusarMutation.isPending}
                onClick={() => recusarMutation.mutate(c.uuid)}
              >
                Recusar
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </QueryListState>
  );
}
