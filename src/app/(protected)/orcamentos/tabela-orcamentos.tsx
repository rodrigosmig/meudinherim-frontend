"use client";

import Modal from "@/components/modal";
import { Button } from "@/components/primitives/button";
import { Table } from "@/components/primitives/table";
import Text from "@/components/primitives/text";
import { toast } from "@/components/toast";
import { keysToInvalidateForCategoria } from "@/helpers/query-keys-helper";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { toCurrency } from "@/helpers/string-helper";
import { orcamentoService } from "@/services/orcamentos-service";
import ApiError from "@/types/application-error";
import type { Orcamento } from "@/types/orcamento";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { ReactNode, useState } from "react";
import OrcamentoForm from "./orcamento-form";

const CABECALHO = ["Categoria", "Valor", "Ações"];

function handleMutationError(error: unknown) {
  if (error instanceof ApiError) {
    toast.error(error.apiMessage.descricao);
    return;
  }
  toast.error(DEFAULT_ERROR_MESSAGE);
}

type TabelaOrcamentosProps = {
  orcamentos: Orcamento[];
};

export default function TabelaOrcamentos({ orcamentos }: Readonly<TabelaOrcamentosProps>) {
  const [orcamentoParaDeletar, setOrcamentoParaDeletar] = useState<Orcamento | null>(null);
  const queryClient = useQueryClient();

  const deletarMutation = useMutation({
    mutationFn: (id: string) => orcamentoService.deletar(id),
    onSuccess: () => {
      toast.success("Orçamento excluído com sucesso!");

      setOrcamentoParaDeletar(null);

      void Promise.all(
        keysToInvalidateForCategoria.map((key) =>
          queryClient.invalidateQueries({ queryKey: [key] }),
        ),
      );
    },
    onError: handleMutationError,
  });

  return (
    <Table.Root theadData={CABECALHO}>
      {orcamentos.map((orcamento) => (
        <Table.Tr key={orcamento.uuid} className="text-sm md:text-base font-semibold">
          <Table.Td>{orcamento.categoria.descricao}</Table.Td>
          <Table.Td>{toCurrency(orcamento.valor)}</Table.Td>

          <Table.Td className="flex items-center gap-2">
            <OrcamentoForm orcamento={orcamento}>
              <Button icon={Pencil} />
            </OrcamentoForm>

            <Button
              icon={Trash2}
              onClick={() => setOrcamentoParaDeletar(orcamento)}
            />
          </Table.Td>
        </Table.Tr>
      ))}

      {orcamentoParaDeletar && (
        <ModalConfirmacao
          isOpen={true}
          title="Excluir Orçamento"
          message={`Tem certeza que deseja excluir o orçamento de "${orcamentoParaDeletar.categoria.descricao}"?`}
          isLoading={deletarMutation.isPending}
          onOpenChange={(open) => { if (!open) setOrcamentoParaDeletar(null); }}
          onConfirmar={() => deletarMutation.mutate(orcamentoParaDeletar.uuid)}
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

function ModalConfirmacao({ title, message, trigger, isOpen, isLoading, onOpenChange, onConfirmar }: ModalConfirmacaoProps) {
  return (
    <Modal open={isOpen} onOpenChange={onOpenChange} title={title} trigger={trigger}>
      <div className="flex flex-col gap-3">
        <Text variant="paragraph-medium">{message}</Text>
        <div className="flex justify-end gap-2">
          <Button variant="cancel" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button isLoading={isLoading} onClick={onConfirmar}>Confirmar</Button>
        </div>
      </div>
    </Modal>
  );
}
