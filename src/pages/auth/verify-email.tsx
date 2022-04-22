import {
  Flex, Tag, Text, useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AuthLayout } from "../../components/AuthLayout";
import { Loading } from "../../components/Loading";
import { getMessage } from "../../utils/helpers";
import { withSsrGuest } from "../../utils/withSSRGuest";


interface Props {
  url: string;
}

export default function VerifyEmail({ url }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [alreadyVerified, setAlreadyVerified] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800')

  useEffect(() => {
    const verifyEmail = async () => {

      if (!url || url.length === 0) {
        getMessage("Erro", "Token de verificação inválido", 'error', 5000);
        setIsError(true);
        return router.push("/");
      }

      try {
        const response = await axios.get(url);

        getMessage("Sucesso", response.data.message, 'success', 5000)

        return router.push("/"); 
      } catch (error) {  
        const data = error.response.data;
        setIsLoading(false);
        
        if (error.response.status === 400) {
          getMessage("Erro", data?.message, 'error', 5000)
          return router.push("/");
        }

        setIsError(true);

        if (error.response.status === 404) {
          return getMessage("Erro", "Token de verificação inválido", 'error', 5000);
        }

        

        getMessage("Erro", data?.message, 'error', 5000)
      }
    }

    verifyEmail()
  }, [router, url]);

  if (isLoading) {
    return (
      <AuthLayout>
        <Loading />
      </AuthLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Verificar Email | Meu Dinherim</title>
      </Head>

      <AuthLayout>
        { isError && (
          <Flex
            as="form"
            w={['100%']}
            maxW={[340, 340, 360]}
            flexDir={["column"]}
            bg={bgColor}
            p={[8]}
            mb={8}
            borderRadius={[8]}
            justify={["center"]}
            alignItems={["center"]}
          >
            <Text>
              Erro ao verificar o email.                 
            </Text>
              <Text >
                Tente &nbsp;
                <Tag color="pink.500">
                  <Link href='/auth/resend-verification-email'>
                    reenviar novamente                    
                  </Link>
                </Tag>
              </Text>
          </Flex>
        )}
      </AuthLayout>
    </>
  )
}

export const getServerSideProps = withSsrGuest(async (context) => {
  const { query } = context;

  const url = query?.url || '';

  return {
    props: {
      url
    }
  }
})