import { 
  Flex, 
  Text, 
} from "@chakra-ui/react";
import Head from "next/head";
import { Card } from "../../components/Card";
import { CreateCategoryForm } from "../../components/Foms/categories/CreateCategoryForm";
import { Heading } from "../../components/Heading";
import { Layout } from "../../components/Layout";
import { setupApiClient } from "../../services/api";
import { withSSRAuth } from "../../utils/withSSRAuth";

export default function CreateCategory() {
  return (
    <>
      <Head>
        <title>Nova categoria | Meu Dinherim</title>
      </Head>

      <Layout>
          <Card>
            <>
              <Flex mb={[6, 6, 8]} justify="space-between" align="center">
                <Heading>
                  <Text>Nova Categoria</Text>
                </Heading>
              </Flex>

              <CreateCategoryForm />
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