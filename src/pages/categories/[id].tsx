import { Box, Flex, Heading } from "@chakra-ui/react";
import Head from "next/head";
import { EditCategoryForm } from "../../components/Foms/categories/EditCategoryForm";
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
        <Box
          h={380}
          flex='1' 
          borderRadius={8} 
          bg="gray.800" 
          p="8"

        >
          <Flex mb={[6, 6, 8]} justify="space-between" align="center">
            <Heading fontSize={['xl', 'xl', '2xl']} fontWeight="normal">
              Editar Categoria
            </Heading>
          </Flex>

          <EditCategoryForm category={category} />
          
        </Box>
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