"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bookmark, BookType, CreditCard, Wallet } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";

import Modal from "@/components/modal";
import { Button } from "@/components/primitives/button";
import { Input } from "@/components/primitives/input";
import InputDate from "@/components/primitives/input-date";
import { InputMoney } from "@/components/primitives/input-money";
import { Select } from "@/components/primitives/select";
import { toast } from "@/components/toast";

import { useCategorias } from "@/hooks/use-categorias";
import { useConfiguracaoInicial } from "@/hooks/use-configuracao-inicial";
import { useContas } from "@/hooks/use-contas";

import { catalogoErros } from "@/helpers/erros-helper";
import {
  keysToInvalidateForConta
} from "@/helpers/query-keys-helper";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { toUsDate } from "@/helpers/string-helper";

import {
  pagamentoParcialFaturaSchema,
  type PagamentoParcialFaturaFormValue,
} from "@/schema-validation/pagamento-parcial-fatura";
import { faturasService } from "@/services/faturas-service";
import type { ApiFormError } from "@/types/api";
import ApiError from "@/types/application-error";

type Props = Readonly<{
  children?: ReactNode;
}>;

const defaultValues: PagamentoParcialFaturaFormValue = {
  idCategoriaEntrada: "",
  idCategoriaSaida: "",
  idConta: "",
  dataPagamento: new Date(),
  descricao: "",
  valor: undefined as unknown as number,
};

export default function PagamentoParcialForm({ children }: Props) {
  const params = useParams<{ idCartao: string; idFatura: string }>();
  const idCartao = params.idCartao;
  const idFatura = params.idFatura;

  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: configData } = useConfiguracaoInicial();
  const { categoriasEntrada, categoriasSaida, isLoading: isCategoriasLoading } = useCategorias();
  const { contasOptions, isLoading: isContasLoading } = useContas();

  const isLoadingDependencies = isCategoriasLoading || isContasLoading;

  const fatura = configData?.faturas.find(
    (f) => f.uuid === idFatura && f.cartao.uuid === idCartao,
  );
  const cartaoOptions = fatura
    ? [{ value: fatura.cartao.uuid, label: fatura.cartao.descricao }]
    : [];

  const categoriasEntradaOptions = useMemo(
    () => categoriasEntrada.map((c) => ({ value: c.uuid, label: c.nome })),
    [categoriasEntrada],
  );

  const categoriasSaidaOptions = useMemo(
    () => categoriasSaida.map((c) => ({ value: c.uuid, label: c.nome })),
    [categoriasSaida],
  );

  const form = useForm<PagamentoParcialFaturaFormValue>({
    resolver: zodResolver(pagamentoParcialFaturaSchema),
    defaultValues,
  });

  const pagamentoParcialMutation = useMutation({
    mutationFn: (data: PagamentoParcialFaturaFormValue) =>
      faturasService.pagamentoParcial(idCartao, idFatura, {
        idCategoriaEntrada: data.idCategoriaEntrada,
        idCategoriaSaida: data.idCategoriaSaida,
        idConta: data.idConta,
        dataPagamento: toUsDate(data.dataPagamento),
        descricao: data.descricao.trim(),
        valor: data.valor,
      }),
    onSuccess: () => {
      toast.success("Pagamento parcial realizado com sucesso!");
      handleOpenChange(false);

      void Promise.all(
        keysToInvalidateForConta.map((key) =>
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
              [
                "idCategoriaEntrada",
                "idCategoriaSaida",
                "idConta",
                "dataPagamento",
                "descricao",
                "valor",
              ].includes(fieldError.field)
            ) {
              form.setError(fieldError.field as keyof PagamentoParcialFaturaFormValue, {
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
    if (!open) {
      form.reset(defaultValues);
    }
  }

  function onSubmit(data: PagamentoParcialFaturaFormValue) {
    pagamentoParcialMutation.mutate(data);
  }

  return (
    <Modal
      title="Pagamento Parcial da Fatura"
      trigger={children}
      open={isOpen}
      onOpenChange={handleOpenChange}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Select
          icon={CreditCard}
          label="Cartão de Crédito"
          options={cartaoOptions}
          placeholder="Cartão de Crédito"
          disabled
          value={fatura?.cartao.uuid ?? ""}
          onChange={() => { }}
        />

        <Controller
          control={form.control}
          name="idCategoriaEntrada"
          render={({ field }) => (
            <Select
              icon={Bookmark}
              label="Categoria de Entrada"
              options={categoriasEntradaOptions}
              placeholder="Selecione uma categoria"
              {...field}
              error={form.formState.errors.idCategoriaEntrada}
            />
          )}
        />

        <Controller
          control={form.control}
          name="idConta"
          render={({ field }) => (
            <Select
              icon={Wallet}
              label="Conta"
              options={contasOptions}
              placeholder="Selecione uma conta"
              {...field}
              error={form.formState.errors.idConta}
            />
          )}
        />

        <Controller
          control={form.control}
          name="idCategoriaSaida"
          render={({ field }) => (
            <Select
              icon={Bookmark}
              label="Categoria de Saída"
              options={categoriasSaidaOptions}
              placeholder="Selecione uma categoria"
              {...field}
              error={form.formState.errors.idCategoriaSaida}
            />
          )}
        />

        <Controller
          control={form.control}
          name="dataPagamento"
          render={({ field }) => (
            <InputDate
              label="Data"
              dateSelected={field.value}
              onChange={field.onChange}
              error={form.formState.errors.dataPagamento}
            />
          )}
        />

        <Input
          icon={BookType}
          label="Descrição"
          placeholder="Descrição"
          {...form.register("descricao")}
          error={form.formState.errors.descricao}
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
            isLoading={pagamentoParcialMutation.isPending}
            disabled={isLoadingDependencies || pagamentoParcialMutation.isPending}
          >
            Salvar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
