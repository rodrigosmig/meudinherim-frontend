"use client";

import LancamentoContaForm from "@/app/(protected)/contas-bancarias/[idConta]/lancamentos/lancamento-conta-form";
import Modal from "@/components/modal";
import { Button } from '@/components/primitives/button';
import { Table } from '@/components/primitives/table';
import Text from "@/components/primitives/text";
import TagsPopover from "@/components/tags-popover";
import { toast } from "@/components/toast";
import { isContaAPagar, isPagamentoContaAgendada } from "@/helpers/conta-agendada-helper";
import { keysToInvalidateForCancelarLancamentoConta, keysToInvalidateForLancamentoConta } from "@/helpers/query-keys-helper";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { toBrDate, toCurrency } from '@/helpers/string-helper';
import { contasAPagarService } from "@/services/contas-a-pagar-service";
import { contasAReceberService } from "@/services/contas-a-receber-service";
import { lancamentoContaService } from "@/services/lancamento-conta-service";
import ApiError from "@/types/application-error";
import { TipoCategoria } from '@/types/enum/tipo-categoria';
import { LancamentoConta } from '@/types/lancamento-conta';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BanknoteX, Pencil, Trash2 } from 'lucide-react';
import { ReactNode, useState } from "react";

type TabelaLancamentosProps = {
  lancamentos: LancamentoConta[];
}

export default function TabelaLancamentosConta({ lancamentos }: Readonly<TabelaLancamentosProps>) {
  const dadosCabecalho = ["Data", "Categoria", "Descrição", "Valor", "Ações"];
  const [lancamentoParaDeletar, setLancamentoParaDeletar] = useState<LancamentoConta | null>(null);
  const [lancamentoParaCancelar, setLancamentoParaCancelar] = useState<LancamentoConta | null>(null);
  const queryClient = useQueryClient();

  const deleteLancamentoMutation = useMutation({
    mutationFn: async (idLancamento: LancamentoConta["uuid"]) => {
      return lancamentoContaService.deletar(idLancamento);
    },
    onSuccess: () => {
      toast.success("Lançamento excluído com sucesso!");
      setLancamentoParaDeletar(null);

      void Promise.all(
        keysToInvalidateForLancamentoConta.map((key) =>
          queryClient.invalidateQueries({ queryKey: [key] }),
        ),
      );
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toast.error(error.apiMessage.descricao);
        return;
      }

      toast.error(DEFAULT_ERROR_MESSAGE);
    },
  });

  const cancelarPagamentoContaAPagarMutation = useMutation({
    mutationFn: async ({ idContaAPagar, idParcela }: { idContaAPagar: string, idParcela: string }) => {
      return contasAPagarService.cancelarPagamento(idContaAPagar, idParcela);
    },
    onSuccess: () => {
      toast.success("Pagamento cancelado com sucesso!");
      setLancamentoParaCancelar(null);

      void Promise.all(
        keysToInvalidateForCancelarLancamentoConta.map((key) =>
          queryClient.invalidateQueries({ queryKey: [key] }),
        ),
      );
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toast.error(error.apiMessage.descricao);
        return;
      }

      toast.error(DEFAULT_ERROR_MESSAGE);
    },
  });

  const cancelarPagamentoContaAReceberMutation = useMutation({
    mutationFn: async ({ idContaAReceber, idParcela }: { idContaAReceber: string, idParcela: string }) => {
      return contasAReceberService.cancelarRecebimento(idContaAReceber, idParcela);
    },
    onSuccess: () => {
      toast.success("Recebimento cancelado com sucesso!");
      setLancamentoParaCancelar(null);

      void Promise.all(
        keysToInvalidateForCancelarLancamentoConta.map((key) =>
          queryClient.invalidateQueries({ queryKey: [key] }),
        ),
      );
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toast.error(error.apiMessage.descricao);
        return;
      }

      toast.error(DEFAULT_ERROR_MESSAGE);
    },
  });

  const handleDeleteLancamento = (id: string) => {
    deleteLancamentoMutation.mutate(id);
  }

  const handleCancelarPagamentoContaAgendada = (lancamento: LancamentoConta) => {
    if (isContaAPagar(lancamento)) {
      if (lancamento.contaAgendada) {
        cancelarPagamentoContaAPagarMutation.mutate({
          idContaAPagar: lancamento.contaAgendada.uuid,
          idParcela: "",
        });
        return;
      }

      if (lancamento.parcela) {
        cancelarPagamentoContaAPagarMutation.mutate({
          idContaAPagar: lancamento.parcela.idContaAgendada,
          idParcela: lancamento.parcela.idParcela,
        });
        return;
      }
    }

    if (lancamento.contaAgendada) {
      cancelarPagamentoContaAReceberMutation.mutate({
        idContaAReceber: lancamento.contaAgendada.uuid,
        idParcela: "",
      });
      return;
    }

    if (lancamento.parcela) {
      cancelarPagamentoContaAReceberMutation.mutate({
        idContaAReceber: lancamento.parcela.idContaAgendada,
        idParcela: lancamento.parcela.idParcela,
      });
      return;
    }
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

          <Table.Td className="flex items-center gap-2">
            <LancamentoContaForm lancamentoConta={lancamento}>
              <Button disabled={isPagamentoContaAgendada(lancamento)} icon={Pencil} />
            </LancamentoContaForm>

            <Button
              disabled={isPagamentoContaAgendada(lancamento)}
              icon={Trash2}
              onClick={() => setLancamentoParaDeletar(lancamento)}
            />

            <Button
              disabled={!isPagamentoContaAgendada(lancamento)}
              icon={BanknoteX}
              onClick={() => setLancamentoParaCancelar(lancamento)}
            />

          </Table.Td>
        </Table.Tr>
      ))}

      {lancamentoParaDeletar && (
        <ModalConfirmacao
          isOpen={true}
          lancamento={lancamentoParaDeletar}
          isLoading={deleteLancamentoMutation.isPending}
          onOpenChange={(open) => { if (!open) setLancamentoParaDeletar(null); }}
          onClickConfirmacao={() => void handleDeleteLancamento(lancamentoParaDeletar.uuid)}
        />
      )}

      {lancamentoParaCancelar && (
        <ModalConfirmacao
          isOpen={true}
          lancamento={lancamentoParaCancelar}
          isLoading={cancelarPagamentoContaAPagarMutation.isPending || cancelarPagamentoContaAReceberMutation.isPending}
          onOpenChange={(open) => { if (!open) setLancamentoParaCancelar(null); }}
          onClickConfirmacao={handleCancelarPagamentoContaAgendada}
        />
      )}
    </Table.Root>
  )
}

