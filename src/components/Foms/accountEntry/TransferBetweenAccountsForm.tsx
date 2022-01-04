import { useRouter } from "next/router";
import { 
  Box,
  Button,
  Divider,
  Flex,
  Stack
} from "@chakra-ui/react";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { SubmitButton } from "../../Buttons/Submit";
import { Input } from "../../Inputs/Input";
import { Datepicker } from "../../DatePicker";
import { accountEntriesService } from '../../../services/ApiService/AccountEntriesService';
import { Select } from "../../Inputs/Select";
import { getMessage, toUsDate } from "../../../utils/helpers";
import { useCategoriesForm } from "../../../hooks/useCategories";
import { Loading } from "../../Loading";
import { useAccountsForm } from "../../../hooks/useAccounts";
import { Heading } from "../../Heading";
import { useQueryClient } from "react-query";


interface FormData {
  date: Date;
  description: string;
  value: number;
  source_category_id: number;
  destination_category_id: number;
  source_account_id: number;
  destination_account_id: number;
}

type ResponseError = {
  date: string[];
  description: string[];
  value: string[];
  source_category_id: string[];
  destination_category_id: string[];
  source_account_id: string[];
  destination_account_id: string[];
}

type Key = keyof ResponseError;

interface CreateAccountEntryFormProps {
  onCancel: () => void;
}

const validationSchema = yup.object().shape({
  date: yup.date().typeError("O campo vencimento é obrigatório"),
  description: yup.string().required("O campo descrição é obrigatório").min(3, "O campo descrição deve ter no mínimo 3 caracteres"),
  value: yup.number().positive("O valor deve ser maior que zero").typeError("O campo valor é inválido"),
  source_category_id: yup.number().integer("Categoria inválida").typeError("O campo categoria de origem é inválido"),
  destination_category_id: yup.number().integer("Categoria inválida").typeError("O campo categoria de destino é inválido"),
  source_account_id: yup.number().integer("Categoria inválida").typeError("O campo conta de origem é inválido"),
  destination_account_id: yup.number().integer("Categoria inválida").typeError("O campo conta de destino é inválido"),
})

export const TransferBetweenAccountsForm = ({ onCancel}: CreateAccountEntryFormProps) => {  
  const queryClient = useQueryClient();

  const { data: categories, isLoading: isLoadingCategories } = useCategoriesForm();
  const { data: formAccounts, isLoading: isLoadingAccounts } = useAccountsForm();

  const { control, register, handleSubmit, setError, formState } = useForm({
    defaultValues:{
      date: new Date(),
      description: "",
      value: "",
      source_account_id: "",
      destination_account_id: "",
      source_category_id: "",
      destination_category_id: ""
    },
    resolver: yupResolver(validationSchema)
  });

  const { errors } = formState;

  const handleTransfer: SubmitHandler<FormData> = async (values) => {
    const data = {
      ...values,
        date: values?.date ? toUsDate(values.date) : ''
    }

    try {
      await accountEntriesService.accountTransfer(data);

      getMessage("Sucesso", "Transferência realizada com sucesso");

      onCancel();
      queryClient.invalidateQueries('accountEntries');
      queryClient.invalidateQueries('account_balance');

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

      if (error.response?.status === 400) {
        const message = error.response.data.message 

        getMessage("Erro", message, 'error');
      }
    }
  }

  const getExpenseCategories = () => {
    return categories?.expense.map(category => {
      return {
        value: category.id,
        label: category.label
      }
    })
  }

  const getIncomeCategories = () => {
    return categories?.income.map(category => {
      return {
        value: category.id,
        label: category.label
      }
    })
  }

  if (isLoadingCategories || isLoadingAccounts) {
    return (
      <Loading />
    )
  }

  return (
    <Box
    as="form"
    onSubmit={handleSubmit(handleTransfer)}
    >
      <Heading
        mb={2}
        fontSize={['md', 'xl']}
        color={"blue.500"}
      >
        Origem
      </Heading>
      
      <Divider mt={2} mb={2}/>

      <Stack spacing={[4]}>
        <Select
          name="type"
          label="Conta de origem"
          options={formAccounts}
          error={errors.source_account_id}
          {...register('source_account_id')}
        />

        <Select
          name="type"
          label="Categoria de origem"
          options={getExpenseCategories()}
          error={errors.source_category_id}
          {...register('source_category_id')}
        />
      </Stack>

      <Heading
        mt={4}
        fontSize={['md', 'xl']}
        color={"red.500"}
      >
        Destino
      </Heading>

      <Divider mt={2} mb={2}/>
      
      <Stack spacing={[4]}>
        <Select
          name="type"
          label="Conta de destino"
          options={formAccounts}
          error={errors.destination_account_id}
          {...register('destination_account_id')}
        />

        <Select
          name="type"
          label="Categoria de destino"
          options={getIncomeCategories()}
          error={errors.destination_category_id}
          {...register('destination_category_id')}
        />
      </Stack>

      <Stack spacing={[4]} mt={4}>
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
          onClick={onCancel}
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
