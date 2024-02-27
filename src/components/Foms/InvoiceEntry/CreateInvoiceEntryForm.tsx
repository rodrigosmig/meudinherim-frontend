import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Stack
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChangeEvent, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useCardsForm } from "../../../hooks/useCards";
import { useSelector } from "../../../hooks/useSelector";
import { invoiceEntriesService } from "../../../services/ApiService/InvoiceEntriesService";
import { IInvoiceEntryCreateData, IInvoiceEntryErrorKey, IInvoiceEntryResponseError } from "../../../types/invoiceEntry";
import { CARDS, getMessage, INVOICE, INVOICES, INVOICE_ENTRIES, OPEN_INVOICES, toUsDate } from "../../../utils/helpers";
import { createValidation } from "../../../validations/invoiceEntry";
import { SubmitButton } from "../../Buttons/Submit";
import { Datepicker } from "../../DatePicker";
import { Input } from "../../Inputs/Input";
import { Installment } from "../../Inputs/Installment";
import { Select } from "../../Inputs/Select";
import { SelectCategories } from "../../Inputs/SelectCategories";
import { Switch } from "../../Inputs/Switch";
import { Loading } from "../../Loading";
import { CreatableSelect as MultiSelect } from "chakra-react-select";
import { useTags } from "../../../hooks/useTags";

interface FormData extends Omit<IInvoiceEntryCreateData, "date"> {
  date: Date;
}

interface CreateInvoiceEntryFormProps {
  card_id?: number;
  onClose: () => void;
}

export const CreateInvoiceEntryForm = ({ card_id = null, onClose }: CreateInvoiceEntryFormProps) => {  
  const queryClient = useQueryClient();

  const { categoriesForm: categories, isLoading: isLoadingCategories } = useSelector(({application}) => application)
  const { data: formCards, isLoading: isLoadingCardsForm } = useCardsForm();
  const { data: dataTags, isLoading: isLoadingTags } = useTags();

  const tags = dataTags?.map(tag => {
    return {
      value: tag.name,
      label: tag.name
    }
  });

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
      installments_number: 2,
      tags: []
    },
    resolver: yupResolver(createValidation)
  });

  const { errors } = formState;

  const onSelectTagsChange = (inputValue: string) => `Nova tag: ${inputValue}`;

  const handleCreateInvoiceEntry: SubmitHandler<FormData> = async (values) => {
    const tags = values.tags.map(tag => tag.value)
    const data = {
      ...values,
      installment: hasInstallment,
      date: values?.date ? toUsDate(values.date) : '',
      tags: tags
    }

    try {
      await invoiceEntriesService.create(data);

      getMessage("Sucesso", `Lançamento ${values.description} criado com sucesso`);

      queryClient.invalidateQueries(INVOICE)
      queryClient.invalidateQueries(INVOICES)
      queryClient.invalidateQueries(INVOICE_ENTRIES)
      queryClient.invalidateQueries(OPEN_INVOICES)
      queryClient.invalidateQueries(CARDS)

      onClose();
    } catch (error) {
      if (error.response?.status === 422) {
        const data: IInvoiceEntryResponseError = error.response.data;

        let key: IInvoiceEntryErrorKey        
        for (key in data) { 
          data[key].forEach(error => {
            setError(key, {message: error})
          });
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

  if (isLoadingCategories || isLoadingCardsForm || isLoadingTags) {
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

<Controller
          control={control}
          name="tags"
          render={({
            field: { onChange, onBlur, value, name, ref },
            fieldState: { error }
          }) => (
            <FormControl isInvalid={!!error}>
              <FormLabel htmlFor={name}>Tags</FormLabel>
              <MultiSelect
                isMulti
                name={name}
                colorScheme="pink"
                options={tags}
                focusBorderColor="pink.500"
                placeholder="..."
                chakraStyles={{
                  dropdownIndicator: (provided) => ({
                    ...provided,
                    bg: "transparent",
                    px: 2,
                    cursor: "inherit",
                  }),
                  indicatorSeparator: (provided) => ({
                    ...provided,
                    display: "none",
                  }),
                }}
                closeMenuOnSelect={false}
                formatCreateLabel={onSelectTagsChange}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                ref={ref}
              />
              </FormControl>
          )}
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
        mt={[4]}
        justify="flex-end"
        align="center"
      >
        <Button
          mr={[4]}
          variant="outline"
          isDisabled={formState.isSubmitting}
          onClick={onClose}
          disabled={formState.isSubmitting}
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
