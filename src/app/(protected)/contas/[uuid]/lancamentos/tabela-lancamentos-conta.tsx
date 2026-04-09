import { toBrDate, toCurrency } from '@/helpers/string-helper';
import { TipoCategoria } from '@/types/enum/tipo-categoria';
import { LancamentoConta } from '@/types/lancamento-conta';
import { Button } from '@/components/primitives/button';
import { Table } from '@/components/primitives/table';
import {Pencil, Trash2} from 'lucide-react';
import LancamentoContaForm from "@/app/(protected)/contas/[uuid]/lancamentos/lancamento-conta-form";
import TagsPopover from "@/components/tags-popover";

type TabelaLancamentosProps = {
  lancamentos: LancamentoConta[];
}

export default function TabelaLancamentosConta({ lancamentos }: Readonly<TabelaLancamentosProps>) {
  const dadosCabecalho = ["Data", "Categoria", "Descrição", "Valor", "Ações"];

  return (
    <Table.Root theadData={dadosCabecalho}>
      {lancamentos.map(lancamento => (
        <Table.Tr key={lancamento.uuid} className="text-sm md:text-base font-semibold">
          <Table.Td>
            {toBrDate(lancamento.data)}
          </Table.Td>
          <Table.Td>
            {lancamento.categoria.descricao}
          </Table.Td>

          <Table.Td>
            <span className="inline-flex items-center gap-1.5">
              {lancamento.descricao}
              <TagsPopover tags={lancamento.tags} />
            </span>
          </Table.Td>

          <Table.Td className={`${lancamento.categoria.tipo === TipoCategoria.ENTRADA ? "text-positive" : "text-negative"}`}>
            {toCurrency(lancamento.valor)}
          </Table.Td>

          <Table.Td className="flex items-center justify-end gap-2">
            <LancamentoContaForm lancamentoConta={lancamento}>
              <Button icon={Pencil} />
            </LancamentoContaForm>
            <Button icon={Trash2} />

          </Table.Td>
        </Table.Tr>
      ))}

    </Table.Root>
  )
}