import { ChevronLeft, ChevronRight } from "lucide-react";
import { Paginacao } from "@/types/pagina";

import { Button } from "./primitives/button";
import Text from "./primitives/text";
import Icon from "./primitives/icon";

function gerarArrayDePaginas(from: number, to: number) {
  return [...new Array(to - from)].map((_, index) => {
    return from + index + 1
  })
    .filter(page => page > 0)
}

const contagemDeIrmaos = 1;

type PaginationProps = {
  paginacao: Paginacao;
  onPageChange: (page: number) => void
}

export default function Pagination({ paginacao, onPageChange }: PaginationProps) {
  const paginaAtual = paginacao.paginaAtual;
  const ultimaPagina = paginacao.ultimaPagina;
  const totalElementos = paginacao.totalElementos;
  const doElemento = paginacao.doElemento;
  const paraElemento = paginacao.paraElemento;

  const previousPages = paginaAtual > 1
    ? gerarArrayDePaginas(paginaAtual - 1 - contagemDeIrmaos, paginaAtual - 1)
    : [];
  const nextPages = paginaAtual < ultimaPagina
    ? gerarArrayDePaginas(paginaAtual, Math.min(paginaAtual + contagemDeIrmaos, ultimaPagina))
    : [];

  if (paginaAtual > ultimaPagina) {
    onPageChange(ultimaPagina);
  }

  return (
    <div className="flex flex-col md:flex-row items-center gap-3 justify-between">
      <div>
        <Text variant="paragraph-small" className="font-bold">{doElemento ? doElemento : 0}</Text>
        <Text variant="caption">{" - "}</Text>
        <Text variant="paragraph-small" className="font-bold">{paraElemento ? paraElemento : 0} </Text>
        <Text variant="paragraph-small">de</Text>
        <Text variant="paragraph-small" className="font-bold"> {totalElementos}</Text>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="pagination"
          tooltip="Anterior"
          aria-label="Anterior"
          onClick={() => onPageChange(paginaAtual - 1)}
          disabled={paginaAtual === 1}
        >
          <Icon icon={ChevronLeft} />
        </Button>

        {paginaAtual > (1 + contagemDeIrmaos) && (
          <>
            <Button variant="pagination" onClick={() => onPageChange(1)}>1</Button>
            {paginaAtual > (2 + contagemDeIrmaos) && (
              <Text className="px-3 py-2 text-sm">...</Text>
            )}
          </>
        )}

        {previousPages.length > 0 && previousPages.map(page => {
          return <Button variant="pagination" onClick={() => onPageChange(page)} key={page}>{page}</Button>
        })}

        <Button variant="pagination" className="bg-primary text-default-text">{paginaAtual}</Button>

        {nextPages.length > 0 && nextPages.map(page => {
          return <Button variant="pagination" onClick={() => onPageChange(page)} key={page}>{page}</Button>
        })}

        {paginaAtual + contagemDeIrmaos < ultimaPagina && (
          <>
            {(paginaAtual + 1 + contagemDeIrmaos) < ultimaPagina && (
              <Text className="px-3 py-2 text-sm">...</Text>
            )}
            <Button variant="pagination" onClick={() => onPageChange(ultimaPagina)}>{ultimaPagina}</Button>
          </>
        )}

        <Button
          variant="pagination"
          tooltip="Próxima"
          aria-label="Próxima"
          onClick={() => onPageChange(paginaAtual + 1)}
          disabled={paginaAtual === ultimaPagina}
        >
          <Icon icon={ChevronRight} />
        </Button>
      </div>
    </div>
  )
}