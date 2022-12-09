import { 
  Flex, 
  Stack, 
  useColorModeValue 
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from '../../Inputs/Input';
import { SubmitButton } from '../../Buttons/Submit';
import { yupResolver } from '@hookform/resolvers/yup';
import { getMessage } from "../../../utils/helpers";
import { authService } from "../../../services/ApiService/AuthService";
import { IResetPaaswordErrorKey, IResetPasswordData, IResetPasswordResponseError } from "../../../types/auth";
import { Heading } from "../../Heading";
import { Link } from "../../Link";
import { useRouter } from "next/router";
import { resetPasswordValidation } from "../../../validations/auth";

interface Props {
  token: string;
}

export const ResetPasswordForm = ({ token }: Props) => {
  const router = useRouter();

  const bgColor = useColorModeValue('white', 'gray.800')
  
  const { register, handleSubmit, setError, reset, formState } = useForm({
    resolver: yupResolver(resetPasswordValidation)
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
          data[key].forEach(error => {
            setError(key, {message: error})
          });
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
      bg={bgColor}
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