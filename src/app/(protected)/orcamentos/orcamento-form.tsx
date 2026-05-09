"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Controller, useForm, type DefaultValues } from "react-hook-form";

import Modal from "@/components/modal";
import { Button } from "@/components/primitives/button";
import { InputMoney } from "@/components/primitives/input-money";
import { Select } from "@/components/primitives/select";
import { toast } from "@/components/toast";

import { useCategorias } from "@/hooks/use-categorias";

import { catalogoErros } from "@/helpers/erros-helper";
import { keysToInvalidateForCategoria } from "@/helpers/query-keys-helper";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";

import { capitalize } from "@/helpers/string-helper";
import { orcamentoSchema, type OrcamentoFormValue } from "@/schema-validation/orcamento";
import { orcamentoService } from "@/services/orcamentos-service";
import type { ApiFormError } from "@/types/api";
import ApiError from "@/types/application-error";
import type { Orcamento } from "@/types/orcamento";

type Props = Readonly<{
  orcamento?: Orcamento;
  children?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}>;

function getDefaultValues(orcamento?: Orcamento): DefaultValues<OrcamentoFormValue> {
  return {
    idCategoria: orcamento?.categoria.uuid ?? "",
    valor: orcamento?.valor ?? undefined,
  };
}

export default function OrcamentoForm({ orcamento, children, open: controlledOpen, onOpenChange: controlledOnOpenChange }: Props) {
  const isEditMode = Boolean(orcamento?.uuid);
  const [isOpen, setIsOpen] = useState(false);
  const resolvedIsOpen = controlledOpen !== undefined ? controlledOpen : isOpen;
  const queryClient = useQueryClient();

  const { categoriasSaida, isLoading: isCategoriasLoading } = useCategorias();

  const defaultValues = useMemo(() => getDefaultValues(orcamento), [orcamento]);

  const categoriasSaidaOptions = useMemo(
    () => categoriasSaida.map((c) => ({ value: c.uuid, label: c.nome })),
    [categoriasSaida],
  );

  const form = useForm<OrcamentoFormValue>({
    resolver: zodResolver(orcamentoSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const mutation = useMutation({
    mutationFn: async (data: OrcamentoFormValue) => {
      if (isEditMode && orcamento?.uuid) {
        return orcamentoService.alterar(orcamento.uuid, data);
      }
      return orcamentoService.cadastrar(data);
    },
    onSuccess: () => {
      toast.success(isEditMode ? "Orçamento alterado com sucesso!" : "Orçamento cadastrado com sucesso!");

      handleOpenChange(false);

      void Promise.all(
        keysToInvalidateForCategoria.map((key) =>
          queryClient.invalidateQueries({ queryKey: [key] }),
        ),
      );
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        if (error.apiMessage.codigo === catalogoErros.CAMPO_INVALIDO_OU_OBRIGATORIO) {
          const formError = error.data as ApiFormError;
          formError.fields.forEach((fieldError) => {
            if (["idCategoria", "valor"].includes(fieldError.field)) {
              form.setError(fieldError.field as keyof OrcamentoFormValue, {
                type: "server",
                message: fieldError.message,
              });
            }
          });
        }

        if (error.apiMessage?.codigo === catalogoErros.JA_EXISTE_UMA_ORCAMENTO_PARA_CATEGORIA) {
          form.setError("idCategoria", {
            type: "server",
            message: capitalize(error.apiMessage.descricao),
          });
          form.setFocus("idCategoria");
        }

        toast.error(error.apiMessage.descricao);

        return;
      }
      toast.error(DEFAULT_ERROR_MESSAGE);
    },
  });

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    controlledOnOpenChange?.(open);
    if (!open) form.reset(defaultValues);
  }

  function onSubmit(data: OrcamentoFormValue) {
    mutation.mutate(data);
  }

  return (
    <Modal
      title={isEditMode ? "Editar orçamento" : "Adicionar orçamento"}
      trigger={children}
      open={resolvedIsOpen}
      onOpenChange={handleOpenChange}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          control={form.control}
          name="idCategoria"
          render={({ field }) => (
            <Select
              icon={Bookmark}
              label="Categoria"
              options={categoriasSaidaOptions}
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

        <Controller
          control={form.control}
          name="valor"
          render={({ field }) => (
            <InputMoney
              label="Valor"
              name={field.name}
              onBlur={field.onBlur}
              value={field.value}
              onChange={(value) => field.onChange(value ?? null)}
              error={form.formState.errors.valor}
            />
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="cancel" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={mutation.isPending}
            disabled={mutation.isPending}
          >
            Salvar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
