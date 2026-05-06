"use client";

import Modal from "@/components/modal";
import { Button } from "@/components/primitives/button";
import { Table } from "@/components/primitives/table";
import Text from "@/components/primitives/text";
import TagsPopover from "@/components/tags-popover";
import { toast } from "@/components/toast";
import { CONTAS_A_RECEBER_QUERY_KEY, keysToInvalidateForConta } from "@/helpers/query-keys-helper";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { cn, toBrDate, toCurrency } from "@/helpers/string-helper";
import { contasAReceberService } from "@/services/contas-a-receber-service";
import ApiError from "@/types/application-error";
import { ContaAgendada } from "@/types/conta-agendada";
import { Periodicidade } from "@/types/enum/periodicidade";
import { StatusContaAgendada } from "@/types/enum/status-conta-agendada";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BanknoteArrowUp, BanknoteX, Pencil, Trash2 } from "lucide-react";
import { ReactNode, useState } from "react";
import ContaAReceberForm from "./conta-a-receber-form";
import ReceberContaAReceberForm from "./receber-conta-a-receber-form";

const CABECALHO = ["Vencimento", "Categoria", "Descrição", "Valor", "Status", "Recorrência", "Ações"];

const STATUS_CONFIG: Record<StatusContaAgendada, { label: string; className: string }> = {
  [StatusContaAgendada.ABERTO]: { label: "Aberto", className: "bg-yellow-900/40 text-yellow-400" },
  [StatusContaAgendada.PAGO]: { label: "Recebido", className: "bg-green-900/40 text-green-400" },
};

const PERIODICIDADE_LABEL: Record<Periodicidade, string> = {
  [Periodicidade.NENHUMA]: "Única",
  [Periodicidade.MENSAL]: "Mensal",
  [Periodicidade.TRIMESTRAL]: "Trimestral",
  [Periodicidade.SEMESTRAL]: "Semestral",
  [Periodicidade.ANUAL]: "Anual",
};

type TabelaContasAReceberProps = {
  contas: ContaAgendada[];
};

function handleMutationError(error: unknown) {
  if (error instanceof ApiError) {
    toast.error(error.apiMessage.descricao);
    return;
  }
  toast.error(DEFAULT_ERROR_MESSAGE);
}

export default function TabelaContasAReceber({ contas }: Readonly<TabelaContasAReceberProps>) {
  const [contaParaDeletar, setContaParaDeletar] = useState<ContaAgendada | null>(null);
  const [contaParaCancelarRecebimento, setContaParaCancelarRecebimento] = useState<ContaAgendada | null>(null);
  const queryClient = useQueryClient();

  const deletarMutation = useMutation({
    mutationFn: (id: string) => contasAReceberService.deletar(id),
    onSuccess: () => {
      toast.success("Conta a receber excluída com sucesso!");
      setContaParaDeletar(null);
      void queryClient.invalidateQueries({ queryKey: [CONTAS_A_RECEBER_QUERY_KEY] });
    },
    onError: handleMutationError,
  });

  const cancelarRecebimentoMutation = useMutation({
    mutationFn: (conta: ContaAgendada) =>
      contasAReceberService.cancelarRecebimento(conta.uuid, conta.dadosParcela?.idParcela),
    onSuccess: () => {
      toast.success("Recebimento cancelado com sucesso!");
      setContaParaCancelarRecebimento(null);
      void Promise.all(
        keysToInvalidateForConta.map((key) =>
          queryClient.invalidateQueries({ queryKey: [key] }),
        ),
      );
    },
    onError: handleMutationError,
  });

  return (
    <Table.Root theadData={CABECALHO}>
      {contas.map((contaAReceber) => {
        const isAberto = contaAReceber.status === StatusContaAgendada.ABERTO;
        const statusConfig = STATUS_CONFIG[contaAReceber.status];

        return (
          <Table.Tr key={contaAReceber.uuid} className="text-sm md:text-base font-semibold">
            <Table.Td>{toBrDate(contaAReceber.dataVencimento)}</Table.Td>
            <Table.Td>{contaAReceber.categoria.descricao}</Table.Td>
            <Table.Td>
              <span className="flex flex-col">
                <span className="inline-flex items-center gap-1.5">
                  {contaAReceber.descricao}
                  <TagsPopover tags={contaAReceber.tags} />
                </span>
                {contaAReceber.parcelado && contaAReceber.dadosParcela && (
                  <span className="text-xs text-gray-400 font-normal">
                    Parcela {contaAReceber.dadosParcela.numeroDaParcela}/{contaAReceber.dadosParcela.totalDeParcelas}
                  </span>
                )}
              </span>
            </Table.Td>
            <Table.Td className="text-positive">{toCurrency(contaAReceber.valor)}</Table.Td>
            <Table.Td>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                  statusConfig?.className ?? "bg-gray-700 text-gray-400",
                )}
              >
                {statusConfig?.label ?? contaAReceber.status}
              </span>
            </Table.Td>
            <Table.Td>
              {contaAReceber.parcelado
                ? "Parcelado"
                : PERIODICIDADE_LABEL[contaAReceber.periodicidade] ?? contaAReceber.periodicidade
              }
            </Table.Td>

            <Table.Td className="flex items-center gap-2">
              <ContaAReceberForm contaAReceber={contaAReceber}>
                <Button
                  icon={Pencil}
                  disabled={(contaAReceber.parcelado && contaAReceber.dadosParcela?.numeroDaParcela !== 1) || !isAberto}
                />
              </ContaAReceberForm>

              <Button
                icon={Trash2}
                onClick={() => setContaParaDeletar(contaAReceber)}
                disabled={(contaAReceber.parcelado && contaAReceber.dadosParcela?.numeroDaParcela !== 1) || !isAberto}
              />

              {isAberto ? (
                <ReceberContaAReceberForm contaAReceber={contaAReceber}>
                  <Button icon={BanknoteArrowUp} />
                </ReceberContaAReceberForm>
              ) : (
                <Button
                  icon={BanknoteX}
                  onClick={() => setContaParaCancelarRecebimento(contaAReceber)}
                />
              )}
            </Table.Td>
          </Table.Tr>
        );
      })}

      {contaParaDeletar && (
        <ModalConfirmacao
          isOpen={true}
          title="Excluir Conta a Receber"
          message={`Tem certeza que deseja excluir "${contaParaDeletar.descricao}"?`}
          isLoading={deletarMutation.isPending}
          onOpenChange={(open) => { if (!open) setContaParaDeletar(null); }}
          onConfirmar={() => deletarMutation.mutate(contaParaDeletar.uuid)}
        />
      )}

      {contaParaCancelarRecebimento && (
        <ModalConfirmacao
          isOpen={true}
          title="Cancelar Recebimento"
          message={`Tem certeza que deseja cancelar o recebimento de "${contaParaCancelarRecebimento.descricao}"?`}
          details={
            <div className="flex flex-col gap-0.5 mt-1">
              <Text><strong>Valor:</strong> {toCurrency(contaParaCancelarRecebimento.valor)}</Text>
              <Text><strong>Vencimento:</strong> {toBrDate(contaParaCancelarRecebimento.dataVencimento)}</Text>
            </div>
          }
          isLoading={cancelarRecebimentoMutation.isPending}
          onOpenChange={(open) => { if (!open) setContaParaCancelarRecebimento(null); }}
          onConfirmar={() => cancelarRecebimentoMutation.mutate(contaParaCancelarRecebimento)}
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
