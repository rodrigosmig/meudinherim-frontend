import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from 'next/router';
import { Box, Flex, Stack, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { Input } from '../../Inputs/Input';
import { authService } from '../../../services/ApiService/AuthService';
import { SubmitButton } from '../../Buttons/Submit';
import { Switch } from "../../Inputs/Switch";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { getMessage } from "../../../utils/helpers";
import { IRegisterData } from "../../../types/auth";
import { Link } from "../../Link";
import { Heading } from "../../Heading";
import ReCaptcha from "react-google-recaptcha";
import { useState } from "react";


const validationSchema = yup.object().shape({
  name: yup.string().required("O campo nome é obrigatório").min(3, "O campo nome deve ter no mínimo 3 caracteres"),
  email: yup.string().required("O campo email é obrigatório").email("E-mail inválido"),
  password: yup.string().required("O campo senha é obrigatório").min(8, "O campo senha deve ter no mínimo 8 caracteres"),
  password_confirmation: yup.string().oneOf([null, yup.ref('password')], 'As senhas precisam ser iguais')
})

export function RegisterForm() {
  const router = useRouter();
  const [reCaptchaToken, setReCaptchaToken] = useState('');
  const [isHuman, setIsHuman] = useState(false);

  const { colorMode } = useColorMode();

  const { register, reset, handleSubmit, setError, formState } = useForm({
    resolver: yupResolver(validationSchema)
  });
  const { errors } = formState;

  const handleRegister: SubmitHandler<IRegisterData> = async (values) => {
    const newValues = {
      ...values,
      reCaptchaToken: reCaptchaToken
    }

    try {
      const response = await authService.register(newValues);
      const name = response.data.name;

      getMessage("Sucesso", `Usuário ${name} cadastrado com sucesso`);

      reset();
      
      router.push('/')
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
      flexDir={["column"]}
      bg={useColorModeValue('white', 'gray.800')}
      p={8}
      borderRadius={[8]}
      onSubmit={handleSubmit(handleRegister)}
    >
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

      <Box marginTop={6}>
        <ReCaptcha
          sitekey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_KEY}
          theme={colorMode}
          hl="pt-BR"
          onChange={handleClickRecaptcha}
          onExpired={handleExpiredToken}
        />
      </Box>
      
      <SubmitButton
        mt={[6]}
        label="Cadastrar"
        isLoading={formState.isSubmitting}
        isDisabled={!isHuman}
      />
      
      <Flex mt={8}>
        <Link href="/">
          Já tenho um usuário
        </Link>
      </Flex>
    </Flex>
  )
}