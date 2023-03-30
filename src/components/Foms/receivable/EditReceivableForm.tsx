import {
  Box,
  Flex,
  Stack
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { parseISO } from 'date-fns';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useQueryClient } from 'react-query';
import { useSelector } from '../../../hooks/useSelector';
import { receivableService } from "../../../services/ApiService/ReceivableService";
import { IAccountSchedulingErrorKey } from '../../../types/accountScheduling';
import { IReceivable, IReceivableFormData, IReceivableResponseError } from '../../../types/receivable';
import { ACCOUNTS_REPORT, getMessage, RECEIVABLES, reverseBrDate, toUsDate } from '../../../utils/helpers';
import { editValidation } from '../../../validations/receivables';
import { CancelButton } from '../../Buttons/Cancel';
import { SubmitButton } from "../../Buttons/Submit";
import { Datepicker } from "../../DatePicker";
import { Input } from "../../Inputs/Input";
import { Select } from "../../Inputs/Select";
import { Switch } from "../../Inputs/Switch";
import { Loading } from '../../Loading';

interface FormData extends Omit<IReceivableFormData, "due_date"> {
  due_date: Date;
}

interface Props {
  receivable: IReceivable,
  onClose: () => void
}

export const EditReceivableForm = ({ receivable, onClose }: Props) => {
  const queryClient = useQueryClient();

  const [ monthly, setMonthly ] = useState(receivable.monthly);

  const { categoriesForm: data, isLoading: isLoadingCategories } = useSelector(({application}) => application)

  const categories = data?.income.map(category => {
    return {
      value: category.id,
      label: category.label
    }
  });

  const { control, formState, register, handleSubmit, setError  } = useForm({
    defaultValues:{
      due_date: parseISO(reverseBrDate(receivable.due_date)),
      category_id: receivable.category.id,
      description: receivable.description,
      value: receivable.value,
      monthly: receivable.monthly,
    },
    resolver: yupResolver(editValidation)
  });

  const { errors } = formState;

  const handleEditReceivable: SubmitHandler<FormData> = async (values) => {
    const data = {
      id: receivable.id,
      data: {
        ...values,
        monthly: monthly,
        due_date: values?.due_date ? toUsDate(values.due_date) : ''
      }
    }

    try {
      await receivableService.update(data);

      queryClient.invalidateQueries(RECEIVABLES);
      queryClient.invalidateQueries(ACCOUNTS_REPORT);
      
      getMessage("Sucesso", "Conta a Receber alterada com sucesso");

      onClose();
    } catch (error) {
      if (error.response?.status === 422) {
        const data: IReceivableResponseError = error.response.data;

        let key: IAccountSchedulingErrorKey        
        for (key in data) {          
          data[key].forEach(error => {
            setError(key, {message: error})
          });
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
      onSubmit={handleSubmit(handleEditReceivable)}
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
        mb={4}
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
