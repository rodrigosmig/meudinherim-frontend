import {
  Box,
  Flex,
  Stack
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { memo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "../../../hooks/useDispatch";
import { updateCategory } from "../../../store/thunks/categoriesThunk";
import { ICategory, ICategoryErrorKey, ICategoryFormData, ICategoryResponseError } from "../../../types/category";
import { getMessage } from "../../../utils/helpers";
import { editValidation } from "../../../validations/categories";
import { CancelButton } from "../../Buttons/Cancel";
import { SubmitButton } from "../../Buttons/Submit";
import { Input } from "../../Inputs/Input";
import { Select } from "../../Inputs/Select";
import { Switch } from "../../Inputs/Switch";

interface Props {
  category: ICategory;
  onClose: () => void,
}

const EditCategoryFormComponent = ({ category, onClose }: Props) => {
  const dispatch = useDispatch();

  const [ isActive, setIsActive ] = useState(category.active);
  const [ showInDashboard, setShowInDashboard ] = useState(category.show_in_dashboard);

  const { register, handleSubmit, setError, formState } = useForm({
    defaultValues: {
      type: category.type,
      name: category.name,
      active: category.active,
      show_in_dashboard: category.show_in_dashboard
    },
    resolver: yupResolver(editValidation)
  });

  const { errors } = formState;

  const handleEditCategory: SubmitHandler<ICategoryFormData> = async (values) => {
    const data = {
      categoryId: category.id,
      data: values
    }

    try {
      await dispatch(updateCategory(data)).unwrap()

      getMessage("Sucesso", "Categoria alterada com sucesso");

      onClose();

    } catch (error) {
      if (error.response?.status === 422) {
        const data: ICategoryResponseError = error.response.data;

        let key: ICategoryErrorKey;
        for (key in data) {          
          data[key].forEach(error => {
            setError(key, {message: error})
          });
        }
      }
    }
  }

  const options = [
    {value: "1", label: "Entrada"},
    {value: "2", label: "Saída"}
  ]

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(handleEditCategory)}
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
          id="active" 
          name='active'
          label="Ativo"
          {...register('active')}
          isChecked={isActive}
          onChange={() => setIsActive(!isActive)}
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

export const EditCategoryForm = memo(EditCategoryFormComponent);