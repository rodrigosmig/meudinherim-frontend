import { 
  Box,
  Flex,
  Stack
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { SubmitButton } from "../../Buttons/Submit";
import { Input } from "../../Inputs/Input";
import { categoryService } from "../../../services/ApiService/CategoryService";
import { Select } from "../../Inputs/Select";
import { CancelButton } from "../../Buttons/Cancel";
import { getMessage } from "../../../utils/helpers";
import { ICategoryFormData } from "../../../types/category";
import { createValidation } from "../../../validations/categories";
import { useQueryClient } from "react-query";

interface Props {
  onClose: () => void,
}

export const CreateCategoryForm = ({ onClose }: Props) => {
  const queryClient = useQueryClient();

  const { register, handleSubmit, setError, formState } = useForm({
    resolver: yupResolver(createValidation)
  });

  const { errors } = formState;

  const handleCreateCategory: SubmitHandler<ICategoryFormData> = async (values) => {
    try {
      await categoryService.create(values);

      getMessage("Sucesso", `Categoria ${values.name} criada com sucesso`);

      queryClient.invalidateQueries('categories')
      queryClient.invalidateQueries('categories-form')

      onClose();
    } catch (error) {
      if (error.response?.status === 422) {
        const data = error.response.data;
        for (const key in data) {          
          data[key].map(error => {
            setError(key, {message: error})
          })
        }
      }
    }
  }

  const options = [
    {value: "", label: "Selecione um tipo"},
    {value: "1", label: "Entrada"},
    {value: "2", label: "Saída"}
  ]

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(handleCreateCategory)}
      >
      <Stack spacing={[4]}>
        <Select
          name="type"
          label="Tipo"
          options={options}
          error={errors.type}
          {...register('type')}
        />        

        <Input
          name="name"
          type="text"
          label="Nome da Categoria"
          error={errors.name}
          {...register('name')}
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
          onClick={onClose}
        />

        <SubmitButton
          label="Salvar"
          isLoading={formState.isSubmitting}
        />
      </Flex>
    </Box>
  )
}