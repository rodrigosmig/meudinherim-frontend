"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, UserMinus } from "lucide-react";
import { Button } from "@/components/primitives/button";
import QueryListState from "@/components/primitives/query-list-state";
import { toast } from "@/components/toast";
import { useConexoes } from "@/hooks/use-conexoes";
import { CONEXOES_QUERY_KEY } from "@/helpers/query-keys-helper";
import { conexoesService } from "@/services/conexoes-service";
import { StatusConexao } from "@/types/enum/status-conexao";

interface ConexoesTabProps {
  onBuscarContatos: () => void;
}

export default function ConexoesTab({ onBuscarContatos }: ConexoesTabProps) {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useConexoes();

  const conexoesAtivas = (data ?? []).filter(
    (c) => c.status === StatusConexao.ACEITA
  );

  const mutation = useMutation({
    mutationFn: (uuid: string) => conexoesService.remover(uuid),
    onSuccess: () => {
      toast.success("Conexão removida");
      queryClient.invalidateQueries({ queryKey: [CONEXOES_QUERY_KEY] });
    },
    onError: () => {
      toast.error("Erro ao remover conexão");
    },
  });

  function handleRemover(uuid: string, nome: string) {
    if (window.confirm(`Remover conexão com ${nome}?`)) {
      mutation.mutate(uuid);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button icon={Plus} onClick={onBuscarContatos}>
          Buscar contatos
        </Button>
      </div>

      <QueryListState
        isLoading={isLoading}
        isError={isError}
        isEmpty={conexoesAtivas.length === 0}
        emptyMessage="Você ainda não tem conexões ativas."
        onRetry={() => refetch()}
      >
        <ul className="flex flex-col gap-2">
          {conexoesAtivas.map((c) => (
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

              <Button
                icon={UserMinus}
                variant="cancel"
                disabled={mutation.isPending}
                onClick={() => handleRemover(c.uuid, c.usuarioConexao.nome)}
              >
                Remover
              </Button>
            </li>
          ))}
        </ul>
      </QueryListState>
    </div>
  );
}
