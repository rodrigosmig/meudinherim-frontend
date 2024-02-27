import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Stack
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useSelector } from "../../../hooks/useSelector";
import { invoiceEntriesService } from "../../../services/ApiService/InvoiceEntriesService";
import { IInvoiceEntry, IInvoiceEntryErrorKey, IInvoiceEntryFormData, IInvoiceEntryResponseError } from "../../../types/invoiceEntry";
import { CARDS, getMessage, INVOICE, INVOICES, INVOICE_ENTRIES, OPEN_INVOICES, TAGS } from "../../../utils/helpers";
import { editValidation } from "../../../validations/invoiceEntry";
import { SubmitButton } from "../../Buttons/Submit";
import { Input } from "../../Inputs/Input";
import { SelectCategories } from "../../Inputs/SelectCategories";
import { Loading } from "../../Loading";
import { CreatableSelect as MultiSelect } from "chakra-react-select";
import { useTags } from "../../../hooks/useTags";

interface Props {
  entry: IInvoiceEntry;
  onClose: () => void,
}

export const EditInvoiceEntryForm = ({ entry, onClose }: Props) => {  
  const queryClient = useQueryClient();

  const { categoriesForm: categories, isLoading } = useSelector(({application}) => application)
  const { data: dataTags, isLoading: isLoadingTags } = useTags();

  const tags = dataTags?.map(tag => {
    return {
      value: tag.name,
      label: tag.name
    }
  });

  const selectedTags = entry?.tags.map(tag => {
    return {value: tag, label: tag}
  })

  const { control, register, handleSubmit, setError, formState } = useForm({
    defaultValues:{
      category_id: entry.category.id,
      description: entry.description,
      value: entry.value,
      tags: selectedTags
    },
    resolver: yupResolver(editValidation)
  });

  const { errors } = formState;

  const onSelectTagsChange = (inputValue: string) => `Nova tag: ${inputValue}`;

  const handleEditInvoiceEntry: SubmitHandler<IInvoiceEntryFormData> = async (values) => {
    const tags = values.tags.map(tag => tag.value)
    const data = {
      id: entry.id,
      category_id: values.category_id,
      description: values.description,
      value: values.value,
      tags: tags
    }

    try {
      await invoiceEntriesService.update(data)

      getMessage("Sucesso", `Lançamento ${values.description} alterado com sucesso`);

      queryClient.invalidateQueries(INVOICE)
      queryClient.invalidateQueries(INVOICES)
      queryClient.invalidateQueries(INVOICE_ENTRIES)
      queryClient.invalidateQueries(OPEN_INVOICES)
      queryClient.invalidateQueries(CARDS)
      queryClient.invalidateQueries(TAGS);

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

  if (isLoading) {
    return (
      <Loading />
    )
  }

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(handleEditInvoiceEntry)}
      >
      <Stack spacing={[4]}>
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
      <Flex
        mt={[10]}
        justify="flex-end"
        align="center"
      >
        <Button
          mr={[4]}
          variant="outline"
          isDisabled={formState.isSubmitting}
          onClick={onClose}
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
