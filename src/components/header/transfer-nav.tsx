"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeftRight, Bookmark, BookType, Landmark } from "lucide-react";
import { useMemo, useState } from "react";
import { Controller, useForm, type DefaultValues } from "react-hook-form";

import Modal from "@/components/modal";
import { Button } from "@/components/primitives/button";
import { Input } from "@/components/primitives/input";
import InputDate from "@/components/primitives/input-date";
import { InputMoney } from "@/components/primitives/input-money";
import { Select } from "@/components/primitives/select";
import { toast } from "@/components/toast";
import Icon from "@/components/primitives/icon";

import { useCategorias } from "@/hooks/use-categorias";
import { useContas } from "@/hooks/use-contas";

import { catalogoErros } from "@/helpers/erros-helper";
import { keysToInvalidateForLancamentoConta } from "@/helpers/query-keys-helper";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { toUsDate } from "@/helpers/string-helper";

import {
  transferenciaEntreContasSchema,
  type TransferenciaEntreContasFormValue,
} from "@/schema-validation/transferencia-entre-contas";
import { lancamentoContaService } from "@/services/lancamento-conta-service";
import type { ApiFormError } from "@/types/api";
import ApiError from "@/types/application-error";

const defaultValues: DefaultValues<TransferenciaEntreContasFormValue> = {
  idContaOrigem: "",
  idCategoriaOrigem: "",
  idContaDestino: "",
  idCategoriaDestino: "",
  data: new Date(),
  descricao: "",
  valor: undefined,
};

function SectionHeading({ label, className }: { label: string; className?: string }) {
  return (
    <div className={`pb-1 border-b border-border-muted ${className}`}>
      <span className="text-sm font-semibold">{label}</span>
    </div>
  );
}

function TransferForm({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();

  const { contasOptions, isLoading: isContasLoading } = useContas();
  const { categoriasSaida, categoriasEntrada, isLoading: isCategoriasLoading } = useCategorias();

  const categoriasSaidaOptions = useMemo(
    () => categoriasSaida.map((c) => ({ value: c.uuid, label: c.nome })),
    [categoriasSaida],
  );

  const categoriasEntradaOptions = useMemo(
    () => categoriasEntrada.map((c) => ({ value: c.uuid, label: c.nome })),
    [categoriasEntrada],
  );

  const isLoadingDependencies = isContasLoading || isCategoriasLoading;

  const form = useForm<TransferenciaEntreContasFormValue>({
    resolver: zodResolver(transferenciaEntreContasSchema),
    defaultValues,
  });

  const transferirMutation = useMutation({
    mutationFn: (data: TransferenciaEntreContasFormValue) =>
      lancamentoContaService.transferirEntreContas({
        idContaOrigem: data.idContaOrigem,
        idCategoriaOrigem: data.idCategoriaOrigem,
        idContaDestino: data.idContaDestino,
        idCategoriaDestino: data.idCategoriaDestino,
        data: toUsDate(data.data),
        descricao: data.descricao.trim(),
        valor: data.valor,
      }),
    onSuccess: () => {
      toast.success("Transferência realizada com sucesso!");
      onClose();
      void Promise.all(
        keysToInvalidateForLancamentoConta.map((key) =>
          queryClient.invalidateQueries({ queryKey: [key] }),
        ),
      );
    },
    onError: (error) => {
        console.log(666,error);
      if (error instanceof ApiError) {
        if (error.apiMessage.codigo === catalogoErros.CAMPO_INVALIDO_OU_OBRIGATORIO) {
          const formError = error.data as ApiFormError;
          formError.fields.forEach((fieldError) => {
            const validFields: (keyof TransferenciaEntreContasFormValue)[] = [
              "idContaOrigem",
              "idCategoriaOrigem",
              "idContaDestino",
              "idCategoriaDestino",
              "data",
              "descricao",
              "valor",
            ];
            if (validFields.includes(fieldError.field as keyof TransferenciaEntreContasFormValue)) {
              form.setError(fieldError.field as keyof TransferenciaEntreContasFormValue, {
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

  function onSubmit(data: TransferenciaEntreContasFormValue) {
    transferirMutation.mutate(data);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <SectionHeading label="Origem" className="text-primary" />

      <Controller
        control={form.control}
        name="idContaOrigem"
        render={({ field }) => (
          <Select
            icon={Landmark}
            label="Conta de origem"
            options={contasOptions}
            placeholder="Selecione a conta de origem"
            {...field}
            error={form.formState.errors.idContaOrigem}
          />
        )}
      />

      <Controller
        control={form.control}
        name="idCategoriaOrigem"
        render={({ field }) => (
          <Select
            icon={Bookmark}
            label="Categoria de origem"
            options={categoriasSaidaOptions}
            placeholder="Selecione a categoria de origem"
            {...field}
            error={form.formState.errors.idCategoriaOrigem}
          />
        )}
      />

      <SectionHeading label="Destino" className="text-negative" />

      <Controller
        control={form.control}
        name="idContaDestino"
        render={({ field }) => (
          <Select
            icon={Landmark}
            label="Conta de destino"
            options={contasOptions}
            placeholder="Selecione a conta de destino"
            {...field}
            error={form.formState.errors.idContaDestino}
          />
        )}
      />

      <Controller
        control={form.control}
        name="idCategoriaDestino"
        render={({ field }) => (
          <Select
            icon={Bookmark}
            label="Categoria de destino"
            options={categoriasEntradaOptions}
            placeholder="Selecione a categoria de destino"
            {...field}
            error={form.formState.errors.idCategoriaDestino}
          />
        )}
      />

      <Controller
        control={form.control}
        name="data"
        render={({ field }) => (
          <InputDate
            label="Data"
            dateSelected={field.value}
            onChange={field.onChange}
            error={form.formState.errors.data}
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
        <Button type="button" variant="cancel" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          type="submit"
          isLoading={transferirMutation.isPending}
          disabled={isLoadingDependencies || transferirMutation.isPending}
        >
          Transferir
        </Button>
      </div>
    </form>
  );
}

export function TransferenciaNav() {
  const [isOpen, setIsOpen] = useState(false);

  function handleClose() {
    setIsOpen(false);
  }

  return (
    <Modal
      title="Transferência entre contas"
      trigger={
        <Button variant="icon" aria-label="Transferência entre contas">
          <Icon icon={ArrowLeftRight} />
        </Button>
      }
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <TransferForm onClose={handleClose} />
    </Modal>
  );
}
