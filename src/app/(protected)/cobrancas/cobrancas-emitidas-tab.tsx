"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import Pagination from "@/components/pagination";
import { Card } from "@/components/primitives/card";
import QueryListState from "@/components/primitives/query-list-state";
import { toast } from "@/components/toast";

import { useCobrancasEmitidasPaginacao } from "@/hooks/use-cobrancas-emitidas-paginacao";

import { keysToInvalidateForCobranca } from "@/helpers/query-keys-helper";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { extrairPaginacaoSegura } from "@/helpers/paginacao-helper";

import { cobrancasService } from "@/services/cobrancas-service";
import ApiError from "@/types/application-error";
import { StatusCobranca } from "@/types/enum/status-cobranca";
import { COBRANCA_MESSAGES } from "./constants";
import { ModalConfirmacao } from "./modal-confirmacao";
import TabelaCobrancasEmitidas from "./tabela-cobrancas-emitidas";

type CobrancasEmitidasTabProps = {
  inicio?: string;
  fim?: string;
  status: StatusCobranca;
  perPage: number;
};

export default function CobrancasEmitidasTab({
  inicio,
  fim,
  status,
  perPage,
}: Readonly<CobrancasEmitidasTabProps>) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [cobrancaParaCancelar, setCobrancaParaCancelar] = useState<{
    uuid: string;
    nomeDevedor: string;
  } | null>(null);
  const [cobrancaParaMarcarPaga, setCobrancaParaMarcarPaga] = useState<{
    uuid: string;
    nomeDevedor: string;
  } | null>(null);

  const { data, isLoading, isError, isFetching, refetch } =
    useCobrancasEmitidasPaginacao(page, perPage, inicio, fim, status);

  const cobrancas = data?.pagina?.conteudo ?? [];

  const paginacao = extrairPaginacaoSegura(data, perPage);

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

  const isMutating =
    cancelarMutation.isPending || marcarComoPagaMutation.isPending;

  return (
    <>
      <QueryListState
        isLoading={isLoading}
        isError={isError}
        isEmpty={!isLoading && cobrancas.length === 0}
        emptyMessage="Nenhuma cobrança emitida"
        errorMessage={DEFAULT_ERROR_MESSAGE}
        onRetry={() => void refetch()}
        isRetrying={isFetching}
        containerClassName="border-t border-default-border"
      >
        <TabelaCobrancasEmitidas
          cobrancas={cobrancas}
          onMarcarComoPaga={setCobrancaParaMarcarPaga}
          onCancelar={setCobrancaParaCancelar}
          isMutating={isMutating}
        />

        <Card.Footer>
          <Pagination paginacao={paginacao} onPageChange={setPage} />
        </Card.Footer>
      </QueryListState>

      {cobrancaParaCancelar && (
        <ModalConfirmacao
          isOpen={true}
          title="Cancelar Cobrança"
          message={`Tem certeza que deseja cancelar a cobrança para ${cobrancaParaCancelar.nomeDevedor}?`}
          isLoading={cancelarMutation.isPending}
          onOpenChange={(open) => {
            if (!open) setCobrancaParaCancelar(null);
          }}
          onConfirmar={() =>
            cancelarMutation.mutate(cobrancaParaCancelar.uuid)
          }
        />
      )}

      {cobrancaParaMarcarPaga && (
        <ModalConfirmacao
          isOpen={true}
          title={COBRANCA_MESSAGES.modalTitle}
          message={`Tem certeza que deseja marcar como paga a cobrança de ${cobrancaParaMarcarPaga.nomeDevedor}?`}
          isLoading={marcarComoPagaMutation.isPending}
          onOpenChange={(open) => {
            if (!open) setCobrancaParaMarcarPaga(null);
          }}
          onConfirmar={() =>
            marcarComoPagaMutation.mutate(cobrancaParaMarcarPaga.uuid)
          }
        />
      )}
    </>
  );
}
