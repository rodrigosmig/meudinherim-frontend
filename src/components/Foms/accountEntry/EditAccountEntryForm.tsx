import { 
  Box,
  Button,
  Flex,
  Stack,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { SubmitButton } from "../../Buttons/Submit";
import { Input } from "../../Inputs/Input";
import { Datepicker } from "../../DatePicker";
import { SelectCategories } from "../../Inputs/SelectCategories";
import { parseISO } from 'date-fns';
import { accountEntriesService } from '../../../services/ApiService/AccountEntriesService';
import { useCategoriesForm } from "../../../hooks/useCategories";
import { ACCOUNTS_ENTRIES, ACCOUNT_BALANCE, ACCOUNT_TOTAL_BY_CATEGORY, getMessage, reverseBrDate, toUsDate } from "../../../utils/helpers";
import { Loading } from "../../Loading";
import { IAccountEntry, IAccountEntryErrorKey, IAccountEntryFormData, IAccountEntryResponseError } from "../../../types/accountEntry";
import { editValidation } from "../../../validations/accountEntry";
import { useQueryClient } from "react-query";

interface FormData extends Omit<IAccountEntryFormData, "date"> { 
  date: Date 
};
interface Props {
  entry: IAccountEntry;
  closeModal: () => void,
  refetch: () => void
}

export const EditAccountEntryForm = ({ entry, closeModal, refetch }: Props) => {
  const queryClient = useQueryClient();

  const { data: categories, isLoading: isLoadingCategories } = useCategoriesForm();

  const { control, register, handleSubmit, setError, formState } = useForm({
    defaultValues: {
      date: parseISO(reverseBrDate(entry.date)),
      category_id: entry.category.id,
      description: entry.description,
      value: entry.value
    },
    resolver: yupResolver(editValidation)
  });

  const { errors } = formState;

  const handleEditAccountEntry: SubmitHandler<FormData> = async (values) => {
    const data = {
      id: entry.id,
      data: {
        ...values,
        account_id: entry.account.id,
        date: values?.date ? toUsDate(values.date) : ''
      }
    }
    
    try {
      await accountEntriesService.update(data);

      getMessage("Sucesso", "Alteração realizada com sucesso");

      queryClient.invalidateQueries(ACCOUNTS_ENTRIES);
      queryClient.invalidateQueries(ACCOUNT_BALANCE);
      queryClient.invalidateQueries(ACCOUNT_TOTAL_BY_CATEGORY);

      closeModal();

    } catch (error) {
      if (error.response?.status === 422) {
        const data: IAccountEntryResponseError = error.response.data;

        let key: IAccountEntryErrorKey        
        for (key in data) {          
          data[key].map(error => {
            setError(key, {message: error})
          })
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
