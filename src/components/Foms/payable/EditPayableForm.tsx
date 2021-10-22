import { useState } from "react";
import { useRouter } from "next/router";
import { 
  Box,
  Button,
  Flex,
  Stack,
  useToast
} from "@chakra-ui/react";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { SubmitButton } from "../../Buttons/Submit";
import { Input } from "../../Inputs/Input";
import Link from "next/link";
import { Datepicker } from "../../DatePicker";
import { format, parseISO } from 'date-fns';
import { payableService } from "../../../services/ApiService/PayableService";
import { Select } from "../../Inputs/Select";
import { Switch } from "../../Inputs/Switch";

interface Category {
  id: number,
  name: string,
}

type CategoriesForForm = {
  value: string;
  label: string;
}

interface Payable {
  id: number;
  due_date: string;
  paid_date: string | null;
  description: string;
  value: number;
  category: Category;
  invoice_id: number | null;
  paid: boolean;
  monthly: boolean;
  has_parcels: boolean;
  is_parcel: boolean,
  parcelable_id: number,
}

interface EditPayableFormProps {
  payable: Payable;
  categories: CategoriesForForm[];
}

interface FormData {
  due_date: Date;
  category_id: number;
  description: string;
  value: number;
  monthly: boolean
}

type ResponseError = {
  category_id: string[];
  description: string[];
  value: string[];
}

type Key = keyof ResponseError;

const validationSchema = yup.object().shape({
  due_date: yup.date().typeError("O campo vencimento é obrigatório"),
  category_id: yup.number().integer("Categoria inválida").typeError("O campo categoria é inválido"),
  description: yup.string().required("O campo descrição é obrigatório").min(3, "O campo descrição deve ter no mínimo 3 caracteres"),
  value: yup.number().positive("O valor deve ser maior que zero").typeError("O campo valor é inválido"),
})

export const EditPayableForm = ({payable, categories}: EditPayableFormProps) => {
  const toast = useToast();
  const router = useRouter();

  const [ monthly, setMonthly ] = useState(payable.monthly);

  const { control, register, handleSubmit, setError, formState } = useForm({
    defaultValues: {
      due_date: parseISO(payable.due_date),
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
        due_date: values?.due_date ? format(values.due_date, 'Y-MM-dd') : ''
      }
    }

    try {
      await payableService.update(data)

      toast({
        title: "Sucesso",
        description: `Conta a Pagar adicionada com sucesso`,
        position: "top-right",
        status: 'success',
        duration: 10000,
        isClosable: true,
      })

      router.push("/payables")

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
        <SubmitButton
          mr={[4]}
          label="Salvar"
          size="md"
          isLoading={formState.isSubmitting}
        />

        <Link href={`/payables`} passHref>
          <Button
            variant="outline"
            isDisabled={formState.isSubmitting}
          >
            Cancelar
          </Button>
        </Link>
      </Flex>
    </Box>
  )
}