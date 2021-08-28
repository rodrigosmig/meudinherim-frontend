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
import Link from "next/link";

interface FormData {
  type: number;
  name: string;
}

const validationSchema = yup.object().shape({
  type: yup.string().required("O campo tipo é obrigatório"),
  name: yup.string().required("O campo nome é obrigatório").min(5, "O campo nome deve ter no mínimo 3 caracteres"),
})

export const CreateCategoryForm = () => {
  const toast = useToast();

  const { register, reset, handleSubmit, setError, formState } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const { errors } = formState;

  const createCategory = useMutation(async (values: FormData) => {
    const response = await categoryService.create(values)
  
    return response.data;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('categories')
    }
  });

  const handleCreateCategory: SubmitHandler<FormData> = async (values) => {
    try {
      await createCategory.mutateAsync(values);
      
      toast({
        title: "Sucesso",
        description: `Categoria ${values.name} criada com sucesso`,
        position: "top-right",
        status: 'success',
        duration: 10000,
        isClosable: true,
      })

      reset();
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
@
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
          isLoading={createCategory.isLoading}
        />

        <Link href="/categories" passHref>
          <Button
            variant="outline"
            isDisabled={createCategory.isLoading}
          >
            Cancelar
          </Button>
        
        </Link>
      </Flex>
    </Box>
  )
}