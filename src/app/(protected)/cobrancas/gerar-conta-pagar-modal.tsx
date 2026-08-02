"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import Modal from "@/components/modal";
import { Button } from "@/components/primitives/button";
import { Select } from "@/components/primitives/select";
import { toast } from "@/components/toast";

import { useCategorias } from "@/hooks/use-categorias";

import {
  COBRANCAS_RECEBIDAS_QUERY_KEY,
  CONTAS_A_PAGAR_QUERY_KEY,
  DASHBOARD_QUERY_KEY,
} from "@/helpers/query-keys-helper";

import {
  gerarContaAPagarSchema,
  type GerarContaAPagarFormValue,
} from "@/schema-validation/gerar-conta-pagar";
import { cobrancasService } from "@/services/cobrancas-service";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import ApiError from "@/types/application-error";

type Props = {
  cobrancaUuid: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function GerarContaAPagarModal({ cobrancaUuid, open, onOpenChange }: Readonly<Props>) {
  const queryClient = useQueryClient();
  const { categoriasSaida, isLoading: isCategoriasLoading } = useCategorias();

  const categoriaOptions = categoriasSaida.map((c) => ({
    value: c.uuid,
    label: c.nome,
  }));

  const form = useForm<GerarContaAPagarFormValue>({
    resolver: zodResolver(gerarContaAPagarSchema),
    defaultValues: {
      idCategoria: "",
      isParcelado: false,
      quantidadeParcelas: undefined,
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset({ idCategoria: "", isParcelado: false, quantidadeParcelas: undefined });
    }
  }, [open, form]);

  const mutation = useMutation({
    mutationFn: ({ idCategoria, isParcelado, quantidadeParcelas }: GerarContaAPagarFormValue) =>
      cobrancasService.gerarContaAPagar(cobrancaUuid, { idCategoria, isParcelado, quantidadeParcelas }),
    onSuccess: () => {
      toast.success("Conta a pagar gerada!");
      onOpenChange(false);
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: [COBRANCAS_RECEBIDAS_QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: [CONTAS_A_PAGAR_QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: [DASHBOARD_QUERY_KEY] }),
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

  function onSubmit(data: GerarContaAPagarFormValue) {
    mutation.mutate(data);
  }

  return (
    <Modal title="Gerar conta a pagar" open={open} onOpenChange={onOpenChange}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          control={form.control}
          name="idCategoria"
          render={({ field }) => (
            <Select
              icon={Bookmark}
              label="Categoria"
              options={categoriaOptions}
              placeholder="Selecione uma categoria"
              value={field.value}
              onChange={(value) => field.onChange(value)}
              onBlur={field.onBlur}
              name={field.name}
              disabled={isCategoriasLoading}
              error={form.formState.errors.idCategoria}
            />
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="cancel"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={mutation.isPending}
            disabled={mutation.isPending}
          >
            Gerar conta a pagar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
