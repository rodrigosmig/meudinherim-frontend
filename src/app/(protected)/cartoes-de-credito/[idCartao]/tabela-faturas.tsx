"use client";

import { Table } from "@/components/primitives/table";
import { cn } from "@/helpers/string-helper";
import { toBrDate, toCurrency } from "@/helpers/string-helper";
import { Urls } from "@/helpers/urls";
import { Fatura } from "@/types/faturas";
import { StatusPagamento } from "@/types/enum/status-pagamento";
import { Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/primitives/button";

const CABECALHO = ["Vencimento", "Fechamento", "Valor Total", "Status", "Ações"];

const STATUS_CONFIG: Record<StatusPagamento, { label: string; className: string }> = {
  [StatusPagamento.ABERTO]: {
    label: "Em aberto",
    className: "bg-yellow-900/40 text-yellow-400",
  },
  [StatusPagamento.PAGO]: {
    label: "Pago",
    className: "bg-green-900/40 text-green-400",
  },
  [StatusPagamento.ANTECIPADO]: {
    label: "Antecipado",
    className: "bg-blue-900/40 text-blue-400",
  },
};

type TabelaFaturasProps = {
  idCartao: string;
  faturas: Fatura[];
};

export default function TabelaFaturas({ idCartao, faturas }: Readonly<TabelaFaturasProps>) {
  return (
    <Table.Root theadData={CABECALHO}>
      {faturas.map((fatura) => {
        const statusConfig = STATUS_CONFIG[fatura.status];
        return (
          <Table.Tr key={fatura.uuid} className="text-sm md:text-base font-semibold">
            <Table.Td>{toBrDate(fatura.dataVencimento)}</Table.Td>
            <Table.Td>{toBrDate(fatura.dataFechamento)}</Table.Td>
            <Table.Td className="text-negative">
              {toCurrency(fatura.valorTotal)}
            </Table.Td>
            <Table.Td>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                  statusConfig?.className ?? "bg-gray-700 text-gray-400",
                )}
              >
                {statusConfig?.label ?? fatura.status}
              </span>
            </Table.Td>
            <Table.Td>
              <Link
                href={`${Urls.CARTOES_DE_CREDITO}/${idCartao}/faturas/${fatura.uuid}`}
              >
                <Button icon={Eye} />
              </Link>
            </Table.Td>
          </Table.Tr>
        );
      })}
    </Table.Root>
  );
}
