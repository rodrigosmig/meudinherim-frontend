"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bookmark, BookType, Tags } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Controller, useForm, type DefaultValues } from "react-hook-form";

import Modal from "@/components/modal";
import { Button } from "@/components/primitives/button";
import { Input } from "@/components/primitives/input";
import InputDate from "@/components/primitives/input-date";
import { InputMoney } from "@/components/primitives/input-money";
import { Select } from "@/components/primitives/select";
import Switch from "@/components/primitives/switch";
import { toast } from "@/components/toast";

import { useCategorias } from "@/hooks/use-categorias";
import { useTags } from "@/hooks/use-tags";

import { catalogoErros } from "@/helpers/erros-helper";
import {
  CONTAS_A_PAGAR_QUERY_KEY
} from "@/helpers/query-keys-helper";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { toUsDate } from "@/helpers/string-helper";

import { contaAPagarSchema, type ContaAPagarFormValue } from "@/schema-validation/conta-a-pagar";
import { contasAPagarService } from "@/services/contas-a-pagar-service";
import type { ApiFormError } from "@/types/api";
import ApiError from "@/types/application-error";
import type { ContaAgendada } from "@/types/conta-agendada";
import { Periodicidade } from "@/types/enum/periodicidade";

const PERIODICIDADE_OPTIONS = [
  { value: Periodicidade.MENSAL, label: "Mensal" },
  { value: Periodicidade.TRIMESTRAL, label: "Trimestral" },
  { value: Periodicidade.SEMESTRAL, label: "Semestral" },
  { value: Periodicidade.ANUAL, label: "Anual" },
];

type Props = Readonly<{
  contaAPagar?: ContaAgendada;
  children?: ReactNode;
}>;

function getDefaultValues(contaAPagar?: ContaAgendada): DefaultValues<ContaAPagarFormValue> {
  if (!contaAPagar) {
    return {
      descricao: "",
      valor: undefined,
      idCategoria: "",
      dataVencimento: new Date(),
      periodicidade: Periodicidade.NENHUMA,
      parcelado: false,
      quantidadeParcelas: undefined,
      tags: [],
    };
  }
  return {
    descricao: contaAPagar.descricao,
    valor: contaAPagar.valor,
    idCategoria: contaAPagar.categoria.uuid,
    dataVencimento: new Date(`${contaAPagar.dataVencimento}T00:00:00`),
    periodicidade: contaAPagar.periodicidade,
    parcelado: contaAPagar.parcelado,
    quantidadeParcelas: contaAPagar.dadosParcela?.totalDeParcelas,
    tags: contaAPagar.tags ?? [],
  };
}

