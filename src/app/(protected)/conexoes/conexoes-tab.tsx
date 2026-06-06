"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, UserMinus } from "lucide-react";
import { ReactNode, useState } from "react";
import Modal from "@/components/modal";
import { Button } from "@/components/primitives/button";
import QueryListState from "@/components/primitives/query-list-state";
import Text from "@/components/primitives/text";
import { toast } from "@/components/toast";
import { useConexoes } from "@/hooks/use-conexoes";
import { CONEXOES_QUERY_KEY } from "@/helpers/query-keys-helper";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { conexoesService } from "@/services/conexoes-service";
import ApiError from "@/types/application-error";
import { StatusConexao } from "@/types/enum/status-conexao";

interface ConexoesTabProps {
  onBuscarContatos: () => void;
}

export default function ConexoesTab({ onBuscarContatos }: ConexoesTabProps) {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useConexoes();
  const [conexaoParaRemover, setConexaoParaRemover] = useState<{ uuid: string; nome: string } | null>(null);

  const conexoes = (data ?? []).filter(
    (c) => c.status === StatusConexao.ACEITA || c.status === StatusConexao.PENDENTE
  );

  const mutation = useMutation({
    mutationFn: (uuid: string) => conexoesService.remover(uuid),
    onSuccess: () => {
      toast.success("Conexão removida");
      setConexaoParaRemover(null);
      void queryClient.invalidateQueries({ queryKey: [CONEXOES_QUERY_KEY] });
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toast.error(error.apiMessage.descricao);
        return;
      }
      toast.error(DEFAULT_ERROR_MESSAGE);
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button icon={Plus} onClick={onBuscarContatos}>
          Buscar contatos
        </Button>
      </div>

      <QueryListState
        isLoading={isLoading}
        isError={isError}
        isEmpty={conexoes.length === 0}
        emptyMessage="Você ainda não tem conexões ativas."
        onRetry={() => refetch()}
      >
        <ul className="flex flex-col gap-2">
          {conexoes.map((c) => (
            <li
              key={c.uuid}
              className="flex items-center justify-between gap-4 rounded-lg border border-default-border bg-gray-800/40 px-4 py-3"
            >
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-gray-200 truncate">
                  {c.usuarioConexao.nome}
                </span>
                <span className="text-xs text-gray-500 truncate">
                  {c.usuarioConexao.email}
                </span>
              </div>

              {c.status === StatusConexao.ACEITA ? (
                <Button
                  icon={UserMinus}
                  variant="cancel"
                  disabled={mutation.isPending}
                  onClick={() => setConexaoParaRemover({ uuid: c.uuid, nome: c.usuarioConexao.nome })}
                >
                  Remover
                </Button>
              ) : (
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-500/15 text-yellow-400 shrink-0">
                  Aguardando confirmação
                </span>
              )}
            </li>
          ))}
        </ul>
      </QueryListState>

      {conexaoParaRemover && (
        <ModalConfirmacao
          isOpen={true}
          title="Remover Conexão"
          message={`Tem certeza que deseja remover a conexão com ${conexaoParaRemover.nome}?`}
          isLoading={mutation.isPending}
          onOpenChange={(open) => { if (!open) setConexaoParaRemover(null); }}
          onConfirmar={() => mutation.mutate(conexaoParaRemover.uuid)}
        />
      )}
    </div>
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
