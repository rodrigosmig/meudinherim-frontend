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
import { getMessage } from "../../../utils/helpers";

interface FormData {
  category_id: number;
  description: string;
  value: number;
}

interface Category {
  id: number,
  type: 1 | 2,
  name: string,
}

interface InvoiceEntry {
  id: number;
  date: string;
  description: string;
  value: number;
  category: Category;
  card_id: number;
  invoice_id: number;
  is_parcel: boolean;
  parcel_number: number;
  parcel_total: number;
  total_purchase: number;
  parcelable_id: number;
  anticipated: boolean;
}

interface EditInvoiceEntryFormProps {
  entry: InvoiceEntry;
  onClose: () => void,
  refetch: () => void
}

type ResponseError = {
  category_id: string[];
  description: string[];
  value: string[];
}

type Key = keyof ResponseError;

const validationSchema = yup.object().shape({
  card_id: yup.number().integer("Cartão de Crédito inválido").typeError("O campo cartão de crédito é inválido"),
  category_id: yup.number().integer("Categoria inválida").typeError("O campo categoria é inválido"),
  description: yup.string().required("O campo descrição é obrigatório").min(3, "O campo descrição deve ter no mínimo 3 caracteres"),
  value: yup.number().positive("O valor deve ser maior que zero").typeError("O campo valor é obrigatório")
})

export const EditInvoiceEntryForm = ({ entry, onClose, refetch }: EditInvoiceEntryFormProps) => {  
  const { data: categories, isLoading } = useCategoriesForm();

  const { register, handleSubmit, setError, formState } = useForm({
    defaultValues:{
      category_id: entry.category.id,
      description: entry.description,
      value: entry.value,
    },
    resolver: yupResolver(validationSchema)
  });

  const { errors } = formState;

  const handleCreateInvoiceEntry: SubmitHandler<FormData> = async (values) => {
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

      refetch();
      onClose();

    } catch (error) {
      if (error.response?.status === 422) {
        const data: ResponseError = error.response.data;

        let key: Key        
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
