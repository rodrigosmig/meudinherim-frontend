'use client'

import { ErrorPage } from "@/components/error-page";
import FiltroPorPagina from "@/components/filtro-por-pagina";
import { Header } from "@/components/header/header";
import ResponsivePageTitle from "@/components/header/responsive-page-title";
import Pagination from "@/components/pagination";
import { Button } from "@/components/primitives/button";
import { Card } from "@/components/primitives/card";
import { Input } from "@/components/primitives/input";
import QueryListState from "@/components/primitives/query-list-state";
import Skeleton from "@/components/primitives/skeleton";
import { FATURAS_QUERY_KEY } from "@/helpers/query-keys-helper";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { toBrDate, toCurrency } from "@/helpers/string-helper";
import { useLancamentosCartaoPaginacao } from "@/hooks/use-lancamentos-cartao-paginacao";
import { faturasService } from "@/services/faturas-service";
import { ApiResponse } from "@/types/api";
import ApiError from "@/types/application-error";
import { ObterFaturaData } from "@/types/faturas";
import { LancamentoCartao } from "@/types/lancamento-cartao";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, Plus, Search } from "lucide-react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import LancamentoCartaoForm from "./lancamento-cartao-form";
import PagamentoParcialForm from "./pagamento-parcial-form";
import TabelaLancamentosCartao from "./tabela-lancamentos-cartao";

export default function FaturaPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") ?? "";

  const params = useParams<{ idFatura: string; idCartao: string }>();
  const idFatura = params.idFatura;
  const idCartao = params.idCartao;

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState(query);
  const [lancamentos, setLancamentos] = useState<LancamentoCartao[]>([]);

  const {
    data: faturaData,
    isLoading: isFaturaLoading,
    isError: isFaturaError,
  } = useQuery({
    queryKey: [FATURAS_QUERY_KEY, idCartao, idFatura],
    queryFn: async () => {
      const response = await faturasService.obter(idCartao, idFatura);
      const fatura = (response as ApiResponse<ObterFaturaData>).data?.fatura;
      if (!fatura) throw new Error("Fatura não encontrada");
      return fatura;
    },
    enabled: !!idCartao && !!idFatura,
    retry: false,
  });

  const {
    data,
    error,
    isLoading: isLancamentosLoading,
    isFetching: isLancamentosFetching,
    isError,
    refetch,
  } = useLancamentosCartaoPaginacao(idCartao, idFatura, page, perPage);

  const paginacao = {
    paginaAtual: data?.pagina.paginacao?.paginaAtual || 1,
    ultimaPagina: data?.pagina.paginacao?.ultimaPagina || 1,
    tamanhoPagina: data?.pagina.paginacao?.tamanhoPagina || 10,
    totalElementos: data?.pagina.paginacao?.totalElementos || 0,
    doElemento: data?.pagina.paginacao?.doElemento || 0,
    paraElemento: data?.pagina.paginacao?.paraElemento || 0,
  };

  const lancamentosErrorMessage =
    error instanceof ApiError ? error.apiMessage.descricao : DEFAULT_ERROR_MESSAGE;

  useEffect(() => {
    if (data) {
      setLancamentos(data.pagina.conteudo);
    }
  }, [data]);

  useEffect(() => {
    setSearch(query);
  }, [query]);

  const handleChangePerPage = useCallback((value: number) => {
    setPage(1);
    setPerPage(value);
  }, []);

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
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
    },
    [pathname, searchParams],
  );

  const lancamentosFiltrados = useMemo(() => {
    const termo = search.trim().toLocaleLowerCase();

    if (!termo) return lancamentos;

    return lancamentos.filter(
      (lancamento) =>
        lancamento.descricao.toLocaleLowerCase().includes(termo) ||
        lancamento.categoria.descricao.toLocaleLowerCase().includes(termo),
    );
  }, [lancamentos, search]);

  const isListEmpty = !isLancamentosLoading && lancamentosFiltrados.length === 0;

  if (isFaturaLoading) {
    return (
      <>
        <Header.Title>
          <Skeleton rounded="sm" className="w-32 h-10 mb-1" />
          <div className="flex flex-col items-end mr-4">
            <Skeleton rounded="sm" className="w-32 h-10" />
          </div>
        </Header.Title>
        <Skeleton rounded="lg" className="w-full h-225" />
      </>
    );
  }

  if (isFaturaError || !faturaData) {
    return (
      <ErrorPage
        title="Fatura não encontrada"
        message="O cartão ou a fatura informados não existem ou não pertencem à sua conta."
      />
    );
  }

  return (
    <>
      <ResponsivePageTitle
        title={`${faturaData.cartao.descricao} - ${toBrDate(faturaData.dataVencimento)}`}
        isLoading={isLancamentosFetching}
        metricLabel="Total Fatura:"
        metricValue={toCurrency(faturaData.valorTotal)}
        metricValueClassName={(faturaData.valorTotal || 0) >= 0 ? "text-negative" : "text-positive"}
      />

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

            <PagamentoParcialForm>
              <Button icon={CreditCard} variant="primary">
                Pagamento Parcial
              </Button>
            </PagamentoParcialForm>

            <LancamentoCartaoForm>
              <Button icon={Plus}>
                Adicionar
              </Button>
            </LancamentoCartaoForm>
          </div>
        </Card.Header>

        <QueryListState
          isLoading={isLancamentosLoading}
          isError={isError}
          isEmpty={isListEmpty}
          errorMessage={lancamentosErrorMessage}
          emptyMessage="Nenhum lançamento encontrado para esta fatura."
          onRetry={() => void refetch()}
          isRetrying={isLancamentosFetching}
          containerClassName="border-t border-default-border"
        >
          <>
            <TabelaLancamentosCartao lancamentos={lancamentosFiltrados} />

            <Card.Footer>
              <Pagination paginacao={paginacao} onPageChange={setPage} />
            </Card.Footer>
          </>
        </QueryListState>
      </Card.Root>
    </>
  );
}
