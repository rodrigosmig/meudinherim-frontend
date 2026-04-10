'use client'

import FiltroPorPagina from "@/components/filtro-por-pagina";
import FiltroPorPeriodo from "@/components/filtro-por-periodo";
import { Header } from "@/components/header/header";
import ResponsivePageTitle from "@/components/header/responsive-page-title";
import Pagination from "@/components/pagination";
import { Button } from "@/components/primitives/button";
import { Card } from "@/components/primitives/card";
import { Input } from "@/components/primitives/input";
import Skeleton from "@/components/primitives/skeleton";
import {toCurrency, toUsDate} from "@/helpers/string-helper";
import { useContas } from "@/hooks/use-contas";
import { useDateFilter } from "@/hooks/use-date-filter";
import { useLancamentosContaPaginacao } from "@/hooks/use-lancamentos-conta-paginacao";
import { LancamentoConta } from "@/types/lancamento-conta";
import { Plus, Search } from "lucide-react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import LancamentoContaForm from "./lancamento-conta-form";
import TabelaLancamentosConta from "./tabela-lancamentos-conta";
import {
  ACCOUNT_BALANCE,
  ACCOUNT_TOTAL_BY_CATEGORY,
  ACCOUNTS_ENTRIES,
  getMessage
} from "../../../../../../legacy/utils/helpers";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import type {LancamentoContaFormValue} from "@/schema-validation/lancamento-conta";
import {lancamentoContaService} from "@/services/lancamento-conta-service";
import {toast} from "@components/toast";
import {DADOS_CONFIGURACAO_QUERY_KEY, LANCAMENTOS_CONTA_QUERY_KEY} from "@/helpers/query-keys-helper";
import ApiError from "@/types/application-error";
import {catalogoErros} from "@/helpers/erros-helper";
import type {ApiFormError} from "@/types/api";
import {DEFAULT_ERROR_MESSAGE} from "@/helpers/route-helpers";

export default function LancamentosPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") ?? "";

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState(query);
  const queryClient = useQueryClient();

  const { dateRange, stringDateUS, handleChangeDateFilter, handleOnClickFilter } = useDateFilter();

  const params = useParams<{ uuid: string }>();
  const uuid = params.uuid;
  const [lancamentos, setLancamentos] = useState<LancamentoConta[]>([])

  const { contas, isLoading: isContasLoading, isFetching: isContasFetching } = useContas();
  const { data, isLoading: isLancamentosLoading, isFetching: isLancamentosFetching, error } = useLancamentosContaPaginacao(uuid, page, perPage, stringDateUS.from, stringDateUS.to);

  const conta = contas?.find((c) => c.uuid === uuid);

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

    setPage(1);

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

  const deleteLancamentoMutation = useMutation({
    mutationFn: async (idLancamento: string) => {
      return lancamentoContaService.deletar(idLancamento);
    },
    onSuccess: () => {
      toast.success("Lançamento excluído com sucesso!");

      void Promise.all([
        queryClient.invalidateQueries({queryKey: [LANCAMENTOS_CONTA_QUERY_KEY]}),
        queryClient.invalidateQueries({queryKey: [DADOS_CONFIGURACAO_QUERY_KEY]}),
      ]);
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toast.error(error.apiMessage.descricao);
        return;
      }

      toast.error(DEFAULT_ERROR_MESSAGE);
    },
  });

  const handleDeleteLancamento = async (id: string) => {
    await deleteLancamentoMutation.mutateAsync(id);
  }

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

        <TabelaLancamentosConta lancamentos={lancamentosFiltrados} />

        <Card.Footer>
          <Pagination paginacao={paginacao} onPageChange={setPage} />
        </Card.Footer>
      </Card.Root >
    </>
  )
}