"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bookmark, BookType, Landmark, Tags } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Controller, useForm, type DefaultValues } from "react-hook-form";

import Modal from "@/components/modal";
import { Button } from "@/components/primitives/button";
import { Input } from "@/components/primitives/input";
import InputDate from "@/components/primitives/input-date";
import { InputMoney } from "@/components/primitives/input-money";
import { Select } from "@/components/primitives/select";
import { toast } from "@/components/toast";

import { useCategorias } from "@/hooks/use-categorias";
import { useContas } from "@/hooks/use-contas";
import { useTags } from "@/hooks/use-tags";

import { catalogoErros } from "@/helpers/erros-helper";
import {
  keysToInvalidate
} from "@/helpers/query-keys-helper";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { toUsDate } from "@/helpers/string-helper";

import {
  lancamentoContaSchema,
  type LancamentoContaFormValue,
} from "@/schema-validation/lancamento-conta";
import { lancamentoContaService } from "@/services/lancamento-conta-service";
import type { ApiFormError } from "@/types/api";
import ApiError from "@/types/application-error";
import type { LancamentoConta } from "@/types/lancamento-conta";

type Props = Readonly<{
  lancamentoConta?: LancamentoConta;
  children?: ReactNode;
}>;

function getDefaultValues(
  idConta: string,
  lancamentoConta?: LancamentoConta,
): DefaultValues<LancamentoContaFormValue> {
  if (!lancamentoConta) {
    return {
      idConta,
      idCategoria: "",
      dataLancamento: new Date(),
      descricao: "",
      valor: undefined,
      tags: [],
    };
  }

  return {
    idConta: lancamentoConta.conta.uuid || idConta,
    idCategoria: lancamentoConta.categoria.uuid,
    dataLancamento: new Date(`${lancamentoConta.data}T00:00:00`),
    descricao: lancamentoConta.descricao,
    valor: lancamentoConta.valor,
    tags: lancamentoConta.tags ?? [],
  };
}

export default function LancamentoContaForm({ lancamentoConta, children }: Props) {
  const params = useParams<{ idConta: string }>();
  const idContaRota = params.idConta;

  const isEditMode = Boolean(lancamentoConta?.uuid);
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { contasOptions, isLoading: isContasLoading } = useContas();
  const { categoriasOptions, isLoading: isCategoriasLoading } = useCategorias();
  const { tagsOptions, isLoading: isTagsLoading } = useTags();

  const isLoadingDependencies = isContasLoading || isCategoriasLoading || isTagsLoading;

  const defaultValues = useMemo(
    () => getDefaultValues(idContaRota, lancamentoConta),
    [idContaRota, lancamentoConta],
  );

  const form = useForm<LancamentoContaFormValue>({
    resolver: zodResolver(lancamentoContaSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const cadastrarLancamentoContaMutation = useMutation({
    mutationFn: async (data: LancamentoContaFormValue) => {
      const payload = {
        idConta: idContaRota,
        idCategoria: data.idCategoria,
        dataLancamento: toUsDate(data.dataLancamento),
        descricao: data.descricao.trim(),
        valor: data.valor,
        tags: data.tags?.length ? data.tags : undefined,
      };

      if (isEditMode && lancamentoConta?.uuid) {
        return lancamentoContaService.alterar(lancamentoConta.uuid, payload);
      }

      return lancamentoContaService.cadastrar(payload);
    },
    onSuccess: () => {
      toast.success(
        isEditMode
          ? "Lançamento alterado com sucesso!"
          : "Lançamento cadastrado com sucesso!",
      );
      handleOpenChange(false);

      void Promise.all(
        keysToInvalidate.map((key) =>
          queryClient.invalidateQueries({ queryKey: [key] }),
        ),
      );
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        if (error.apiMessage.codigo === catalogoErros.CAMPO_INVALIDO_OU_OBRIGATORIO) {
          const formError = error.data as ApiFormError;
          formError.fields.forEach((fieldError) => {
            if (["idConta", "idCategoria", "dataLancamento", "descricao", "valor", "tags"].includes(fieldError.field)) {
              form.setError(fieldError.field as keyof LancamentoContaFormValue, {
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

  function onSubmit(data: LancamentoContaFormValue) {
    cadastrarLancamentoContaMutation.mutate(data);
  }

  return (
    <Modal
      title={isEditMode ? "Editar lançamento" : "Adicionar lançamento"}
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
              placeholder="Selecione uma conta"
              {...field}
              error={form.formState.errors.idConta}
            />
          )}
        />

        <Controller
          control={form.control}
          name="dataLancamento"
          render={({ field }) => (
            <InputDate
              label="Data"
              dateSelected={field.value}
              onChange={field.onChange}
              error={form.formState.errors.dataLancamento}
            />
          )}
        />

        <Controller
          control={form.control}
          name="idCategoria"
          render={({ field }) => (
            <Select
              icon={Bookmark}
              label="Categoria"
              options={categoriasOptions}
              placeholder="Selecione uma categoria"
              {...field}
              error={form.formState.errors.idCategoria}
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

        <Controller
          control={form.control}
          name="tags"
          render={({ field }) => (
            <Select
              isMulti
              icon={Tags}
              label="Tags"
              options={tagsOptions}
              placeholder="Selecione as tags..."
              {...field}
            />
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="cancel" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={cadastrarLancamentoContaMutation.isPending}
            disabled={isLoadingDependencies || cadastrarLancamentoContaMutation.isPending}
          >
            Cadastrar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
