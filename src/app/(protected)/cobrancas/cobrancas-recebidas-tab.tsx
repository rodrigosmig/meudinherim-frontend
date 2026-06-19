"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/primitives/button";
import QueryListState from "@/components/primitives/query-list-state";
import { toast } from "@/components/toast";

import { useCobrancasRecebidas } from "@/hooks/use-cobrancas-recebidas";

import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { toCurrency, toBrDate } from "@/helpers/string-helper";

import { keysToInvalidateForCobranca } from "@/helpers/query-keys-helper";
import { cobrancasService } from "@/services/cobrancas-service";
import ApiError from "@/types/application-error";
import { StatusCobranca } from "@/types/enum/status-cobranca";
import GerarContaAPagarModal from "./gerar-conta-pagar-modal";
import { StatusBadge } from "./status-badge";
import { ModalConfirmacao } from "./modal-confirmacao";
import { COBRANCA_MESSAGES } from "./constants";

export default function CobrancasRecebidasTab() {
  const queryClient = useQueryClient();
  const [cobrancaSelecionada, setCobrancaSelecionada] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [cobrancaParaMarcarPaga, setCobrancaParaMarcarPaga] = useState<{ uuid: string; nomeCobrador: string } | null>(null);

  const { data, isLoading, isError, refetch } = useCobrancasRecebidas();
  const recebidas = data ?? [];

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

  function handleGerarContaAPagar(uuid: string) {
    setCobrancaSelecionada(uuid);
    setModalOpen(true);
  }

  function handleModalOpenChange(open: boolean) {
    setModalOpen(open);
    if (!open) {
      setCobrancaSelecionada(null);
    }
  }

  return (
    <>
      <QueryListState
        isLoading={isLoading}
        isError={isError}
        isEmpty={recebidas.length === 0}
        emptyMessage="Nenhuma cobrança recebida"
        onRetry={() => void refetch()}
      >
        <div className="divide-y divide-default-border">
          {recebidas.map((c) => (
            <div
              key={c.uuid}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 hover:bg-gray-800/40 transition-colors"
            >
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-gray-200 truncate">
                    {c.cobrador.nome}
                  </span>
                  <StatusBadge status={c.status} />
                </div>
                <span className="text-xs text-gray-400 truncate">{c.descricao}</span>
                {c.pagoEm && (
                  <span className="text-xs text-green-400">
                    Pago em {toBrDate(c.pagoEm.split("T")[0])}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0 flex-wrap">
                <span className="text-sm font-bold text-gray-200">
                  {toCurrency(c.valor)}
                </span>

                {c.status === StatusCobranca.ABERTO && (
                  <>
                    <Button
                      variant="primary"
                      disabled={c.gerouContaAPagar}
                      onClick={() => handleGerarContaAPagar(c.uuid)}
                    >
                      {c.gerouContaAPagar ? "Conta gerada" : "Gerar conta a pagar"}
                    </Button>
                    <Button
                      variant="primary"
                      disabled={marcarComoPagaMutation.isPending}
                      onClick={() =>
                        setCobrancaParaMarcarPaga({ uuid: c.uuid, nomeCobrador: c.cobrador.nome })
                      }
                    >
                      {COBRANCA_MESSAGES.buttonLabel}
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </QueryListState>

      <GerarContaAPagarModal
        cobrancaUuid={cobrancaSelecionada ?? ""}
        open={modalOpen}
        onOpenChange={handleModalOpenChange}
      />

      {cobrancaParaMarcarPaga && (
        <ModalConfirmacao
          isOpen={true}
          title={COBRANCA_MESSAGES.modalTitle}
          message={`Tem certeza que deseja marcar como paga a cobrança de ${cobrancaParaMarcarPaga.nomeCobrador}?`}
          isLoading={marcarComoPagaMutation.isPending}
          onOpenChange={(open) => {
            if (!open) setCobrancaParaMarcarPaga(null);
          }}
          onConfirmar={() => marcarComoPagaMutation.mutate(cobrancaParaMarcarPaga.uuid)}
        />
      )}
    </>
  );
}

