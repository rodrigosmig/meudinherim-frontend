"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/primitives/button";
import QueryListState from "@/components/primitives/query-list-state";
import { toast } from "@/components/toast";

import { useCobrancasEmitidas } from "@/hooks/use-cobrancas-emitidas";

import { COBRANCAS_EMITIDAS_QUERY_KEY } from "@/helpers/query-keys-helper";
import { toCurrency, toBrDate } from "@/helpers/string-helper";

import { cobrancasService } from "@/services/cobrancas-service";
import { StatusCobranca } from "@/types/enum/status-cobranca";

function StatusBadge({ status }: { status: StatusCobranca }) {
  if (status === StatusCobranca.ABERTO) {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-500/15 text-yellow-400">
        Aberto
      </span>
    );
  }
  if (status === StatusCobranca.PAGO) {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-500/15 text-green-400">
        Pago
      </span>
    );
  }
  return (
    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-500/15 text-gray-400">
      Cancelado
    </span>
  );
}

export default function CobrancasEmitidasTab() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useCobrancasEmitidas();
  const emitidas = data ?? [];

  const cancelarMutation = useMutation({
    mutationFn: (uuid: string) => cobrancasService.cancelar(uuid),
    onSuccess: () => {
      toast.success("Cobrança cancelada");
      void queryClient.invalidateQueries({ queryKey: [COBRANCAS_EMITIDAS_QUERY_KEY] });
    },
    onError: () => {
      toast.error("Erro ao cancelar cobrança");
    },
  });

  function handleCancelar(uuid: string, nomeDevedor: string) {
    if (!window.confirm(`Cancelar cobrança para ${nomeDevedor}?`)) return;
    cancelarMutation.mutate(uuid);
  }

  return (
    <QueryListState
      isLoading={isLoading}
      isError={isError}
      isEmpty={emitidas.length === 0}
      emptyMessage="Nenhuma cobrança emitida"
      onRetry={() => void refetch()}
    >
      <div className="divide-y divide-default-border">
        {emitidas.map((c) => (
          <div
            key={c.uuid}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 hover:bg-gray-800/40 transition-colors"
          >
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-gray-200 truncate">
                  {c.devedor.nome}
                </span>
                <StatusBadge status={c.status} />
              </div>
              <span className="text-xs text-gray-400 truncate">{c.descricao}</span>
              <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500">
                <span>Emitido em {toBrDate(c.criadoEm.split("T")[0])}</span>
                {c.pagoEm && (
                  <span className="text-green-400">
                    Pago em {toBrDate(c.pagoEm.split("T")[0])}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-sm font-bold text-gray-200">
                {toCurrency(c.valor)}
              </span>
              {c.status === StatusCobranca.ABERTO && (
                <Button
                  variant="cancel"
                  onClick={() => handleCancelar(c.uuid, c.devedor.nome)}
                  disabled={cancelarMutation.isPending}
                  isLoading={cancelarMutation.isPending && cancelarMutation.variables === c.uuid}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </QueryListState>
  );
}
