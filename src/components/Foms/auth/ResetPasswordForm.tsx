import { 
  Flex, 
  Stack, 
  useColorModeValue 
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from '../../Inputs/Input';
import { SubmitButton } from '../../Buttons/Submit';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { getMessage } from "../../../utils/helpers";
import { authService } from "../../../services/ApiService/AuthService";
import { IResetPaaswordErrorKey, IResetPasswordData, IResetPasswordResponseError } from "../../../types/auth";
import { Heading } from "../../Heading";
import { Link } from "../../Link";
import { useRouter } from "next/router";

const validationSchema = yup.object().shape({
  email: yup.string().required("O campo email é obrigatório").email("E-mail inválido"),
  password: yup.string().required("O campo senha é obrigatório").min(8, "O campo senha deve ter no mínimo 8 caracteres"),
  password_confirmation: yup.string().oneOf([null, yup.ref('password')], 'As senhas precisam ser iguais')
});

interface Props {
  token: string;
}

export const ResetPasswordForm = ({ token }: Props) => {
  const router = useRouter();
  
  const { register, handleSubmit, setError, reset, formState } = useForm({
    resolver: yupResolver(validationSchema)
  });
  const { errors } = formState;

  const handleSendEmail: SubmitHandler<IResetPasswordData> = async (values) => {
    const data = {
      token: token,
      ...values
    }
    try {
      const response = await authService.resetPassword(data);
      const message = response.data.message;

      getMessage("Sucesso", message, 'success');

      reset();

      router.push("/");

    } catch (error) {
      if (error.response?.status === 422) {
        const data: IResetPasswordResponseError = error.response.data;

        let key: IResetPaaswordErrorKey
        for (key in data) {   
          data[key].map(error => {
            setError(key, {message: error})
          })
        }
      }

      if (error.response?.status === 400) {
        getMessage("Dados inválidos", error.response.data.message, 'error');
      }
    }
  }

  return (
    <Flex
      as="form"
      w={['100%']}
      maxW={[340, 340, 360]}
      flexDir={["column"]}
      bg={useColorModeValue('white', 'gray.800')}
      p={[8]}
      mb={8}
      borderRadius={[8]}
      onSubmit={handleSubmit(handleSendEmail)}
    >
      <Heading mb={8}>Resetar senha</Heading>

      <Stack spacing={[4]}>
        <Input 
          name='email'
          type='email'
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

        <Input 
          name='password_confirmation'
          type='password'
          label='Confirmação de Senha'
          error={errors.password_confirmation}
          {...register('password_confirmation')}
        />

      </Stack>

      <SubmitButton
        mt={[6]}
        label="Resetar Senha"
        isLoading={formState.isSubmitting}
      />

      <Flex mt={8}>
        <Link href="/">
          Voltar
        </Link>
      </Flex>

    </Flex>
  )
}