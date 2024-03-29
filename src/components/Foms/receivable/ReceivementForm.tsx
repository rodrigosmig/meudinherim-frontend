import React from "react"
import { 
    Box,
    Flex,
    Stack,
} from "@chakra-ui/react"
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../../Inputs/Input"
import { Switch } from "../../Inputs/Switch"
import { SubmitButton } from "../../Buttons/Submit";
import { Datepicker } from "../../DatePicker";
import { Select } from "../../Inputs/Select";
import { receivableService } from "../../../services/ApiService/ReceivableService";
import { CancelButton } from "../../Buttons/Cancel";
import { ACCOUNTS_ENTRIES, ACCOUNTS_REPORT, ACCOUNT_BALANCE, ACCOUNT_TOTAL_BY_CATEGORY, getMessage, RECEIVABLES, toUsDate } from "../../../utils/helpers";
import { ITransactionErrorKey, ITransactionResponseError } from "../../../types/accountScheduling";
import { IReceivable, IReceivementFormData } from "../../../types/receivable";
import { receivementValidation } from "../../../validations/receivables";
import { useQueryClient } from "react-query";
import { useAccountsForm } from "../../../hooks/useAccounts";
import { Loading } from "../../Loading";

interface Props {
    receivable: IReceivable;
    onClose: () => void;
}

interface FormData extends Omit<IReceivementFormData, "paid_date"> {
  paid_date: Date;
}

export const ReceivementForm = ({ receivable, onClose }: Props) => {
  const queryClient = useQueryClient();

  const { data: accounts, isLoading: isLoadingAccounts } = useAccountsForm();

  const { control, register, handleSubmit, setError, formState } = useForm({
    defaultValues: {
      account_id: 0,
      paid_date: new Date(),
      value: receivable.value
    },
    resolver: yupResolver(receivementValidation)
  });

  const { errors } = formState;

  const handleReceivement: SubmitHandler<FormData> = async (values) => {
    const data = {
      id: receivable.id,
      data: {
        ...values,
        value: receivable.is_parcel ? receivable.value : values.value,
        parcelable_id: receivable.parcelable_id,
        paid_date: values?.paid_date ? toUsDate(values.paid_date) : ''
      }
    }

    try {
      await receivableService.receivement(data);

      getMessage("Sucesso", "Conta recebida com sucesso");

      queryClient.invalidateQueries(RECEIVABLES);
      queryClient.invalidateQueries(ACCOUNTS_REPORT);
      queryClient.invalidateQueries(ACCOUNTS_ENTRIES);
      queryClient.invalidateQueries(ACCOUNT_BALANCE);
      queryClient.invalidateQueries(ACCOUNT_TOTAL_BY_CATEGORY);

      onClose();  
    } catch (error) {
      if (error.response?.status === 422) {
        const data: ITransactionResponseError = error.response.data;
  
        let key: ITransactionErrorKey        
        for (key in data) {          
          data[key].forEach(error => {
            setError(key, {message: error})
          });
        }
      } else if (error.response.data.message) {
        getMessage("Sucesso", error.response.data.message, 'error');

        onClose(); 
      }
    }
  }

  if (isLoadingAccounts) {
    return (
      <Loading />
    )
  }

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(handleReceivement)}
    >
      <Stack spacing={[4]}>
        <Select
          name="type"
          label="Conta"
          options={accounts}
          error={errors.account_id}
          {...register('account_id')}
        />
        <Controller
          control={control}
            name="paid_date"
            render={({ field }) => (
              <Datepicker
                label="Data do Pagamento"
                error={errors.paid_date}
                selected={field.value}
                onChange={(date) => field.onChange(date)}
              />
          )}
        />
        <Input
          name="due_date"
          type="text"
          label="Vencimento"
          value={receivable.due_date}
          isDisabled={true}
        />

        <Input
          name="category"
          type="text"
          label="Categoria"
          value={receivable.category.name}
          isDisabled={true}
        />

        <Input
          name="description"
          type="text"
          label="Descrição"
          value={receivable.description}
          isDisabled={true}
        />

        <Input
          name="value"
          type="number"
          label="Valor"
          step="0.01"
          error={errors.value}
          defaultValue={receivable.value}
          isDisabled={receivable.is_parcel}
          {...register('value')}
        />

        <Switch
          size="lg"
          id="monthly" 
          name='monthly'
          label="Mensal"
          isChecked={receivable.monthly}
          isDisabled={true}
        />
      </Stack>

      <Flex
        mt={[10]}
        justify="flex-end"
        align="center"
      >
        <CancelButton
          mr={4}
          isDisabled={formState.isSubmitting}
          onClick={onClose}
        />

        <SubmitButton
          label="Receber"
          isLoading={formState.isSubmitting}
        />
      </Flex>
    </Box>
  )
} 