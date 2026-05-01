"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Landmark } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Controller, useForm, type DefaultValues } from "react-hook-form";

import Modal from "@/components/modal";
import { Button } from "@/components/primitives/button";
import { Input } from "@/components/primitives/input";
import InputDate from "@/components/primitives/input-date";
import { InputMoney } from "@/components/primitives/input-money";
import { Select } from "@/components/primitives/select";
import { toast } from "@/components/toast";

import { useContas } from "@/hooks/use-contas";

import { keysToInvalidate } from "@/helpers/query-keys-helper";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { toBrDate, toUsDate } from "@/helpers/string-helper";

import { pagarContaSchema, type PagarContaFormValue } from "@/schema-validation/conta-a-pagar";
import { contasAPagarService } from "@/services/contas-a-pagar-service";
import ApiError from "@/types/application-error";
import type { ContaAgendada } from "@/types/conta-agendada";

type Props = Readonly<{
  contaAPagar: ContaAgendada;
  children?: ReactNode;
}>;

function getDefaultValues(contaAPagar: ContaAgendada): DefaultValues<PagarContaFormValue> {
  return {
    dataPagamento: new Date(),
    valor: contaAPagar.valor,
    idConta: "",
  };
}

export default function PagarContaAPagarForm({ contaAPagar, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { contasOptions, isLoading: isContasLoading } = useContas();

  const defaultValues = useMemo(() => getDefaultValues(contaAPagar), [contaAPagar]);

  const form = useForm<PagarContaFormValue>({
    resolver: zodResolver(pagarContaSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const mutation = useMutation({
    mutationFn: async (data: PagarContaFormValue) => {
      return contasAPagarService.pagamento(contaAPagar.uuid, {
        dataPagamento: toUsDate(data.dataPagamento),
        valor: data.valor,
        idParcela: contaAPagar.dadosParcela?.idParcela ?? "",
        idConta: data.idConta,
      });
    },
    onSuccess: () => {
      toast.success("Pagamento registrado com sucesso!");
      handleOpenChange(false);

      void Promise.all(
        keysToInvalidate.map((key) =>
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

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    if (!open) form.reset(defaultValues);
  }

  function onSubmit(data: PagarContaFormValue) {
    mutation.mutate(data);
  }

  return (
    <Modal
      title={`Pagar conta`}
      trigger={children}
      open={isOpen}
      onOpenChange={handleOpenChange}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          control={form.control}
          name="idConta"
          render={({ field }) => (
            <Select
              icon={Landmark}
              label="Conta"
              options={contasOptions}
              placeholder="Selecione a conta"
              value={field.value}
              onChange={(value) => field.onChange(value)}
              onBlur={field.onBlur}
              name={field.name}
              disabled={isContasLoading}
              error={form.formState.errors.idConta}
            />
          )}
        />

        <Controller
          control={form.control}
          name="dataPagamento"
          render={({ field }) => (
            <InputDate
              label="Data do pagamento"
              dateSelected={field.value}
              onChange={field.onChange}
              error={form.formState.errors.dataPagamento}
            />
          )}
        />

        <Input
          label="Vencimento"
          value={toBrDate(contaAPagar.dataVencimento)}
          disabled
          readOnly
        />

        <Input
          label="Categoria"
          value={contaAPagar.categoria.descricao}
          disabled
          readOnly
        />

        <Input
          label="Descrição"
          value={contaAPagar.descricao}
          disabled
          readOnly
        />

        <Controller
          control={form.control}
          name="valor"
          render={({ field }) => (
            <InputMoney
              label="Valor pago"
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
            Confirmar pagamento
          </Button>
        </div>
      </form>
    </Modal>
  );
}
