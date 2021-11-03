import { useRouter } from "next/router";
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
import { Select } from "../../Inputs/Select";
import { accountService } from '../../../services/ApiService/AccountService';

const validationSchema = yup.object().shape({
  type: yup.string().required("O campo tipo é obrigatório"),
  name: yup.string().required("O campo nome é obrigatório").min(3, "O campo nome deve ter no mínimo 3 caracteres"),
})

interface Account {
  id: number;
  type: {
    id: 'money' | 'savings' | 'checking_account' | 'investment';
    desc: string;
  }
  name: string;
  balance: number;
}

interface EditAccountFormProps {
  account: Account;
}

interface FormData {
  type: string;
  name: string;
}

type ResponseError = {
  type: string[];
  name: string[];
}

type Key = keyof ResponseError

export const EditAccountForm = ({ account }: EditAccountFormProps) => {
  const toast = useToast();
  const router = useRouter();

  const { register, handleSubmit, setError, formState } = useForm({
    defaultValues: {
      type: account.type.id,
      name: account.name
    },
    resolver: yupResolver(validationSchema)
  });

  const { errors } = formState;

  const handleEditAccount: SubmitHandler<FormData> = async (values) => {
    const data = {
      accountId: account.id,
      data: {
        type: values.type,
        name: values.name,
      }
    }

    try {
      await accountService.update(data)
      
      toast({
        title: "Sucesso",
        description: "Alteração realizada com sucesso",
        position: "top-right",
        status: 'success',
        duration: 10000,
        isClosable: true,
      })

      router.push("/accounts");
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
    {value: "money", label: "Dinheiro"},
    {value: "savings", label: "Poupança"},
    {value: "checking_account", label: "Conta Corrente"},
    {value: "investment", label: "Investimentos"}
  ];

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(handleEditAccount)}
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
        <Link href={"/accounts"} passHref>
          <Button
            mr={[4]}
            variant="outline"
            isDisabled={formState.isSubmitting}
          >
            Cancelar
          </Button>
        </Link>

        <SubmitButton
          label="Salvar"
          size="md"
          isLoading={formState.isSubmitting}
        />
      </Flex>
    </Box>
  )
}