import { useState, ChangeEvent } from 'react';
import { 
  Box,
  Flex,
  Stack, 
} from "@chakra-ui/react";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { SubmitButton } from "../../Buttons/Submit";
import { Input } from "../../Inputs/Input";
import { Datepicker } from "../../DatePicker";
import { Switch } from "../../Inputs/Switch";
import { payableService } from '../../../services/ApiService/PayableService';
import { Installment } from '../../Inputs/Installment';
import { Select } from "../../Inputs/Select";
import { CancelButton } from "../../Buttons/Cancel";
import { getMessage, toUsDate } from '../../../utils/helpers';
import { useRouter } from 'next/router';
import { IPayableCreateData, IPayableResponseError } from '../../../types/payable';
import { IAccountSchedulingErrorKey } from '../../../types/accountScheduling';

interface FormData extends Omit<IPayableCreateData, "due_date"> {
  due_date: Date;
}

interface CreatePayableFormProps {
  categories: {
    value: string;
    label: string
  }[];
  onCancel: () => void,
  refetch?: () => void
}

const validationSchema = yup.object().shape({
  due_date: yup.date().typeError("O campo vencimento é obrigatório"),
  category_id: yup.number().integer("Categoria inválida").moreThan(0, "O campo categoria é inválido").typeError("O campo categoria é inválido"),
  description: yup.string().required("O campo descrição é obrigatório").min(3, "O campo descrição deve ter no mínimo 3 caracteres"),
  value: yup.number().positive("O valor deve ser maior que zero").typeError("O campo valor é inválido"),
  installment: yup.boolean(),
  installments_number: yup.number().when('installment', {
    is: true,
    then: yup.number().typeError("O número de parcelas é inválido")
      .min(2, 'O valor mínimo é 2.')
      .max(12, 'O valor máximo é 12.'),
  })
})

export const CreatePayableForm = ({ categories, onCancel, refetch }: CreatePayableFormProps) => {  
  const router = useRouter();

  const { control, register, handleSubmit, setError, formState } = useForm({
    defaultValues:{
      due_date: new Date(),
      category_id: 0,
      description: "",
      value: 0,
      monthly: false,
      installment: false,
      installments_number: 2
    },
    resolver: yupResolver(validationSchema)
  });

  const [ monthly, setMonthly ] = useState(false);
  const [ hasInstallment, setHasInstallment ] = useState(false);
  const [ payableValue, setPayableValue ] = useState(0);

  const { errors } = formState;

  const handleCreatePayable: SubmitHandler<FormData> = async (values) => {
    const data = {
      ...values,
      monthly: monthly,
      installment: hasInstallment,
      due_date: values?.due_date ? toUsDate(values.due_date) : ''
    }

    try {
      await payableService.create(data);

      getMessage("Sucesso", "Conta a Pagar adicionada com sucesso");

      if (typeof refetch !== 'undefined') {
        refetch();
        onCancel();
      } else {
        router.push(`/payables`)
      }
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

  const handleIsMonthly = () => {
    setHasInstallment(false)
    setMonthly(!monthly)
  }

  const handleHasInstallment = () => {
    setMonthly(false)
    setHasInstallment(!hasInstallment);
  }

  const hasPayableValue = () => {
    return payableValue > 0;
  }

  const handleChangePayableValue = (event: ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(event.target.value);

    setPayableValue(amount);
  }

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(handleCreatePayable)}
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
          value={payableValue}
          name="value"
          type="number"
          label="Valor"
          error={errors.value}
          step="0.01"
          {...register('value')}
          onChange={v => handleChangePayableValue(v)}
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
          isDisabled={!hasPayableValue()}
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
          amount={payableValue}
          isChecked={hasInstallment}
          error={errors.installments_number}
          {...register('installments_number')}
          onChange={handleHasInstallment}
        />

      <Flex
        mt={[10]}
        justify="flex-end"
        align="center"
      >

        <CancelButton
          mr={4}
          isDisabled={formState.isSubmitting}
          onClick={onCancel}
        />

        <SubmitButton
          mr={[4]}
          label="Salvar"
          isLoading={formState.isSubmitting}
        />
      </Flex>
    </Box>
  )
}
