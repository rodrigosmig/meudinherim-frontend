"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import Modal from "@/components/modal";
import { Button } from "@/components/primitives/button";
import QueryListState from "@/components/primitives/query-list-state";
import Text from "@/components/primitives/text";
import { toast } from "@/components/toast";

import { useCobrancasEmitidas } from "@/hooks/use-cobrancas-emitidas";

import { COBRANCAS_EMITIDAS_QUERY_KEY } from "@/helpers/query-keys-helper";
import { toCurrency, toBrDate } from "@/helpers/string-helper";

import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { cobrancasService } from "@/services/cobrancas-service";
import ApiError from "@/types/application-error";
import { StatusCobranca } from "@/types/enum/status-cobranca";
import { StatusBadge } from "./status-badge";

export default function CobrancasEmitidasTab() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useCobrancasEmitidas();
  const emitidas = data ?? [];
  const [cobrancaParaCancelar, setCobrancaParaCancelar] = useState<{ uuid: string; nomeDevedor: string } | null>(null);

  const cancelarMutation = useMutation({
    mutationFn: (uuid: string) => cobrancasService.cancelar(uuid),
    onSuccess: () => {
      toast.success("Cobrança cancelada");
      setCobrancaParaCancelar(null);
      void queryClient.invalidateQueries({ queryKey: [COBRANCAS_EMITIDAS_QUERY_KEY] });
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
                <Button
                  variant="cancel"
                  disabled={cancelarMutation.isPending}
                  onClick={() => setCobrancaParaCancelar({ uuid: c.uuid, nomeDevedor: c.devedor.nome })}
                >
                  Cancelar
                </Button>
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
    </QueryListState>
  );
}

interface ModalConfirmacaoProps {
  title: string;
  message: string;
  trigger?: ReactNode;
  isOpen: boolean;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmar: () => void;
}

function ModalConfirmacao({
  title,
  message,
  trigger,
  isOpen,
  isLoading,
  onOpenChange,
  onConfirmar,
}: ModalConfirmacaoProps) {
  return (
    <Modal open={isOpen} onOpenChange={onOpenChange} title={title} trigger={trigger}>
      <div className="flex flex-col gap-3">
        <Text variant="paragraph-medium">{message}</Text>

        <div className="flex justify-end gap-2">
          <Button variant="cancel" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button isLoading={isLoading} onClick={onConfirmar}>
            Confirmar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
