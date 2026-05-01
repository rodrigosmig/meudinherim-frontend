"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Landmark } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Controller, useForm, type DefaultValues } from "react-hook-form";

import { BankIconPicker } from "@/components/bank-icon-picker";

import Modal from "@/components/modal";
import { Button } from "@/components/primitives/button";
import { Input } from "@/components/primitives/input";
import { Select } from "@/components/primitives/select";
import { toast } from "@/components/toast";

import { catalogoErros } from "@/helpers/erros-helper";
import { CONTAS_QUERY_KEY, DADOS_CONFIGURACAO_QUERY_KEY } from "@/helpers/query-keys-helper";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";

import { contaSchema, type ContaFormValue } from "@/schema-validation/conta";
import { contasService } from "@/services/contas-service";
import type { ApiFormError } from "@/types/api";
import ApiError from "@/types/application-error";
import type { Conta } from "@/types/contas";
import { TipoConta } from "@/types/enum/tipo-conta";

const TIPO_OPTIONS = [
  { value: TipoConta.CONTA_CORRENTE, label: "Conta Corrente" },
  { value: TipoConta.POUPANCA, label: "Poupança" },
  { value: TipoConta.DINHEIRO, label: "Dinheiro" },
  { value: TipoConta.INVESTIMENTO, label: "Investimento" },
];

type Props = Readonly<{
  conta?: Conta;
  children?: ReactNode;
}>;

function getDefaultValues(conta?: Conta): DefaultValues<ContaFormValue> {
  if (!conta) {
    return { nome: "", tipo: undefined, icon: "" };
  }
  return { nome: conta.nome, tipo: conta.tipo, icon: conta.icon ?? "" };
}

export default function ContaForm({ conta, children }: Props) {
  const isEditMode = Boolean(conta?.uuid);
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const defaultValues = useMemo(() => getDefaultValues(conta), [conta]);

  const form = useForm<ContaFormValue>({
    resolver: zodResolver(contaSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const salvarContaMutation = useMutation({
    mutationFn: async (data: ContaFormValue) => {
      const payload = { nome: data.nome, tipo: data.tipo, icon: data.icon ?? "" };
      if (isEditMode && conta?.uuid) {
        return contasService.alterar(conta.uuid, payload);
      }
      return contasService.cadastrar(payload);
    },
    onSuccess: () => {
      toast.success(isEditMode ? "Conta alterada com sucesso!" : "Conta cadastrada com sucesso!");
      handleOpenChange(false);

      void Promise.all([
        queryClient.invalidateQueries({ queryKey: [CONTAS_QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: [DADOS_CONFIGURACAO_QUERY_KEY] }),
      ]);
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        if (error.apiMessage.codigo === catalogoErros.CAMPO_INVALIDO_OU_OBRIGATORIO) {
          const formError = error.data as ApiFormError;
          formError.fields.forEach((fieldError) => {
            if (["nome", "tipo"].includes(fieldError.field)) {
              form.setError(fieldError.field as keyof ContaFormValue, {
                type: "server",
                message: fieldError.message,
              });
            }
          });
        }
        toast.error(error.apiMessage.descricao);
        return;
      }
      toast.error(DEFAULT_ERROR_MESSAGE);
    },
  });

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    if (!open) form.reset(defaultValues);
  }

  function onSubmit(data: ContaFormValue) {
    salvarContaMutation.mutate(data);
  }

  return (
    <Modal
      title={isEditMode ? "Editar conta" : "Adicionar conta"}
      trigger={children}
      open={isOpen}
      onOpenChange={handleOpenChange}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input
          icon={Landmark}
          label="Nome"
          placeholder="Nome da conta"
          {...form.register("nome")}
          error={form.formState.errors.nome}
        />

        <Controller
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <Select
              label="Tipo"
              options={TIPO_OPTIONS}
              placeholder="Selecione o tipo"
              value={field.value}
              onChange={(value) => field.onChange(value)}
              onBlur={field.onBlur}
              name={field.name}
              error={form.formState.errors.tipo}
            />
          )}
        />

        <Controller
          control={form.control}
          name="icon"
          render={({ field }) => (
            <BankIconPicker
              label="Ícone do banco"
              value={field.value ?? ""}
              onChange={field.onChange}
            />
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="cancel" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
          >
            Salvar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
