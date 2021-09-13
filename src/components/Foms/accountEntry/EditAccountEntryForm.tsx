import { useRouter } from "next/router";
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
import Link from "next/link";
import { Datepicker } from "../../DatePicker";
import { SelectCategories } from "../../Inputs/SelectCategories";
import { format, parseISO } from 'date-fns';
import { accountEntriesService } from '../../../services/ApiService/AccountEntriesService';

interface Category {
  id: number,
  type: 1 | 2,
  name: string,
}

type CategoriesForForm = {
  income: {
    id: number;
    label: string
  }[]
  expense: {
    id: number;
    label: string
  }[]
}

interface Account {
  id: number;
  name: string;
  type: {
    id: 'money' | 'savings' | 'checking_account' | 'investment';
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
  categories: CategoriesForForm;
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
  value: yup.number().positive("O valor deve ser positivo").typeError("O campo valor é obrigatório")
})

export const EditAccountEntryForm = ({ entry, categories }: EditAccountEntryFormProps) => {  
  const toast = useToast();
  const router = useRouter();

  const { control, register, handleSubmit, setError, formState } = useForm({
  defaultValues: {
    date: parseISO(entry.date),
    category_id: entry.category.id,
    description: entry.description,
    value: entry.value
  },
  resolver: yupResolver(validationSchema)
});

  const { errors } = formState;

  const handleEditAccountEntry: SubmitHandler<FormData> = async (values) => {
    console.log(values)
    const data = {
      id: entry.id,
      data: {
        ...values,
        date: values?.date ? format(values.date, 'Y-MM-dd') : ''
      }
    }
    
    try {
      const response = await accountEntriesService.update(data)
      
      toast({
        title: "Sucesso",
        description: "Alteração realizada com sucesso",
        position: "top-right",
        status: 'success',
        duration: 10000,
        isClosable: true,
      })

      router.push(`/accounts/${entry.account.id}/entries`)

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
        <SubmitButton
          mr={[4]}
          label="Salvar"
          size="md"
          isLoading={formState.isSubmitting}
        />

        <Link href={`/accounts/${entry.account.id}/entries`} passHref>
          <Button
            variant="outline"
            isDisabled={formState.isSubmitting}
          >
            Cancelar
          </Button>
        </Link>
      </Flex>
    </Box>
  )
}
