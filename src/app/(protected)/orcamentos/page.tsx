"use client";

import FiltroPorPagina from "@/components/filtro-por-pagina";
import { Header } from "@/components/header/header";
import ResponsivePageTitle from "@/components/header/responsive-page-title";
import Pagination from "@/components/pagination";
import { Button } from "@/components/primitives/button";
import { Card } from "@/components/primitives/card";
import { Input } from "@/components/primitives/input";
import QueryListState from "@/components/primitives/query-list-state";
import Skeleton from "@/components/primitives/skeleton";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { useOrcamentosPaginacao } from "@/hooks/use-orcamentos-paginacao";
import ApiError from "@/types/application-error";
import type { Orcamento } from "@/types/orcamento";
import { Plus, Search } from "lucide-react";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import OrcamentoForm from "./orcamento-form";
import TabelaOrcamentos from "./tabela-orcamentos";

export default function OrcamentosPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);

  const {
    data,
    error,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useOrcamentosPaginacao(page, perPage);

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
    if (data) setOrcamentos(data.pagina.conteudo);
  }, [data]);

  const handleChangePerPage = useCallback((value: number) => {
    setPage(1);
    setPerPage(value);
  }, []);

  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }, []);

  const orcamentosFiltrados = useMemo(() => {
    const termo = search.trim().toLocaleLowerCase();
    if (!termo) return orcamentos;
    return orcamentos.filter((o) =>
      o.categoria.descricao.toLocaleLowerCase().includes(termo),
    );
  }, [orcamentos, search]);

  const isListEmpty = !isLoading && orcamentosFiltrados.length === 0;

  if (isLoading) {
    return (
      <>
        <Header.Title>
          <Skeleton rounded="sm" className="w-40 h-10 mb-1" />
        </Header.Title>
        <Skeleton rounded="lg" className="w-full h-20 mb-6" />
        <Skeleton rounded="lg" className="w-full h-96" />
      </>
    );
  }

  return (
    <>
      <ResponsivePageTitle title="Orçamentos" isLoading={isFetching} />

      <Card.Root>
        <Card.Header>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <FiltroPorPagina value={perPage} onChange={handleChangePerPage} />

            <div className="flex-1">
              <Input
                placeholder="Pesquisar por categoria"
                icon={Search}
                value={search}
                onChange={handleSearchChange}
              />
            </div>

            <OrcamentoForm>
              <Button icon={Plus}>Adicionar</Button>
            </OrcamentoForm>
          </div>
        </Card.Header>

        <QueryListState
          isLoading={isLoading}
          isError={isError}
          isEmpty={isListEmpty}
          errorMessage={errorMessage}
          emptyMessage="Nenhum orçamento encontrado."
          onRetry={() => void refetch()}
          isRetrying={isFetching}
          containerClassName="border-t border-default-border"
        >
          <>
            <TabelaOrcamentos orcamentos={orcamentosFiltrados} />

            <Card.Footer>
              <Pagination paginacao={paginacao} onPageChange={setPage} />
            </Card.Footer>
          </>
        </QueryListState>
      </Card.Root>
    </>
  );
}
