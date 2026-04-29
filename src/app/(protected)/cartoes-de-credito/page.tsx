"use client";

import FiltroPorPagina from "@/components/filtro-por-pagina";
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
import { useCartoesPaginacao } from "@/hooks/use-cartoes-paginacao";
import ApiError from "@/types/application-error";
import { Cartao } from "@/types/cartao";
import { Status } from "@/types/enum/status";
import { Plus, Search } from "lucide-react";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import CartaoForm from "./cartao-form";
import TabelaCartoes from "./tabela-cartoes";

const STATUS_OPTIONS = [
  { value: Status.ATIVO, label: "Ativos" },
  { value: Status.INATIVO, label: "Inativos" },
];

export default function CartoesDeCreditoPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Status>(Status.ATIVO);
  const [cartoes, setCartoes] = useState<Cartao[]>([]);

  const {
    data,
    error,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useCartoesPaginacao(page, perPage, status);

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
    if (data) setCartoes(data.pagina.conteudo);
  }, [data]);

  const handleChangePerPage = useCallback((value: number) => {
    setPage(1);
    setPerPage(value);
  }, []);

  const handleChangeStatus = useCallback((value: string | string[] | undefined) => {
    setPage(1);
    setStatus((value as Status) ?? Status.ATIVO);
  }, []);

  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }, []);

  const cartoesFiltrados = useMemo(() => {
    const termo = search.trim().toLocaleLowerCase();
    if (!termo) return cartoes;
    return cartoes.filter((c) => c.nome.toLocaleLowerCase().includes(termo));
  }, [cartoes, search]);

  const isListEmpty = !isLoading && cartoesFiltrados.length === 0;

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
      <ResponsivePageTitle title="Cartões de Crédito" isLoading={isFetching} />

      <Card.Root className="mb-4">
        <Card.Header className="py-3">
          <div className="flex flex-col md:flex-row flex-wrap md:items-center md:justify-between gap-6">
            <Select
              options={STATUS_OPTIONS}
              value={status}
              onChange={handleChangeStatus}
              placeholder="Status"
            />

            <CartaoForm>
              <Button icon={Plus}>Adicionar</Button>
            </CartaoForm>
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
          emptyMessage="Nenhum cartão encontrado."
          onRetry={() => void refetch()}
          isRetrying={isFetching}
          containerClassName="border-t border-default-border"
        >
          <>
            <TabelaCartoes cartoes={cartoesFiltrados} />

            <Card.Footer>
              <Pagination paginacao={paginacao} onPageChange={setPage} />
            </Card.Footer>
          </>
        </QueryListState>
      </Card.Root>
    </>
  );
}
