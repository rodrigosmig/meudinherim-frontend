'use client'

import FiltroPorPagina from "@/components/filtro-por-pagina";
import { Header } from "@/components/header/header";
import Pagination from "@/components/pagination";
import { Button } from "@/components/primitives/button";
import { Card } from "@/components/primitives/card";
import Heading from "@/components/primitives/heading";
import { Input } from "@/components/primitives/input";
import Loading from "@/components/primitives/loading";
import Skeleton from "@/components/primitives/skeleton";
import Text from "@/components/primitives/text";
import { toCurrency } from "@/helpers/string-helper";
import { useContas } from "@/hooks/use-contas";
import { useLancamentosConta } from "@/hooks/use-lancamentos-conta";
import { LancamentoConta } from "@/types/lancamento-conta";
import { Calendar, Filter, Plus, Search } from "lucide-react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import TabelaLancamentos from "./tabelaLancamentos";

export default function LancamentosPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") ?? "";

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState(query);

  const params = useParams<{ uuid: string }>();
  const uuid = params.uuid;
  const [lancamentos, setLancamentos] = useState<LancamentoConta[]>([])

  const { data: contas, isLoading: isContasLoading, isFetching: isContasFetching } = useContas();
  const { data, isLoading: isLancamentosLoading, isFetching: isLancamentosFetching, error } = useLancamentosConta(uuid, page, perPage);

  const conta = contas?.contas.find((c) => c.uuid === uuid);

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
        <Skeleton rounded="lg" className="w-full h-1/2" />
      </>
    )
  }

  return (
    <>
      <Header.Title>
        <div className="flex gap-2 items-center">
          <Heading variant="heading2">{conta?.nome}</Heading>
          {isFetching && <Loading />}
        </div>
        <div className="flex flex-col items-end mr-4"> {/* verificar se é possível padronizar para todoas as paginas */}
          <Text variant="paragraph-small">Saldo:</Text>
          <Heading variant="heading4" className="text-positive">{toCurrency(conta?.saldo || 0)}</Heading>
        </div>
      </Header.Title>

      <div className="flex justify-between md:hidden mb-2 px-1">
        <Heading variant="heading2">{conta?.nome}</Heading>
        <div className="flex flex-col items-end">
          <Text variant="caption">Saldo:</Text>
          <Text variant="paragraph-medium" className="font-bold text-positive">{toCurrency(conta?.saldo || 0)}</Text>
        </div>
      </div>

      <Card.Root className="mb-6">
        <Card.Header>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4 ">
              <Input placeholder="Filtrar por período" icon={Calendar} />
              <Button icon={Filter} tooltip="Filtrar" aria-label="Filtrar" />
            </div>

            <Button icon={Plus}>
              Adicionar
            </Button>
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

        <TabelaLancamentos lancamentos={lancamentosFiltrados} />

        <Card.Footer>
          <Pagination paginacao={paginacao} onPageChange={setPage} />
        </Card.Footer>
      </Card.Root >
    </>
  )
}