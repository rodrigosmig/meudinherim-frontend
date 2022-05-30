import { useState } from 'react';
import { 
  Box,
  Flex,
  Stack
} from "@chakra-ui/react";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { SubmitButton } from "../../Buttons/Submit";
import { Input } from "../../Inputs/Input";
import { Datepicker } from "../../DatePicker";
import { parseISO } from 'date-fns';
import { Switch } from "../../Inputs/Switch";
import { Select } from "../../Inputs/Select";
import { receivableService } from "../../../services/ApiService/ReceivableService";
import { getMessage, reverseBrDate, toUsDate } from '../../../utils/helpers';
import { CancelButton } from '../../Buttons/Cancel';
import { IReceivable, IReceivableFormData, IReceivableResponseError } from '../../../types/receivable';
import { IAccountSchedulingErrorKey } from '../../../types/accountScheduling';

interface FormData extends Omit<IReceivableFormData, "due_date"> {
  due_date: Date;
}

interface Props {
  receivable: IReceivable,
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
})

export const EditReceivableForm = ({ receivable, categories, closeModal, refetch }: Props) => {  
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

      getMessage("Sucesso", "Conta a Receber alterada com sucesso");

      refetch();
      closeModal();

    } catch (error) {
      if (error.response?.status === 422) {
        const data: IReceivableResponseError = error.response.data;

        let key: IAccountSchedulingErrorKey        
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
          isLoading={formState.isSubmitting}
        />
      </Flex>
    </Box>
  )
}
