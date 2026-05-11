"use client";

import Modal from "@/components/modal";
import { Button } from "@/components/primitives/button";
import { Table } from "@/components/primitives/table";
import Text from "@/components/primitives/text";
import { toast } from "@/components/toast";
import { keysToInvalidateForContaBancaria } from "@/helpers/query-keys-helper";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { toCurrency } from "@/helpers/string-helper";
import { Urls } from "@/helpers/urls";
import { contasService } from "@/services/contas-service";
import ApiError from "@/types/application-error";
import { Conta } from "@/types/contas";
import { Status } from "@/types/enum/status";
import { TipoConta } from "@/types/enum/tipo-conta";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BankIcon } from "@/components/bank-icon";
import { Banknote, CircleCheck, CircleX, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { ReactNode, useState } from "react";
import ContaForm from "./conta-form";

const CABECALHO = ["Nome", "Tipo", "Saldo", "Ações"];

const TIPO_LABEL: Record<TipoConta, string> = {
  [TipoConta.CONTA_CORRENTE]: "Conta Corrente",
  [TipoConta.POUPANCA]: "Poupança",
  [TipoConta.DINHEIRO]: "Dinheiro",
  [TipoConta.INVESTIMENTO]: "Investimento",
};

type TabelaContasProps = {
  contas: Conta[];
};

function useInvalidarContas() {
  const queryClient = useQueryClient();
  return () =>
    void Promise.all(
      keysToInvalidateForContaBancaria.map((key) =>
        queryClient.invalidateQueries({ queryKey: [key] }),
      ),
    );
}

function handleMutationError(error: unknown) {
  if (error instanceof ApiError) {
    toast.error(error.apiMessage.descricao);
    return;
  }
  toast.error(DEFAULT_ERROR_MESSAGE);
}

export default function TabelaContas({ contas }: Readonly<TabelaContasProps>) {
  const [contaParaDeletar, setContaParaDeletar] = useState<Conta | null>(null);
  const [contaParaAlterarStatus, setContaParaAlterarStatus] = useState<Conta | null>(null);
  const invalidar = useInvalidarContas();

  const deletarMutation = useMutation({
    mutationFn: (id: string) => contasService.deletar(id),
    onSuccess: () => {
      toast.success("Conta excluída com sucesso!");
      setContaParaDeletar(null);
      invalidar();
    },
    onError: handleMutationError,
  });

  const ativarMutation = useMutation({
    mutationFn: (id: string) => contasService.ativar(id),
    onSuccess: () => {
      toast.success("Conta ativada com sucesso!");
      setContaParaAlterarStatus(null);
      invalidar();
    },
    onError: handleMutationError,
  });

  const desativarMutation = useMutation({
    mutationFn: (id: string) => contasService.desativar(id),
    onSuccess: () => {
      toast.success("Conta desativada com sucesso!");
      setContaParaAlterarStatus(null);
      invalidar();
    },
    onError: handleMutationError,
  });

  function handleConfirmarAlterarStatus() {
    if (!contaParaAlterarStatus) return;
    if (contaParaAlterarStatus.status === Status.ATIVO) {
      desativarMutation.mutate(contaParaAlterarStatus.uuid);
    } else {
      ativarMutation.mutate(contaParaAlterarStatus.uuid);
    }
  }

  return (
    <Table.Root theadData={CABECALHO}>
      {contas.map((conta) => {
        const isAtivo = conta.status === Status.ATIVO;
        return (
          <Table.Tr key={conta.uuid} className="text-sm md:text-base font-semibold">
            <Table.Td>
              <div className="flex items-center gap-2">
                <BankIcon icon={conta.icon} name={conta.nome} size={28} className="rounded-lg" />
                {conta.nome}
              </div>
            </Table.Td>

            <Table.Td>
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-900/40 text-blue-400">
                {TIPO_LABEL[conta.tipo] ?? conta.tipo}
              </span>
            </Table.Td>

            <Table.Td className={conta.saldo >= 0 ? "text-positive" : "text-negative"}>
              {toCurrency(conta.saldo)}
            </Table.Td>

            <Table.Td className="flex items-center gap-2">
              <ContaForm conta={conta}>
                <Button icon={Pencil} tooltip="Editar" />
              </ContaForm>

              <Button
                icon={Trash2}
                tooltip="Excluir"
                onClick={() => setContaParaDeletar(conta)}
              />

              <Button
                icon={isAtivo ? CircleX : CircleCheck}
                tooltip={isAtivo ? "Desativar" : "Ativar"}
                onClick={() => setContaParaAlterarStatus(conta)}
              />

              <Link href={`${Urls.CONTAS_BANCARIAS}/${conta.uuid}/lancamentos`}>
                <Button icon={Banknote} tooltip="Ver lançamentos" />
              </Link>
            </Table.Td>
          </Table.Tr>
        );
      })}

      {contaParaDeletar && (
        <ModalConfirmacao
          isOpen={true}
          title="Excluir Conta"
          message={`Tem certeza que deseja excluir a conta "${contaParaDeletar.nome}"?`}
          isLoading={deletarMutation.isPending}
          onOpenChange={(open) => { if (!open) setContaParaDeletar(null); }}
          onConfirmar={() => deletarMutation.mutate(contaParaDeletar.uuid)}
        />
      )}

      {contaParaAlterarStatus && (
        <ModalConfirmacao
          isOpen={true}
          title={contaParaAlterarStatus.status === Status.ATIVO ? "Desativar Conta" : "Ativar Conta"}
          message={`Tem certeza que deseja ${contaParaAlterarStatus.status === Status.ATIVO ? "desativar" : "ativar"} a conta "${contaParaAlterarStatus.nome}"?`}
          isLoading={ativarMutation.isPending || desativarMutation.isPending}
          onOpenChange={(open) => { if (!open) setContaParaAlterarStatus(null); }}
          onConfirmar={handleConfirmarAlterarStatus}
        />
      )}
    </Table.Root>
  );
}

interface ModalConfirmacaoProps {
  title: string;
  message: string;
  trigger?: ReactNode;
  isOpen: boolean;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmar: () => void;
}

function ModalConfirmacao({
  title,
  message,
  trigger,
  isOpen,
  isLoading,
  onOpenChange,
  onConfirmar,
}: ModalConfirmacaoProps) {
  return (
    <Modal open={isOpen} onOpenChange={onOpenChange} title={title} trigger={trigger}>
      <div className="flex flex-col gap-3">
        <Text variant="paragraph-medium">{message}</Text>

        <div className="flex justify-end gap-2">
          <Button variant="cancel" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button isLoading={isLoading} onClick={onConfirmar}>
            Confirmar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
