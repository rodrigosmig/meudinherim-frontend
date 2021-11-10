import { 
  Box,
  Button,
  Flex,
  Stack,
  useToast
} from "@chakra-ui/react";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { SubmitButton } from "../../Buttons/Submit";
import { Input } from "../../Inputs/Input";
import { Datepicker } from "../../DatePicker";
import { SelectCategories } from "../../Inputs/SelectCategories";
import { format, parseISO } from 'date-fns';
import { accountEntriesService } from '../../../services/ApiService/AccountEntriesService';
import { useCategoriesForm } from "../../../hooks/useCategories";
import { reverseBrDate } from "../../../utils/helpers";
import { Loading } from "../../Loading";

interface Category {
  id: number,
  type: 1 | 2,
  name: string,
}

interface Account {
  id: number;
  name: string;
  type: {
    id: string | 'money' | 'savings' | 'checking_account' | 'investment';
    desc: string;
  }
  balance: number;
}

interface AccountEntry {
  id: number;
  date: string;
  category: Category;
  description: string;
  value: number;
  account: Account;
}

interface EditAccountEntryFormProps {
  entry: AccountEntry;
  closeModal: () => void,
  refetch: () => void
}

interface FormData {
  date: Date;
  category_id: number;
  description: string;
  value: number;
}

type ResponseError = {
  category_id: string[];
  description: string[];
  value: string[];
}

type Key = keyof ResponseError;

const validationSchema = yup.object().shape({
  date: yup.date().typeError("O campo data é obrigatório"),
  category_id: yup.number().integer("Categoria inválida").typeError("O campo categoria é inválido"),
  description: yup.string().required("O campo descrição é obrigatório").min(3, "O campo descrição deve ter no mínimo 3 caracteres"),
  value: yup.number().positive("O valor deve ser maior que zero").typeError("O campo valor é obrigatório")
})

export const EditAccountEntryForm = ({ entry, closeModal, refetch }: EditAccountEntryFormProps) => {  
  const toast = useToast();

  const { data: categories, isLoading } = useCategoriesForm();

  const { control, register, handleSubmit, setError, formState } = useForm({
    defaultValues: {
      date: parseISO(reverseBrDate(entry.date)),
      category_id: entry.category.id,
      description: entry.description,
      value: entry.value
    },
    resolver: yupResolver(validationSchema)
  });

  const { errors } = formState;

  const handleEditAccountEntry: SubmitHandler<FormData> = async (values) => {
    const data = {
      id: entry.id,
      data: {
        ...values,
        account_id: entry.account.id,
        date: values?.date ? format(values.date, 'Y-MM-dd') : ''
      }
    }
    
    try {
      await accountEntriesService.update(data)
      
      toast({
        title: "Sucesso",
        description: "Alteração realizada com sucesso",
        position: "top-right",
        status: 'success',
        duration: 10000,
        isClosable: true,
      })

      refetch();
      closeModal();

    } catch (error) {
      if (error.response?.status === 422) {
        const data: ResponseError = error.response.data;

        let key: Key        
        for (key in data) {          
          data[key].map(error => {
            setError(key, {message: error})
          })
        }
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
      onSubmit={handleSubmit(handleEditAccountEntry)}
      >
      <Stack spacing={[4]}>
        <Controller
          control={control}
            name="date"
            render={({ field }) => (
              <Datepicker
                label="Data"
                error={errors.date}
                selected={field.value}
                onChange={(date) => field.onChange(date)}
              />
           )}
        />

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
          onClick={closeModal}
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
