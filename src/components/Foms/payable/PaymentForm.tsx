import { 
    Box,
    Button,
    Flex,
    Stack
} from "@chakra-ui/react"
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../../Inputs/Input"
import { Switch } from "../../Inputs/Switch"
import { getMessage, toBrDate, toUsDate } from "../../../utils/helpers"
import { payableService } from "../../../services/ApiService/PayableService";
import { SubmitButton } from "../../Buttons/Submit";
import { Datepicker } from "../../DatePicker";
import { Select } from "../../Inputs/Select";
import { IPayable, IPaymentFormData } from "../../../types/payable";

interface Props {
    payable: IPayable;
    accounts: {
      value: string;
      label: string;
    }[];
    onCancel: () => void;
    refetch: () => void;
}

interface FormData extends Omit<IPaymentFormData, "paid_date">  {
  paid_date: Date;
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

export const PaymentForm = ({ payable, accounts, onCancel, refetch }: Props) => {
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
      await payableService.payment(data);

      getMessage("Sucesso", "Conta paga com sucesso");

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
        getMessage('Erro', error.response.data.message, 'error')

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