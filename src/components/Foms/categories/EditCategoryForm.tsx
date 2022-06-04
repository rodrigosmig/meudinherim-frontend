import { memo } from "react";
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
import { ICategoryErrorKey, ICategory, ICategoryFormData, ICategoryResponseError } from "../../../types/category";
import { editValidation } from "../../../validations/categories";

interface Props {
  category: ICategory;
  closeModal: () => void,
  refetch: () => void
}

const EditCategoryFormComponent = ({ category, closeModal, refetch }: Props) => {
  const { register, handleSubmit, setError, formState } = useForm({
    defaultValues: {
      type: category.type,
      name: category.name
    },
    resolver: yupResolver(editValidation)
  });

  const { errors } = formState;

  const handleEditCategory: SubmitHandler<ICategoryFormData> = async (values) => {
    const data = {
      categoryId: category.id,
      data: {
        type: values.type,
        name: values.name,
      }
    }

    try {
      await categoryService.update(data);

      getMessage("Sucesso", "Categoria alterada com sucesso");

      refetch();
      closeModal();

    } catch (error) {
      if (error.response?.status === 422) {
        const data: ICategoryResponseError = error.response.data;

        let key: ICategoryErrorKey;
        for (key in data) {          
          data[key].map(error => {
            setError(key, {message: error})
          })
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
      </Stack>
      <Flex
        mt={[10]}
        justify="flex-end"
        align="center"
      >
        <CancelButton
          mr={4}
          isDisabled={formState.isSubmitting}
          onClick={closeModal}
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