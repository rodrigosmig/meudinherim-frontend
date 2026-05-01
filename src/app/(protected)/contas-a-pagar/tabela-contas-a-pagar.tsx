"use client";

import Modal from "@/components/modal";
import { Button } from "@/components/primitives/button";
import { Table } from "@/components/primitives/table";
import Text from "@/components/primitives/text";
import TagsPopover from "@/components/tags-popover";
import { toast } from "@/components/toast";
import { CONTAS_A_PAGAR_QUERY_KEY, keysToInvalidate } from "@/helpers/query-keys-helper";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { cn, toBrDate, toCurrency } from "@/helpers/string-helper";
import { contasAPagarService } from "@/services/contas-a-pagar-service";
import ApiError from "@/types/application-error";
import { ContaAgendada } from "@/types/conta-agendada";
import { Periodicidade } from "@/types/enum/periodicidade";
import { StatusPagamento } from "@/types/enum/status-pagamento";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BanknoteArrowDown, BanknoteX, Pencil, Trash2 } from "lucide-react";
import { ReactNode, useState } from "react";
import ContaAPagarForm from "./conta-a-pagar-form";
import PagarContaAPagarForm from "./pagar-conta-a-pagar-form";

const CABECALHO = ["Vencimento", "Categoria", "Descrição", "Valor", "Status", "Recorrência", "Ações"];

const STATUS_CONFIG: Record<StatusPagamento, { label: string; className: string }> = {
  [StatusPagamento.ABERTO]: { label: "Aberto", className: "bg-yellow-900/40 text-yellow-400" },
  [StatusPagamento.PAGO]: { label: "Pago", className: "bg-green-900/40 text-green-400" },
  [StatusPagamento.ANTECIPADO]: { label: "Antecipado", className: "bg-blue-900/40 text-blue-400" },
};

const PERIODICIDADE_LABEL: Record<Periodicidade, string> = {
  [Periodicidade.NENHUMA]: "Única",
  [Periodicidade.MENSAL]: "Mensal",
  [Periodicidade.TRIMESTRAL]: "Trimestral",
  [Periodicidade.SEMESTRAL]: "Semestral",
  [Periodicidade.ANUAL]: "Anual",
};

type TabelaContasAPagarProps = {
  contas: ContaAgendada[];
};

function handleMutationError(error: unknown) {
  if (error instanceof ApiError) {
    toast.error(error.apiMessage.descricao);
    return;
  }
  toast.error(DEFAULT_ERROR_MESSAGE);
}

