import { LancamentoContaFormValue, lancamentoContaSchema } from "@/schema-validation/lancamento-conta";
import { Controller, DefaultValues, useForm } from "react-hook-form";
import { Bookmark, BookType, Landmark, Tags } from "lucide-react";
import { InputMoney } from "@/components/primitives/input-money";
import MultiSelect from "@/components/primitives/multi-select";
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
import { useState } from "react";

type AddLancamentoContaFormProps = {
  lancamentoConta?: LancamentoConta;
  children?: React.ReactNode;
}

const getDefaultValues = (): DefaultValues<LancamentoContaFormValue> => ({
  idConta: "",
  idCategoria: "",
  dataLancamento: new Date(),
  descricao: "",
  valor: undefined,
});

export default function LancamentoContaForm({ lancamentoConta, children }: AddLancamentoContaFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { contas, isLoading: isContasLoading } = useContas();
  const { tagsOptions, isLoading: isTagsLoading } = useTags();
  const { categoriasEntrada, categoriasSaida, isLoading: isCategoriasLoading } = useCategorias();


  const form = useForm<LancamentoContaFormValue>({
    resolver: zodResolver(lancamentoContaSchema),
    defaultValues: getDefaultValues(),
  });

  const isLoading = isContasLoading || isTagsLoading || isCategoriasLoading;

  function handleOpenChange(isOpen: boolean) {
    setIsOpen(isOpen);

    if (!isOpen) {
      form.reset(getDefaultValues());
    }
  }

  const onSubmit = async (data: LancamentoContaFormValue) => {
    console.log("Dados do formulário:", data);
    // try {
    //   //await login(data);

    //   setIsOpen(false);
    // } catch (error) {
    //   if (error instanceof ApiError) {
    //     if (error.apiMessage.codigo === catalogoErros.CAMPO_INVALIDO_OU_OBRIGATORIO) {
    //       const formError = error.data as ApiFormError;

    //       formError.fields.forEach((fieldError) => {
    //         if (["idCategoria", "dataLancamento", "descricao", "valor"].includes(fieldError.field)) {
    //           form.setError(fieldError.field as keyof LancamentoContaFormValue, {
    //             type: "server",
    //             message: fieldError.message,
    //           });
    //         }
    //       });
    //     }

    //     toast.error(error.apiMessage.descricao);
    //     return;
    //   }

    //   toast.error(DEFAULT_ERROR_MESSAGE);
    //   return;
    // }
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
            <Select.Root
              icon={Landmark}
              label="Conta"
              placeholder="Selecione uma conta"
              value={field.value}
              onValueChange={field.onChange}
            >
              {contas.map(conta => (
                <Select.Item key={conta.uuid} text={conta.nome} value={conta.uuid} />
              ))}
            </Select.Root>
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
            />
          )}
        />

        <Controller
          control={form.control}
          name="idCategoria"
          render={({ field }) => (
            <Select.Root
              icon={Bookmark}
              placeholder="Selecione uma categoria"
              label="Categoria"
              value={field.value}
              onValueChange={field.onChange}
            >
              <Select.Group label="Entrada">
                {categoriasEntrada.map(categoria => (
                  <Select.Item
                    key={categoria.uuid}
                    text={categoria.nome}
                    value={categoria.uuid}
                  />
                ))}
              </Select.Group>
              <Select.Group label="Saída">
                {categoriasSaida.map(categoria => (
                  <Select.Item
                    key={categoria.uuid}
                    text={categoria.nome}
                    value={categoria.uuid}
                  />
                ))}
              </Select.Group>
            </Select.Root>
          )}
        />

        <Input
          icon={BookType}
          label="Descrição"
          placeholder="Descrição"
          {...form.register("descricao")}
        />

        <Controller
          control={form.control}
          name="valor"
          render={({ field }) => (
            <InputMoney label="Valor" {...field} />
          )}
        />

        <MultiSelect
          icon={Tags}
          label={"Tags"}
          options={tagsOptions}
          placeholder="Selecione as tags..."
        />

        <div className="flex justify-end gap-2">
          <Button type="button" onClick={() => handleOpenChange(false)}>Cancelar</Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Modal>
  )
}