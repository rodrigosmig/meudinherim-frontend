"use client";

import { useMemo, useState } from "react";

import FiltroPorPeriodo from "@/components/filtro-por-periodo";
import ResponsivePageTitle from "@/components/header/responsive-page-title";
import { Card } from "@/components/primitives/card";
import { Select, SelectOption } from "@/components/primitives/select";
import Skeleton from "@/components/primitives/skeleton";
import { Table } from "@/components/primitives/table";

import { useConfiguracaoInicial } from "@/hooks/use-configuracao-inicial";
import { useContas } from "@/hooks/use-contas";
import { useDateFilter } from "@/hooks/use-date-filter";
import { useRelatorioLancamentosPorCategoria } from "@/hooks/use-relatorio-lancamentos-por-categoria";
import { useTags } from "@/hooks/use-tags";

import Text from "@/components/primitives/text";
import { cn, toCurrency } from "@/helpers/string-helper";
import { TipoRelatorioPorCategoria } from "@/types/enum/tipo-relatorio-por-categoria";

const TIPO_OPTIONS: SelectOption[] = [
  { value: TipoRelatorioPorCategoria.TODOS, label: "Todos" },
  { value: TipoRelatorioPorCategoria.CONTA, label: "Conta" },
  { value: TipoRelatorioPorCategoria.CARTAO, label: "Cartão" },
];

type Aba = "entrada" | "saida";

export default function LancamentosPorCategoriaPage() {
  const [tipo, setTipo] = useState<TipoRelatorioPorCategoria>(TipoRelatorioPorCategoria.TODOS);
  const [uuid, setUuid] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [abaAtiva, setAbaAtiva] = useState<Aba>("entrada");

  const { dateRange, stringDateUS, handleChangeDateFilter, handleOnClickFilter } = useDateFilter();
  const { contas } = useContas();
  const { tagsOptions } = useTags();
  const { data: configData } = useConfiguracaoInicial();

  const contasOptions: SelectOption[] = useMemo(() => [
    { value: "", label: "Todas as Contas" },
    ...contas.map((c) => ({ value: c.uuid, label: c.nome })),
  ], [contas]);

  const cartoesOptions: SelectOption[] = useMemo(() => {
    const seen = new Set<string>();
    const unique: SelectOption[] = [{ value: "", label: "Todos os Cartões" }];
    for (const fatura of configData?.faturas ?? []) {
      if (!seen.has(fatura.cartao.uuid)) {
        seen.add(fatura.cartao.uuid);
        unique.push({ value: fatura.cartao.uuid, label: fatura.cartao.descricao });
      }
    }
    return unique;
  }, [configData?.faturas]);

  function handleTipoChange(novoTipo: TipoRelatorioPorCategoria) {
    setTipo(novoTipo);
    setUuid("");
  }

  const { data, isLoading, isFetching, isError } = useRelatorioLancamentosPorCategoria(
    stringDateUS.from,
    stringDateUS.to,
    tipo,
    uuid,
    tags,
  );

  const itensAtivos = abaAtiva === "entrada" ? (data?.entrada ?? []) : (data?.saida ?? []);

  return (
    <>
      <ResponsivePageTitle title="Lançamentos por Categoria" isLoading={isFetching} />

      <Card.Root className="mb-4">
        <Card.Header className="py-3 gap-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Text variant="paragraph-medium" className="hidden md:block font-bold">Período:</Text>
              <FiltroPorPeriodo
                selectedRange={dateRange}
                onRangeChange={handleChangeDateFilter}
                onClickFilter={handleOnClickFilter}
              />
            </div>

            <div className="flex gap-3 items-end">
              <div className="w-36">
                <div>
                  <Text variant="paragraph-medium" className="hidden md:block font-bold">Tipo relatório:</Text>
                  <Select
                    options={TIPO_OPTIONS}
                    value={tipo}
                    onChange={(v) => handleTipoChange(v as TipoRelatorioPorCategoria)}
                  />
                </div>
              </div>

              {tipo === TipoRelatorioPorCategoria.CONTA && (
                <div className="w-52">
                  <div>
                    <Text variant="paragraph-medium" className="hidden md:block font-bold">Selecione a conta:</Text>
                    <Select
                      options={contasOptions}
                      value={uuid}
                      onChange={(v) => setUuid((v as string) ?? "")}
                    />
                  </div>
                </div>
              )}

              {tipo === TipoRelatorioPorCategoria.CARTAO && (
                <div className="w-52">
                  <div>
                    <Text variant="paragraph-medium" className="hidden md:block font-bold">Selecione o cartão:</Text>
                    <Select
                      options={cartoesOptions}
                      value={uuid}
                      onChange={(v) => setUuid((v as string) ?? "")}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <Text variant="paragraph-medium" className="hidden md:block font-bold">Filtro por tags:</Text>
            <Select
              options={tagsOptions}
              value={tags}
              onChange={(v) => setTags((v as string[]) ?? [])}
              placeholder="Tags..."
              isMulti
            />
          </div>
        </Card.Header>
      </Card.Root>

      {isLoading && <Skeleton rounded="lg" className="w-full h-48 mb-4" />}

      {isError && !isLoading && (
        <Card.Root className="mb-4">
          <div className="p-5 text-sm text-error text-center">
            Falha ao carregar o relatório. Tente novamente.
          </div>
        </Card.Root>
      )}

      {data && (
        <Card.Root>
          <div className="flex border-b border-default-border">
            <AbaButton active={abaAtiva === "entrada"} onClick={() => setAbaAtiva("entrada")}>
              Entrada ({data.entrada.length})
            </AbaButton>
            <AbaButton active={abaAtiva === "saida"} onClick={() => setAbaAtiva("saida")}>
              Saída ({data.saida.length})
            </AbaButton>
          </div>

          {itensAtivos.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">Nenhum item encontrado.</p>
          ) : (
            <Table.Root theadData={["Categoria", "Quantidade", "Total"]}>
              {itensAtivos.map((item) => (
                <Table.Tr key={item.idCategoria} className="text-sm md:text-base">
                  <Table.Td>{item.nomeCategoria}</Table.Td>
                  <Table.Td>
                    <span className="inline-flex items-center justify-center rounded-md bg-green-700 text-white text-xs font-bold px-2 py-0.5 min-w-6">
                      {item.quantidade}
                    </span>
                  </Table.Td>
                  <Table.Td className={abaAtiva === "entrada" ? "text-positive" : "text-negative"}>
                    {toCurrency(item.total)}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Root>
          )}
        </Card.Root>
      )}
    </>
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
