import React from "react"
import { 
    Box,
    Flex,
    Stack,
} from "@chakra-ui/react"
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { Input } from "../../Inputs/Input"
import { Switch } from "../../Inputs/Switch"
import { SubmitButton } from "../../Buttons/Submit";
import { Datepicker } from "../../DatePicker";
import { Select } from "../../Inputs/Select";
import { receivableService } from "../../../services/ApiService/ReceivableService";
import { CancelButton } from "../../Buttons/Cancel";
import { getMessage, toUsDate } from "../../../utils/helpers";

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

interface ReceivementFormProps {
    receivable: Receivable;
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

export const ReceivementForm = ({ receivable, accounts, onCancel, refetch }: ReceivementFormProps) => {
  const { control, register, handleSubmit, setError, formState } = useForm({
    defaultValues: {
      account_id: "",
      paid_date: new Date(),
      value: receivable.value
    },
    resolver: yupResolver(validationSchema)
  });

  const { errors } = formState;

  const handleReceivement: SubmitHandler<FormData> = async (values) => {
    const data = {
      id: receivable.id,
      data: {
        ...values,
        value: receivable.is_parcel ? receivable.value : values.value,
        parcelable_id: receivable.parcelable_id,
        paid_date: values?.paid_date ? toUsDate(values.paid_date) : ''
      }
    }

    try {
      await receivableService.receivement(data);

      getMessage("Sucesso", "Conta recebida com sucesso");

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
        getMessage("Sucesso", error.response.data.message, 'error');

        onCancel(); 
      }
    }
  }
    return (
        <Box
          as="form"
          onSubmit={handleSubmit(handleReceivement)}
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
              value={receivable.due_date}
              isDisabled={true}
            />

            <Input
              name="category"
              type="text"
              label="Categoria"
              value={receivable.category.name}
              isDisabled={true}
            />

            <Input
              name="description"
              type="text"
              label="Descrição"
              value={receivable.description}
              isDisabled={true}
            />

            <Input
              name="value"
              type="number"
              label="Valor"
              step="0.01"
              error={errors.value}
              defaultValue={receivable.value}
              isDisabled={receivable.is_parcel}
              {...register('value')}
            />

            <Switch
              size="lg"
              id="monthly" 
              name='monthly'
              label="Mensal"
              isChecked={receivable.monthly}
              isDisabled={true}
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
              onClick={onCancel}
            />

            <SubmitButton
              label="Receber"
              size="md"
              isLoading={formState.isSubmitting}
            />
          </Flex>
        </Box>
    )
} 