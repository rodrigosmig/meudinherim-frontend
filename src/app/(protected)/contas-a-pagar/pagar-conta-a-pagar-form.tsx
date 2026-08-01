"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Landmark, CreditCard } from "lucide-react";
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
import { useConfiguracaoInicial } from "@/hooks/use-configuracao-inicial";

import { keysToInvalidateForConta } from "@/helpers/query-keys-helper";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { cn, toBrDate, toUsDate } from "@/helpers/string-helper";

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
    tipoPagamento: "CONTA",
    idConta: "",
  };
}

export default function PagarContaAPagarForm({ contaAPagar, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { contasOptions, isLoading: isContasLoading } = useContas();
  const { data: configData, isLoading: isConfigLoading } = useConfiguracaoInicial();

  const cartoesOptions = useMemo(() => {
    if (!configData?.faturas) return [];
    return configData.faturas.map((fatura) => ({
      value: fatura.cartao.uuid,
      label: fatura.cartao.descricao,
    }));
  }, [configData]);

  const isParcelada = contaAPagar.parcelado;
  const isConfiguracaoLoading = isContasLoading || isConfigLoading;
  const hasNoCartoes = cartoesOptions.length === 0;
  const isCartaoDisabled = isParcelada || hasNoCartoes;

  const defaultValues = useMemo(() => getDefaultValues(contaAPagar), [contaAPagar]);

  const form = useForm<PagarContaFormValue>({
    resolver: zodResolver(pagarContaSchema),
    defaultValues,
  });

  const tipoPagamento = form.watch("tipoPagamento");

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
        tipoPagamento: data.tipoPagamento,
      });
    },
    onSuccess: () => {
      toast.success("Pagamento registrado com sucesso!");
      handleOpenChange(false);

      void Promise.all(
        keysToInvalidateForConta.map((key) =>
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
          name="tipoPagamento"
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-gray-300">Forma de pagamento</span>
              <div className="flex rounded-md border border-gray-700 overflow-hidden">
                <button
                  type="button"
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors",
                    field.value === "CONTA"
                      ? "bg-primary/20 text-primary border-r border-gray-700"
                      : "bg-transparent text-gray-400 hover:text-gray-200 border-r border-gray-700",
                  )}
                  onClick={() => {
                    field.onChange("CONTA");
                    form.setValue("idConta", "");
                  }}
                >
                  <Landmark className="size-3.5" />
                  Conta
                </button>
                <button
                  type="button"
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors",
                    isCartaoDisabled && "opacity-40 cursor-not-allowed",
                    field.value === "CARTAO"
                      ? "bg-primary/20 text-primary"
                      : "bg-transparent text-gray-400 hover:text-gray-200",
                  )}
                  onClick={() => {
                    if (isCartaoDisabled) return;
                    field.onChange("CARTAO");
                    form.setValue("idConta", "");
                  }}
                  disabled={isCartaoDisabled}
                  title={
                    isParcelada
                      ? "Pagamento com cartão não disponível para contas parceladas"
                      : hasNoCartoes
                        ? "Nenhum cartão disponível"
                        : undefined
                  }
                >
                  <CreditCard className="size-3.5" />
                  Cartão
                </button>
              </div>
            </div>
          )}
        />

        {tipoPagamento === "CONTA" && (
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
                disabled={isConfiguracaoLoading}
                error={form.formState.errors.idConta}
              />
            )}
          />
        )}

        {tipoPagamento === "CARTAO" && (
          <Controller
            control={form.control}
            name="idConta"
            render={({ field }) => (
              <Select
                icon={CreditCard}
                label="Cartão"
                options={cartoesOptions}
                placeholder="Selecione o cartão"
                value={field.value}
                onChange={(value) => field.onChange(value)}
                onBlur={field.onBlur}
                name={field.name}
                disabled={isConfiguracaoLoading}
                error={form.formState.errors.idConta}
              />
            )}
          />
        )}

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
