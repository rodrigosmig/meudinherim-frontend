import { 
  Flex, 
  Text, 
} from "@chakra-ui/react";
import Head from "next/head";
import { Card } from "../../components/Card";
import { CreateAccountForm } from "../../components/Foms/account/CreateAccountForm";
import { Heading } from "../../components/Heading";
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
        <Card>
          <>
            <Flex mb={[6, 6, 8]} justify="space-between" align="center">
              <Heading>
                <Text>Nova Conta</Text>
              </Heading>
            </Flex>

            <CreateAccountForm />
          </>
        </Card>
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