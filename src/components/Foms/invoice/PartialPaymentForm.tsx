import { 
    Box,
    Button,
    Divider,
    Flex,
    Stack
  } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { SubmitButton } from "../../Buttons/Submit";
import { Input } from "../../Inputs/Input";
import { Datepicker } from "../../DatePicker";
import { Select } from "../../Inputs/Select";
import { getMessage, toUsDate } from "../../../utils/helpers";
import { useCategoriesForm } from "../../../hooks/useCategories";
import { Loading } from "../../Loading";
import { useAccountsForm } from "../../../hooks/useAccounts";
import { useQueryClient } from "react-query";
import { useCardsForm } from "../../../hooks/useCards";
import { IPartialPaymentErrorKey, IPartialPaymentInvoiceData, IPartialPaymentInvoiceResponseError } from "../../../types/card";
import { cardService } from "../../../services/ApiService/CardService";
import { partialPayment } from "../../../validations/card";
  
interface FormData extends Omit<IPartialPaymentInvoiceData, "date"> { 
  date: Date 
}

interface Props {
  cardId: number;
  onCancel: () => void;
}

export const PartialPaymentForm = ({ cardId, onCancel}: Props) => {  
  const queryClient = useQueryClient();

  const { data: categories, isLoading: isLoadingCategories } = useCategoriesForm();
  const { data: formCards, isLoading: isLoadingCardsForm } = useCardsForm();
  const { data: formAccounts, isLoading: isLoadingAccounts } = useAccountsForm();

  const { control, register, handleSubmit, setError, formState } = useForm({
    defaultValues:{
      date: new Date(),
      description: "",
      value: 0,
      account_id: 0,
      card_id: cardId,
      income_category_id: 0,
      expense_category_id: 0
    },
    resolver: yupResolver(partialPayment)
  });

  const { errors } = formState;

  const handlePayment: SubmitHandler<FormData> = async (values) => {
    const data = {
      ...values,
        date: values?.date ? toUsDate(values.date) : ''
    }

    try {
      await cardService.partialPayment(data);

      queryClient.invalidateQueries('accountEntries');
      queryClient.invalidateQueries('account_balance');
      queryClient.invalidateQueries('invoiceEntries');
      queryClient.invalidateQueries('invoice');

      getMessage("Sucesso", "Pagamento parcial realizado com sucesso");

      onCancel();
    } catch (error) {
      if (error.response?.status === 422) {
        const data: IPartialPaymentInvoiceResponseError = error.response.data;

        let key: IPartialPaymentErrorKey        
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

  if (isLoadingCategories || isLoadingCardsForm || isLoadingAccounts) {
    return (
      <Loading />
    )
  }

  return (
    <Box
    as="form"
    onSubmit={handleSubmit(handlePayment)}
    >      
      <Stack spacing={[4]}>
        <Select
          isDisabled
          name="type"
          label="Cartão de Crédito"
          options={formCards}
          error={errors.card_id}
          {...register('card_id')}
        />

        <Select
          name="type"
          label="Categoria de Entrada"
          options={getIncomeCategories()}
          error={errors.income_category_id}
          {...register('income_category_id')}
        />
      </Stack>

      <Divider mt={6} mb={6}/>
      
      <Stack spacing={[4]}>
        <Select
          name="type"
          label="Conta"
          options={formAccounts}
          error={errors.account_id}
          {...register('account_id')}
        />

        <Select
          name="type"
          label="Categoria de Saída"
          options={getExpenseCategories()}
          error={errors.expense_category_id}
          {...register('expense_category_id')}
        />
      </Stack>

      <Divider mt={6} mb={6}/>

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
  