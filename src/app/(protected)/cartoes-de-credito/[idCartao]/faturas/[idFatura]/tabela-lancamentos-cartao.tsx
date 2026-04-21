"use client";

import Modal from "@/components/modal";
import { Button } from "@/components/primitives/button";
import { Table } from "@/components/primitives/table";
import Text from "@/components/primitives/text";
import TagsPopover from "@/components/tags-popover";
import { toast } from "@/components/toast";
import {
  DADOS_CONFIGURACAO_QUERY_KEY,
  LANCAMENTOS_CARTAO_QUERY_KEY,
} from "@/helpers/query-keys-helper";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { toBrDate, toCurrency } from "@/helpers/string-helper";
import { lancamentoCartaoService } from "@/services/lancamento-cartao-service";
import ApiError from "@/types/application-error";
import { StatusPagamento } from "@/types/enum/status-pagamento";
import { TipoCategoria } from "@/types/enum/tipo-categoria";
import { LancamentoCartao } from "@/types/lancamento-cartao";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { History, Pencil, Trash2 } from "lucide-react";
import { ReactNode, useState } from "react";
import LancamentoCartaoForm from "./lancamento-cartao-form";

type TabelaLancamentosCartaoProps = {
  lancamentos: LancamentoCartao[];
};

export default function TabelaLancamentosCartao({ lancamentos }: Readonly<TabelaLancamentosCartaoProps>) {
  const dadosCabecalho = ["Data", "Categoria", "Descrição", "Valor", "Ações"];
  const [lancamentoParaDeletar, setLancamentoParaDeletar] = useState<LancamentoCartao | null>(null);
  const queryClient = useQueryClient();

  const deleteLancamentoMutation = useMutation({
    mutationFn: async (idLancamento: LancamentoCartao["uuid"]) => {
      return lancamentoCartaoService.deletar(idLancamento);
    },
    onSuccess: () => {
      toast.success("Lançamento excluído com sucesso!");

      void Promise.all([
        queryClient.invalidateQueries({ queryKey: [LANCAMENTOS_CARTAO_QUERY_KEY] }),
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
    setLancamentoParaDeletar(null);
  };

  function canDeleteLancamento(lancamento: LancamentoCartao) {
    if (lancamento.isParcelado) {
      const parcela = lancamento.parcelas.find((parcela) => parcela.idParcela === lancamento.uuid);
      return parcela?.numeroDaParcela === 1;
    }

    return true;
  };

  function canAnteciparParcelas(lancamento: LancamentoCartao) {
    if (lancamento.isParcelado) {
      return lancamento.parcelas.some((parcela) =>
        parcela.idParcela !== lancamento.uuid && parcela.status !== StatusPagamento.PAGO
      );
    }

    return false;
  };

  return (
    <Table.Root theadData={dadosCabecalho}>
      {lancamentos.map((lancamento) => (
        <Table.Tr key={lancamento.uuid} className="text-sm md:text-base font-semibold">
          <Table.Td>{toBrDate(lancamento.data)}</Table.Td>

          <Table.Td>{lancamento.categoria.descricao}</Table.Td>

          <Table.Td>
            <span className="inline-flex items-center gap-1.5">
              {lancamento.descricao}
              <TagsPopover tags={lancamento.tags} />
            </span>
          </Table.Td>

          <Table.Td
            className={lancamento.categoria.tipo === TipoCategoria.ENTRADA ? "text-positive" : "text-negative"}
          >
            {toCurrency(lancamento.valor)}
          </Table.Td>

          <Table.Td className="flex items-center gap-2">
            <LancamentoCartaoForm lancamentoCartao={lancamento}>
              <Button
                disabled={lancamento.isParcelado}
                icon={Pencil}
              />
            </LancamentoCartaoForm>

            <Button
              icon={Trash2}
              disabled={!canDeleteLancamento(lancamento)}
              onClick={() => setLancamentoParaDeletar(lancamento)}
            />

            <Button
              icon={History}
              disabled={!canAnteciparParcelas(lancamento)}
              onClick={() => null}
            />
          </Table.Td>
        </Table.Tr>
      ))}

      {lancamentoParaDeletar && (
        <ModalConfirmacaoDelete
          isOpen={true}
          lancamento={lancamentoParaDeletar}
          isLoading={deleteLancamentoMutation.isPending}
          onOpenChange={(open) => { if (!open) setLancamentoParaDeletar(null); }}
          onClickConfirmacao={() => void handleDeleteLancamento(lancamentoParaDeletar.uuid)}
        />
      )}
    </Table.Root>
  );
}

interface ModalConfirmacaoDeleteProps {
  lancamento: LancamentoCartao;
  trigger?: ReactNode;
  isOpen: boolean;
  isLoading: boolean;
  onOpenChange: (open: boolean | null) => void;
  onClickConfirmacao: () => void;
}

function ModalConfirmacaoDelete({
  lancamento,
  trigger,
  isOpen,
  isLoading,
  onOpenChange,
  onClickConfirmacao,
}: ModalConfirmacaoDeleteProps) {
  return (
    <Modal
      open={isOpen}
      onOpenChange={onOpenChange}
      title="Excluir Lançamento"
      trigger={trigger}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col">
          <Text variant="paragraph-medium" className="mb-2">
            Tem certeza que deseja excluir este lançamento?
          </Text>
          <Text><strong>Descrição:</strong> {lancamento.descricao}</Text>
          <Text><strong>Valor:</strong> {toCurrency(lancamento.valor)}</Text>
        </div>

        {lancamento.isParcelado && lancamento.parcelas.length > 0 && (
          <Text className="text-center mb-2">Ao confirmar todas as parcelas serão excluídas.</Text>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="cancel" onClick={() => onOpenChange(null)}>
            Cancelar
          </Button>
          <Button isLoading={isLoading} onClick={onClickConfirmacao}>
            Confirmar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
