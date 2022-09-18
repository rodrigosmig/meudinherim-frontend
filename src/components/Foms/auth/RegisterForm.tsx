import { SubmitHandler, useForm } from "react-hook-form";
import { 
  Box, 
  Flex, 
  Stack, 
  Text, 
  useColorModeValue 
} from "@chakra-ui/react";
import { Input } from '../../Inputs/Input';
import { authService } from '../../../services/ApiService/AuthService';
import { SubmitButton } from '../../Buttons/Submit';
import { Switch } from "../../Inputs/Switch";
import { yupResolver } from '@hookform/resolvers/yup';
import { getMessage, isDevelopment } from "../../../utils/helpers";
import { IRegisterData } from "../../../types/auth";
import { Link } from "../../Link";
import { Heading } from "../../Heading";
import { useEffect, useState } from "react";
import { registerValidation } from "../../../validations/auth";
import { Recaptcha } from "../../Recaptcha";

export function RegisterForm() {
  const [reCaptchaToken, setReCaptchaToken] = useState('');
  const [isHuman, setIsHuman] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if(isDevelopment()) {
      setIsHuman(true);
    }
  }, [])

  const { register, reset, handleSubmit, setError, formState } = useForm({
    resolver: yupResolver(registerValidation)
  });
  const { errors } = formState;

  const handleRegister: SubmitHandler<IRegisterData> = async (values) => {
    const newValues = {
      ...values,
      reCaptchaToken: isDevelopment() ? "recaptchaDev" : reCaptchaToken
    }

    try {
      const response = await authService.register(newValues);

      const name = response.data.name;

      getMessage("Sucesso", `Usuário ${name} cadastrado com sucesso`);

      reset();

      setIsRegistered(true)
    } catch (error) {
      if (error?.code === 'ECONNABORTED') {
        return getMessage("Falha ao Registrar", "Servidor indisponível", 'error');
      }

      if (error.response?.status === 422) {
        const data = error.response.data;

        for (const key in data) {  
          if (key === 'reCaptchaToken') {
            return getMessage('Falha ao Registrar', data[key][0], 'error')
          }

          data[key].map(error => {
            setError(key, {message: error})
          })
        }
      }
    }
  }

  const handleClickRecaptcha = (token: string) => {
    setReCaptchaToken(token);
    setIsHuman(true);
  }

  const handleExpiredToken = () => {
    setIsHuman(false);
  }

  return (
    <Flex
      as="form"      
      w={[360]}
      mb={4}
      flexDir={["column"]}
      bg={useColorModeValue('white', 'gray.800')}
      p={8}
      borderRadius={[8]}
      onSubmit={handleSubmit(handleRegister)}
    >
      { !isRegistered 
        ? (
          <>
            <Heading mb={8}>Cadastrar Usuário</Heading>

            <Stack spacing={[4]}>
              <Input 
                name='name'
                type='text'
                label='Nome'
                error={errors.name}
                {...register('name')}
              />

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
              
              <Switch
                id="notifications" 
                label="Receber notificações"
                {...register('enable_notification')}
              />
            </Stack>

            <Recaptcha
              onCheck={handleClickRecaptcha}
              onExpired={handleExpiredToken}
            />

            <SubmitButton
              mt={[6]}
              label="Cadastrar"
              isLoading={formState.isSubmitting}
              isDisabled={!isHuman}
            />

            <Flex mt={6}>
              <Link href="/">
                Já tenho um usuário
              </Link>
            </Flex>
          </>
        )
        : (
          <Box>
            <Text 
              fontSize={['sm']}
              textAlign="center"
            >
              Uma mensagem com um link de confirmação foi enviada para seu e-mail. Clique no link para ativar sua conta.
            </Text>
            <Text
              mt={4}
              fontSize={['sm']}
              textAlign="center"
            >
              Caso já tenha ativado a conta, faça o <Link href="/">login</Link>!
            </Text>
          </Box>
        )
      }
      
    </Flex>
  )
}