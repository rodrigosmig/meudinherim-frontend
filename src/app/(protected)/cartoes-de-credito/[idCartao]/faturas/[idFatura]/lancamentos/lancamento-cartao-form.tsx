"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bookmark, BookType, CreditCard, Tags } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Controller, useForm, type DefaultValues } from "react-hook-form";

import Modal from "@/components/modal";
import { Button } from "@/components/primitives/button";
import { Input } from "@/components/primitives/input";
import InputDate from "@/components/primitives/input-date";
import { InputMoney } from "@/components/primitives/input-money";
import { Select } from "@/components/primitives/select";
import Switch from "@/components/primitives/switch";
import Text from "@/components/primitives/text";
import { toast } from "@/components/toast";

import { useCategorias } from "@/hooks/use-categorias";
import { useConfiguracaoInicial } from "@/hooks/use-configuracao-inicial";
import { useTags } from "@/hooks/use-tags";

import { catalogoErros } from "@/helpers/erros-helper";
import {
  keysToInvalidateForCartao
} from "@/helpers/query-keys-helper";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { toCurrency, toUsDate } from "@/helpers/string-helper";

import {
  lancamentoCartaoSchema,
  type LancamentoCartaoFormValue,
} from "@/schema-validation/lancamento-cartao";
import { lancamentoCartaoService } from "@/services/lancamento-cartao-service";
import type { ApiFormError } from "@/types/api";
import ApiError from "@/types/application-error";
import type { LancamentoCartao } from "@/types/lancamento-cartao";

type Props = Readonly<{
  lancamentoCartao?: LancamentoCartao;
  children?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}>;

function getDefaultValues(
  idCartao: string,
  lancamentoCartao?: LancamentoCartao,
): DefaultValues<LancamentoCartaoFormValue> {
  if (!lancamentoCartao) {
    return {
      idCartao,
      idCategoria: "",
      dataLancamento: new Date(),
      descricao: "",
      valor: undefined,
      parcelado: false,
      quantidadeParcelas: undefined,
      tags: [],
    };
  }

  return {
    idCartao,
    idCategoria: lancamentoCartao.categoria.uuid,
    dataLancamento: new Date(`${lancamentoCartao.data}T00:00:00`),
    descricao: lancamentoCartao.descricao,
    valor: lancamentoCartao.valor,
    parcelado: lancamentoCartao.isParcelado,
    quantidadeParcelas: lancamentoCartao.parcelas?.length,
    tags: lancamentoCartao.tags ?? [],
  };
}

export default function LancamentoCartaoForm({ lancamentoCartao, children, open: controlledOpen, onOpenChange: controlledOnOpenChange }: Props) {
  const params = useParams<{ idCartao: string }>();
  const idCartaoFromParams = (params.idCartao as string | undefined) ?? "";

  const isEditMode = Boolean(lancamentoCartao?.uuid);
  const [isOpen, setIsOpen] = useState(false);
  const resolvedIsOpen = controlledOpen !== undefined ? controlledOpen : isOpen;
  const queryClient = useQueryClient();

  const { data: configData } = useConfiguracaoInicial();
  const { categoriasOptions, isLoading: isCategoriasLoading } = useCategorias();
  const { tagsOptions, isLoading: isTagsLoading } = useTags();

  const isLoadingDependencies = isCategoriasLoading || isTagsLoading;

  const cartaoOptions = useMemo(() => {
    if (!configData?.faturas) return [];
    const seen = new Set<string>();
    return configData.faturas
      .filter((f) => {
        if (seen.has(f.cartao.uuid)) return false;
        seen.add(f.cartao.uuid);
        return true;
      })
      .map((f) => ({ value: f.cartao.uuid, label: f.cartao.descricao }));
  }, [configData?.faturas]);

  const defaultValues = useMemo(
    () => getDefaultValues(idCartaoFromParams, lancamentoCartao),
    [idCartaoFromParams, lancamentoCartao],
  );

  const form = useForm<LancamentoCartaoFormValue>({
    resolver: zodResolver(lancamentoCartaoSchema),
    defaultValues,
  });

  const valor = form.watch("valor");
  const parcelado = form.watch("parcelado");
  const quantidadeParcelas = form.watch("quantidadeParcelas");
  const valorPreenchido = !!valor && valor > 0;
  const valorParcela = valor && quantidadeParcelas && quantidadeParcelas > 0
    ? valor / quantidadeParcelas
    : 0;

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  function handleParceladoSwitch(checked: boolean) {
    form.setValue("parcelado", checked);
    if (!checked) {
      form.setValue("quantidadeParcelas", undefined);
    }
  }

  const cadastrarLancamentoCartaoMutation = useMutation({
    mutationFn: async (data: LancamentoCartaoFormValue) => {
      if (isEditMode && lancamentoCartao?.uuid) {
        return lancamentoCartaoService.alterar(lancamentoCartao.uuid, {
          idConta: data.idCartao,
          idCategoria: data.idCategoria,
          descricao: data.descricao.trim(),
          valor: data.valor,
          tags: data.tags?.length ? data.tags : undefined,
        });
      }

      return lancamentoCartaoService.cadastrar({
        idConta: data.idCartao,
        idCategoria: data.idCategoria,
        dataLancamento: toUsDate(data.dataLancamento),
        descricao: data.descricao.trim(),
        valor: data.valor,
        parcelado: data.parcelado,
        quantidadeParcelas: data.parcelado ? (data.quantidadeParcelas ?? 2) : 1,
        tags: data.tags?.length ? data.tags : undefined,
      });
    },
    onSuccess: () => {
      toast.success(
        isEditMode ? "Lançamento alterado com sucesso!" : "Lançamento cadastrado com sucesso!",
      );
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
              ["idCartao", "idCategoria", "dataLancamento", "descricao", "valor", "parcelado", "quantidadeParcelas", "tags"].includes(
                fieldError.field,
              )
            ) {
              form.setError(fieldError.field as keyof LancamentoCartaoFormValue, {
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
    controlledOnOpenChange?.(open);
    if (!open) form.reset(defaultValues);
  }

  function onSubmit(data: LancamentoCartaoFormValue) {
    cadastrarLancamentoCartaoMutation.mutate(data);
  }

  return (
    <Modal
      title={isEditMode ? "Editar lançamento" : "Adicionar lançamento"}
      trigger={children}
      open={resolvedIsOpen}
      onOpenChange={handleOpenChange}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          control={form.control}
          name="idCartao"
          render={({ field }) => (
            <Select
              icon={CreditCard}
              label="Cartão"
              options={cartaoOptions}
              placeholder="Selecione um cartão"
              disabled={isEditMode}
              {...field}
              error={form.formState.errors.idCartao}
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
              disabled={isEditMode}
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
              isCreatable
              icon={Tags}
              label="Tags"
              options={tagsOptions}
              placeholder="Selecione as tags..."
              {...field}
            />
          )}
        />

        {!isEditMode && (
          <div className="space-y-3">
            <Switch
              label="Parcelado"
              checked={parcelado}
              disabled={!valorPreenchido}
              onCheckedChange={handleParceladoSwitch}
            />

            {parcelado && (
              <>
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
                <Text variant="caption" className="text-gray-400">
                  Valor de cada parcela: {toCurrency(valorParcela)}
                </Text>
              </>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="cancel" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={cadastrarLancamentoCartaoMutation.isPending}
            disabled={isLoadingDependencies || cadastrarLancamentoCartaoMutation.isPending}
          >
            Salvar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
