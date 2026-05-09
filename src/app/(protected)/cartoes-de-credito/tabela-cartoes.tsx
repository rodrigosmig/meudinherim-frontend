"use client";

import Modal from "@/components/modal";
import { Button } from "@/components/primitives/button";
import { Table } from "@/components/primitives/table";
import Text from "@/components/primitives/text";
import { toast } from "@/components/toast";
import { keysToInvalidateForCartao } from "@/helpers/query-keys-helper";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { toCurrency } from "@/helpers/string-helper";
import { Urls } from "@/helpers/urls";
import { cartoesService } from "@/services/cartoes-service";
import ApiError from "@/types/application-error";
import { Cartao } from "@/types/cartao";
import { Status } from "@/types/enum/status";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CircleCheck, CircleX, FileText, Pencil } from "lucide-react";
import Link from "next/link";
import { ReactNode, useState } from "react";
import CartaoForm from "./cartao-form";

const CABECALHO = ["Nome", "Vencimento", "Fechamento", "Limite", "Saldo", "Ações"];

type TabelaCartoesProps = {
  cartoes: Cartao[];
};

function useInvalidarCartoes() {
  const queryClient = useQueryClient();
  return () =>
    void Promise.all(
      keysToInvalidateForCartao.map((key) =>
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

export default function TabelaCartoes({ cartoes }: Readonly<TabelaCartoesProps>) {
  const [cartaoParaAlterarStatus, setCartaoParaAlterarStatus] = useState<Cartao | null>(null);
  const invalidar = useInvalidarCartoes();

  const ativarMutation = useMutation({
    mutationFn: (id: string) => cartoesService.ativar(id),
    onSuccess: () => {
      toast.success("Cartão ativado com sucesso!");
      setCartaoParaAlterarStatus(null);
      invalidar();
    },
    onError: handleMutationError,
  });

  const desativarMutation = useMutation({
    mutationFn: (id: string) => cartoesService.desativar(id),
    onSuccess: () => {
      toast.success("Cartão desativado com sucesso!");
      setCartaoParaAlterarStatus(null);
      invalidar();
    },
    onError: handleMutationError,
  });

  function handleConfirmarAlterarStatus() {
    if (!cartaoParaAlterarStatus) return;
    if (cartaoParaAlterarStatus.status === Status.ATIVO) {
      desativarMutation.mutate(cartaoParaAlterarStatus.uuid);
    } else {
      ativarMutation.mutate(cartaoParaAlterarStatus.uuid);
    }
  }

  return (
    <Table.Root theadData={CABECALHO}>
      {cartoes.map((cartao) => {
        const isAtivo = cartao.status === Status.ATIVO;
        return (
          <Table.Tr key={cartao.uuid} className="text-sm md:text-base font-semibold">
            <Table.Td>{cartao.nome}</Table.Td>
            <Table.Td>Dia {cartao.diaVencimento}</Table.Td>
            <Table.Td>Dia {cartao.diaFechamento}</Table.Td>
            <Table.Td>{toCurrency(cartao.limiteCredito)}</Table.Td>
            <Table.Td className={cartao.saldo >= 0 ? "text-positive" : "text-negative"}>
              {toCurrency(cartao.saldo)}
            </Table.Td>

            <Table.Td className="flex items-center gap-2">
              <CartaoForm cartao={cartao}>
                <Button icon={Pencil} />
              </CartaoForm>

              <Button
                icon={isAtivo ? CircleX : CircleCheck}
                onClick={() => setCartaoParaAlterarStatus(cartao)}
              />

              <Link href={`${Urls.CARTOES_DE_CREDITO}/${cartao.uuid}`}>
                <Button
                  icon={FileText}
                />
              </Link>
            </Table.Td>
          </Table.Tr>
        );
      })}

      {cartaoParaAlterarStatus && (
        <ModalConfirmacao
          isOpen={true}
          title={cartaoParaAlterarStatus.status === Status.ATIVO ? "Desativar Cartão" : "Ativar Cartão"}
          message={`Tem certeza que deseja ${cartaoParaAlterarStatus.status === Status.ATIVO ? "desativar" : "ativar"} o cartão "${cartaoParaAlterarStatus.nome}"?`}
          isLoading={ativarMutation.isPending || desativarMutation.isPending}
          onOpenChange={(open) => { if (!open) setCartaoParaAlterarStatus(null); }}
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
