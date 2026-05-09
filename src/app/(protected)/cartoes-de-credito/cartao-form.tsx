"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditCard } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useForm, type DefaultValues } from "react-hook-form";

import Modal from "@/components/modal";
import { Button } from "@/components/primitives/button";
import { Input } from "@/components/primitives/input";
import { InputMoney } from "@/components/primitives/input-money";
import { toast } from "@/components/toast";

import { catalogoErros } from "@/helpers/erros-helper";
import { keysToInvalidateForCartao } from "@/helpers/query-keys-helper";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";

import { cartaoSchema, type CartaoFormValue } from "@/schema-validation/cartao";
import { cartoesService } from "@/services/cartoes-service";
import type { ApiFormError } from "@/types/api";
import ApiError from "@/types/application-error";
import type { Cartao } from "@/types/cartao";

type Props = Readonly<{
  cartao?: Cartao;
  children?: ReactNode;
}>;

function getDefaultValues(cartao?: Cartao): DefaultValues<CartaoFormValue> {
  if (!cartao) {
    return {
      nome: "",
      diaVencimento: undefined,
      diaFechamento: undefined,
      limiteCredito: undefined,
    };
  }
  return {
    nome: cartao.nome,
    diaVencimento: cartao.diaVencimento,
    diaFechamento: cartao.diaFechamento,
    limiteCredito: cartao.limiteCredito,
  };
}

export default function CartaoForm({ cartao, children }: Props) {
  const isEditMode = Boolean(cartao?.uuid);
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const defaultValues = useMemo(() => getDefaultValues(cartao), [cartao]);

  const form = useForm<CartaoFormValue>({
    resolver: zodResolver(cartaoSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const salvarCartaoMutation = useMutation({
    mutationFn: async (data: CartaoFormValue) => {
      const payload = {
        nome: data.nome,
        diaVencimento: data.diaVencimento,
        diaFechamento: data.diaFechamento,
        limiteCredito: data.limiteCredito,
      };
      if (isEditMode && cartao?.uuid) {
        return cartoesService.alterar(cartao.uuid, payload);
      }
      return cartoesService.cadastrar(payload);
    },
    onSuccess: () => {
      toast.success(isEditMode ? "Cartão alterado com sucesso!" : "Cartão cadastrado com sucesso!");
      handleOpenChange(false);

      void Promise.all(
        keysToInvalidateForCartao.map((key) =>
          queryClient.invalidateQueries({ queryKey: [key] }),
        ),
      );
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        if (error.apiMessage.codigo === catalogoErros.CAMPO_INVALIDO_OU_OBRIGATORIO) {
          const formError = error.data as ApiFormError;
          formError.fields.forEach((fieldError) => {
            if (
              ["nome", "diaVencimento", "diaFechamento", "limiteCredito"].includes(fieldError.field)
            ) {
              form.setError(fieldError.field as keyof CartaoFormValue, {
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

  function onSubmit(data: CartaoFormValue) {
    salvarCartaoMutation.mutate(data);
  }

  return (
    <Modal
      title={isEditMode ? "Editar cartão" : "Adicionar cartão"}
      trigger={children}
      open={isOpen}
      onOpenChange={handleOpenChange}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input
          icon={CreditCard}
          label="Nome"
          placeholder="Nome do cartão"
          {...form.register("nome")}
          error={form.formState.errors.nome}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Dia de vencimento"
            placeholder="Ex: 10"
            type="number"
            min={1}
            max={31}
            {...form.register("diaVencimento", { valueAsNumber: true })}
            error={form.formState.errors.diaVencimento}
          />

          <Input
            label="Dia de fechamento"
            placeholder="Ex: 3"
            type="number"
            min={1}
            max={31}
            {...form.register("diaFechamento", { valueAsNumber: true })}
            error={form.formState.errors.diaFechamento}
          />
        </div>

        <InputMoney
          label="Limite de crédito"
          name="limiteCredito"
          value={form.watch("limiteCredito")}
          onChange={(value) => form.setValue("limiteCredito", value ?? 0)}
          onBlur={() => form.trigger("limiteCredito")}
          error={form.formState.errors.limiteCredito}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="cancel" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={salvarCartaoMutation.isPending}
            disabled={salvarCartaoMutation.isPending}
          >
            Salvar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
