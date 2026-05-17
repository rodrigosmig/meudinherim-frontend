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
import { useCategoriasPaginacao } from "@/hooks/use-categorias-paginacao";
import ApiError from "@/types/application-error";
import { Categoria } from "@/types/categorias";
import { Status } from "@/types/enum/status";
import { TipoCategoria } from "@/types/enum/tipo-categoria";
import { Plus, Search } from "lucide-react";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import CategoriaForm from "./categoria-form";
import TabelaCategorias from "./tabela-categorias";

const TIPO_OPTIONS = [
  { value: "", label: "Todos" },
  { value: TipoCategoria.ENTRADA, label: "Entrada" },
  { value: TipoCategoria.SAIDA, label: "Saída" },
];

const ATIVAS_OPTIONS = [
  { value: Status.ATIVO, label: "Ativas" },
  { value: Status.INATIVO, label: "Inativas" },
];

export default function CategoriasPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState("");
  const [status, setStatus] = useState(Status.ATIVO);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const {
    data,
    error,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useCategoriasPaginacao(page, perPage, tipo, status);

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
    if (data) {
      setCategorias(data.pagina.conteudo);
    }
  }, [data]);

  const handleChangePerPage = useCallback((value: number) => {
    setPage(1);
    setPerPage(value);
  }, []);

  const handleChangeTipo = useCallback((value: string | string[] | undefined) => {
    setPage(1);
    setTipo((value as string) ?? "");
  }, []);

  const handleChangeStatus = useCallback((value: string | string[] | undefined) => {
    setPage(1);
    setStatus((value as Status) ?? Status.ATIVO);
  }, []);

  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }, []);

  const categoriasFiltradas = useMemo(() => {
    const termo = search.trim().toLocaleLowerCase();
    if (!termo) return categorias;
    return categorias.filter((c) => c.nome.toLocaleLowerCase().includes(termo));
  }, [categorias, search]);

  const isListEmpty = !isLoading && categoriasFiltradas.length === 0;

  if (isLoading) {
    return (
      <>
        <Header.Title>
          <Skeleton rounded="sm" className="w-32 h-10 mb-1" />
        </Header.Title>
        <Skeleton rounded="lg" className="w-full h-20 mb-6" />
        <Skeleton rounded="lg" className="w-full h-96" />
      </>
    );
  }

  return (
    <>
      <ResponsivePageTitle title="Categorias" isLoading={isFetching} />

      <Card.Root className="mb-4">
        <Card.Header className="py-3">
          <div className="flex flex-col md:flex-row flex-wrap md:items-center md:justify-between gap-6">
            <div className="flex flex-col md:flex-row gap-2">
              <Select
                options={TIPO_OPTIONS}
                value={tipo}
                onChange={handleChangeTipo}
                placeholder="Tipo"
              />

              <Select
                options={ATIVAS_OPTIONS}
                value={status}
                onChange={handleChangeStatus}
                placeholder="Status"
              />
            </div>
            <CategoriaForm>
              <Button icon={Plus}>Adicionar</Button>
            </CategoriaForm>
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
          emptyMessage="Nenhuma categoria encontrada."
          onRetry={() => void refetch()}
          isRetrying={isFetching}
          containerClassName="border-t border-default-border"
        >
          <>
            <TabelaCategorias categorias={categoriasFiltradas} />

            <Card.Footer>
              <Pagination paginacao={paginacao} onPageChange={setPage} />
            </Card.Footer>
          </>
        </QueryListState>
      </Card.Root>
    </>
  );
}
