import { useState } from "react";
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
import { payableService } from "../../../services/ApiService/PayableService";
import { Select } from "../../Inputs/Select";
import { Switch } from "../../Inputs/Switch";
import { getMessage, reverseBrDate, toUsDate } from "../../../utils/helpers";
import { CancelButton } from "../../Buttons/Cancel";
import { IPayable, IPayableFormData, IPayableResponseError } from "../../../types/payable";
import { IAccountSchedulingErrorKey } from "../../../types/accountScheduling";

interface Props {
  payable: IPayable;
  categories: {
    value: string;
    label: string
  }[];
  closeModal: () => void,
  refetch: () => void
}

interface FormData extends Omit<IPayableFormData, "due_date"> {
  due_date: Date;
}

const validationSchema = yup.object().shape({
  due_date: yup.date().typeError("O campo vencimento é obrigatório"),
  category_id: yup.number().integer("Categoria inválida").typeError("O campo categoria é inválido"),
  description: yup.string().required("O campo descrição é obrigatório").min(3, "O campo descrição deve ter no mínimo 3 caracteres"),
  value: yup.number().positive("O valor deve ser maior que zero").typeError("O campo valor é inválido"),
})

export const EditPayableForm = ({ payable, categories, closeModal, refetch }: Props) => {
  const [ monthly, setMonthly ] = useState(payable.monthly);

  const { control, register, handleSubmit, setError, formState } = useForm({
    defaultValues: {
      due_date: parseISO(reverseBrDate(payable.due_date)),
      category_id: payable.category.id,
      description: payable.description,
      value: payable.value,
      monthly: payable.monthly,
    },
    resolver: yupResolver(validationSchema)
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

      refetch();
      closeModal();

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