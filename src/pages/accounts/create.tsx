import { 
  Box, 
  Flex, 
  Heading, 
} from "@chakra-ui/react";
import Head from "next/head";
import { CreateAccountForm } from "../../components/Foms/account/CreateAccountForm";
import { Layout } from "../../components/Layout";
import { setupApiClient } from "../../services/api";
import { withSSRAuth } from "../../utils/withSSRAuth";

export default function CreateAccount() {
  return (
    <>
      <Head>
        <title>Nova conta | Meu Dinherim</title>
      </Head>

      <Layout>
        <Box
          h={380}
          flex='1' 
          borderRadius={8} 
          bg="gray.800" 
          p="8"

        >
          <Flex mb={[6, 6, 8]} justify="space-between" align="center">
            <Heading fontSize={['xl', 'xl', '2xl']} fontWeight="normal">
              Nova Conta
            </Heading>
          </Flex>

          <CreateAccountForm />
          
        </Box>
      </Layout>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (context) => {
  const apiClient = setupApiClient(context);
  
  const response = await apiClient.get('/categories');

  return {
    props: {}
  }
})