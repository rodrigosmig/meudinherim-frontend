import { memo } from "react";
import { 
  Box,
  Button,
  Flex,
  Stack, 
  useToast
} from "@chakra-ui/react";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { SubmitButton } from "../../Buttons/Submit";
import { Input } from "../../Inputs/Input";
import { categoryService } from "../../../services/ApiService/CategoryService";
import { Select } from "../../Inputs/Select";

interface EditCategoryFormProps {
  category: Category;
  closeModal: () => void,
  refetch: () => void
}

interface Category {
  id: number;
  type: 1 | 2;
  name: string;
}

interface FormData {
  type: number;
  name: string;
}

type ResponseError = {
  type: string[];
  name: string[];
}

type Key = keyof ResponseError

const validationSchema = yup.object().shape({
  type: yup.string().required("O campo tipo é obrigatório"),
  name: yup.string().required("O campo nome é obrigatório").min(3, "O campo nome deve ter no mínimo 3 caracteres"),
})

const EditCategoryFormComponent = ({ category, closeModal, refetch }: EditCategoryFormProps) => {
  const toast = useToast();

  const { register, handleSubmit, setError, formState } = useForm({
    defaultValues: {
      type: category.type,
      name: category.name
    },
    resolver: yupResolver(validationSchema)
  });

  const { errors } = formState;

  const handleEditCategory: SubmitHandler<FormData> = async (values) => {
    const data = {
      categoryId: category.id,
      data: {
        type: values.type,
        name: values.name,
      }
    }

    try {
      await categoryService.update(data)
      
      toast({
        title: "Sucesso",
        description: "Categoria alterada com sucesso",
        position: "top-right",
        status: 'success',
        duration: 10000,
        isClosable: true,
      })

      refetch();
      closeModal();

    } catch (error) {
      if (error.response?.status === 422) {
        const data: ResponseError = error.response.data;

        let key: Key        
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
          size="md"
          isLoading={formState.isSubmitting}
        />
      </Flex>
    </Box>
  )
}

export const EditCategoryForm = memo(EditCategoryFormComponent);