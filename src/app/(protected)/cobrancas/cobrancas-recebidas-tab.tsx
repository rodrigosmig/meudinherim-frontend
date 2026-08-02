"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import Pagination from "@/components/pagination";
import { Card } from "@/components/primitives/card";
import QueryListState from "@/components/primitives/query-list-state";
import { toast } from "@/components/toast";

import { useCobrancasRecebidasPaginacao } from "@/hooks/use-cobrancas-recebidas-paginacao";

import { keysToInvalidateForCobranca } from "@/helpers/query-keys-helper";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";

import { cobrancasService } from "@/services/cobrancas-service";
import ApiError from "@/types/application-error";
import type { CobrancaRecebida } from "@/types/cobranca";
import { StatusCobranca } from "@/types/enum/status-cobranca";
import { COBRANCA_MESSAGES } from "./constants";
import GerarContaAPagarModal from "./gerar-conta-pagar-modal";
import { ModalConfirmacao } from "./modal-confirmacao";
import TabelaCobrancasRecebidas from "./tabela-cobrancas-recebidas";

type CobrancasRecebidasTabProps = {
  inicio?: string;
  fim?: string;
  status: StatusCobranca;
  perPage: number;
};

export default function CobrancasRecebidasTab({
  inicio,
  fim,
  status,
  perPage,
}: Readonly<CobrancasRecebidasTabProps>) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [cobrancaSelecionada, setCobrancaSelecionada] = useState<CobrancaRecebida | null>(null);
  const [modalGerarOpen, setModalGerarOpen] = useState(false);
  const [cobrancaParaMarcarPaga, setCobrancaParaMarcarPaga] = useState<{
    uuid: string;
    nomeCobrador: string;
  } | null>(null);

  const { data, isLoading, isError, isFetching, refetch } =
    useCobrancasRecebidasPaginacao(page, perPage, inicio, fim, status);

  const cobrancas = data?.pagina?.conteudo ?? [];

  const paginacao = {
    paginaAtual: data?.pagina?.paginacao?.paginaAtual ?? 1,
    ultimaPagina: data?.pagina?.paginacao?.ultimaPagina ?? 1,
    tamanhoPagina: data?.pagina?.paginacao?.tamanhoPagina ?? perPage,
    totalElementos: data?.pagina?.paginacao?.totalElementos ?? 0,
    doElemento: data?.pagina?.paginacao?.doElemento ?? 0,
    paraElemento: data?.pagina?.paginacao?.paraElemento ?? 0,
  };

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

  function handleGerarContaAPagar(cobranca: CobrancaRecebida) {
    setCobrancaSelecionada(cobranca);
    setModalGerarOpen(true);
  }

  function handleModalGerarOpenChange(open: boolean) {
    setModalGerarOpen(open);
    if (!open) {
      setCobrancaSelecionada(null);
    }
  }

  return (
    <>
      <QueryListState
        isLoading={isLoading}
        isError={isError}
        isEmpty={!isLoading && cobrancas.length === 0}
        emptyMessage="Nenhuma cobrança recebida"
        errorMessage={DEFAULT_ERROR_MESSAGE}
        onRetry={() => void refetch()}
        isRetrying={isFetching}
        containerClassName="border-t border-default-border"
      >
        <TabelaCobrancasRecebidas
          cobrancas={cobrancas}
          onGerarContaAPagar={(uuid) => {
            const cobranca = cobrancas.find((c) => c.uuid === uuid);
            if (cobranca) handleGerarContaAPagar(cobranca);
          }}
          onMarcarComoPaga={setCobrancaParaMarcarPaga}
          isMutating={marcarComoPagaMutation.isPending}
        />

        <Card.Footer>
          <Pagination paginacao={paginacao} onPageChange={setPage} />
        </Card.Footer>
      </QueryListState>

      {cobrancaSelecionada && (
        <GerarContaAPagarModal
          cobrancaUuid={cobrancaSelecionada.uuid}
          valorCobranca={cobrancaSelecionada.valor}
          open={modalGerarOpen}
          onOpenChange={handleModalGerarOpenChange}
        />
      )}

      {cobrancaParaMarcarPaga && (
        <ModalConfirmacao
          isOpen={true}
          title={COBRANCA_MESSAGES.modalTitle}
          message={`Tem certeza que deseja marcar como paga a cobrança de ${cobrancaParaMarcarPaga.nomeCobrador}?`}
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
