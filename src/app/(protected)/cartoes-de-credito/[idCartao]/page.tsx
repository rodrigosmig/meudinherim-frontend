"use client";

import FiltroPorPagina from "@/components/filtro-por-pagina";
import { Header } from "@/components/header/header";
import ResponsivePageTitle from "@/components/header/responsive-page-title";
import Pagination from "@/components/pagination";
import { Card } from "@/components/primitives/card";
import { Input } from "@/components/primitives/input";
import QueryListState from "@/components/primitives/query-list-state";
import { Select } from "@/components/primitives/select";
import Skeleton from "@/components/primitives/skeleton";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { useFaturasPaginacao } from "@/hooks/use-faturas-paginacao";
import ApiError from "@/types/application-error";
import { StatusPagamento } from "@/types/enum/status-pagamento";
import { Fatura } from "@/types/faturas";
import { Search } from "lucide-react";
import { useParams } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import TabelaFaturas from "./tabela-faturas";

const STATUS_OPTIONS = [
  { value: StatusPagamento.ABERTO, label: "Abertas" },
  { value: StatusPagamento.PAGO, label: "Pagas" },
];

export default function CartaoFaturasPage() {
  const params = useParams<{ idCartao: string }>();
  const idCartao = params.idCartao;

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [statusPagamento, setStatusPagamento] = useState<StatusPagamento | "">(StatusPagamento.ABERTO);
  const [faturas, setFaturas] = useState<Fatura[]>([]);

  const {
    data,
    error,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useFaturasPaginacao(idCartao, page, perPage, statusPagamento);

  const cartaoNome = data?.pagina.conteudo[0]?.cartao.descricao ?? "Faturas";

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
    if (data) setFaturas(data.pagina.conteudo);
  }, [data]);

  const handleChangePerPage = useCallback((value: number) => {
    setPage(1);
    setPerPage(value);
  }, []);

  const handleChangeStatus = useCallback((value: string | string[] | undefined) => {
    setPage(1);
    setStatusPagamento((value as StatusPagamento | "") ?? "");
  }, []);

  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }, []);

  const faturasFiltradas = useMemo(() => {
    const termo = search.trim().toLocaleLowerCase();
    if (!termo) return faturas;
    return faturas.filter((f) =>
      f.dataVencimento.includes(termo) ||
      f.cartao.descricao.toLocaleLowerCase().includes(termo),
    );
  }, [faturas, search]);

  const isListEmpty = !isLoading && faturasFiltradas.length === 0;

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
      <ResponsivePageTitle title={cartaoNome} isLoading={isFetching} />

      <Card.Root>
        <Card.Header>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <FiltroPorPagina value={perPage} onChange={handleChangePerPage} />

            <Select
              options={STATUS_OPTIONS}
              value={statusPagamento}
              onChange={handleChangeStatus}
              placeholder="Todas"
            />

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
          emptyMessage="Nenhuma fatura encontrada."
          onRetry={() => void refetch()}
          isRetrying={isFetching}
          containerClassName="border-t border-default-border"
        >
          <>
            <TabelaFaturas idCartao={idCartao} faturas={faturasFiltradas} />

            <Card.Footer>
              <Pagination paginacao={paginacao} onPageChange={setPage} />
            </Card.Footer>
          </>
        </QueryListState>
      </Card.Root>
    </>
  );
}
