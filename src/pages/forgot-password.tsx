import {
  Box,
  Flex,
  Heading,
  Image,
  useColorMode,
} from "@chakra-ui/react";
import Head from "next/head";
import { AuthLayout } from "../components/AuthLayout";
import { ForgotPasswordForm } from "../components/Foms/auth/ForgotPasswordForm";

export default function ForgotPassword() {
  const { colorMode } = useColorMode();

  const url_logo = colorMode === "dark" ? '/icons/logo_white.png' : '/icons/logo_black.png'

  return (
    <>
      <Head>
        <title>Esqueci minha senha | Meu Dinherim</title>
      </Head>

      <AuthLayout>
        <ForgotPasswordForm />
      </AuthLayout>
    </>
  )
}