import { Flex, Text } from "@chakra-ui/react";
import Head from 'next/head';

import { useRouter } from "next/router";
import { CreateCategoryForm } from "../../components/Foms/categories/CreateCategoryForm";
import { Heading } from "../../components/Heading";
import { Layout } from "../../components/Layout";
import { setupApiClient } from "../../services/api";
import { withSSRAuth } from "../../utils/withSSRAuth";

export default function CreateAccountEntry() {
  const router = useRouter();

  const handleOnCancel = () => {
    router.push('/categories');
  }

  return (
    <>
      <Head>
        <title>Adicionar Categoria | Meu Dinherim</title>
      </Head>

      <Layout>
          <Flex mb={[6, 6, 8]} justify="space-between" align="center">
            <Heading>
              <Text>Nova Categoria</Text>
            </Heading>
          </Flex>

          <CreateCategoryForm
            onCancel={handleOnCancel}          
          />
      </Layout>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (context) => {
    const apiClient = setupApiClient(context);

    await apiClient.get(`/accounts`);

    return {
      props: {}
    }
})
