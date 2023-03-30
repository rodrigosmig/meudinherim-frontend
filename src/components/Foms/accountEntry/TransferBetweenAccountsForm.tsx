import {
  Box,
  Button,
  Divider,
  Flex,
  Stack
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useAccountsForm } from "../../../hooks/useAccounts";
import { useSelector } from "../../../hooks/useSelector";
import { accountEntriesService } from '../../../services/ApiService/AccountEntriesService';
import { IAccountEntryTransferData, IAccountEntryTransferResponseError, ITransferErrorKey } from "../../../types/accountEntry";
import { ACCOUNTS_ENTRIES, ACCOUNT_BALANCE, ACCOUNT_TOTAL_BY_CATEGORY, getMessage, toUsDate } from "../../../utils/helpers";
import { transferValidation } from "../../../validations/accountEntry";
import { SubmitButton } from "../../Buttons/Submit";
import { Datepicker } from "../../DatePicker";
import { Heading } from "../../Heading";
import { Input } from "../../Inputs/Input";
import { Select } from "../../Inputs/Select";
import { Loading } from "../../Loading";

interface FormData extends Omit<IAccountEntryTransferData, "date"> { 
  date: Date 
}

interface Props {
  onCancel: () => void;
}

export const TransferBetweenAccountsForm = ({ onCancel}: Props) => {  
  const queryClient = useQueryClient();

  const { categoriesForm: categories, isLoading: isLoadingCategories } = useSelector(({application}) => application)
  const { data: formAccounts, isLoading: isLoadingAccounts } = useAccountsForm();

  const { control, register, handleSubmit, setError, formState } = useForm({
    defaultValues:{
      date: new Date(),
      description: "",
      value: 0,
      source_account_id: 0,
      destination_account_id: 0,
      source_category_id: 0,
      destination_category_id: 0
    },
    resolver: yupResolver(transferValidation)
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

      queryClient.invalidateQueries(ACCOUNTS_ENTRIES);
      queryClient.invalidateQueries(ACCOUNT_BALANCE);
      queryClient.invalidateQueries(ACCOUNT_TOTAL_BY_CATEGORY);
      onCancel();

    } catch (error) {
      if (error.response?.status === 422) {
        const data: IAccountEntryTransferResponseError = error.response.data;

        let key: ITransferErrorKey        
        for (key in data) {          
          data[key].forEach(error => {
            setError(key, {message: error})
          });
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
          isLoading={formState.isSubmitting}
        />
      </Flex>
    </Box>
  )
}
