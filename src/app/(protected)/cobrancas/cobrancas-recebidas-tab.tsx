"use client";

import { useState } from "react";

import { Button } from "@/components/primitives/button";
import QueryListState from "@/components/primitives/query-list-state";

import { useCobrancasRecebidas } from "@/hooks/use-cobrancas-recebidas";

import { toCurrency, toBrDate } from "@/helpers/string-helper";

import { StatusCobranca } from "@/types/enum/status-cobranca";
import GerarContaAPagarModal from "./gerar-conta-pagar-modal";
import { StatusBadge } from "./status-badge";

export default function CobrancasRecebidasTab() {
  const [cobrancaSelecionada, setCobrancaSelecionada] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useCobrancasRecebidas();
  const recebidas = data ?? [];

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
                  <Button
                    variant="primary"
                    disabled={c.gerouContaAPagar}
                    onClick={() => handleGerarContaAPagar(c.uuid)}
                  >
                    {c.gerouContaAPagar ? "Conta gerada" : "Gerar conta a pagar"}
                  </Button>
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
    </>
  );
}
