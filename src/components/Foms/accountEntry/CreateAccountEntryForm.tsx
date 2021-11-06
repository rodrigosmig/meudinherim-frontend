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
import { format } from 'date-fns';
import { accountEntriesService } from '../../../services/ApiService/AccountEntriesService';
import { Select } from "../../Inputs/Select";

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

interface AccountForm {
  value: string;
  label: string;
}

interface FormData {
  account_id: number;
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

interface CreateAccountEntryFormProps {
  categories: CategoriesForForm;
  formAccounts: AccountForm[]
}

const validationSchema = yup.object().shape({
  account_id: yup.number().integer("Conta inválida").typeError("O campo conta é inválido"),
  date: yup.date().typeError("O campo data é obrigatório"),
  category_id: yup.number().integer("Categoria inválida").typeError("O campo categoria é inválido"),
  description: yup.string().required("O campo descrição é obrigatório").min(3, "O campo descrição deve ter no mínimo 3 caracteres"),
  value: yup.number().positive("O valor deve ser maior que zero").typeError("O campo valor é obrigatório")
})

export const CreateAccountEntryForm = ({ categories, formAccounts }: CreateAccountEntryFormProps) => {  
  const toast = useToast();
  const router = useRouter();

  const { control, register, handleSubmit, setError, formState } = useForm({
    defaultValues:{
      date: new Date(),
      account_id: "",
      category_id: "",
      description: "",
      value: 0
    },
    resolver: yupResolver(validationSchema)
  });

  const { errors } = formState;

  const handleCreateAccountEntry: SubmitHandler<FormData> = async (values) => {
    const data = {
      ...values,
        date: values?.date ? format(values.date, 'Y-MM-dd') : ''
    }

    try {
      const response = await accountEntriesService.create(data)

      toast({
        title: "Sucesso",
        description: `Lançamento ${values.description} criado com sucesso`,
        position: "top-right",
        status: 'success',
        duration: 10000,
        isClosable: true,
      })

      router.push(`/accounts/${response.data.account.id}/entries`)

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
      onSubmit={handleSubmit(handleCreateAccountEntry)}
      >
      <Stack spacing={[4]}>
        <Select
          name="type"
          label="Conta"
          options={formAccounts}
          error={errors.account_id}
          {...register('account_id')}
        />

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
        <Link href={`/dashboard`} passHref>
          <Button
            mr={[4]}
            variant="outline"
            isDisabled={formState.isSubmitting}
          >
            Cancelar
          </Button>
        </Link>

        <SubmitButton
          label="Salvar"
          size="md"
          isLoading={formState.isSubmitting}
        />
      </Flex>
    </Box>
  )
}
