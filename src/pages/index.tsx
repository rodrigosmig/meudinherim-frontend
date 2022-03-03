import Head from "next/head";
import { LoginForm } from "../components/Foms/auth/LoginForm";
import { withSsrGuest } from '../utils/withSSRGuest';
import { AuthLayout } from "../components/AuthLayout";

export default function SignIn() {
  return (
    <>
      <Head>
        <title>Meu Dinherim</title>
      </Head>
      
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
    
    </>
  )
}

export const getServerSideProps = withSsrGuest(async (context) => {
  return {
    props: {}
  }
})