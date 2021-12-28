import React from "react"
import { 
    Box,
    Button,
    Flex,
    Stack,
    useToast
} from "@chakra-ui/react"
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { format } from 'date-fns';

import { Input } from "../../Inputs/Input"
import { Switch } from "../../Inputs/Switch"
import { toBrDate, toUsDate } from "../../../utils/helpers"
import { payableService } from "../../../services/ApiService/PayableService";
import { SubmitButton } from "../../Buttons/Submit";
import { Datepicker } from "../../DatePicker";
import { Select } from "../../Inputs/Select";

interface Payable {
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

interface PaymentFormProps {
    payable: Payable;
    accounts: {
      value: string;
      label: string;
    }[];
    onCancel: () => void;
    refetch: () => void;
}

interface FormData {
  paid_date: Date;
  account_id: number;
  value: number;
  parcelable_id?: number
}

type ResponseError = {
  paid_date: string[];
  account_id: string[];
  value: string[];
}

type Key = keyof ResponseError;

const validationSchema = yup.object().shape({
  paid_date: yup.date().typeError("O campo data de pagamento é obrigatório"),
  account_id: yup.number().integer("Conta inválida").typeError("O campo conta é inválido"),
  value: yup.number().positive("O valor deve ser maior que zero").typeError("O campo valor é inválido"),
})

export const PaymentForm = ({ payable, accounts, onCancel, refetch }: PaymentFormProps) => {
  const toast = useToast();

  const { control, register, handleSubmit, setError, formState } = useForm({
    defaultValues: {
      account_id: "",
      paid_date: new Date(),
      value: payable.value
    },
    resolver: yupResolver(validationSchema)
  });

  const { errors } = formState;

  const handlePayment: SubmitHandler<FormData> = async (values) => {
    const data = {
      id: payable.id,
      data: {
        ...values,
        parcelable_id: payable.parcelable_id,
        paid_date: values?.paid_date ? toUsDate(values.paid_date) : ''
      }
    }

    try {
      await payableService.payment(data)

      toast({
        title: "Sucesso",
        description: `Conta paga com sucesso`,
        position: "top-right",
        status: 'success',
        duration: 10000,
        isClosable: true,
      });

      refetch();
      onCancel();  
    } catch (error) {
      if (error.response?.status === 422) {
        const data: ResponseError = error.response.data;
  
        let key: Key        
        for (key in data) {          
          data[key].map(error => {
            setError(key, {message: error})
          })
        }
      } else if (error.response.data.message) {
        toast({
          title: "Erro",
          description: error.response.data.message,
          position: "top-right",
          status: 'error',
          duration: 10000,
          isClosable: true,
        });

        onCancel(); 
      }
    }
  }
    return (
        <Box
          as="form"
          onSubmit={handleSubmit(handlePayment)}
        >
          <Stack spacing={[4]}>
            <Select
              name="type"
              label="Conta"
              options={accounts}
              error={errors.account_id}
              {...register('account_id')}
            />
            <Controller
              control={control}
                name="paid_date"
                render={({ field }) => (
                  <Datepicker
                    label="Data do Pagamento"
                    error={errors.paid_date}
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                  />
              )}
            />
            <Input
              name="due_date"
              type="text"
              label="Vencimento"
              value={toBrDate(payable.due_date)}
              isDisabled={true}
            />

            <Input
              name="category"
              type="text"
              label="Categoria"
              value={payable.category.name}
              isDisabled={true}
            />

            <Input
              name="description"
              type="text"
              label="Descrição"
              value={payable.description}
              isDisabled={true}
            />

            <Input
              name="value"
              type="number"
              label="Valor"
              step="0.01"
              error={errors.value}
              defaultValue={payable.value}
              {...register('value')}
            />

            <Switch
              size="lg"
              id="monthly" 
              name='monthly'
              label="Mensal"
              isChecked={payable.monthly}
              isDisabled={true}
            />
          </Stack>

          <Flex
            mt={[10]}
            justify="flex-end"
            align="center"
          >
            <Button
              variant="outline"
              isDisabled={formState.isSubmitting}
              onClick={onCancel}
              mr={[4]}
            >
              Cancelar
            </Button>

            <SubmitButton
              label="Pagar"
              size="md"
              isLoading={formState.isSubmitting}
            />
          </Flex>
        </Box>
    )
} 