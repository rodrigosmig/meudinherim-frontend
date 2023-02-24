import {
  Flex,
  Stack,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "../../../hooks/useDispatch";
import { useSelector } from "../../../hooks/useSelector";
import { authService } from "../../../services/ApiService/AuthService";
import { tokenService } from "../../../services/tokenService";
import { logout } from "../../../store/thunks/authThunk";
import { IForgotPasswordData } from "../../../types/auth";
import { getMessage } from "../../../utils/helpers";
import { resendEmailVerificationValidation } from "../../../validations/auth";
import { SubmitButton } from '../../Buttons/Submit';
import { Input } from '../../Inputs/Input';
import { Link } from "../../Link";

export const ResendVerificationEmailForm = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(({auth}) => auth);

  const { register, handleSubmit, reset, formState } = useForm({
    resolver: yupResolver(resendEmailVerificationValidation)
  });
  const { errors } = formState;

  useEffect(() => {
    if (isAuthenticated) {
      tokenService.delete(undefined);
    }
  }, [isAuthenticated])

  const handleSendEmail: SubmitHandler<IForgotPasswordData> = async (values) => {
    try {
      const response = await authService.resendVerificationEmail(values);
      const message = response.data.message;

      getMessage("Sucesso", message, 'success');

      reset();
      
      await dispatch(logout());        
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