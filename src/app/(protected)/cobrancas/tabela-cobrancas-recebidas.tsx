"use client";

import { Button } from "@/components/primitives/button";
import { Table } from "@/components/primitives/table";
import { cn, toBrDate, toCurrency } from "@/helpers/string-helper";
import { CobrancaRecebida } from "@/types/cobranca";
import { StatusCobranca } from "@/types/enum/status-cobranca";
import { BanknoteArrowUp, FilePlus } from "lucide-react";
import { StatusBadge } from "./status-badge";

const CABECALHO = ["Nome", "Descrição", "Data", "Valor", "Status", "Ações"];

type TabelaCobrancasRecebidasProps = {
  cobrancas: CobrancaRecebida[];
  onGerarContaAPagar: (uuid: string) => void;
  onMarcarComoPaga: (cobranca: { uuid: string; nomeCobrador: string }) => void;
  isMutating: boolean;
};

export default function TabelaCobrancasRecebidas({
  cobrancas,
  onGerarContaAPagar,
  onMarcarComoPaga,
  isMutating,
}: Readonly<TabelaCobrancasRecebidasProps>) {
  return (
    <Table.Root theadData={CABECALHO}>
      {cobrancas.map((c) => {
        const isAberto = c.status === StatusCobranca.ABERTO;

        return (
          <Table.Tr key={c.uuid} className="text-sm md:text-base font-semibold">
            <Table.Td>{c.cobrador.nome}</Table.Td>
            <Table.Td>{c.descricao}</Table.Td>
            <Table.Td>{toBrDate(c.data)}</Table.Td>
            <Table.Td className="text-negative">{toCurrency(c.valor)}</Table.Td>
            <Table.Td>
              <div className="flex flex-col gap-1">
                <StatusBadge status={c.status} />
                {c.pagoEm && (
                  <span className="text-xs text-green-400">
                    Pago em {toBrDate(c.pagoEm.split("T")[0])}
                  </span>
                )}
              </div>
            </Table.Td>

            <Table.Td className="flex items-center gap-2">
              {isAberto && (
                <>
                  <Button
                    icon={FilePlus}
                    tooltip={c.gerouContaAPagar ? "Conta gerada" : "Gerar conta a pagar"}
                    aria-label={c.gerouContaAPagar ? "Conta gerada" : "Gerar conta a pagar"}
                    disabled={c.gerouContaAPagar || isMutating}
                    onClick={() => onGerarContaAPagar(c.uuid)}
                  />
                  <Button
                    icon={BanknoteArrowUp}
                    tooltip="Marcar como pago"
                    aria-label="Marcar como pago"
                    disabled={isMutating}
                    onClick={() =>
                      onMarcarComoPaga({ uuid: c.uuid, nomeCobrador: c.cobrador.nome })
                    }
                  />
                </>
              )}
            </Table.Td>
          </Table.Tr>
        );
      })}
    </Table.Root>
  );
}
