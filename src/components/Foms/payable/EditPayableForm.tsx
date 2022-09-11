import { useEffect, useState } from "react";
import { 
  Box,
  Flex,
  Stack
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { SubmitButton } from "../../Buttons/Submit";
import { Input } from "../../Inputs/Input";
import { Datepicker } from "../../DatePicker";
import { parseISO } from 'date-fns';
import { payableService } from "../../../services/ApiService/PayableService";
import { Select } from "../../Inputs/Select";
import { Switch } from "../../Inputs/Switch";
import { ACCOUNTS_REPORT, getMessage, PAYABLES, reverseBrDate, toUsDate } from "../../../utils/helpers";
import { CancelButton } from "../../Buttons/Cancel";
import { IPayable, IPayableFormData, IPayableResponseError } from "../../../types/payable";
import { IAccountSchedulingErrorKey } from "../../../types/accountScheduling";
import { editValidation } from "../../../validations/payable";
import { useQueryClient } from "react-query";
import { useCategoriesForm } from "../../../hooks/useCategories";
import { Loading } from "../../Loading";

interface Props {
  payable: IPayable;
  onClose: () => void,
}

interface FormData extends Omit<IPayableFormData, "due_date"> {
  due_date: Date;
}

export const EditPayableForm = ({ payable, onClose }: Props) => {
  const queryClient = useQueryClient();

  const { data, isLoading: isLoadingCategories } = useCategoriesForm();

  const [ monthly, setMonthly ] = useState(payable.monthly);

  const categories = data?.expense.map(category => {
    return {
      value: category.id,
      label: category.label
    }
  });

  const { control, register, handleSubmit, setError, formState } = useForm({
    defaultValues: {
      due_date: parseISO(reverseBrDate(payable.due_date)),
      category_id: payable.category.id,
      description: payable.description,
      value: payable.value,
      monthly: payable.monthly,
    },
    resolver: yupResolver(editValidation)
  });

  const { errors } = formState;

  const handleEditPayable: SubmitHandler<FormData> = async (values) => {
    const data = {
      id: payable.id,
      data: {
        ...values,
        monthly: monthly,
        due_date: values?.due_date ? toUsDate(values.due_date) : ''
      }
    }

    try {
      await payableService.update(data);

      getMessage("Sucesso", "Conta a Pagar alterada com sucesso");

      queryClient.invalidateQueries(PAYABLES);
      queryClient.invalidateQueries(ACCOUNTS_REPORT);

      onClose();

    } catch (error) {
      if (error.response?.status === 422) {
        const data: IPayableResponseError = error.response.data;

        let key: IAccountSchedulingErrorKey        
        for (key in data) {          
          data[key].map(error => {
            setError(key, {message: error})
          })
        }
      }
    }
  }

  if (isLoadingCategories) {
    return (
      <Loading />
    )
  }

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(handleEditPayable)}
      >
      <Stack spacing={[4]}>
        <Controller
          control={control}
            name="due_date"
            render={({ field }) => (
              <Datepicker
                label="Vencimento"
                error={errors.due_date}
                selected={field.value}
                onChange={(date) => field.onChange(date)}
              />
           )}
        />

        <Select
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

        <Switch
          size="lg"
          id="monthly" 
          name='monthly'
          label="Mensal"
          {...register('monthly')}
          isChecked={monthly}
          onChange={() => setMonthly(!monthly)}
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
          label="Salvar"
          isLoading={formState.isSubmitting}
        />
      </Flex>
    </Box>
  )
}