export default function ContaAPagarForm({ contaAPagar, children }: Props) {
  const isEditMode = Boolean(contaAPagar?.uuid);
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { categoriasSaida, isLoading: isCategoriasLoading } = useCategorias();
  const { tagsOptions, isLoading: isTagsLoading } = useTags();

  const defaultValues = useMemo(() => getDefaultValues(contaAPagar), [contaAPagar]);

  const form = useForm<ContaAPagarFormValue>({
    resolver: zodResolver(contaAPagarSchema),
    defaultValues,
  });

  const valor = form.watch("valor");
  const parcelado = form.watch("parcelado");
  const periodicidade = form.watch("periodicidade");
  const categoriasSaidaOptions = categoriasSaida.map(categoria => ({ value: categoria.uuid, label: categoria.nome }));

  const periodicidadeAtiva = periodicidade !== Periodicidade.NENHUMA;
  const valorPreenchido = !!valor && valor > 0;

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  function handlePeriodicidadeSwitch(checked: boolean) {
    if (checked) {
      form.setValue("periodicidade", Periodicidade.MENSAL);
    } else {
      form.setValue("periodicidade", Periodicidade.NENHUMA);
    }
  }

  function handleParceladoSwitch(checked: boolean) {
    form.setValue("parcelado", checked);
    if (!checked) {
      form.setValue("quantidadeParcelas", undefined);
    }
  }

  const mutation = useMutation({
    mutationFn: async (data: ContaAPagarFormValue) => {
      const payload = {
        dataVencimento: toUsDate(data.dataVencimento),
        idCategoria: data.idCategoria,
        descricao: data.descricao.trim(),
        valor: data.valor,
        idFatura: "",
        periodicidade: data.periodicidade,
        parcelado: data.parcelado,
        quantidadeParcelas: data.parcelado ? (data.quantidadeParcelas ?? 2) : 1,
        tags: data.tags?.length ? data.tags : undefined,
      };

      if (isEditMode && contaAPagar?.uuid) {
        return contasAPagarService.alterar(contaAPagar.uuid, payload as any);
      }
      return contasAPagarService.cadastrar(payload);
    },
    onSuccess: () => {
      toast.success(
        isEditMode ? "Conta a pagar alterada com sucesso!" : "Conta a pagar cadastrada com sucesso!",
      );
      handleOpenChange(false);

      void Promise.all([
        queryClient.invalidateQueries({ queryKey: [CONTAS_A_PAGAR_QUERY_KEY] }),
      ]);
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        if (error.apiMessage.codigo === catalogoErros.CAMPO_INVALIDO_OU_OBRIGATORIO) {
          const formError = error.data as ApiFormError;
          formError.fields.forEach((fieldError) => {
            if (
              ["descricao", "valor", "idCategoria", "dataVencimento", "periodicidade"].includes(
                fieldError.field,
              )
            ) {
              form.setError(fieldError.field as keyof ContaAPagarFormValue, {
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

  function onSubmit(data: ContaAPagarFormValue) {
    mutation.mutate(data);
  }

  return (
    <Modal
      title={isEditMode ? "Editar conta a pagar" : "Adicionar conta a pagar"}
      trigger={children}
      open={isOpen}
      onOpenChange={handleOpenChange}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          control={form.control}
          name="dataVencimento"
          render={({ field }) => (
            <InputDate
              label="Data de vencimento"
              dateSelected={field.value}
              onChange={field.onChange}
              error={form.formState.errors.dataVencimento}
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

        <Input
          icon={BookType}
          label="Descrição"
          placeholder="Descrição da conta"
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
              value={field.value}
              onChange={(value) => field.onChange(value)}
              onBlur={field.onBlur}
              name={field.name}
              disabled={isTagsLoading}
            />
          )}
        />

        <div className="space-y-3">
          <Switch
            label="Periodicidade"
            checked={periodicidadeAtiva}
            disabled={parcelado}
            onCheckedChange={handlePeriodicidadeSwitch}
          />

          {periodicidadeAtiva && (
            <Controller
              control={form.control}
              name="periodicidade"
              render={({ field }) => (
                <Select
                  options={PERIODICIDADE_OPTIONS}
                  placeholder="Selecione"
                  value={field.value === Periodicidade.NENHUMA ? "" : field.value}
                  onChange={(value) => field.onChange(value)}
                  onBlur={field.onBlur}
                  name={field.name}
                  error={form.formState.errors.periodicidade}
                />
              )}
            />
          )}

          {!isEditMode && (
            <>
              <Switch
                label="Parcelado"
                checked={parcelado}
                disabled={!valorPreenchido || periodicidadeAtiva}
                onCheckedChange={handleParceladoSwitch}
              />

              {parcelado && (
                <Input
                  placeholder="Informe o número de parcelas"
                  type="number"
                  inputMode="numeric"
                  min={2}
                  step={1}
                  onKeyDown={(e) => {
                    if (!/^[0-9]$/.test(e.key) && !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onInput={(e) => {
                    const input = e.currentTarget as HTMLInputElement;
                    input.value = input.value.replace(/[^0-9]/g, "");
                  }}
                  {...form.register("quantidadeParcelas", { valueAsNumber: true })}
                  error={form.formState.errors.quantidadeParcelas}
                />
              )}
            </>
          )}
        </div>

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
