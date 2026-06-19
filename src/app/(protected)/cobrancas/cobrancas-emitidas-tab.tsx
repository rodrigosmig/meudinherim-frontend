"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/primitives/button";
import QueryListState from "@/components/primitives/query-list-state";
import { toast } from "@/components/toast";

import { useCobrancasEmitidas } from "@/hooks/use-cobrancas-emitidas";

import { keysToInvalidateForCobranca } from "@/helpers/query-keys-helper";
import { toCurrency, toBrDate } from "@/helpers/string-helper";

import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { cobrancasService } from "@/services/cobrancas-service";
import ApiError from "@/types/application-error";
import { StatusCobranca } from "@/types/enum/status-cobranca";
import { StatusBadge } from "./status-badge";
import { ModalConfirmacao } from "./modal-confirmacao";
import { COBRANCA_MESSAGES } from "./constants";

export default function CobrancasEmitidasTab() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useCobrancasEmitidas();
  const emitidas = data ?? [];
  const [cobrancaParaCancelar, setCobrancaParaCancelar] = useState<{ uuid: string; nomeDevedor: string } | null>(null);
  const [cobrancaParaMarcarPaga, setCobrancaParaMarcarPaga] = useState<{ uuid: string; nomeDevedor: string } | null>(null);

  const cancelarMutation = useMutation({
    mutationFn: (uuid: string) => cobrancasService.cancelar(uuid),
    onSuccess: () => {
      toast.success("Cobrança cancelada");
      setCobrancaParaCancelar(null);
      void Promise.all(
        keysToInvalidateForCobranca.map((key) =>
          queryClient.invalidateQueries({ queryKey: [key] }),
        ),
      );
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toast.error(error.apiMessage.descricao);
        return;
      }
      toast.error(DEFAULT_ERROR_MESSAGE);
    },
  });

  const marcarComoPagaMutation = useMutation({
    mutationFn: (uuid: string) => cobrancasService.marcarComoPaga(uuid),
    onSuccess: () => {
      toast.success(COBRANCA_MESSAGES.marcadaComoPaga);
      setCobrancaParaMarcarPaga(null);
      void Promise.all(
        keysToInvalidateForCobranca.map((key) =>
          queryClient.invalidateQueries({ queryKey: [key] }),
        ),
      );
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toast.error(error.apiMessage.descricao);
        return;
      }
      toast.error(DEFAULT_ERROR_MESSAGE);
    },
  });

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
                <>
                  <Button
                    variant="primary"
                    disabled={cancelarMutation.isPending || marcarComoPagaMutation.isPending}
                    onClick={() => setCobrancaParaMarcarPaga({ uuid: c.uuid, nomeDevedor: c.devedor.nome })}
                  >
                    {COBRANCA_MESSAGES.buttonLabel}
                  </Button>
                  <Button
                    variant="cancel"
                    disabled={cancelarMutation.isPending || marcarComoPagaMutation.isPending}
                    onClick={() => setCobrancaParaCancelar({ uuid: c.uuid, nomeDevedor: c.devedor.nome })}
                  >
                    Cancelar
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {cobrancaParaCancelar && (
        <ModalConfirmacao
          isOpen={true}
          title="Cancelar Cobrança"
          message={`Tem certeza que deseja cancelar a cobrança para ${cobrancaParaCancelar.nomeDevedor}?`}
          isLoading={cancelarMutation.isPending}
          onOpenChange={(open) => { if (!open) setCobrancaParaCancelar(null); }}
          onConfirmar={() => cancelarMutation.mutate(cobrancaParaCancelar.uuid)}
        />
      )}

      {cobrancaParaMarcarPaga && (
        <ModalConfirmacao
          isOpen={true}
          title={COBRANCA_MESSAGES.modalTitle}
          message={`Tem certeza que deseja marcar como paga a cobrança de ${cobrancaParaMarcarPaga.nomeDevedor}?`}
          isLoading={marcarComoPagaMutation.isPending}
          onOpenChange={(open) => { if (!open) setCobrancaParaMarcarPaga(null); }}
          onConfirmar={() => marcarComoPagaMutation.mutate(cobrancaParaMarcarPaga.uuid)}
        />
      )}
    </QueryListState>
  );
}

