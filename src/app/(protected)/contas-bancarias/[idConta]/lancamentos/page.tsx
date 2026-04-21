'use client'

import { ErrorPage } from "@/components/error-page";
import FiltroPorPagina from "@/components/filtro-por-pagina";
import FiltroPorPeriodo from "@/components/filtro-por-periodo";
import { Header } from "@/components/header/header";
import ResponsivePageTitle from "@/components/header/responsive-page-title";
import Pagination from "@/components/pagination";
import { Button } from "@/components/primitives/button";
import { Card } from "@/components/primitives/card";
import { Input } from "@/components/primitives/input";
import QueryListState from "@/components/primitives/query-list-state";
import Skeleton from "@/components/primitives/skeleton";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { toCurrency } from "@/helpers/string-helper";
import { useContas } from "@/hooks/use-contas";
import { useDateFilter } from "@/hooks/use-date-filter";
import { useLancamentosContaPaginacao } from "@/hooks/use-lancamentos-conta-paginacao";
import ApiError from "@/types/application-error";
import { LancamentoConta } from "@/types/lancamento-conta";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import LancamentoContaForm from "./lancamento-conta-form";
import TabelaLancamentosConta from "./tabela-lancamentos-conta";

export default function LancamentosPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") ?? "";

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState(query);
  const queryClient = useQueryClient();

  const { dateRange, stringDateUS, handleChangeDateFilter, handleOnClickFilter } = useDateFilter();

  const params = useParams<{ idConta: string }>();
  const idConta = params.idConta;
  const [lancamentos, setLancamentos] = useState<LancamentoConta[]>([])

  const { contas, isLoading: isContasLoading, isFetching: isContasFetching } = useContas();
  const {
    data,
    error,
    isLoading: isLancamentosLoading,
    isFetching: isLancamentosFetching,
    isError,
    refetch,
  } = useLancamentosContaPaginacao(idConta, page, perPage, stringDateUS.from, stringDateUS.to);

  const conta = contas?.find((c) => c.uuid === idConta);

  const paginacao = {
    paginaAtual: data?.pagina.paginacao?.paginaAtual || 1,
    ultimaPagina: data?.pagina.paginacao?.ultimaPagina || 1,
    tamanhoPagina: data?.pagina.paginacao?.tamanhoPagina || 10,
    totalElementos: data?.pagina.paginacao?.totalElementos || 0,
    doElemento: data?.pagina.paginacao?.doElemento || 0,
    paraElemento: data?.pagina.paginacao?.paraElemento || 0,
  }

  const isLoading = isContasLoading || isLancamentosLoading;
  const isFetching = isContasFetching || isLancamentosFetching;
  const isContaInvalida = !isContasLoading && !conta;
  const lancamentosErrorMessage = error instanceof ApiError
    ? error.apiMessage.descricao
    : DEFAULT_ERROR_MESSAGE;

  useEffect(() => {
    if (data) {
      setLancamentos(data.pagina.conteudo)
    }
  }, [data])

  useEffect(() => {
    setSearch(query);
  }, [query]);

  const handleChangePerPage = useCallback((value: number) => {
    setPage(1)
    setPerPage(value)
  }, []);

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

  const lancamentosFiltrados = useMemo(() => {
    const termo = search.trim().toLocaleLowerCase();

    if (!termo) {
      return lancamentos;
    }

    return lancamentos.filter((lancamento) => {
      return (
        lancamento.descricao.toLocaleLowerCase().includes(termo)
        || lancamento.categoria.descricao.toLocaleLowerCase().includes(termo)
      );
    });
  }, [lancamentos, search]);

  const isListEmpty = !isLancamentosLoading && lancamentosFiltrados.length === 0;

  if (isLoading) {
    return (
      <>
        <Header.Title>
          <Skeleton rounded="sm" className="w-32 h-10 mb-1" />
          <div className="flex flex-col items-end mr-4">
            <Skeleton rounded="sm" className="w-32 h-10" />
          </div>
        </Header.Title>

        <Skeleton rounded="lg" className="w-full h-20 mb-6" />
        <Skeleton rounded="lg" className="w-full h-225" />
      </>
    )
  }

  if (isContaInvalida) {
    return (
      <ErrorPage
        title="Conta não encontrada"
        message="A conta informada não existe ou não pertence à sua conta."
      />
    );
  }


  return (
    <>
      <ResponsivePageTitle
        title={conta?.nome || ""}
        isLoading={isFetching}
        metricLabel="Saldo:"
        metricValue={toCurrency(conta?.saldo || 0)}
        metricValueClassName={(conta?.saldo || 0) >= 0 ? "text-positive" : "text-negative"}
      />

      <Card.Root className="mb-4">
        <Card.Header className="py-3">
          <div className="flex flex-col md:flex-row flex-wrap md:items-center md:justify-between gap-6">
            <FiltroPorPeriodo
              selectedRange={dateRange}
              onRangeChange={handleChangeDateFilter}
              onClickFilter={handleOnClickFilter}
            />

            <LancamentoContaForm>
              <Button icon={Plus}>
                Adicionar
              </Button>
            </LancamentoContaForm>

          </div>
        </Card.Header>
      </Card.Root>

      <Card.Root>
        <Card.Header>
          <div className="flex items-center gap-4">
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
          isLoading={isLancamentosLoading}
          isError={isError}
          isEmpty={isListEmpty}
          errorMessage={lancamentosErrorMessage}
          emptyMessage="Nenhum lançamento encontrado para este período e filtros."
          onRetry={() => void refetch()}
          isRetrying={isLancamentosFetching}
          containerClassName="border-t border-default-border"
        >
          <>
            <TabelaLancamentosConta lancamentos={lancamentosFiltrados} />

            <Card.Footer>
              <Pagination paginacao={paginacao} onPageChange={setPage} />
            </Card.Footer>
          </>
        </QueryListState>
      </Card.Root >
    </>
  )
}