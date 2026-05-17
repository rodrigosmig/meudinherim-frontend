"use client";

import FiltroPorPagina from "@/components/filtro-por-pagina";
import FiltroPorPeriodo from "@/components/filtro-por-periodo";
import { Header } from "@/components/header/header";
import ResponsivePageTitle from "@/components/header/responsive-page-title";
import Pagination from "@/components/pagination";
import { Button } from "@/components/primitives/button";
import { Card } from "@/components/primitives/card";
import { Input } from "@/components/primitives/input";
import QueryListState from "@/components/primitives/query-list-state";
import { Select } from "@/components/primitives/select";
import Skeleton from "@/components/primitives/skeleton";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { useContasAPagarPaginacao } from "@/hooks/use-contas-a-pagar-paginacao";
import { useDateFilter } from "@/hooks/use-date-filter";
import ApiError from "@/types/application-error";
import { ContaAgendada } from "@/types/conta-agendada";
import { StatusContaAgendada } from "@/types/enum/status-conta-agendada";
import { Plus, Search } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import ContaAPagarForm from "./conta-a-pagar-form";
import TabelaContasAPagar from "./tabela-contas-a-pagar";

const STATUS_OPTIONS = [
  { value: StatusContaAgendada.ABERTO, label: "Abertas" },
  { value: StatusContaAgendada.PAGO, label: "Pagas" },
];

export default function ContasAPagarPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") ?? "";

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState(query);
  const [statusPagamento, setStatusPagamento] = useState<StatusContaAgendada>(StatusContaAgendada.ABERTO);
  const [contas, setContas] = useState<ContaAgendada[]>([]);

  const { dateRange, stringDateUS, handleChangeDateFilter, handleOnClickFilter } = useDateFilter();

  const {
    data,
    error,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useContasAPagarPaginacao(
    page,
    perPage,
    stringDateUS.from,
    stringDateUS.to,
    statusPagamento,
  );

  const paginacao = {
    paginaAtual: data?.pagina.paginacao?.paginaAtual || 1,
    ultimaPagina: data?.pagina.paginacao?.ultimaPagina || 1,
    tamanhoPagina: data?.pagina.paginacao?.tamanhoPagina || 10,
    totalElementos: data?.pagina.paginacao?.totalElementos || 0,
    doElemento: data?.pagina.paginacao?.doElemento || 0,
    paraElemento: data?.pagina.paginacao?.paraElemento || 0,
  };

  const errorMessage = error instanceof ApiError
    ? error.apiMessage.descricao
    : DEFAULT_ERROR_MESSAGE;

  useEffect(() => {
    if (data) setContas(data.pagina.conteudo);
  }, [data]);

  const handleChangePerPage = useCallback((value: number) => {
    setPage(1);
    setPerPage(value);
  }, []);

  const handleChangeStatus = useCallback((value: string | string[] | undefined) => {
    setPage(1);
    setStatusPagamento((value as StatusContaAgendada) ?? StatusContaAgendada.ABERTO);
  }, []);

  useEffect(() => {
    setSearch(query);
  }, [query]);

  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const nextSearch = event.target.value;
    setSearch(nextSearch);

    const params = new URLSearchParams(searchParams?.toString() ?? "");

    if (nextSearch.trim().length > 0) {
      params.set("q", nextSearch);
    } else {
      params.delete("q");
    }

    const queryString = params.toString();
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;
    window.history.replaceState(null, "", nextUrl);
  }, [pathname, searchParams]);

  const contasFiltradas = useMemo(() => {
    const termo = search.trim().toLocaleLowerCase();
    if (!termo) return contas;
    return contas.filter(
      (c) =>
        c.descricao.toLocaleLowerCase().includes(termo) ||
        c.categoria.descricao.toLocaleLowerCase().includes(termo),
    );
  }, [contas, search]);

  const isListEmpty = !isLoading && contasFiltradas.length === 0;

  if (isLoading) {
    return (
      <>
        <Header.Title>
          <Skeleton rounded="sm" className="w-48 h-10 mb-1" />
        </Header.Title>
        <Skeleton rounded="lg" className="w-full h-20 mb-6" />
        <Skeleton rounded="lg" className="w-full h-96" />
      </>
    );
  }

  return (
    <>
      <ResponsivePageTitle title="Contas a Pagar" isLoading={isFetching} />

      <Card.Root className="mb-4">
        <Card.Header className="py-3">
          <div className="flex flex-col md:flex-row flex-wrap md:items-center md:justify-between gap-6">
            <div className="flex flex-col md:flex-row gap-2">
              <FiltroPorPeriodo
                selectedRange={dateRange}
                onRangeChange={handleChangeDateFilter}
                onClickFilter={handleOnClickFilter}
              />

              <Select
                options={STATUS_OPTIONS}
                value={statusPagamento}
                onChange={handleChangeStatus}
              />
            </div>

            <ContaAPagarForm>
              <Button icon={Plus}>Adicionar</Button>
            </ContaAPagarForm>
          </div>
        </Card.Header>
      </Card.Root>

      <Card.Root>
        <Card.Header>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <FiltroPorPagina value={perPage} onChange={handleChangePerPage} />

            <div className="flex-1">
              <Input
                placeholder="Pesquisar"
                icon={Search}
                value={search}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </Card.Header>

        <QueryListState
          isLoading={isLoading}
          isError={isError}
          isEmpty={isListEmpty}
          errorMessage={errorMessage}
          emptyMessage="Nenhuma conta a pagar encontrada para o período selecionado."
          onRetry={() => void refetch()}
          isRetrying={isFetching}
          containerClassName="border-t border-default-border"
        >
          <>
            <TabelaContasAPagar contas={contasFiltradas} />

            <Card.Footer>
              <Pagination paginacao={paginacao} onPageChange={setPage} />
            </Card.Footer>
          </>
        </QueryListState>
      </Card.Root>
    </>
  );
}
