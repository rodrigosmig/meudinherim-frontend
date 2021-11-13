import { useState } from 'react';
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
import { format, parseISO } from 'date-fns';
import { Switch } from "../../Inputs/Switch";
import { Select } from "../../Inputs/Select";
import { receivableService } from "../../../services/ApiService/ReceivableService";
import { reverseBrDate } from '../../../utils/helpers';
import { CancelButton } from '../../Buttons/Cancel';

interface Receivable {
  id: number;
  due_date: string;
  paid_date: string | null;
  description: string;
  value: number;
  category: {
    id: number;
    name: string;
  };
  invoice_id: number | null;
  paid: boolean;
  monthly: boolean;
  has_parcels: boolean;
  is_parcel: boolean,
  total_purchase: number,
  parcel_number: number,
  parcelable_id: number,
}

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
  receivable: Receivable,
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

export const EditReceivableForm = ({ receivable, categories, closeModal, refetch }: CreateReceivableFormProps) => {  
  const toast = useToast();

  const { control, formState, register, handleSubmit, setError  } = useForm({
    defaultValues:{
      due_date: parseISO(reverseBrDate(receivable.due_date)),
      category_id: receivable.category.id,
      description: receivable.description,
      value: receivable.value,
      monthly: receivable.monthly,
    },
    resolver: yupResolver(validationSchema)
  });

  const [ monthly, setMonthly ] = useState(receivable.monthly);
  const [ hasInstallment, setHasInstallment ] = useState(false);

  const { errors } = formState;

  const handleEditReceivable: SubmitHandler<FormData> = async (values) => {
    const data = {
      id: receivable.id,
      data: {
        ...values,
        monthly: monthly,
        installment: hasInstallment,
        due_date: values?.due_date ? format(values.due_date, 'Y-MM-dd') : ''
      }
    }

    try {
      await receivableService.update(data)

      toast({
        title: "Sucesso",
        description: `Conta a Receber alterada com sucesso`,
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
