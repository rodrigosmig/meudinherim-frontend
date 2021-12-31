import { useState, ChangeEvent } from "react";
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
import { Datepicker } from "../../DatePicker";
import { SelectCategories } from "../../Inputs/SelectCategories";
import { Select } from "../../Inputs/Select";
import { invoiceEntriesService } from "../../../services/ApiService/InvoiceEntriesService";
import { useCategoriesForm } from "../../../hooks/useCategories";
import { Loading } from "../../Loading";
import { useCardsForm } from "../../../hooks/useCards";
import { Installment } from "../../Inputs/Installment";
import { Switch } from "../../Inputs/Switch";
import { toUsDate } from "../../../utils/helpers";

interface FormData {
  card_id: number;
  date: Date;
  category_id: number;
  description: string;
  value: number;
  installment: boolean;
  installments_number: number
}

type ResponseError = {
  category_id: string[];
  description: string[];
  value: string[];
  date: string[];
}

type Key = keyof ResponseError;

interface CreateInvoiceEntryFormProps {
  card_id?: number;
  onCancel: () => void;
  refetch?: () => void;
}

const validationSchema = yup.object().shape({
  card_id: yup.number().integer("Cartão de Crédito inválido").typeError("O campo cartão de crédito é inválido"),
  date: yup.date().typeError("O campo data é obrigatório"),
  category_id: yup.number().integer("Categoria inválida").typeError("O campo categoria é inválido"),
  description: yup.string().required("O campo descrição é obrigatório").min(3, "O campo descrição deve ter no mínimo 3 caracteres"),
  value: yup.number().positive("O valor deve ser maior que zero").typeError("O campo valor é obrigatório"),
  installment: yup.boolean(),
  installments_number: yup.number().when('installment', {
    is: true,
    then: yup.number().typeError("O número de parcelas é inválido")
      .min(2, 'O valor mínimo é 2.')
      .max(12, 'O valor máximo é 12.'),
  })
})

export const CreateInvoiceEntryForm = ({ card_id = null, onCancel, refetch }: CreateInvoiceEntryFormProps) => {  
  const toast = useToast();
  const router = useRouter();

  const { data: categories, isLoading: isLoadingCategories } = useCategoriesForm();
  const { data: formCards, isLoading: isLoadingCardsForm } = useCardsForm();

  const [ hasInstallment, setHasInstallment ] = useState(false);
  const [ entryValue, setEntryValue ] = useState(0);

  const { control, register, handleSubmit, setError, formState } = useForm({
    defaultValues:{
      date: new Date(),
      card_id: card_id,
      category_id: "",
      description: "",
      value: 0,
      installment: false,
      installments_number: 2
    },
    resolver: yupResolver(validationSchema)
  });

  const { errors } = formState;

  const handleCreateInvoiceEntry: SubmitHandler<FormData> = async (values) => {
    const data = {
      ...values,
      installment: hasInstallment,
      date: values?.date ? toUsDate(values.date) : ''
    }

    try {
      const response = await invoiceEntriesService.create(data)

      toast({
        title: "Sucesso",
        description: `Lançamento ${values.description} criado com sucesso`,
        position: "top-right",
        status: 'success',
        duration: 10000,
        isClosable: true,
      })

      if (typeof refetch !== 'undefined') {
        refetch();
        onCancel();
      } else {
        router.push(`/cards/${response.data.card_id}/invoices/${response.data.invoice_id}/entries`)
      }
    } catch (error) {
      if (error.response?.status === 422) {
        const data: ResponseError = error.response.data;

        let key: Key        
        for (key in data) {          
          data[key].map(error => {
            setError(key, {message: error})
          })
        }
      } else if (error.response?.status === 400) {
        toast({
          title: "Erro",
          description: error.response.data.message,
          position: "top-right",
          status: 'error',
          duration: 10000,
          isClosable: true,
        })
      }
    }
  }

  const hasEntryValue = () => {
    return entryValue > 0;
  }

  const handleChangeEntryValue = (event: ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(event.target.value);

    setEntryValue(amount);
  }

  if (isLoadingCategories || isLoadingCardsForm) {
    return (
      <Loading />
    )
  }

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(handleCreateInvoiceEntry)}
      >
      <Stack spacing={[4]}>
        <Select
          name="type"
          label="Cartão de Crédito"
          options={formCards}
          error={errors.card_id}
          {...register('card_id')}
        />

        <Controller
          control={control}
            name="date"
            render={({ field }) => (
              <Datepicker
                label="Data"
                error={errors.date}
                selected={field.value}
                onChange={(date) => field.onChange(date)}
              />
           )}
        />

        <SelectCategories
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
          value={entryValue}
          name="value"
          type="number"
          label="Valor"
          error={errors.value}
          step="0.01"
          {...register('value')}
          onChange={v => handleChangeEntryValue(v)}
        />

        <Switch
          isDisabled={!hasEntryValue()}
          size="lg"
          id="installment" 
          name='installment'
          label="Parcelar"
          isChecked={hasInstallment}
          {...register('installment')}
          onChange={() => setHasInstallment(!hasInstallment)}
        />
      </Stack>

      <Installment
        amount={entryValue}
        isChecked={hasInstallment}
        error={errors.installments_number}
        {...register('installments_number')}
        onChange={() => setHasInstallment(!hasInstallment)}
      />

      <Flex
        mt={[10]}
        justify="flex-end"
        align="center"
      >
        <Button
          mr={[4]}
          variant="outline"
          isDisabled={formState.isSubmitting}
          onClick={onCancel}
        >
          Cancelar
        </Button>

        <SubmitButton
          label="Salvar"
          size="md"
          isLoading={formState.isSubmitting}
        />
      </Flex>
    </Box>
  )
}
