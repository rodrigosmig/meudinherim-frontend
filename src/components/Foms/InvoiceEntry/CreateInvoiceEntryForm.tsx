import { useState, ChangeEvent } from "react";
import { useRouter } from "next/router";
import { 
  Box,
  Button,
  Flex,
  Stack
} from "@chakra-ui/react";
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
import { getMessage, toUsDate } from "../../../utils/helpers";
import { IInvoiceEntryCreateData, IInvoiceEntryErrorKey, IInvoiceEntryResponseError } from "../../../types/invoiceEntry";
import { createValidation } from "../../../validations/invoiceEntry";

interface FormData extends Omit<IInvoiceEntryCreateData, "date"> {
  date: Date;
}

interface CreateInvoiceEntryFormProps {
  card_id?: number;
  onCancel: () => void;
  refetch?: () => void;
}

export const CreateInvoiceEntryForm = ({ card_id = null, onCancel, refetch }: CreateInvoiceEntryFormProps) => {  
  const router = useRouter();

  const { data: categories, isLoading: isLoadingCategories } = useCategoriesForm();
  const { data: formCards, isLoading: isLoadingCardsForm } = useCardsForm();

  const [ hasInstallment, setHasInstallment ] = useState(false);
  const [ entryValue, setEntryValue ] = useState(0);

  const { control, register, handleSubmit, setError, formState } = useForm({
    defaultValues:{
      date: new Date(),
      card_id: card_id,
      category_id: 0,
      description: "",
      value: 0,
      installment: false,
      installments_number: 2
    },
    resolver: yupResolver(createValidation)
  });

  const { errors } = formState;

  const handleCreateInvoiceEntry: SubmitHandler<FormData> = async (values) => {
    const data = {
      ...values,
      installment: hasInstallment,
      date: values?.date ? toUsDate(values.date) : ''
    }

    try {
      const response = await invoiceEntriesService.create(data);

      getMessage("Sucesso", `Lan??amento ${values.description} criado com sucesso`);

      if (typeof refetch !== 'undefined') {
        refetch();
        onCancel();
      } else {
        if (isNaN(response.data.card_id) || isNaN(response.data.invoice_id)) {
          router.push(`/cards/${values.card_id}/invoices`);
        } else {
          router.push(`/cards/${response.data.card_id}/invoices/${response.data.invoice_id}/entries`);
        }
      }
    } catch (error) {
      if (error.response?.status === 422) {
        const data: IInvoiceEntryResponseError = error.response.data;

        let key: IInvoiceEntryErrorKey        
        for (key in data) {          
          data[key].map(error => {
            setError(key, {message: error})
          })
        }
      } else if (error.response?.status === 400) {
        getMessage("Erro", error.response.data.message, 'error');
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
          label="Cart??o de Cr??dito"
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
          label="Descri????o"
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
