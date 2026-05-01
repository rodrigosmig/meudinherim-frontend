"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Controller, useForm, type DefaultValues } from "react-hook-form";

import Modal from "@/components/modal";
import { Button } from "@/components/primitives/button";
import { Input } from "@/components/primitives/input";
import { Select } from "@/components/primitives/select";
import Switch from "@/components/primitives/switch";
import { toast } from "@/components/toast";

import { catalogoErros } from "@/helpers/erros-helper";
import { CATEGORIAS_QUERY_KEY, DADOS_CONFIGURACAO_QUERY_KEY } from "@/helpers/query-keys-helper";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";

import { categoriaSchema, type CategoriaFormValue } from "@/schema-validation/categoria";
import { categoriasService } from "@/services/categorias-service";
import type { ApiFormError } from "@/types/api";
import ApiError from "@/types/application-error";
import type { Categoria } from "@/types/categoria";
import { TipoCategoria } from "@/types/enum/tipo-categoria";

const TIPO_OPTIONS = [
  { value: TipoCategoria.ENTRADA, label: "Entrada" },
  { value: TipoCategoria.SAIDA, label: "Saída" },
];

type Props = Readonly<{
  categoria?: Categoria;
  children?: ReactNode;
}>;

function getDefaultValues(categoria?: Categoria): DefaultValues<CategoriaFormValue> {
  if (!categoria) {
    return { nome: "", tipo: undefined, exibirNaDashboard: false };
  }

  return {
    nome: categoria.nome,
    tipo: categoria.tipo,
    exibirNaDashboard: categoria.exibirNaDashboard,
  };
}

export default function CategoriaForm({ categoria, children }: Props) {
  const isEditMode = Boolean(categoria?.uuid);
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const defaultValues = useMemo(() => getDefaultValues(categoria), [categoria]);

  const form = useForm<CategoriaFormValue>({
    resolver: zodResolver(categoriaSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const salvarCategoriaMutation = useMutation({
    mutationFn: async (data: CategoriaFormValue) => {
      const values = {
        nome: data.nome,
        tipo: data.tipo,
        exibirNaDashboard: data.exibirNaDashboard,
      };

      if (isEditMode && categoria?.uuid) {
        return categoriasService.alterar(categoria.uuid, values);
      }

      return categoriasService.cadastrar(values);
    },
    onSuccess: () => {
      toast.success(
        isEditMode ? "Categoria alterada com sucesso!" : "Categoria cadastrada com sucesso!",
      );
      handleOpenChange(false);

      void Promise.all([
        queryClient.invalidateQueries({ queryKey: [CATEGORIAS_QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: [DADOS_CONFIGURACAO_QUERY_KEY] }),
      ]);
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        if (error.apiMessage.codigo === catalogoErros.CAMPO_INVALIDO_OU_OBRIGATORIO) {
          const formError = error.data as ApiFormError;
          formError.fields.forEach((fieldError) => {
            if (["nome", "tipo", "exibirNaDashboard"].includes(fieldError.field)) {
              form.setError(fieldError.field as keyof CategoriaFormValue, {
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

  function onSubmit(data: CategoriaFormValue) {
    salvarCategoriaMutation.mutate(data);
  }

  return (
    <Modal
      title={isEditMode ? "Editar categoria" : "Adicionar categoria"}
      trigger={children}
      open={isOpen}
      onOpenChange={handleOpenChange}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input
          icon={Bookmark}
          label="Nome"
          placeholder="Nome da categoria"
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
          name="exibirNaDashboard"
          render={({ field }) => (
            <Switch
              label="Exibir na Dashboard"
              checked={field.value}
              onCheckedChange={field.onChange}
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
