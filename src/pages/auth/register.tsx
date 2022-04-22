import Head from "next/head";
import { AuthLayout } from "../../components/AuthLayout";
import { RegisterForm } from "../../components/Foms/auth/RegisterForm";

export default function Register() {  
  return (
    <>
      <Head>
        <title>Cadastrar | Meu Dinherim</title>
      </Head>

      <AuthLayout
        minH="100vh"
        h="100%"
      >
        <RegisterForm />
      </AuthLayout>
    </>
  )
}