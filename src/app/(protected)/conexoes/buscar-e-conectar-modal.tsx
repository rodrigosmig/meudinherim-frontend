"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, UserPlus } from "lucide-react";
import Modal from "@/components/modal";
import { Button } from "@/components/primitives/button";
import { Input } from "@/components/primitives/input";
import { toast } from "@/components/toast";
import { useBuscarUsuarios } from "@/hooks/use-buscar-usuarios";
import { keysToInvalidateForConexao } from "@/helpers/query-keys-helper";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { conexoesService } from "@/services/conexoes-service";
import ApiError from "@/types/application-error";
import { Usuario } from "@/types/conexao";

interface BuscarEConectarModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BuscarEConectarModal({ open, onOpenChange }: BuscarEConectarModalProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [search]);

  const { data: resultados, isLoading: buscando } = useBuscarUsuarios(debouncedSearch);

  const mutation = useMutation({
    mutationFn: (id: string) => conexoesService.enviarSolicitacao({ idDestinatario: id }),
    onSuccess: () => {
      toast.success("Solicitação enviada!");
      void Promise.all(
        keysToInvalidateForConexao.map((key) =>
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

  function handleOpenChange(value: boolean) {
    if (!value) {
      setSearch("");
    }
    onOpenChange(value);
  }

  return (
    <Modal title="Buscar contatos" open={open} onOpenChange={handleOpenChange}>
      <div className="flex flex-col gap-4">
        <Input
          icon={Search}
          placeholder="Buscar por nome ou email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex flex-col gap-2">
          {search.length < 2 && (
            <p className="text-sm text-gray-500 text-center py-6">
              Digite pelo menos 2 caracteres para buscar
            </p>
          )}

          {search.length >= 2 && buscando && (
            <p className="text-sm text-gray-400 text-center py-6">Buscando...</p>
          )}

          {resultados?.length === 0 && debouncedSearch.length >= 2 && !buscando && (
            <p className="text-sm text-gray-400 text-center py-6">
              Nenhum usuário encontrado
            </p>
          )}

          {!buscando && resultados && resultados.length > 0 && (
            <ul className="flex flex-col gap-2">
              {resultados.map((usuario: Usuario) => (
                <li
                  key={usuario.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-default-border bg-gray-800/40 px-4 py-3"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-gray-200 truncate">
                      {usuario.nome}
                    </span>
                    <span className="text-xs text-gray-500 truncate">{usuario.email}</span>
                  </div>

                  <Button
                    icon={UserPlus}
                    variant="primary"
                    disabled={mutation.isPending}
                    onClick={() => mutation.mutate(usuario.id)}
                  >
                    Conectar
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  );
}
