import Link from "next/link";
import { useState, ChangeEvent } from 'react';
import { useRouter } from "next/router";
import { 
  Box,
  Button,
  Flex,
  Stack, 
  useToast,
} from "@chakra-ui/react";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { SubmitButton } from "../../Buttons/Submit";
import { Input } from "../../Inputs/Input";
import { Datepicker } from "../../DatePicker";
import { format } from 'date-fns';
import { Switch } from "../../Inputs/Switch";
import { Installment } from '../../Inputs/Installment';
import { Select } from "../../Inputs/Select";
import { receivableService } from "../../../services/ApiService/ReceivableService";
import { CancelButton } from "../../Buttons/Cancel";
import { toUsDate } from "../../../utils/helpers";

interface FormData {
  due_date: Date;
  category_id: number;
  description: string;
  value: number;
  monthly: boolean;
  installment: boolean;
  installments_number: number
}

type ResponseError = {
  category_id: string[];
  description: string[];
  value: string[];
}

type Key = keyof ResponseError;

interface CreateReceivableFormProps {
  categories: {
    value: string;
    label: string
  }[];
  closeModal: () => void,
  refetch: () => void
}

const validationSchema = yup.object().shape({
  due_date: yup.date().typeError("O campo vencimento é obrigatório"),
  category_id: yup.number().integer("Categoria inválida").typeError("O campo categoria é inválido"),
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

export const CreateReceivableForm = ({ categories, closeModal, refetch }: CreateReceivableFormProps) => {  
  const toast = useToast();

  const { control, formState, register, handleSubmit, setError  } = useForm({
    defaultValues:{
      due_date: new Date(),
      category_id: "",
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
      await receivableService.create(data)

      toast({
        title: "Sucesso",
        description: `Conta a Receber adicionada com sucesso`,
        position: "top-right",
        status: 'success',
        duration: 10000,
        isClosable: true,
      })

      refetch();
      closeModal();

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
          onClick={closeModal}
        />

        <SubmitButton
          label="Salvar"
          size="md"
          isLoading={formState.isSubmitting}
        />
      </Flex>
    </Box>
  )
}
