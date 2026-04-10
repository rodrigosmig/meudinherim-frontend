"use client";

import LancamentoContaForm from "@/app/(protected)/contas-bancarias/[uuid]/lancamentos/lancamento-conta-form";
import Modal from "@/components/modal";
import { Button } from '@/components/primitives/button';
import { Table } from '@/components/primitives/table';
import Text from "@/components/primitives/text";
import TagsPopover from "@/components/tags-popover";
import { DADOS_CONFIGURACAO_QUERY_KEY, LANCAMENTOS_CONTA_QUERY_KEY } from "@/helpers/query-keys-helper";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { toBrDate, toCurrency } from '@/helpers/string-helper';
import { lancamentoContaService } from "@/services/lancamento-conta-service";
import ApiError from "@/types/application-error";
import { TipoCategoria } from '@/types/enum/tipo-categoria';
import { LancamentoConta } from '@/types/lancamento-conta';
import { toast } from "@components/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from "react";

type TabelaLancamentosProps = {
  lancamentos: LancamentoConta[];
}

export default function TabelaLancamentosConta({ lancamentos }: Readonly<TabelaLancamentosProps>) {
  const dadosCabecalho = ["Data", "Categoria", "Descrição", "Valor", "Ações"];
  const [lancamentoModalAbertoUuid, setLancamentoModalAbertoUuid] = useState<LancamentoConta["uuid"] | null>(null);
  const queryClient = useQueryClient();

  const deleteLancamentoMutation = useMutation({
    mutationFn: async (idLancamento: LancamentoConta["uuid"]) => {
      return lancamentoContaService.deletar(idLancamento);
    },
    onSuccess: () => {
      toast.success("Lançamento excluído com sucesso!");

      void Promise.all([
        queryClient.invalidateQueries({ queryKey: [LANCAMENTOS_CONTA_QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: [DADOS_CONFIGURACAO_QUERY_KEY] }),
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
    setLancamentoModalAbertoUuid(null);
  }

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

            <Modal
              open={lancamentoModalAbertoUuid === lancamento.uuid}
              onOpenChange={(open) => setLancamentoModalAbertoUuid(open ? lancamento.uuid : null)}
              title="Excluir Lançamento"
              trigger={<Button icon={Trash2} />
              }
            >
              <div className="flex flex-col gap-3">
                <div className="flex flex-col">
                  <Text variant="paragraph-medium" className="mb-2">Tem certeza que deseja excluir este lançamento?</Text>
                  <Text><strong>Descrição:</strong> {lancamento.descricao}</Text>
                  <Text><strong>Valor:</strong> {toCurrency(lancamento.valor)}</Text>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="cancel" onClick={() => setLancamentoModalAbertoUuid(null)}>
                    Cancelar
                  </Button>
                  <Button
                    isLoading={deleteLancamentoMutation.isPending}
                    onClick={() => void handleDeleteLancamento(lancamento.uuid)}>
                    Excluir
                  </Button>
                </div>
              </div>
            </Modal>


          </Table.Td>
        </Table.Tr>
      ))}

    </Table.Root>
  )
}