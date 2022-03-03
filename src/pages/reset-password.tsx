import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { AuthLayout } from "../components/AuthLayout";
import { ResetPasswordForm } from "../components/Foms/auth/ResetPasswordForm";
import { getMessage } from "../utils/helpers";
import { withSsrGuest } from "../utils/withSSRGuest";

interface Props {
  token: string;
}

export default function ForgotPassword({ token }) {
  const router = useRouter()

  useEffect(() => {
    if (!token) {
      getMessage("Token inválido", "Não é possível resetar a senha", 'error');
      router.push("/")
    }

  }, [token, router])

  return (
    <>
      <Head>
        <title>Resetar Senha | Meu Dinherim</title>
      </Head>

      <AuthLayout
        minH="100vh"
        h="100%"
      >
        <ResetPasswordForm token={token} />
      </AuthLayout>

    </>
  )
}

export const getServerSideProps = withSsrGuest(async (context) => {
  const { query } = context;

  const token = query?.token || '';
  
  return {
    props: {
      token
    }
  }
})