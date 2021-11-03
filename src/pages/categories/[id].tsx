import { Flex, Text } from "@chakra-ui/react";
import Head from "next/head";
import { Card } from "../../components/Card";
import { EditCategoryForm } from "../../components/Foms/categories/EditCategoryForm";
import { Heading } from "../../components/Heading";
import { Layout } from "../../components/Layout";
import { setupApiClient } from "../../services/api";
import { withSSRAuth } from "../../utils/withSSRAuth";

interface Category {
  id: number,
  type: 1 | 2,
  name: string,
}

interface EditCategoryProps {
  category: Category
}

export default function EditCategory({ category }: EditCategoryProps) {
  return (
    <>
      <Head>
        <title>Editar categoria | Meu Dinherim</title>
      </Head>

      <Layout>
        <Card>
          <>
            <Flex mb={[6, 6, 8]} justify="space-between" align="center">
              <Heading>
                  <Text>Editar Categoria</Text>
                </Heading>
            </Flex>

            <EditCategoryForm category={category} />
          </>
        </Card>
      </Layout>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (context) => {
  const apiClient = setupApiClient(context);

  const {id} = context.params
  
  const response = await apiClient.get(`/categories/${id}`);

  const category = response.data

  return {
    props: {
      category
    }
  }
})