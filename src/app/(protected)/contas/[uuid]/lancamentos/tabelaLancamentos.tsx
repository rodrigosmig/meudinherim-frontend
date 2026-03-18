import { Button } from '@/components/primitives/button';
import { Table } from '@/components/primitives/table';
import { toBrDate, toCurrency } from '@/helpers/string-helper';
import { LancamentoConta } from '@/types/lancamento-conta';
import { Pencil, Trash2 } from 'lucide-react';

type TabelaLancamentosProps = {
  lancamentos: LancamentoConta[];
}

export default function TabelaLancamentos({ lancamentos }: TabelaLancamentosProps) {
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
            {lancamento.descricao}
          </Table.Td>

          <Table.Td>
            {toCurrency(lancamento.valor)}
          </Table.Td>

          <Table.Td className="flex items-center justify-end gap-2">
            <Button icon={Pencil} tooltip="Editar" />
            <Button icon={Trash2} tooltip="Remover" />

          </Table.Td>
        </Table.Tr>
      ))}

    </Table.Root>
  )
}