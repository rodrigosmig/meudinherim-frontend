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
import { CATEGORIES, CATEGORIES_FORM, getMessage } from "../../../utils/helpers";
import { ICategoryFormData } from "../../../types/category";
import { createValidation } from "../../../validations/categories";
import { useQueryClient } from "react-query";
import { useState } from "react";
import { Switch } from "../../Inputs/Switch";

interface Props {
  onClose: () => void,
}

export const CreateCategoryForm = ({ onClose }: Props) => {
  const queryClient = useQueryClient();

  const { register, handleSubmit, setError, formState } = useForm({
    resolver: yupResolver(createValidation)
  });

  const [ showInDashboard, setShowInDashboard ] = useState(true);

  const { errors } = formState;

  const handleCreateCategory: SubmitHandler<ICategoryFormData> = async (values) => {
    try {
      await categoryService.create(values);

      getMessage("Sucesso", `Categoria ${values.name} criada com sucesso`);

      queryClient.invalidateQueries(CATEGORIES)
      queryClient.invalidateQueries(CATEGORIES_FORM)

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

        <Switch
          size="lg"
          id="show_in_dashboard" 
          name='show_in_dashboard'
          label="Exibir na Dashboard"
          {...register('show_in_dashboard')}
          isChecked={showInDashboard}
          onChange={() => setShowInDashboard(!showInDashboard)}
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