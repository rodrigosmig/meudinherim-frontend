import Link from "next/link";
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
import { accountService } from '../../../services/ApiService/AccountService';
import { Select } from "../../Inputs/Select";
import { useRouter } from 'next/router';

interface FormData {
  type: string;
  name: string;
}

const validationSchema = yup.object().shape({
  type: yup.string().required("O campo tipo é obrigatório"),
  name: yup.string().required("O campo nome é obrigatório").min(3, "O campo nome deve ter no mínimo 3 caracteres"),
})

export const CreateAccountForm = () => {
  const toast = useToast();
  const router = useRouter();

  const { register, handleSubmit, setError, formState } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const { errors } = formState;

  const handleCreateAccount: SubmitHandler<FormData> = async (values) => {
    try {
      await accountService.create(values)
      
      toast({
        title: "Sucesso",
        description: `Conta ${values.name} criada com sucesso`,
        position: "top-right",
        status: 'success',
        duration: 10000,
        isClosable: true,
      });

      router.push("/accounts");
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
    {value: "money", label: "Dinheiro"},
    {value: "savings", label: "Poupança"},
    {value: "checking_account", label: "Conta Corrente"},
    {value: "investment", label: "Investimentos"}
  ];

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(handleCreateAccount)}
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
          label="Nome da Conta"
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

        <Link href={"/accounts"}>
          <Button
            variant="outline"
            isDisabled={formState.isSubmitting}
          >
            Cancelar
          </Button>
        </Link>
      </Flex>
    </Box>
  )
}