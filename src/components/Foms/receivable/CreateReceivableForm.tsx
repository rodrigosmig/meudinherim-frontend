import {
  Box,
  Flex,
  Stack
} from "@chakra-ui/react";
import { ChangeEvent, useState } from 'react';

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useQueryClient } from 'react-query';
import { useCategoriesForm } from '../../../hooks/useCategories';
import { receivableService } from "../../../services/ApiService/ReceivableService";
import { IAccountSchedulingCreateData, IAccountSchedulingErrorKey } from '../../../types/accountScheduling';
import { IReceivableResponseError } from '../../../types/receivable';
import { ACCOUNTS_REPORT, getMessage, RECEIVABLES, toUsDate } from "../../../utils/helpers";
import { createValidation } from '../../../validations/receivables';
import { CancelButton } from "../../Buttons/Cancel";
import { SubmitButton } from "../../Buttons/Submit";
import { Datepicker } from "../../DatePicker";
import { Input } from "../../Inputs/Input";
import { Installment } from '../../Inputs/Installment';
import { Select } from "../../Inputs/Select";
import { Switch } from "../../Inputs/Switch";
import { Loading } from '../../Loading';

interface FormData extends Omit<IAccountSchedulingCreateData, "due_date"> {
  due_date: Date;
}

interface Props {
  onClose: () => void,
}

export const CreateReceivableForm = ({ onClose }: Props) => {  
  const queryClient = useQueryClient();

  const { data, isLoading: isLoadingCategories } = useCategoriesForm();

  const categories = data?.income.map(category => {
    return {
      value: category.id,
      label: category.label
    }
  });

  const { control, formState, register, handleSubmit, setError  } = useForm({
    defaultValues:{
      due_date: new Date(),
      category_id: 0,
      description: "",
      value: 0,
      monthly: false,
      installment: false,
      installments_number: 2
    },
    resolver: yupResolver(createValidation)
  });

  const [ monthly, setMonthly ] = useState(false);
  const [ hasInstallment, setHasInstallment ] = useState(false);
  const [ receivableValue, setReceivableValue ] = useState(0);

  const { errors } = formState;

  const handleCreateReceivable: SubmitHandler<FormData> = async (values) => {
    const data = {
      ...values,
      monthly: monthly,
      installment: hasInstallment,
      due_date: values?.due_date ? toUsDate(values.due_date) : ''
    }

    try {
      await receivableService.create(data);

      getMessage("Sucesso", "Conta a Receber adicionada com sucesso");

      queryClient.invalidateQueries(RECEIVABLES);
      queryClient.invalidateQueries(ACCOUNTS_REPORT);

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

  const handleIsMonthly = () => {
    setHasInstallment(false)
    setMonthly(!monthly)
  }

  const handleHasInstallment = () => {
    setMonthly(false)
    setHasInstallment(!hasInstallment);
  }

  const hasReceivableValue = () => {
    return receivableValue > 0;
  }

  const handleChangeReceivableValue = (event: ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(event.target.value);

    setReceivableValue(amount);
  }

  if (isLoadingCategories) {
    return (
      <Loading />
    )
  }

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(handleCreateReceivable)}
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
          value={receivableValue}
          name="value"
          type="number"
          label="Valor"
          error={errors.value}
          step="0.01"
          {...register('value')}
          onChange={v => handleChangeReceivableValue(v)}
        />

        <Switch
          size="lg"
          id="monthly" 
          name='monthly'
          label="Mensal"
          {...register('monthly')}
          isChecked={monthly}
          onChange={handleIsMonthly}
        />

        <Switch
          isDisabled={!hasReceivableValue()}
          size="lg"
          id="installment" 
          name='installment'
          label="Parcelar"
          isChecked={hasInstallment}
          {...register('installment')}
          onChange={handleHasInstallment}
        />
      </Stack>

        <Installment
          amount={receivableValue}
          isChecked={hasInstallment}
          error={errors.installments_number}
          {...register('installments_number')}
          onChange={handleHasInstallment}
        />

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
