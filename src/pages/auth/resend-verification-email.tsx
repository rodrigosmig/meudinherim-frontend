import { GetServerSideProps } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { bool } from "yup";
import { AuthLayout } from "../../components/AuthLayout";
import { ResendVerificationEmailForm } from "../../components/Foms/auth/ResendVerificationEmailForm";
import { getMessage } from "../../utils/helpers";

interface Props {
  verified: boolean
}

export default function ResendVerificationEmail({ verified }: Props) {
  useEffect(() => {
    if (!verified) {
      getMessage("E-mail não verificado", "Solicite o email de verificação", 'error', 10000)
    }

  }, [verified])

   return (
    <>
      <Head>
        <title>Reenviar e-mail de verificação | Meu Dinherim</title>
      </Head>

      <AuthLayout>
        <ResendVerificationEmailForm />
      </AuthLayout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;

  const verified = query?.verified === 'false' ? false : true;
  
  return {
    props: {
      verified
    }
  }
}