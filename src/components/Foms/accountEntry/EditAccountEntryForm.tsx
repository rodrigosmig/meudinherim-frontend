import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Stack
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { parseISO } from 'date-fns';
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useSelector } from "../../../hooks/useSelector";
import { accountEntriesService } from '../../../services/ApiService/AccountEntriesService';
import { IAccountEntry, IAccountEntryErrorKey, IAccountEntryFormData, IAccountEntryResponseError } from "../../../types/accountEntry";
import { ACCOUNTS_ENTRIES, ACCOUNT_BALANCE, ACCOUNT_TOTAL_BY_CATEGORY, getMessage, reverseBrDate, TAGS, toUsDate } from "../../../utils/helpers";
import { editValidation } from "../../../validations/accountEntry";
import { SubmitButton } from "../../Buttons/Submit";
import { Datepicker } from "../../DatePicker";
import { Input } from "../../Inputs/Input";
import { SelectCategories } from "../../Inputs/SelectCategories";
import { Loading } from "../../Loading";
import { CreatableSelect as MultiSelect } from "chakra-react-select";
import { useTags } from "../../../hooks/useTags";

interface FormData extends Omit<IAccountEntryFormData, "date"> { 
  date: Date 
}

interface Props {
  entry: IAccountEntry;
  closeModal: () => void,
  refetch: () => void
}

export const EditAccountEntryForm = ({ entry, closeModal, refetch }: Props) => {
  const queryClient = useQueryClient();

  const { categoriesForm: categories, isLoading: isLoadingCategories } = useSelector(({application}) => application)
  const { data: dataTags, isLoading: isLoadingTags } = useTags();

  const tags = dataTags?.map(tag => {
    return {
      value: tag.name,
      label: tag.name
    }
  });

  const selectedTags = entry.tags.map(tag => {
    return {value: tag, label: tag}
  })

  const { control, register, handleSubmit, setError, formState } = useForm({
    defaultValues: {
      date: parseISO(reverseBrDate(entry.date)),
      category_id: entry.category.id,
      description: entry.description,
      value: entry.value,
      tags: selectedTags
    },
    resolver: yupResolver(editValidation)
  });

  const { errors } = formState;

  const onSelectTagsChange = (inputValue: string) => `Nova tag: ${inputValue}`;

  const handleEditAccountEntry: SubmitHandler<FormData> = async (values) => {
    const tags = values.tags.map(tag => tag.value)
    const data = {
      id: entry.id,
      ...values,
      account_id: entry.account.id,
      date: values?.date ? toUsDate(values.date) : '',
      tags: tags
    }
    
    try {
      await accountEntriesService.update(data);
      
      queryClient.invalidateQueries(ACCOUNTS_ENTRIES);
      queryClient.invalidateQueries(ACCOUNT_BALANCE);
      queryClient.invalidateQueries(ACCOUNT_TOTAL_BY_CATEGORY);
      queryClient.invalidateQueries(TAGS);

      getMessage("Sucesso", "Alteração realizada com sucesso");

      closeModal();

    } catch (error) {
      if (error.response?.status === 422) {
        const data: IAccountEntryResponseError = error.response.data;

        let key: IAccountEntryErrorKey        
        for (key in data) {          
          data[key].forEach(error => {
            setError(key, {message: error})
          });
        }
      }
    }
  }

  if (isLoadingCategories) {
    return (
      <Loading />
    )
  }

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(handleEditAccountEntry)}
      >
      <Stack spacing={[4]}>
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
          onClick={closeModal}
        >
          Cancelar
        </Button>

        <SubmitButton
          label="Salvar"
          isLoading={formState.isSubmitting}
        />
      </Flex>
    </Box>
  )
}
