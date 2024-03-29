import {
  Flex,
  Stack,
  useColorModeValue
} from "@chakra-ui/react";
import { yupResolver } from '@hookform/resolvers/yup';
import router from "next/router";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "../../../hooks/useDispatch";
import { signIn } from "../../../store/thunks/authThunk";
import { ISignInCredentials } from "../../../types/auth";
import { getMessage, isDevelopment } from "../../../utils/helpers";
import { loginValidation } from "../../../validations/auth";
import { SubmitButton } from '../../Buttons/Submit';
import { Input } from '../../Inputs/Input';
import { Link } from "../../Link";
import { Recaptcha } from "../../Recaptcha";

export function LoginForm() {
  const dispatch = useDispatch();

  const [isSubimited, setIsSubimited] = useState(false);
  const [reCaptchaToken, setReCaptchaToken] = useState('');
  const [isHuman, setIsHuman] = useState(false);

  const { register, handleSubmit, setError, formState } = useForm({
    resolver: yupResolver(loginValidation)
  });
  const { errors } = formState;

  useEffect(() => {
    if(isDevelopment()) {
      setIsHuman(true);
    }
  }, [])

  const handleLogin: SubmitHandler<ISignInCredentials> = async (values) => {
    const newValues = {
      ...values,
      reCaptchaToken: isDevelopment() ? "recaptchaDev" : reCaptchaToken
    }

    try {
      await dispatch(signIn(newValues)).unwrap();
      setIsSubimited(true);
      router.push("/dashboard")
    } catch (error) {
      if (error?.code === 'ECONNABORTED') {
        return getMessage("Falha ao Entrar", "Servidor indisponível", 'error');
      }

      const data = error.response.data

      if (data.error) {
        getMessage("Falha ao Entrar", "As credenciais informadas são inválidas", 'error');

      } else if (error?.response.status === 422) {
        const data = error.response.data;

        for (const key in data) {
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
      w={['100%']}
      maxW={[340, 340, 360]}
      flexDir={["column"]}
      bg={useColorModeValue('white', 'gray.800')}
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

      <Recaptcha 
        onCheck={handleClickRecaptcha}
        onExpired={handleExpiredToken}
      />

      <SubmitButton
        mt={[6]}
        label="Entrar"
        isLoading={formState.isSubmitting || isSubimited}
        isDisabled={!isHuman}
      />

      <Flex 
        direction={"column"}
        mt={8}
      >
        <Link href="/auth/forgot-password">
            Esqueci minha senha
        </Link>

        <Link href="/auth/register">
            Cadastrar novo usuário
        </Link>
      </Flex>
    </Flex>
  )
}