interface ModalConfirmacaoProps {
  lancamento: LancamentoConta;
  trigger?: ReactNode;
  isOpen: boolean;
  isLoading: boolean;
  onOpenChange: (open: boolean | null) => void;
  onClickConfirmacao: (lancamento: LancamentoConta) => void;
}

function ModalConfirmacao({
  lancamento,
  trigger,
  isOpen,
  isLoading,
  onOpenChange,
  onClickConfirmacao
}: ModalConfirmacaoProps) {
  const isContaAgendada = isPagamentoContaAgendada(lancamento);
  const isContaAgendadaAPagar = isContaAPagar(lancamento);
  const title = !isContaAgendada ? "Excluir Lançamento" : isContaAgendadaAPagar ? "Cancelar Pagamento" : "Cancelar Recebimento";
  const lancamentoMessage = "Tem certeza que deseja excluir este lançamento?";
  const pagamentoMessage = `Tem certeza que deseja cancelar este ${isContaAgendadaAPagar ? "pagamento" : "recebimento"}?`;

  return (
    <Modal
      open={isOpen}
      onOpenChange={onOpenChange}
      title={title}
      trigger={trigger}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col">
          <Text variant="paragraph-medium" className="mb-2">{isContaAgendada ? pagamentoMessage : lancamentoMessage}</Text>
          <Text><strong>Descrição:</strong> {lancamento.descricao}</Text>
          <Text><strong>Valor:</strong> {toCurrency(lancamento.valor)}</Text>

        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="cancel"
            onClick={() => onOpenChange(null)}
          >
            Cancelar
          </Button>
          <Button
            isLoading={isLoading}
            onClick={() => onClickConfirmacao(lancamento)}>
            Confirmar
          </Button>
        </div>
      </div>
    </Modal>
  )
}