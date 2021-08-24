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
import { SubmitButton } from "../Buttons/Submit";
import { Input } from "../Inputs/Input";
import { queryClient } from "../../services/queryClient";
import { useMutation } from "react-query";
import { categoryService } from "../../services/ApiService/CategoryService";
import { Select } from "../Inputs/Select";

interface EditCategoryFormProps {
  category: Category;
  closeModal: () => void;
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

const validationSchema = yup.object().shape({
  type: yup.string().required("O campo tipo é obrigatório"),
  name: yup.string().required("O campo nome é obrigatório").min(5, "O campo nome deve ter no mínimo 3 caracteres"),
})

export const EditCategoryForm = ({ category, closeModal }: EditCategoryFormProps) => {
  const toast = useToast();
  const { register, handleSubmit, setValue, setError, formState } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const { errors } = formState;

  setValue('type', category?.type)
  setValue('name', category?.name)

  const { isLoading, mutateAsync } = useMutation(async (values: FormData) => {
    const data = {
      categoryId: category.id,
      data: {
        type: values.type,
        name: values.name,
      }
    }
    const response = await categoryService.update(data)
  
    return response.data;
  });

  const handleEditCategory: SubmitHandler<FormData> = async (values) => {
    try {
      await mutateAsync(values);
      
      toast({
        title: "Sucesso",
        description: "Alteração realizada com sucesso",
        position: "top-right",
        status: 'success',
        duration: 10000,
        isClosable: true,
      })

      closeModal();
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
        <SubmitButton
          mr={[4]}
          label="Salvar"
          size="md"
          isLoading={formState.isSubmitting}
        />

        <Button
          onClick={closeModal} 
          variant="outline"
          isDisabled={isLoading}
        >
          Cancelar
        </Button>
      </Flex>
    </Box>
  )
}