import { 
  Flex,
  Stack, 
  Text, 
  useColorModeValue 
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from '../../Inputs/Input';
import { SubmitButton } from '../../Buttons/Submit';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { getMessage } from "../../../utils/helpers";
import { authService } from "../../../services/ApiService/AuthService";
import { IForgotPasswordData } from "../../../types/auth";
import { Link } from "../../Link";
import { useRouter } from "next/router";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { resendEmailVerificationValidation } from "../../../validations/auth";

export const ResendVerificationEmailForm = () => {
  const router = useRouter();

  const { signOut } = useContext(AuthContext);

  const { register, handleSubmit, reset, formState } = useForm({
    resolver: yupResolver(resendEmailVerificationValidation)
  });
  const { errors } = formState;

  const handleSendEmail: SubmitHandler<IForgotPasswordData> = async (values) => {
    try {
      const response = await authService.resendVerificationEmail(values);
      const message = response.data.message;

      getMessage("Sucesso", message, 'success');

      reset();

      setTimeout(() => {
        signOut();        
      }, 3000);

      return;
    } catch (error) {
      if (error.response?.status === 422) {
        const data = error.response.data;
        const message = data?.email[0]

        return getMessage("Dados inválidos", message, 'error');
      }

      const data = error.response?.data;
      const message = data?.message
      
      return getMessage("Dados inválidos", message, 'error');      
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
      <Text
        fontWeight="bold"
        textAlign="center"
        mb={8}
      >
        Enviar e-mail de verificação
      </Text>

      <Stack spacing={[4]}>
        <Input 
          name='email'
          type='text'
          label='E-mail'
          placeholder="Digite o e-mail de verificação"
          error={errors.email}
          {...register('email')}
        />

      </Stack>

      <SubmitButton
        mt={[6]}
        label="Enviar e-mail de verificação"
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