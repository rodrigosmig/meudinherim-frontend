"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";

import Modal from "@/components/modal";
import { Button } from "@/components/primitives/button";
import { Input } from "@/components/primitives/input";
import { InputMoney } from "@/components/primitives/input-money";
import { Select } from "@/components/primitives/select";
import { toast } from "@/components/toast";

import { useCategorias } from "@/hooks/use-categorias";

import { keysToInvalidateForConta } from "@/helpers/query-keys-helper";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { toBrDate } from "@/helpers/string-helper";

import {
  fecharFaturaSchema,
  type FecharFaturaFormValue,
} from "@/schema-validation/fechar-fatura";
import { faturasService } from "@/services/faturas-service";
import ApiError from "@/types/application-error";
import type { Fatura } from "@/types/faturas";

type Props = Readonly<{
  fatura: Fatura;
  children?: ReactNode;
}>;

const defaultValues: FecharFaturaFormValue = {
  idCategoria: "",
};

export default function FecharFaturaForm({ fatura, children }: Props) {
  const params = useParams<{ idCartao: string; idFatura: string }>();
  const idCartao = params.idCartao;
  const idFatura = params.idFatura;

  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { categoriasSaida, isLoading: isCategoriasLoading } = useCategorias();

  const categoriasSaidaOptions = useMemo(
    () => categoriasSaida.map((c) => ({ value: c.uuid, label: c.nome })),
    [categoriasSaida],
  );

  const form = useForm<FecharFaturaFormValue>({
    resolver: zodResolver(fecharFaturaSchema),
    defaultValues,
  });

  const fecharFaturaMutation = useMutation({
    mutationFn: (data: FecharFaturaFormValue) =>
      faturasService.fecharFatura(idCartao, idFatura, {
        idCategoria: data.idCategoria,
      }),
    onSuccess: () => {
      toast.success("Fatura fechada com sucesso!");
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
    if (!open) {
      form.reset(defaultValues);
    }
  }

  function onSubmit(data: FecharFaturaFormValue) {
    fecharFaturaMutation.mutate(data);
  }

  return (
    <Modal
      title="Fechar Fatura"
      trigger={children}
      open={isOpen}
      onOpenChange={handleOpenChange}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          control={form.control}
          name="idCategoria"
          render={({ field }) => (
            <Select
              icon={Bookmark}
              label="Categoria"
              options={categoriasSaidaOptions}
              placeholder="Selecione uma categoria"
              {...field}
              error={form.formState.errors.idCategoria}
            />
          )}
        />

        <Input
          label="Vencimento"
          value={toBrDate(fatura.dataVencimento)}
          disabled
          readOnly
        />

        <Input
          label="Descrição"
          value={`Fatura: ${fatura.cartao.descricao}`}
          disabled
          readOnly
        />

        <InputMoney
          label="Valor"
          value={fatura.valorTotal}
          disabled
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="cancel" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={fecharFaturaMutation.isPending}
            disabled={isCategoriasLoading || fecharFaturaMutation.isPending}
          >
            Fechar Fatura
          </Button>
        </div>
      </form>
    </Modal>
  );
}
