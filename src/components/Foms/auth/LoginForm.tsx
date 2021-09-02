import { useState, useContext } from "react";
import Link from "next/link";
import { Box, Flex, Stack, useToast } from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from '../../Inputs/Input';
import { AuthContext } from '../../../contexts/AuthContext';
import { SubmitButton } from '../../Buttons/Submit';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

type LoginFormData = {
  email: string;
  password: string
}

const validationSchema = yup.object().shape({
  email: yup.string().required("O campo email é obrigatório").email("E-mail inválido"),
  password: yup.string().required("O campo senha é obrigatório").min(8, "O campo senha deve ter no mínimo 8 caracteres"),
})

export function LoginForm() {
  const toast = useToast();
  const [isSubimited, setIsSubimited] = useState(false);

  const { signIn } = useContext(AuthContext);  
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(validationSchema)
  });
  const { errors } = formState;

  const handleLogin: SubmitHandler<LoginFormData> = async (values) => {
    try {
      await signIn(values);
      setIsSubimited(true);

      toast({
        title: "Sucesso",
        description: "Login realizado com sucesso.",
        position: "top-right",
        status: "success",
        duration: 2000,
        isClosable: true,
      })
    } catch (error) {
      const data = error.response.data

      if (data.error) {
        toast({
          title: "Falha ao entrar",
          description: "As credenciais informadas são inválidas.",
          position: "top-right",
          status: "error",
          duration: 10000,
          isClosable: true,
        })
      } else if (error?.response.status === 422) {
        const data = error.response.data;

        for (const key in data) {
          data[key].map(error => {
            toast({
              title: "Erro",
              description: error,
              position: "top-right",
              status: "error",
              duration: 10000,
              isClosable: true,
            })
          })
        }
      }
    }
  }

  return (
    <Flex
      as="form"
      w={['100%']}
      maxW={[340, 340, 360]}
      flexDir={["column"]}
      bg="gray.800"
      p={[8]}
      borderRadius={[8]}
      onSubmit={handleSubmit(handleLogin)}
    >       
      <Stack spacing={[4]}>
        <Input 
          name='email'
          type='text'
          label='E-mail'
          error={errors.email}
          {...register('email')}
        />

        <Input 
          name='password'
          type='password'
          label='Senha'
          error={errors.password}
          {...register('password')}
        />
      </Stack>

      <SubmitButton
        mt={[6]}
        label="Entrar"
        isLoading={formState.isSubmitting || isSubimited}
      />

      <Link href="/register" passHref>
        <Box as="a" mt={[8]} 
          _hover={{
            cursor: 'pointer',
            color: 'pink.400'
          }}
        >
          Cadastrar novo usuário        
        </Box>
      </Link>
    </Flex>
  )
}