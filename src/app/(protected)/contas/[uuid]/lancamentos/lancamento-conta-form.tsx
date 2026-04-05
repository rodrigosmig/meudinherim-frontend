import { LancamentoContaFormValue, lancamentoContaSchema } from "@/schema-validation/lancamento-conta";
import { Controller, DefaultValues, useForm } from "react-hook-form";
import { Bookmark, BookType, Landmark, Tags } from "lucide-react";
import { InputMoney } from "@/components/primitives/input-money";
import InputDate from "@/components/primitives/input-date";
import { LancamentoConta } from "@/types/lancamento-conta";
import { Select } from "@/components/primitives/select";
import { Button } from "@/components/primitives/button";
import { useCategorias } from "@/hooks/use-categorias";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/primitives/input";
import { useContas } from "@/hooks/use-contas";
import { useTags } from "@/hooks/use-tags";
import Modal from "@/components/modal";
import { useEffect, useState, ReactNode } from "react";
import { toast } from "@/components/toast";
import { catalogoErros } from "@/helpers/erros-helper";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { DADOS_CONFIGURACAO_QUERY_KEY, LANCAMENTOS_CONTA_QUERY_KEY } from "@/helpers/query-keys-helper";
import { toUsDate } from "@/helpers/string-helper";
import { lancamentoContaService } from "@/services/lancamento-conta-service";
import { ApiFormError } from "@/types/api";
import ApiError from "@/types/application-error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

type AddLancamentoContaFormProps = Readonly<{
  lancamentoConta?: LancamentoConta;
  children?: ReactNode;
}>

const getDefaultValues = (idConta = ""): DefaultValues<LancamentoContaFormValue> => ({
  idConta,
  idCategoria: "",
  dataLancamento: new Date(),
  descricao: "",
  valor: undefined,
  tags: []
});

export default function LancamentoContaForm({ children }: AddLancamentoContaFormProps) {
  const params = useParams<{ uuid: string }>();
  const idContaRota = params.uuid;
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const { contasOptions, isLoading: isContasLoading } = useContas();
  const { tagsOptions, isLoading: isTagsLoading } = useTags();
  const { categoriasOptions, isLoading: isCategoriasLoading } = useCategorias();


  const form = useForm<LancamentoContaFormValue>({
    resolver: zodResolver(lancamentoContaSchema),
    defaultValues: getDefaultValues(idContaRota),
  });

  const isLoading = isContasLoading || isTagsLoading || isCategoriasLoading;

  useEffect(() => {
    if (idContaRota) {
      form.setValue("idConta", idContaRota, { shouldValidate: true });
    }
  }, [form, idContaRota]);

  const cadastrarLancamentoMutation = useMutation({
    mutationFn: async (data: LancamentoContaFormValue) => {
      return lancamentoContaService.cadastrar({
        idConta: idContaRota,
        idCategoria: data.idCategoria,
        dataLancamento: toUsDate(data.dataLancamento),
        descricao: data.descricao.trim(),
        valor: data.valor,
        tags: data.tags?.length ? data.tags : undefined,
      });
    },
  });

  function handleOpenChange(isOpen: boolean) {
    setIsOpen(isOpen);

    if (!isOpen) {
      form.reset(getDefaultValues(idContaRota));
    }
  }

  const onSubmit = async (data: LancamentoContaFormValue) => {
    try {
      await cadastrarLancamentoMutation.mutateAsync(data);

      toast.success("Lançamento cadastrado com sucesso!");

      handleOpenChange(false);

      void Promise.all([
        queryClient.invalidateQueries({ queryKey: [LANCAMENTOS_CONTA_QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: [DADOS_CONFIGURACAO_QUERY_KEY] }),
      ]);
    } catch (error) {
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
      return;
    }
  };

  return (
    <Modal
      title="Adicionar lançamento"
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
              label={"Conta"}
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
              label={"Categoria"}
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
            <InputMoney label="Valor" {...field} error={form.formState.errors.valor} />
          )}
        />

        <Controller
          control={form.control}
          name="tags"
          render={({ field }) => (
            <Select
              isMulti
              icon={Tags}
              label={"Tags"}
              options={tagsOptions}
              placeholder="Selecione as tags..."
              {...field}
            />
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={form.formState.isSubmitting}
            disabled={isLoading || form.formState.isSubmitting}
          >
            Salvar
          </Button>
        </div>
      </form>
    </Modal>
  )
}