export default function TabelaContasAPagar({ contas }: Readonly<TabelaContasAPagarProps>) {
  const [contaParaDeletar, setContaParaDeletar] = useState<ContaAgendada | null>(null);
  const [contaParaCancelarPagamento, setContaParaCancelarPagamento] = useState<ContaAgendada | null>(null);
  const queryClient = useQueryClient();

  const deletarMutation = useMutation({
    mutationFn: (id: string) => contasAPagarService.deletar(id),
    onSuccess: () => {
      toast.success("Conta a pagar excluída com sucesso!");

      setContaParaDeletar(null);

      void Promise.all([
        queryClient.invalidateQueries({ queryKey: [CONTAS_A_PAGAR_QUERY_KEY] }),
      ]);
    },
    onError: handleMutationError,
  });

  const cancelarPagamentoMutation = useMutation({
    mutationFn: (conta: ContaAgendada) =>
      contasAPagarService.cancelarPagamento(conta.uuid, conta.dadosParcela?.idParcela),
    onSuccess: () => {
      toast.success("Pagamento cancelado com sucesso!");

      setContaParaCancelarPagamento(null);

      void Promise.all(
        keysToInvalidate.map((key) =>
          queryClient.invalidateQueries({ queryKey: [key] }),
        ),
      );
    },
    onError: handleMutationError,
  });

  return (
    <Table.Root theadData={CABECALHO}>
      {contas.map((contaAPagar) => {
        const isAberto = contaAPagar.status === StatusPagamento.ABERTO;
        const statusConfig = STATUS_CONFIG[contaAPagar.status];

        return (
          <Table.Tr key={contaAPagar.uuid} className="text-sm md:text-base font-semibold">
            <Table.Td>{toBrDate(contaAPagar.dataVencimento)}</Table.Td>
            <Table.Td>{contaAPagar.categoria.descricao}</Table.Td>
            <Table.Td>
              <span className="flex flex-col">
                <span className="inline-flex items-center gap-1.5">
                  {contaAPagar.descricao}
                  <TagsPopover tags={contaAPagar.tags} />
                </span>
                {contaAPagar.parcelado && contaAPagar.dadosParcela && (
                  <span className="text-xs text-gray-400 font-normal">
                    Parcela {contaAPagar.dadosParcela.numeroDaParcela}/{contaAPagar.dadosParcela.totalDeParcelas}
                  </span>
                )}
              </span>
            </Table.Td>
            <Table.Td className="text-negative">{toCurrency(contaAPagar.valor)}</Table.Td>
            <Table.Td>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                  statusConfig?.className ?? "bg-gray-700 text-gray-400",
                )}
              >
                {statusConfig?.label ?? contaAPagar.status}
              </span>
            </Table.Td>
            <Table.Td>
              {contaAPagar.parcelado
                ? "Parcelado"
                : PERIODICIDADE_LABEL[contaAPagar.periodicidade] ?? contaAPagar.periodicidade
              }
            </Table.Td>

            <Table.Td className="flex items-center gap-2">
              <ContaAPagarForm contaAPagar={contaAPagar}>
                <Button
                  icon={Pencil}
                  disabled={(contaAPagar.parcelado && contaAPagar.dadosParcela?.numeroDaParcela !== 1) || !isAberto}
                />
              </ContaAPagarForm>

              <Button
                icon={Trash2}
                onClick={() => setContaParaDeletar(contaAPagar)}
                disabled={(contaAPagar.parcelado && contaAPagar.dadosParcela?.numeroDaParcela !== 1) || !isAberto}
              />

              {isAberto ? (
                <PagarContaAPagarForm contaAPagar={contaAPagar}>
                  <Button icon={BanknoteArrowDown} />
                </PagarContaAPagarForm>
              ) : (
                <Button
                  icon={BanknoteX}
                  onClick={() => setContaParaCancelarPagamento(contaAPagar)}
                />
              )}
            </Table.Td>
          </Table.Tr>
        );
      })}

      {contaParaDeletar && (
        <ModalConfirmacao
          isOpen={true}
          title="Excluir Conta a Pagar"
          message={`Tem certeza que deseja excluir "${contaParaDeletar.descricao}"?`}
          isLoading={deletarMutation.isPending}
          onOpenChange={(open) => { if (!open) setContaParaDeletar(null); }}
          onConfirmar={() => deletarMutation.mutate(contaParaDeletar.uuid)}
        />
      )}

      {contaParaCancelarPagamento && (
        <ModalConfirmacao
          isOpen={true}
          title="Cancelar Pagamento"
          message={`Tem certeza que deseja cancelar o pagamento de "${contaParaCancelarPagamento.descricao}"?`}
          details={
            <div className="flex flex-col gap-0.5 mt-1">
              <Text><strong>Valor:</strong> {toCurrency(contaParaCancelarPagamento.valor)}</Text>
              <Text><strong>Vencimento:</strong> {toBrDate(contaParaCancelarPagamento.dataVencimento)}</Text>
            </div>
          }
          isLoading={cancelarPagamentoMutation.isPending}
          onOpenChange={(open) => { if (!open) setContaParaCancelarPagamento(null); }}
          onConfirmar={() => cancelarPagamentoMutation.mutate(contaParaCancelarPagamento)}
        />
      )}
    </Table.Root>
  );
}

interface ModalConfirmacaoProps {
  title: string;
  message: string;
  details?: ReactNode;
  trigger?: ReactNode;
  isOpen: boolean;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmar: () => void;
}

function ModalConfirmacao({ title, message, details, trigger, isOpen, isLoading, onOpenChange, onConfirmar }: ModalConfirmacaoProps) {
  return (
    <Modal open={isOpen} onOpenChange={onOpenChange} title={title} trigger={trigger}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <Text variant="paragraph-medium">{message}</Text>
          {details}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="cancel" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button isLoading={isLoading} onClick={onConfirmar}>Confirmar</Button>
        </div>
      </div>
    </Modal>
  );
}
