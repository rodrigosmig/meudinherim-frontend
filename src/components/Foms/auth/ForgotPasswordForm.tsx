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
import { IForgotPasswordData } from "../../../types/auth";
import { Heading } from "../../Heading";
import { Link } from "../../Link";
import { useRouter } from "next/router";
import { forgotPasswordValidation } from "../../../validations/auth";

export const ForgotPasswordForm = () => {
  const router = useRouter();

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(forgotPasswordValidation)
  });
  const { errors } = formState;

  const handleSendEmail: SubmitHandler<IForgotPasswordData> = async (values) => {
    try {
      const response = await authService.forgotPassword(values);
      const message = response.data.message;

      getMessage("Sucesso", message, 'success');

      router.push("/");
    } catch (error) {
      if (error.response?.status === 422) {
        const data = error.response.data;
        const message = data.errors.email[0]

        getMessage("Dados inválidos", message, 'error');
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
      borderRadius={[8]}
      onSubmit={handleSubmit(handleSendEmail)}
    >
      <Heading mb={8}>Esqueci minha senha</Heading>

      <Stack spacing={[4]}>
        <Input 
          name='email'
          type='text'
          label='E-mail'
          placeholder="Digite o e-mail de recuperação"
          error={errors.email}
          {...register('email')}
        />

      </Stack>

      <SubmitButton
        mt={[6]}
        label="Enviar e-mail de recuperação"
        isLoading={formState.isSubmitting}
      />

      <Flex mt={8}>
        <Link href="/">
          Fazer login
        </Link>
      </Flex>

    </Flex>
  )
}