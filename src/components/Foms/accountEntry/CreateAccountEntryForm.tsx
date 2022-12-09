import {
  Box,
  Button,
  Flex,
  Stack
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useAccountsForm } from "../../../hooks/useAccounts";
import { useCategoriesForm } from "../../../hooks/useCategories";
import { accountEntriesService } from '../../../services/ApiService/AccountEntriesService';
import { IAccountEntryErrorKey, IAccountEntryFormData, IAccountEntryResponseError } from "../../../types/accountEntry";
import { ACCOUNTS_ENTRIES, ACCOUNT_BALANCE, ACCOUNT_TOTAL_BY_CATEGORY, getMessage, toUsDate } from "../../../utils/helpers";
import { createValidation } from "../../../validations/accountEntry";
import { SubmitButton } from "../../Buttons/Submit";
import { Datepicker } from "../../DatePicker";
import { Input } from "../../Inputs/Input";
import { Select } from "../../Inputs/Select";
import { SelectCategories } from "../../Inputs/SelectCategories";
import { Loading } from "../../Loading";

interface FormData extends Omit<IAccountEntryFormData, "date"> { 
  date: Date;
}

interface Props {
  accountId?: number;
  onClose: () => void;
}

export const CreateAccountEntryForm = ({ accountId = null, onClose }: Props) => {  
  const queryClient = useQueryClient();

  const { data: categories, isLoading: isLoadingCategories } = useCategoriesForm();
  const { data: formAccounts, isLoading: isLoadingAccounts } = useAccountsForm();

  const { control, register, handleSubmit, setError, formState } = useForm({
    defaultValues:{
      date: new Date(),
      account_id: accountId,
      category_id: 0,
      description: "",
      value: 0
    },
    resolver: yupResolver(createValidation)
  });

  const { errors } = formState;

  const handleCreateAccountEntry: SubmitHandler<FormData> = async (values) => {
    const data = {
      ...values,
        date: values?.date ? toUsDate(values.date) : ''
    }

    try {
      await accountEntriesService.create(data);

      getMessage("Sucesso", `Lançamento ${values.description} criado com sucesso`);

      queryClient.invalidateQueries(ACCOUNTS_ENTRIES);
      queryClient.invalidateQueries(ACCOUNT_BALANCE);
      queryClient.invalidateQueries(ACCOUNT_TOTAL_BY_CATEGORY);

      onClose();
    } catch (error) {
      if (error.response?.status === 422) {
        const data: IAccountEntryResponseError = error.response.data;

        let key: IAccountEntryErrorKey        
        for (key in data) {          
          data[key].forEach(error => {
            setError(key, {message: error})
          });
        }
      }
    }
  }

  if (isLoadingCategories || isLoadingAccounts) {
    return (
      <Loading />
    )
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
          isLoading={formState.isSubmitting}
        />
      </Flex>
    </Box>
  )
}
