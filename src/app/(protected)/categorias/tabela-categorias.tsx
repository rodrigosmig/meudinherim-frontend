"use client";

import Modal from "@/components/modal";
import { Button } from "@/components/primitives/button";
import { Table } from "@/components/primitives/table";
import Text from "@/components/primitives/text";
import { toast } from "@/components/toast";
import { CATEGORIAS_QUERY_KEY, DADOS_CONFIGURACAO_QUERY_KEY } from "@/helpers/query-keys-helper";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { categoriasService } from "@/services/categorias-service";
import ApiError from "@/types/application-error";
import { Categoria } from "@/types/categoria";
import { Status } from "@/types/enum/status";
import { TipoCategoria } from "@/types/enum/tipo-categoria";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CircleCheck, CircleX, Pencil, Trash2 } from "lucide-react";
import { ReactNode, useState } from "react";
import CategoriaForm from "./categoria-form";

const CABECALHO = ["Nome", "Tipo", "Exibir na Dashboard", "Ações"];

type TabelaCategoriasProps = {
  categorias: Categoria[];
};

function useInvalidarCategorias() {
  const queryClient = useQueryClient();
  return () =>
    void Promise.all([
      queryClient.invalidateQueries({ queryKey: [CATEGORIAS_QUERY_KEY] }),
      queryClient.invalidateQueries({ queryKey: [DADOS_CONFIGURACAO_QUERY_KEY] }),
    ]);
}

function handleMutationError(error: unknown) {
  if (error instanceof ApiError) {
    toast.error(error.apiMessage.descricao);
    return;
  }
  toast.error(DEFAULT_ERROR_MESSAGE);
}

export default function TabelaCategorias({ categorias }: Readonly<TabelaCategoriasProps>) {
  const [categoriaParaDeletar, setCategoriaParaDeletar] = useState<Categoria | null>(null);
  const [categoriaParaAlterarStatus, setCategoriaParaAlterarStatus] = useState<Categoria | null>(null);
  const invalidar = useInvalidarCategorias();

  const deletarMutation = useMutation({
    mutationFn: (id: string) => categoriasService.deletar(id),
    onSuccess: () => {
      toast.success("Categoria excluída com sucesso!");
      setCategoriaParaDeletar(null);
      invalidar();
    },
    onError: handleMutationError,
  });

  const ativarMutation = useMutation({
    mutationFn: (id: string) => categoriasService.ativar(id),
    onSuccess: () => {
      toast.success("Categoria ativada com sucesso!");
      setCategoriaParaAlterarStatus(null);
      invalidar();
    },
    onError: handleMutationError,
  });

  const desativarMutation = useMutation({
    mutationFn: (id: string) => categoriasService.desativar(id),
    onSuccess: () => {
      toast.success("Categoria desativada com sucesso!");
      setCategoriaParaAlterarStatus(null);
      invalidar();
    },
    onError: handleMutationError,
  });

  function handleConfirmarAlterarStatus() {
    if (!categoriaParaAlterarStatus) return;
    const isAtivo = categoriaParaAlterarStatus.status === Status.ATIVO;
    if (isAtivo) {
      desativarMutation.mutate(categoriaParaAlterarStatus.uuid);
    } else {
      ativarMutation.mutate(categoriaParaAlterarStatus.uuid);
    }
  }

  return (
    <Table.Root theadData={CABECALHO}>
      {categorias.map((categoria) => {
        const isAtivo = categoria.status === Status.ATIVO;
        return (
          <Table.Tr key={categoria.uuid} className="text-sm md:text-base font-semibold">
            <Table.Td>{categoria.nome}</Table.Td>

            <Table.Td>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${categoria.tipo === TipoCategoria.ENTRADA
                    ? "bg-green-900/40 text-green-400"
                    : "bg-red-900/40 text-red-400"
                  }`}
              >
                {categoria.tipo === TipoCategoria.ENTRADA ? "Entrada" : "Saída"}
              </span>
            </Table.Td>

            <Table.Td>{categoria.exibirNaDashboard ? "Sim" : "Não"}</Table.Td>

            <Table.Td className="flex items-center gap-2">
              <CategoriaForm categoria={categoria}>
                <Button icon={Pencil} />
              </CategoriaForm>

              <Button
                icon={Trash2}
                onClick={() => setCategoriaParaDeletar(categoria)}
              />

              <Button
                icon={isAtivo ? CircleX : CircleCheck}
                onClick={() => setCategoriaParaAlterarStatus(categoria)}
              />
            </Table.Td>
          </Table.Tr>
        );
      })}

      {categoriaParaDeletar && (
        <ModalConfirmacao
          isOpen={true}
          title="Excluir Categoria"
          message={`Tem certeza que deseja excluir a categoria "${categoriaParaDeletar.nome}"?`}
          isLoading={deletarMutation.isPending}
          onOpenChange={(open) => { if (!open) setCategoriaParaDeletar(null); }}
          onConfirmar={() => deletarMutation.mutate(categoriaParaDeletar.uuid)}
        />
      )}

      {categoriaParaAlterarStatus && (
        <ModalConfirmacao
          isOpen={true}
          title={categoriaParaAlterarStatus.status === Status.ATIVO ? "Desativar Categoria" : "Ativar Categoria"}
          message={`Tem certeza que deseja ${categoriaParaAlterarStatus.status === Status.ATIVO ? "desativar" : "ativar"} a categoria "${categoriaParaAlterarStatus.nome}"?`}
          isLoading={ativarMutation.isPending || desativarMutation.isPending}
          onOpenChange={(open) => { if (!open) setCategoriaParaAlterarStatus(null); }}
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
