import Head from "next/head";
import { AuthLayout } from "../../components/AuthLayout";
import { ForgotPasswordForm } from "../../components/Foms/auth/ForgotPasswordForm";

export default function ForgotPassword() {
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