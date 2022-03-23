import { useState, useContext, useCallback, useEffect } from "react";
import { 
  Box,
  Flex, 
  Stack, 
  useColorMode, 
  useColorModeValue 
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from '../../Inputs/Input';
import { AuthContext } from '../../../contexts/AuthContext';
import { SubmitButton } from '../../Buttons/Submit';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { getMessage } from "../../../utils/helpers";
import { ISignInCredentials } from "../../../types/auth";
import { Link } from "../../Link";
import ReCAPTCHA from "react-google-recaptcha";

const validationSchema = yup.object().shape({
  email: yup.string().required("O campo email é obrigatório").email("E-mail inválido"),
  password: yup.string().required("O campo senha é obrigatório").min(8, "O campo senha deve ter no mínimo 8 caracteres"),
})

export function LoginForm() {
  const [isSubimited, setIsSubimited] = useState(false);
  const [reCaptchaToken, setReCaptchaToken] = useState('');
  const [isHuman, setIsHuman] = useState(false);

  const { colorMode } = useColorMode();

  const { signIn } = useContext(AuthContext);  
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(validationSchema)
  });
  const { errors } = formState;

  const handleLogin: SubmitHandler<ISignInCredentials> = async (values) => {
    const newValues = {
      ...values,
      reCaptchaToken: reCaptchaToken
    }

    try {
      await signIn(newValues);
      setIsSubimited(true);
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
            getMessage("Erro", error, 'error');
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

      <Box marginTop={6}>
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_KEY}
          theme={colorMode}
          hl="pt-BR"
          onChange={handleClickRecaptcha}
          onExpired={handleExpiredToken}
        />
      </Box>

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
        <Link href="/forgot-password">
            Esqueci minha senha
        </Link>

        <Link href="/register">
            Cadastrar novo usuário
        </Link>
      </Flex>
    </Flex>
  )
}