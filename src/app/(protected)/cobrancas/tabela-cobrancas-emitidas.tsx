"use client";

import { Button } from "@/components/primitives/button";
import { Table } from "@/components/primitives/table";
import { toBrDate, toCurrency } from "@/helpers/string-helper";
import { CobrancaEmitida } from "@/types/cobranca";
import { StatusCobranca } from "@/types/enum/status-cobranca";
import { Ban, BanknoteArrowUp } from "lucide-react";
import { StatusBadge } from "./status-badge";

const CABECALHO = ["Nome", "Descrição", "Data", "Valor", "Status", "Ações"];

type TabelaCobrancasEmitidasProps = {
  cobrancas: CobrancaEmitida[];
  onMarcarComoPaga: (cobranca: { uuid: string; nomeDevedor: string }) => void;
  onCancelar: (cobranca: { uuid: string; nomeDevedor: string }) => void;
  isMutating: boolean;
};

export default function TabelaCobrancasEmitidas({
  cobrancas,
  onMarcarComoPaga,
  onCancelar,
  isMutating,
}: Readonly<TabelaCobrancasEmitidasProps>) {
  return (
    <Table.Root theadData={CABECALHO}>
      {cobrancas.map((c) => {
        const isAberto = c.status === StatusCobranca.ABERTO;

        return (
          <Table.Tr key={c.uuid} className="text-sm md:text-base font-semibold">
            <Table.Td>{c.devedor.nome}</Table.Td>
            <Table.Td>{c.descricao}</Table.Td>
            <Table.Td>{toBrDate(c.data)}</Table.Td>
            <Table.Td className="text-negative">{toCurrency(c.valor)}</Table.Td>
            <Table.Td>
              <StatusBadge status={c.status} />
            </Table.Td>

            <Table.Td className="flex items-center gap-2">
              {isAberto && (
                <>
                  <Button
                    icon={BanknoteArrowUp}
                    tooltip="Marcar como pago"
                    aria-label="Marcar como pago"
                    disabled={isMutating}
                    onClick={() =>
                      onMarcarComoPaga({ uuid: c.uuid, nomeDevedor: c.devedor.nome })
                    }
                  />
                  <Button
                    icon={Ban}
                    tooltip="Cancelar"
                    aria-label="Cancelar"
                    disabled={isMutating}
                    onClick={() =>
                      onCancelar({ uuid: c.uuid, nomeDevedor: c.devedor.nome })
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
