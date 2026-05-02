"use client";

import * as RadixSwitch from "@radix-ui/react-switch";
import { useState } from "react";

import FiltroPorPeriodo from "@/components/filtro-por-periodo";
import ResponsivePageTitle from "@/components/header/responsive-page-title";
import { Card } from "@/components/primitives/card";
import Skeleton from "@/components/primitives/skeleton";
import { Table } from "@/components/primitives/table";
import TagsPopover from "@/components/tags-popover";

import { useContas } from "@/hooks/use-contas";
import { useDateFilter } from "@/hooks/use-date-filter";
import { useRelatorioContasAgendadas } from "@/hooks/use-relatorio-contas-agendadas";

import { cn, toBrDate, toCurrency } from "@/helpers/string-helper";
import { StatusPagamento } from "@/types/enum/status-pagamento";
import type { ContaAgendada } from "@/types/conta-agendada";

const CABECALHO = ["Vencimento", "Categoria", "Descrição", "Valor"];

type Aba = "receber" | "pagar";

export default function ContasAPagarReceberPage() {
  const [abaAtiva, setAbaAtiva] = useState<Aba>("receber");
  const [contasSelecionadas, setContasSelecionadas] = useState<Set<string>>(new Set());

  const { dateRange, stringDateUS, handleChangeDateFilter, handleOnClickFilter } = useDateFilter();
  const { contas } = useContas();

  const { data, isLoading, isFetching, isError } = useRelatorioContasAgendadas(
    stringDateUS.from,
    stringDateUS.to,
    StatusPagamento.ABERTO,
  );

  function toggleConta(uuid: string, checked: boolean) {
    setContasSelecionadas((prev) => {
      const next = new Set(prev);
      if (checked) next.add(uuid);
      else next.delete(uuid);
      return next;
    });
  }

  const saldoContasSelecionadas = contas
    .filter((c) => contasSelecionadas.has(c.uuid))
    .reduce((acc, c) => acc + c.saldo, 0);

  const saldoFinal = data
    ? data.contasAReceber.total - data.contasAPagar.total - data.totalFaturas + saldoContasSelecionadas
    : 0;

  const itensAtivos: ContaAgendada[] =
    abaAtiva === "receber"
      ? (data?.contasAReceber.itens ?? [])
      : (data?.contasAPagar.itens ?? []);

  return (
    <>
      <ResponsivePageTitle title="Relatório de Contas" isLoading={isFetching} />

      <Card.Root className="mb-4">
        <Card.Header className="py-3">
          <FiltroPorPeriodo
            selectedRange={dateRange}
            onRangeChange={handleChangeDateFilter}
            onClickFilter={handleOnClickFilter}
          />
        </Card.Header>
      </Card.Root>

      {isLoading && (
        <Skeleton rounded="lg" className="w-full h-48 mb-4" />
      )}

      {isError && !isLoading && (
        <Card.Root className="mb-4">
          <div className="p-5 text-sm text-error text-center">
            Falha ao carregar o relatório. Tente novamente.
          </div>
        </Card.Root>
      )}

      {data && (
        <>
          <Card.Root className="mb-4">
            <div className="p-5 md:p-6">
              <div className="space-y-2.5">
                <MetricaRow
                  label="Contas a Receber:"
                  value={toCurrency(data.contasAReceber.total)}
                  valueClassName="text-positive"
                />
                <MetricaRow
                  label="Contas a Pagar:"
                  value={toCurrency(data.contasAPagar.total)}
                  valueClassName="text-negative"
                />
                <MetricaRow
                  label="Faturas Abertas:"
                  value={toCurrency(data.totalFaturas)}
                  valueClassName="text-negative"
                />
                {contasSelecionadas.size > 0 && (
                  <MetricaRow
                    label="Saldo das Contas:"
                    value={toCurrency(saldoContasSelecionadas)}
                    valueClassName={saldoContasSelecionadas >= 0 ? "text-positive" : "text-negative"}
                  />
                )}
                <MetricaRow
                  label="Saldo:"
                  value={toCurrency(saldoFinal)}
                  valueClassName={cn("font-bold", saldoFinal >= 0 ? "text-positive" : "text-negative")}
                />
              </div>

              {contas.length > 0 && (
                <div className="mt-5 pt-5 border-t border-default-border">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Contas Bancárias
                  </p>
                  <div className="space-y-1.5">
                    {contas.map((conta) => (
                      <label
                        key={conta.uuid}
                        className="flex items-center justify-between gap-4 py-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <RadixSwitch.Root
                            checked={contasSelecionadas.has(conta.uuid)}
                            onCheckedChange={(checked) => toggleConta(conta.uuid, checked)}
                            className="relative w-10 h-6 flex items-center rounded-full transition-colors px-1 shrink-0 bg-gray-700 data-[state=checked]:bg-purple-600 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          >
                            <RadixSwitch.Thumb className="inline-block w-4 h-4 rounded-full bg-white shadow transform transition-transform translate-x-0 data-[state=checked]:translate-x-4" />
                          </RadixSwitch.Root>
                          <span className="text-sm text-gray-200 truncate">{conta.nome}</span>
                        </div>
                        <span
                          className={cn(
                            "text-sm font-medium shrink-0",
                            conta.saldo >= 0 ? "text-positive" : "text-negative",
                          )}
                        >
                          {toCurrency(conta.saldo)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card.Root>

          <Card.Root>
            <div className="flex border-b border-default-border">
              <AbaButton
                active={abaAtiva === "receber"}
                onClick={() => setAbaAtiva("receber")}
              >
                Contas a Receber ({data.contasAReceber.itens.length})
              </AbaButton>
              <AbaButton
                active={abaAtiva === "pagar"}
                onClick={() => setAbaAtiva("pagar")}
              >
                Contas a Pagar ({data.contasAPagar.itens.length})
              </AbaButton>
            </div>

            {itensAtivos.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                Nenhum item encontrado.
              </p>
            ) : (
              <Table.Root theadData={CABECALHO}>
                {itensAtivos.map((item) => (
                  <Table.Tr key={item.uuid} className="text-sm md:text-base font-semibold">
                    <Table.Td>{toBrDate(item.dataVencimento)}</Table.Td>
                    <Table.Td>{item.categoria.descricao}</Table.Td>
                    <Table.Td>
                      <span className="inline-flex items-center gap-1.5">
                        {item.descricao}
                        <TagsPopover tags={item.tags} />
                      </span>
                    </Table.Td>
                    <Table.Td
                      className={abaAtiva === "receber" ? "text-positive" : "text-negative"}
                    >
                      {toCurrency(item.valor)}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Root>
            )}
          </Card.Root>
        </>
      )}
    </>
  );
}

function MetricaRow({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="font-bold text-sm md:text-base w-48 shrink-0">{label}</span>
      <span className={cn("text-sm md:text-base font-semibold", valueClassName)}>{value}</span>
    </div>
  );
}

function AbaButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 py-3.5 px-4 text-sm font-medium transition-colors",
        active
          ? "border-b-2 border-primary text-primary"
          : "text-gray-400 hover:text-gray-200 border-b-2 border-transparent",
      )}
    >
      {children}
    </button>
  );
}
