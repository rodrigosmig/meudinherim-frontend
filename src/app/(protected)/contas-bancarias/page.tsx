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
import { toCurrency } from "@/helpers/string-helper";
import { useContasPaginacao } from "@/hooks/use-contas-paginacao";
import ApiError from "@/types/application-error";
import { Conta } from "@/types/contas";
import { Status } from "@/types/enum/status";
import { Plus, Search } from "lucide-react";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import ContaForm from "./conta-form";
import TabelaContas from "./tabela-contas";

const STATUS_OPTIONS = [
  { value: Status.ATIVO, label: "Ativas" },
  { value: Status.INATIVO, label: "Inativas" },
];

export default function ContasPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Status>(Status.ATIVO);
  const [contas, setContas] = useState<Conta[]>([]);

  const {
    data,
    error,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useContasPaginacao(page, perPage, status);

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
    setStatus((value as Status) ?? Status.ATIVO);
  }, []);

  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }, []);

  const contasFiltradas = useMemo(() => {
    const termo = search.trim().toLocaleLowerCase();
    if (!termo) return contas;
    return contas.filter((c) => c.nome.toLocaleLowerCase().includes(termo));
  }, [contas, search]);

  const saldoTotal = useMemo(
    () => contas.reduce((acc, c) => acc + c.saldo, 0),
    [contas],
  );

  const isListEmpty = !isLoading && contasFiltradas.length === 0;

  if (isLoading) {
    return (
      <>
        <Header.Title>
          <Skeleton rounded="sm" className="w-48 h-10 mb-1" />
          <div className="flex flex-col items-end mr-4">
            <Skeleton rounded="sm" className="w-32 h-10" />
          </div>
        </Header.Title>
        <Skeleton rounded="lg" className="w-full h-20 mb-6" />
        <Skeleton rounded="lg" className="w-full h-96" />
      </>
    );
  }

  return (
    <>
      <ResponsivePageTitle
        title="Contas Bancárias"
        isLoading={isFetching}
        metricLabel="Saldo total:"
        metricValue={toCurrency(saldoTotal)}
        metricValueClassName={saldoTotal >= 0 ? "text-positive" : "text-negative"}
      />

      <Card.Root className="mb-4">
        <Card.Header className="py-3">
          <div className="flex flex-col md:flex-row flex-wrap md:items-center md:justify-between gap-6">
            <Select
              options={STATUS_OPTIONS}
              value={status}
              onChange={handleChangeStatus}
              placeholder="Status"
            />

            <ContaForm>
              <Button icon={Plus}>Adicionar</Button>
            </ContaForm>
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
          emptyMessage="Nenhuma conta encontrada."
          onRetry={() => void refetch()}
          isRetrying={isFetching}
          containerClassName="border-t border-default-border"
        >
          <>
            <TabelaContas contas={contasFiltradas} />

            <Card.Footer>
              <Pagination paginacao={paginacao} onPageChange={setPage} />
            </Card.Footer>
          </>
        </QueryListState>
      </Card.Root>
    </>
  );
}
