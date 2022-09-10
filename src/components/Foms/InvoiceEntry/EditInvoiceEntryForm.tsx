import { 
  Box,
  Button,
  Flex,
  Stack
} from "@chakra-ui/react";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { SubmitButton } from "../../Buttons/Submit";
import { Input } from "../../Inputs/Input";
import { SelectCategories } from "../../Inputs/SelectCategories";
import { invoiceEntriesService } from "../../../services/ApiService/InvoiceEntriesService";
import { useCategoriesForm } from "../../../hooks/useCategories";
import { Loading } from "../../Loading";
import { CARDS, getMessage, INVOICE, INVOICES, INVOICE_ENTRIES, OPEN_INVOICES } from "../../../utils/helpers";
import { IInvoiceEntry, IInvoiceEntryErrorKey, IInvoiceEntryFormData, IInvoiceEntryResponseError } from "../../../types/invoiceEntry";
import { editValidation } from "../../../validations/invoiceEntry";
import { useQueryClient } from "react-query";

interface Props {
  entry: IInvoiceEntry;
  onClose: () => void,
}

export const EditInvoiceEntryForm = ({ entry, onClose }: Props) => {  
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useCategoriesForm();

  const { register, handleSubmit, setError, formState } = useForm({
    defaultValues:{
      category_id: entry.category.id,
      description: entry.description,
      value: entry.value,
    },
    resolver: yupResolver(editValidation)
  });

  const { errors } = formState;

  const handleCreateInvoiceEntry: SubmitHandler<IInvoiceEntryFormData> = async (values) => {
    const data = {
      id: entry.id,
      data: {
        category_id: values.category_id,
        description: values.description,
        value: values.value
      }
    }

    try {
      const response = await invoiceEntriesService.update(data)

      getMessage("Sucesso", `Lançamento ${values.description} alterado com sucesso`);

      queryClient.invalidateQueries(INVOICE)
      queryClient.invalidateQueries(INVOICES)
      queryClient.invalidateQueries(INVOICE_ENTRIES)
      queryClient.invalidateQueries(OPEN_INVOICES)
      queryClient.invalidateQueries(CARDS)

      onClose();

    } catch (error) {
      if (error.response?.status === 422) {
        const data: IInvoiceEntryResponseError = error.response.data;

        let key: IInvoiceEntryErrorKey        
        for (key in data) {          
          data[key].map(error => {
            setError(key, {message: error})
          })
        }
      } else if (error.response?.status === 400) {
        getMessage("Erro", error.response.data.message, 'error');
      }
    }
  }

  if (isLoading) {
    return (
      <Loading />
    )
  }

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(handleCreateInvoiceEntry)}
      >
      <Stack spacing={[4]}>
        <SelectCategories
          name="type"
          label="Categoria"
          options={categories}
          error={errors.category_id}
          {...register('category_id')}
        />
        <Input
          name="description"
          type="text"
          label="Descrição"
          error={errors.description}
          {...register('description')}
        />

        <Input
          name="value"
          type="number"
          label="Valor"
          error={errors.value}
          step="0.01"
          {...register('value')}
        />
      </Stack>
      <Flex
        mt={[10]}
        justify="flex-end"
        align="center"
      >
        <Button
          mr={[4]}
          variant="outline"
          isDisabled={formState.isSubmitting}
          onClick={onClose}
        >
          Cancelar
        </Button>

        <SubmitButton
          label="Salvar"
          size="md"
          isLoading={formState.isSubmitting}
        />
      </Flex>
    </Box>
  )
}
